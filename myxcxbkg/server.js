const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createPool({
  host: "localhost",
  user: "gva",
  password: "123456",
  database: "gin_vue_admin",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const PORT = 8088; // 按你实际需要改
const WECHAT_APPID = 'wx506c944851f9f1eb';
const WECHAT_SECRET = 'df64f12abbbd7f411cf1ce606208b9ba';


// ================== 获取微信小程序用户 openid ==================
app.post('/api/wechat/openid', async (req, res) => {
  const { code } = req.body || {};

  if (!code) {
    return res.status(400).json({ code: 400, message: 'code 不能为空' });
  }

  try {
    // 调用微信 jscode2session 接口
    const url = 'https://api.weixin.qq.com/sns/jscode2session';
    const resp = await axios.get(url, {
      params: {
        appid: WECHAT_APPID,
        secret: WECHAT_SECRET,
        js_code: code,
        grant_type: 'authorization_code'
      },
      timeout: 5000
    });

    const data = resp.data || {};

    // 微信错误处理
    if (data.errcode) {
      console.error('微信 jscode2session 错误:', data);
      return res.status(500).json({
        code: 500,
        message: '微信接口错误',
        errcode: data.errcode,
        errmsg: data.errmsg
      });
    }

    // 正常：返回 openid / session_key 给前端
    return res.json({
      code: 200,
      message: '获取 openid 成功',
      data: {
        openid: data.openid,
        session_key: data.session_key,
        unionid: data.unionid || null
      }
    });
  } catch (err) {
    console.error('请求微信接口异常:', err);
    return res.status(500).json({
      code: 500,
      message: '服务器请求微信失败'
    });
  }
});

// ================== 微信 access_token 高级缓存 v2.0 ==================

// 内存缓存：所有请求共享
let cachedToken = '';
let cachedExpireAt = 0; // 时间戳（毫秒）

// 最近一次拉取失败时间
let lastTokenFailedAt = 0;

// 失败冷却时间（避免失败时无限重试打爆微信）
const TOKEN_FAIL_COOLDOWN = 30 * 1000; // 30 秒

// 正在获取中的 Promise（防止并发时多次同时请求微信）
let fetchingTokenPromise = null;

/**
 * 获取微信 access_token（自动缓存 / 并发合并 / 失败冷却）
 * - 正常情况：大部分请求只读内存，不访问微信
 * - 并发情况：多个请求共享同一个 fetchingTokenPromise
 * - 失败情况：进入冷却期，不会频繁重试打爆微信
 */
async function getAccessToken() {
  const now = Date.now();

  // 1. 有可用缓存，直接返回
  if (cachedToken && now < cachedExpireAt) {
    return cachedToken;
  }

  // 2. 正在有人获取 token，直接等结果（防止并发重复打微信）
  if (fetchingTokenPromise) {
    return fetchingTokenPromise;
  }

  // 3. 最近刚失败过一轮，处于冷却期，直接抛错
  if (now - lastTokenFailedAt < TOKEN_FAIL_COOLDOWN) {
    throw new Error('ACCESS_TOKEN_COOLDOWN');
  }

  // 4. 开始真正去微信拉取 access_token
  fetchingTokenPromise = (async () => {
    try {
      const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WECHAT_APPID}&secret=${WECHAT_SECRET}`;
      const resp = await axios.get(url, { timeout: 5000 });
      const data = resp.data || {};

      if (!data.access_token) {
        lastTokenFailedAt = Date.now();
        console.error('❌ 获取 access_token 失败：', data);
        throw new Error('ACCESS_TOKEN_FETCH_FAILED');
      }

      cachedToken = data.access_token;

      // 官方 expires_in 一般是 7200 秒，这里提前 5 分钟让它过期
      const expiresIn = data.expires_in || 7200;
      const safeExpireInSec = Math.max(expiresIn - 300, 600); // 防止过小，至少缓存 10 分钟
      cachedExpireAt = Date.now() + safeExpireInSec * 1000;

      // 成功后清空失败时间
      lastTokenFailedAt = 0;

      console.log('✅ 获取新的 access_token 成功，过期时间（秒）：', safeExpireInSec);
      return cachedToken;
    } catch (err) {
      if (lastTokenFailedAt === 0) {
        lastTokenFailedAt = Date.now();
      }
      throw err;
    } finally {
      // 无论成功失败，都要把 fetching 状态清空，避免下次没人能重新拉
      fetchingTokenPromise = null;
    }
  })();

  return fetchingTokenPromise;
}

// ================== 核心接口：获取手机号并写入 xcx_users ==================
app.post('/api/wx/phone', async (req, res) => {
  try {
    const { code, openid } = req.body || {};

    if (!code || !openid) {
      return res.json({
        code: 400,
        msg: 'code 和 openid 必传',
      });
    }

    // 1. 先拿 access_token（带防爆保护）
    let accessToken;
    try {
      accessToken = await getAccessToken();
    } catch (err) {
      console.error('获取 access_token 失败：', err);

      if (err && err.message === 'ACCESS_TOKEN_COOLDOWN') {
        return res.json({
          code: 503,
          msg: '系统繁忙，请稍后重试',
        });
      }

      return res.json({
        code: 500,
        msg: '系统获取微信凭证失败',
      });
    }

    // 2. 调用微信 getuserphonenumber 接口
    const url = `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${accessToken}`;

    const wxResp = await axios.post(url, { code }, { timeout: 5000 });
    const wxData = wxResp.data || {};

    console.log('📱 微信手机号接口返回：', wxData);

    if (wxData.errcode !== 0) {
      return res.json({
        code: 500,
        msg: '微信手机号解密失败：' + (wxData.errmsg || ''),
      });
    }

    const phoneInfo = wxData.phone_info || {};
    const phoneNumber = phoneInfo.purePhoneNumber || phoneInfo.phoneNumber;

    if (!phoneNumber) {
      return res.json({
        code: 500,
        msg: '未获取到手机号',
      });
    }

    // 3. 写入 xcx_users 表（upsert）
    const sql = `
      INSERT INTO xcx_users (openid, mobile)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE
        mobile = VALUES(mobile),
        updated_at = NOW()
    `;

    db.query(sql, [openid, phoneNumber], (err, result) => {
      if (err) {
        console.error('写入 xcx_users 失败：', err);
        return res.json({
          code: 500,
          msg: '保存手机号失败',
        });
      }

      return res.json({
        code: 200,
        msg: '手机号获取成功',
        data: {
          phoneNumber,
          countryCode: phoneInfo.countryCode || '86',
        },
      });
    });
  } catch (e) {
    console.error('获取手机号接口异常：', e);
    return res.json({
      code: 500,
      msg: '服务器异常',
    });
  }
});


/**
 * 🗂️ 分类管理 CRUD
 */

// ✅ 获取分类列表
app.get("/api/categories/list", (req, res) => {
  const sql = "SELECT * FROM categories ORDER BY sort_order ASC, id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("查询分类失败:", err);
      return res.status(500).json({ code: 500, message: "获取分类失败" });
    }
    res.json({ code: 200, data: results });
  });
});

// ✅ 获取单个分类
app.get("/api/categories/:id", (req, res) => {
  const sql = "SELECT * FROM categories WHERE id=?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ code: 500, message: "查询失败" });
    if (results.length === 0)
      return res.status(404).json({ code: 404, message: "分类不存在" });
    res.json({ code: 200, data: results[0] });
  });
});

// ✅ 新增分类
app.post("/api/categories/add", (req, res) => {
  const { name, parent_id = 0, description = "", sort_order = 0 } = req.body;
  if (!name) return res.status(400).json({ code: 400, message: "分类名称不能为空" });

  const sql =
    "INSERT INTO categories (name, parent_id, description, sort_order) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, parent_id, description, sort_order], (err, result) => {
    if (err) {
      console.error("新增分类失败:", err);
      return res.status(500).json({ code: 500, message: "新增失败" });
    }
    res.json({ code: 200, message: "新增成功 ✅", id: result.insertId });
  });
});

// ✅ 修改分类
app.put("/api/categories/update/:id", (req, res) => {
  const { name, parent_id = 0, description = "", sort_order = 0 } = req.body;
  const sql =
    "UPDATE categories SET name=?, parent_id=?, description=?, sort_order=?, updated_at=NOW() WHERE id=?";
  db.query(sql, [name, parent_id, description, sort_order, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ code: 500, message: "更新失败" });
    if (result.affectedRows === 0)
      return res.status(404).json({ code: 404, message: "分类不存在" });
    res.json({ code: 200, message: "更新成功 ✅" });
  });
});

// ✅ 删除分类
app.delete("/api/categories/delete/:id", (req, res) => {
  const sql = "DELETE FROM categories WHERE id=?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ code: 500, message: "删除失败" });
    if (result.affectedRows === 0)
      return res.status(404).json({ code: 404, message: "分类不存在" });
    res.json({ code: 200, message: "删除成功 ✅" });
  });
});


/**
 * ✅ 添加商品（含SKU、多图）
 */
app.post('/api/products/add', (req, res) => {
  const { name, description, category_id, limit_purchase, skus, images } = req.body;

  if (!name || !Array.isArray(skus) || skus.length === 0) {
    return res.status(400).json({ code: 400, message: "商品名称或SKU不能为空" });
  }

  db.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ code: 500, message: "获取数据库连接失败" });
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return res.status(500).json({ code: 500, message: "启动事务失败" });
      }

      const imagesJson = JSON.stringify(images || []);

      // 插入商品数据时加入 limit_purchase 字段
      connection.query(
        `INSERT INTO products (name, description, category_id, limit_purchase, images) VALUES (?, ?, ?, ?, ?)`,
        [name, description, category_id || null, limit_purchase || 0, imagesJson],
        (err, result) => {
          if (err) {
            connection.rollback(() => {
              connection.release();
              return res.status(500).json({ code: 500, message: "插入商品失败" });
            });
          }

          const productId = result.insertId;

          // SKU 批量插入
          const skuValues = skus.map(s => [
            productId,
            `${s.attr1 || ''}/${s.attr2 || ''}/${s.attr3 || ''}/${s.attr4 || ''}`,
            s.attr1 || null,
            s.attr2 || null,
            s.attr3 || null,
            s.attr4 || null,
            s.price || 0,
            s.stock || 0,
            s.limit_qty || 0,
            s.image || null
          ]);

          connection.query(
            `INSERT INTO product_skus
            (product_id, sku_name, attr1, attr2, attr3, attr4, price, stock, limit_qty, image)
            VALUES ?`,
            [skuValues],
            (err2) => {
              if (err2) {
                connection.rollback(() => {
                  connection.release();
                  return res.status(500).json({ code: 500, message: "插入SKU失败" });
                });
              }

              connection.commit((err3) => {
                if (err3) {
                  connection.rollback(() => {
                    connection.release();
                    return res.status(500).json({ code: 500, message: "提交事务失败" });
                  });
                }

                connection.release();
                res.json({ code: 200, message: "商品添加成功 ✅", product_id: productId });
              });
            }
          );
        }
      );
    });
  });
});




/**
 * ✅ 修改商品信息 + SKU + 图片
 */
app.put('/api/products/update/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, category_id, limit_purchase, skus, images } = req.body;

  // 获取数据库连接
  db.getConnection((err, connection) => {
    if (err) {
      console.error('获取数据库连接失败:', err);
      return res.status(500).json({ code: 500, message: '获取数据库连接失败' });
    }

    // 开启事务
    connection.beginTransaction(err => {
      if (err) {
        connection.release();
        console.error('事务启动失败:', err);
        return res.status(500).json({ code: 500, message: '事务启动失败' });
      }

      const imagesJson = JSON.stringify(images || []);

      // 更新商品基本信息
      connection.query(
        `UPDATE products SET name=?, description=?, category_id=?, limit_purchase=?, images=?, updated_at=NOW() WHERE id=?`,
        [name, description, category_id, limit_purchase || 0, imagesJson, id],
        (err1) => {
          if (err1) {
            connection.rollback(() => {
              connection.release();
              console.error('更新商品失败:', err1);
              return res.status(500).json({ code: 500, message: '更新商品失败' });
            });
          }

          // 删除旧的 SKU 数据
          connection.query(`DELETE FROM product_skus WHERE product_id=?`, [id], (err2) => {
            if (err2) {
              connection.rollback(() => {
                connection.release();
                console.error('删除旧SKU失败:', err2);
                return res.status(500).json({ code: 500, message: '删除旧SKU失败' });
              });
            }

            if (!Array.isArray(skus) || skus.length === 0) {
              // 如果没有新的 SKU，提交事务
              connection.commit(err3 => {
                if (err3) {
                  connection.rollback(() => {
                    connection.release();
                    console.error('提交事务失败:', err3);
                    return res.status(500).json({ code: 500, message: '提交事务失败' });
                  });
                }

                connection.release();
                return res.json({ code: 200, message: '商品更新成功（无SKU） ✅' });
              });
              return;
            }

            // 如果有新的 SKU，准备批量插入数据
            const skuValues = skus.map(s => [
              id,
              `${s.attr1 || ''}/${s.attr2 || ''}/${s.attr3 || ''}/${s.attr4 || ''}`,
              s.attr1 || null,
              s.attr2 || null,
              s.attr3 || null,
              s.attr4 || null,
              s.price || 0,
              s.stock || 0,
              s.limit_qty || 0,
              s.image || null
            ]);

            // 批量插入新的 SKU 数据
            connection.query(
              `INSERT INTO product_skus
              (product_id, sku_name, attr1, attr2, attr3, attr4, price, stock, limit_qty, image)
              VALUES ?`,
              [skuValues],
              (err4) => {
                if (err4) {
                  connection.rollback(() => {
                    connection.release();
                    console.error('插入新SKU失败:', err4);
                    return res.status(500).json({ code: 500, message: '插入新SKU失败' });
                  });
                }

                // 提交事务
                connection.commit(err5 => {
                  if (err5) {
                    connection.rollback(() => {
                      connection.release();
                      console.error('提交事务失败:', err5);
                      return res.status(500).json({ code: 500, message: '提交事务失败' });
                    });
                  }

                  connection.release();
                  return res.json({ code: 200, message: '商品更新成功 ✅' });
                });
              }
            );
          });
        }
      );
    });
  });
});




/**
 * ✅ 查询所有商品及SKU（带多图 JSON 解析）
 */
app.get('/api/products/list', (req, res) => {
  const sql = `
    SELECT p.id AS product_id, p.name, p.description, p.category_id, p.images, p.limit_purchase,
           s.id AS sku_id, s.sku_name, s.attr1, s.attr2, s.attr3, s.attr4,
           s.price, s.stock, s.limit_qty, s.image
    FROM products p
    LEFT JOIN product_skus s ON p.id = s.product_id
    ORDER BY p.id DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("❌ 查询商品失败:", err);
      return res.status(500).json({ code: 500, message: "查询失败" });
    }

    const map = new Map();

    rows.forEach(r => {
      if (!map.has(r.product_id)) {
        let parsedImages = [];

        // ✅ 安全解析 images 字段
        try {
          if (r.images && typeof r.images === 'string') {
            if (r.images.trim().startsWith('[')) {
              parsedImages = JSON.parse(r.images);
            } else if (r.images.trim().startsWith('http')) {
              parsedImages = [r.images];
            }
          } else if (Array.isArray(r.images)) {
            parsedImages = r.images;
          }
        } catch (e) {
          console.warn("⚠️ 图片解析失败:", r.images);
          parsedImages = [];
        }

        map.set(r.product_id, {
          id: r.product_id,
          name: r.name,
          description: r.description,
          category_id: r.category_id,
          images: parsedImages,
          limit_purchase: r.limit_purchase,  // 包括 limit_purchase
          skus: []
        });
      }

      // ✅ SKU 合并
      if (r.sku_id) {
        map.get(r.product_id).skus.push({
          sku_id: r.sku_id,
          sku_name: r.sku_name,
          attr1: r.attr1,
          attr2: r.attr2,
          attr3: r.attr3,
          attr4: r.attr4,
          price: r.price,
          stock: r.stock,
          limit_qty: r.limit_qty,
          image: r.image
        });
      }
    });

    res.json({ code: 200, data: Array.from(map.values()) });
  });
});



/**
 * ✅ 更新单个SKU库存、限售、图片
 */
app.patch('/api/skus/update/:sku_id', (req, res) => {
  const { sku_id } = req.params;
  const { stock, limit_qty, image } = req.body;

  const fields = [];
  const params = [];

  if (stock !== undefined) {
    fields.push("stock=?");
    params.push(stock);
  }
  if (limit_qty !== undefined) {
    fields.push("limit_qty=?");
    params.push(limit_qty);
  }
  if (image !== undefined) {
    fields.push("image=?");
    params.push(image);
  }

  if (fields.length === 0)
    return res.status(400).json({ message: "请至少提供一个字段" });

  params.push(sku_id);

  db.query(`UPDATE product_skus SET ${fields.join(", ")} WHERE id=?`, params, (err) => {
    if (err) return res.status(500).json({ message: "更新失败" });
    res.json({ message: "SKU更新成功 ✅" });
  });
});

/**
 * ✅ 删除商品（级联删除SKU）
 */
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.query(`DELETE FROM products WHERE id=?`, [id], (err) => {
    if (err) return res.status(500).json({ message: "删除失败" });
    res.json({ message: "商品删除成功 ✅" });
  });
});

// ✅ 分页查询商品列表
app.get('/api/products/page', (req, res) => {
  let { page = 1, pageSize = 10, keyword = "" } = req.query;
  page = parseInt(page);
  pageSize = parseInt(pageSize);

  const offset = (page - 1) * pageSize;

  // 搜索条件
  const whereSql = keyword
    ? `WHERE p.name LIKE ?`
    : "";

  // 总数 SQL
  const countSql = `
    SELECT COUNT(*) AS total
    FROM products p
    ${whereSql}
  `;

  // 分页 SQL
  const listSql = `
    SELECT 
      p.id, p.name, p.description, p.category_id, p.images,
      (SELECT COUNT(*) FROM product_skus WHERE product_id = p.id) AS sku_count
    FROM products p
    ${whereSql}
    ORDER BY p.id DESC
    LIMIT ? OFFSET ?
  `;

  const params = keyword ? [`%${keyword}%`] : [];
  
  // 查询总数
  db.query(countSql, params, (err, totalResult) => {
    if (err) {
      console.error("❌ 获取商品总数失败:", err);
      return res.status(500).json({ code: 500, message: "获取商品数量失败" });
    }

    const total = totalResult[0].total;

    // 查询分页数据
    const listParams = keyword
      ? [`%${keyword}%`, pageSize, offset]
      : [pageSize, offset];

    db.query(listSql, listParams, (err2, list) => {
      if (err2) {
        console.error("❌ 查询商品失败:", err2);
        return res.status(500).json({ code: 500, message: "查询失败" });
      }

      // 解析 images JSON
      const parsedList = list.map(item => {
        let imgs = [];
        try {
          if (item.images && item.images.startsWith('[')) {
            imgs = JSON.parse(item.images);
          } else if (item.images) {
            imgs = [item.images];
          }
        } catch (e) {}

        return {
          ...item,
          images: imgs
        };
      });

      res.json({
        code: 200,
        data: {
          list: parsedList,
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      });
    });
  });
});


// ✅ 首页商品接口（带图片、最低价）
app.get('/api/products/home', (req, res) => {
  let { page = 1, pageSize = 20 } = req.query;
  page = parseInt(page);
  pageSize = parseInt(pageSize);
  const offset = (page - 1) * pageSize;

  const sql = `
    SELECT 
      p.id,
      p.name,
      p.description,
      p.images,
      p.category_id,
      (SELECT MIN(price) FROM product_skus WHERE product_id = p.id) AS min_price,
      (SELECT COUNT(*) FROM product_skus WHERE product_id = p.id) AS sku_count
    FROM products p
    ORDER BY p.id DESC
    LIMIT ? OFFSET ?
  `;

  db.query(sql, [pageSize, offset], (err, list) => {
    if (err) {
      console.error("❌ 查询商品失败:", err);
      return res.status(500).json({ code: 500, message: "查询失败" });
    }

    const products = list.map(item => {
      let imgs = [];

      try {
        if (!item.images) {
          imgs = [];
        } else if (Array.isArray(item.images)) {
          // ✅ MySQL JSON 字段已经被解析成数组的情况
          imgs = item.images;
        } else if (typeof item.images === 'string') {
          const str = item.images.trim();
          if (str.startsWith('[')) {
            // ✅ 标准 JSON 数组字符串：["url1","url2"]
            imgs = JSON.parse(str);
          } else {
            // ✅ 单个 URL 字符串："https://xxx.png"
            imgs = [str];
          }
        }
      } catch (e) {
        console.warn('⚠️ images 解析失败:', item.images);
        imgs = [];
      }

      return {
        id: item.id,
        name: item.name,
        description: item.description,
        sku_count: item.sku_count,
        price: item.min_price || 0,                 // 首页显示最低 SKU 价格
        pic: imgs.length > 0 ? imgs[0] : '',        // ✅ 首张图给前端
      };
    });

    res.json({
      code: 200,
      data: {
        list: products,
        page,
        pageSize
      }
    });
  });
});


/**
 * ========== Banner API 全量接口 ==========
 */

/**
 * 1. 获取 Banner 分页（后台管理用）
 * GET /api/admin/banners?page=1&pageSize=10&keyword=xxx
 */
app.get("/api/admin/banners", (req, res) => {
  let { page = 1, pageSize = 10, keyword = "" } = req.query;
  page = parseInt(page);
  pageSize = parseInt(pageSize);
  const offset = (page - 1) * pageSize;

  const whereSql = keyword ? "WHERE title LIKE ?" : "";
  const params = keyword ? [`%${keyword}%`] : [];

  const countSql = `SELECT COUNT(*) as total FROM banners ${whereSql}`;
  const listSql = `
    SELECT *
    FROM banners
    ${whereSql}
    ORDER BY sort DESC, id DESC
    LIMIT ? OFFSET ?
  `;

  db.query(countSql, params, (err, totalResult) => {
    if (err) return res.json({ code: 500, message: "统计失败" });

    const total = totalResult[0].total;

    db.query(
      listSql,
      keyword ? [...params, pageSize, offset] : [pageSize, offset],
      (err2, list) => {
        if (err2) return res.json({ code: 500, message: "查询失败" });

        res.json({
          code: 200,
          data: {
            list,
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
          },
        });
      }
    );
  });
});


/**
 * 2. 新增 Banner
 * POST /api/admin/banners
 */
app.post("/api/admin/banners", (req, res) => {
  const { title, image, product_id, sort } = req.body;

  const sql = `
    INSERT INTO banners (title, image, product_id, sort)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [title, image, product_id || null, sort || 0], (err) => {
    if (err) return res.json({ code: 500, message: "新增失败" });

    res.json({ code: 200, message: "新增成功" });
  });
});


/**
 * 3. 修改 Banner
 * PUT /api/admin/banners/:id
 */
app.put("/api/admin/banners/:id", (req, res) => {
  const { id } = req.params;
  const { title, image, product_id, sort } = req.body;

  const sql = `
    UPDATE banners
    SET title = ?, image = ?, product_id = ?, sort = ?
    WHERE id = ?
  `;

  db.query(sql, [title, image, product_id || null, sort, id], (err) => {
    if (err) return res.json({ code: 500, message: "更新失败" });

    res.json({ code: 200, message: "更新成功" });
  });
});


/**
 * 4. 删除 Banner
 * DELETE /api/admin/banners/:id
 */
app.delete("/api/admin/banners/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM banners WHERE id = ?", [id], (err) => {
    if (err) return res.json({ code: 500, message: "删除失败" });

    res.json({ code: 200, message: "删除成功" });
  });
});


/**
 * 5. 前台获取全部 Banner（用户端用）
 * GET /api/banners
 */
app.get("/api/banners", (req, res) => {
  const sql = `
    SELECT id, title, image, product_id
    FROM banners
    ORDER BY sort DESC, id DESC
  `;

  db.query(sql, (err, list) => {
    if (err) return res.json({ code: 500, message: "获取失败" });

    res.json({
      code: 200,
      data: list,
    });
  });
});


/**
 * ✅ 获取商品详情（带所有图片 + SKU）
 * GET /api/products/:id
 */
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      p.id AS product_id,
      p.name,
      p.description,
      p.category_id,
      p.images,
      p.limit_purchase,
      s.id AS sku_id,
      s.sku_name,
      s.attr1,
      s.attr2,
      s.attr3,
      s.attr4,
      s.price,
      s.stock,
      s.limit_qty,
      s.image
    FROM products p
    LEFT JOIN product_skus s ON p.id = s.product_id
    WHERE p.id=?
  `;

  db.query(sql, [id], (err, rows) => {
    if (err) {
      console.error("❌ 查询商品详情失败:", err);
      return res.status(500).json({ code: 500, message: "查询失败" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ code: 404, message: "商品不存在" });
    }

    // 解析图片
    let images = [];
    try {
      const img = rows[0].images;
      if (Array.isArray(img)) {
        images = img;
      } else if (typeof img === "string") {
        if (img.trim().startsWith("[")) {
          images = JSON.parse(img);
        } else {
          images = [img];
        }
      }
    } catch (_) {
      images = [];
    }

    const product = {
      id: rows[0].product_id,
      name: rows[0].name,
      description: rows[0].description,
      category_id: rows[0].category_id,
      images,
      limit_purchase: rows[0].limit_purchase,
      skus: [],
    };

    // 合并 SKU
    rows.forEach(r => {
      if (r.sku_id) {
        product.skus.push({
          sku_id: r.sku_id,
          sku_name: r.sku_name,
          attr1: r.attr1,
          attr2: r.attr2,
          attr3: r.attr3,
          attr4: r.attr4,
          price: r.price,
          stock: r.stock,
          limit_qty: r.limit_qty,
          image: r.image
        });
      }
    });

    res.json({
      code: 200,
      data: product,
    });
  });
});


// GET /api/products/:id
app.get("/products/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const productRows = await queryAsync(
      `SELECT id, name, description, category_id, limit_purchase
       FROM products WHERE id = ? LIMIT 1`,
      [id]
    );

    if (productRows.length === 0) {
      return res.json({ code: 404, msg: "商品不存在" });
    }

    const product = productRows[0];

    const imageRows = await queryAsync(
      `SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort ASC`,
      [id]
    );

    const images = imageRows.map(i => i.image_url);

    const skuRows = await queryAsync(
      `SELECT 
         id AS sku_id,
         sku_name,
         attr1, attr2, attr3, attr4,
         price,
         stock,
         limit_qty,
         image_url AS image
       FROM product_skus
       WHERE product_id = ?`,
      [id]
    );

    const skus = skuRows.map(sku => ({
      sku_id: sku.sku_id,
      sku_name: sku.sku_name,
      price: sku.price,
      stock: sku.stock,
      limit_qty: sku.limit_qty,
      image: sku.image,
      attrs: [
        { key: "颜色", value: sku.attr1 },
        { key: "尺寸", value: sku.attr2 },
        { key: "材质", value: sku.attr3 },
        { key: "型号", value: sku.attr4 },
      ],
    }));

    res.json({
      code: 200,
      data: {
        ...product,
        images,
        skus,
      },
    });
  } catch (err) {
    console.error("get product error:", err);
    res.json({ code: 500, msg: "服务器错误" });
  }
});



// 创建订单
// 创建订单
app.post('/api/orders/create', (req, res) => {
  const {
    userId = 0,       // 可以不用登录，默认 0
    realName,
    mobile,
    idCardNo,
    items,
    studentSchool,    // 👈 新增：就读学校（可选）
    studentGrade      // 👈 新增：就读年级（可选）
  } = req.body || {};

  // 简单校验（学生信息非必填）
  if (!realName || !idCardNo || !mobile) {
    return res.status(400).json({
      code: 400,
      message: '姓名、手机号、身份证号不能为空'
    });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      code: 400,
      message: '订单商品不能为空'
    });
  }

  // ✅ 校验每个 item 是否有 sku_id 和合法数量
  for (const it of items) {
    // items 结构示例：
    // { product_id, product_name, sku_id, sku_name, price, quantity, image }
    if (it.sku_id == null || Number(it.sku_id) <= 0) {
      return res.status(400).json({
        code: 400,
        message: '订单商品缺少有效的 sku_id'
      });
    }
    const qtyNum = Number(it.quantity);
    if (!Number.isFinite(qtyNum) || qtyNum <= 0) {
      return res.status(400).json({
        code: 400,
        message: '商品数量必须为大于 0 的数字'
      });
    }
  }

  // 计算金额：所有 sku 的 price * quantity
  let totalAmount = 0;
  try {
    items.forEach(it => {
      const price = Number(it.price) || 0;
      const qty = Number(it.quantity) || 0;
      totalAmount += price * qty;
    });
  } catch (e) {
    return res.status(400).json({
      code: 400,
      message: '商品价格或数量格式错误'
    });
  }

  const payAmount = totalAmount; // 暂时不做优惠，实付=总价

  // ========= 新增：下单前检查每个 SKU 的库存是否足够 =========
  // 用 product_skus 表：id, stock
  const skuIds = items.map(it => Number(it.sku_id));

  const placeholders = skuIds.map(() => '?').join(',');
  const stockSql = `
    SELECT id, stock
    FROM product_skus
    WHERE id IN (${placeholders})
  `;

  db.query(stockSql, skuIds, (stockErr, stockRows) => {
    if (stockErr) {
      console.error('检查库存失败:', stockErr);
      return res.status(500).json({
        code: 500,
        message: '检查库存失败'
      });
    }

    if (!stockRows || stockRows.length === 0) {
      return res.status(400).json({
        code: 400,
        message: '所选商品不存在或已下架'
      });
    }

    // 建立 id -> stock 的映射
    const stockMap = {};
    stockRows.forEach(row => {
      stockMap[row.id] = Number(row.stock) || 0;
    });

    // 校验每个商品是否库存足够
    for (const it of items) {
      const skuId = Number(it.sku_id);
      const need = Number(it.quantity);
      const available = stockMap[skuId];

      if (available === undefined) {
        return res.status(400).json({
          code: 400,
          message: `商品 SKU ${skuId} 不存在或已下架`
        });
      }

      if (available < need) {
        return res.status(400).json({
          code: 400,
          message: `商品 SKU ${skuId} 库存不足，需 ${need} 件，剩余 ${available} 件`
        });
      }
    }

    // ========= 库存全部足够，继续原来的创建订单逻辑 =========

    // 生成订单号：20251115 + 时间戳后几位
    const now = new Date();
    const pad2 = n => (n < 10 ? '0' + n : '' + n);
    const dateStr = now.getFullYear().toString()
      + pad2(now.getMonth() + 1)
      + pad2(now.getDate());

    const orderNo = 'ORD' + dateStr + now.getTime().toString().slice(-6);

    // items 快照，存 TEXT
    const itemsSnapshot = JSON.stringify(items);

    // ⚠️ 列顺序要跟表结构对应：
    // user_name, id_card_no, student_school, student_grade, mobile, ...
    const sql = `
      INSERT INTO orders (
        order_no,
        user_id,
        user_name,
        id_card_no,
        student_school,
        student_grade,
        mobile,
        total_amount,
        pay_amount,
        status,
        items_snapshot
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      orderNo,
      userId,
      realName,
      idCardNo,
      studentSchool || null,  // student_school
      studentGrade || null,   // student_grade
      mobile,
      totalAmount,
      payAmount,
      0,               // 0 = 待支付
      itemsSnapshot
    ];

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error('创建订单失败:', err);
        return res.status(500).json({
          code: 500,
          message: '创建订单失败'
        });
      }

      res.json({
        code: 200,
        message: '创建订单成功',
        data: {
          orderId: result.insertId,
          orderNo: orderNo,
          status: 0,
          totalAmount,
          payAmount
        }
      });
    });
  });
});



/**
 * 📦 管理后台：订单列表（分页 + 状态筛选）
 * GET /api/admin/orders?page=1&pageSize=10&status=1
 */
app.get('/api/admin/orders', (req, res) => {
  let { page, pageSize, status } = req.query;

  // 字符串转整数，带默认值
  page = parseInt(page, 10);
  if (isNaN(page) || page <= 0) page = 1;

  pageSize = parseInt(pageSize, 10);
  if (isNaN(pageSize) || pageSize <= 0) pageSize = 10;

  const offset = (page - 1) * pageSize;

  // 构建 WHERE 条件
  const whereArr = [];
  const params = [];

  // 按订单状态筛选（可选）：0待支付 1已支付 2退款中 3已退款
  if (status !== undefined && status !== '') {
    whereArr.push('status = ?');
    params.push(parseInt(status, 10));
  }

  const whereSql = whereArr.length > 0 ? 'WHERE ' + whereArr.join(' AND ') : '';

  // 统计总数
  const countSql = `
    SELECT COUNT(*) AS total
    FROM orders
    ${whereSql}
  `;

  // 列表查询（可根据需要调整字段）
const listSql = `
  SELECT
    id,
    order_no,
    user_id,
    user_name,
    id_card_no,
    student_school,
    student_grade,
    mobile,
    total_amount,
    pay_amount,
    status,
    refund_status,
    items_snapshot,   -- ✅ 新增这一行
    created_at,
    pay_time
  FROM orders
  ${whereSql}
  ORDER BY id DESC
  LIMIT ? OFFSET ?
`;


  // 先查总数
  db.query(countSql, params, (err, totalResult) => {
    if (err) {
      console.error('❌ 获取订单总数失败:', err);
      return res.status(500).json({
        code: 500,
        message: '获取订单数量失败'
      });
    }

    const total = (totalResult && totalResult[0] && totalResult[0].total) || 0;

    // 再查列表
    const listParams = params.slice(); // 拷贝一份
    listParams.push(pageSize, offset);

    db.query(listSql, listParams, (err2, list) => {
      if (err2) {
        console.error('❌ 获取订单列表失败:', err2);
        return res.status(500).json({
          code: 500,
          message: '获取订单列表失败'
        });
      }

      res.json({
        code: 200,
        data: {
          list,
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      });
    });
  });
});


/**
 * 🎠 轮播图管理 CRUD（适配简化版表结构：id, image_url, product_id）
 */

// 小工具：统一打印错误日志
function logCarouselError(action, err) {
  console.error(`❌ [Carousel] ${action}失败:`, {
    code: err.code,
    errno: err.errno,
    sqlMessage: err.sqlMessage,
  });
}

// ✅ 获取轮播图列表（按 ID 降序）
app.get("/api/carousel/list", (req, res) => {
  const sql = "SELECT id, image_url, product_id FROM carousel ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      logCarouselError("查询列表", err);
      return res.status(500).json({ code: 500, message: "获取轮播图失败" });
    }
    return res.json({ code: 200, data: results });
  });
});

app.post("/api/carousel/add", (req, res) => {
  const { image_url, product_id } = req.body || {};

  // 图片必填
  if (!image_url || image_url.trim() === "") {
    return res.status(400).json({ code: 400, message: "图片地址不能为空" });
  }

  // ⭐ 自动把 product_id 转成数字，如果为空/null/NaN → 设置成 0
  let pid = Number(product_id);
  if (!pid) pid = 0; // 自动兜底

  const sql = "INSERT INTO carousel (image_url, product_id) VALUES (?, ?)";

  db.query(sql, [image_url.trim(), pid], (err, result) => {
    if (err) {
      console.error("添加轮播图失败:", err);
      return res.status(500).json({ code: 500, message: "添加轮播图失败" });
    }

    return res.json({
      code: 200,
      message: "添加成功",
      data: { id: result.insertId },
    });
  });
});


// ✅ 更新轮播图
// 这里沿用你原来的风格：从 body 中拿 id
app.put("/api/carousel/update", (req, res) => {
  const { id, image_url, product_id } = req.body || {};

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ code: 400, message: "轮播图ID不合法" });
  }
  if (!image_url || image_url.trim() === "") {
    return res.status(400).json({ code: 400, message: "图片地址不能为空" });
  }
  if (product_id === undefined || product_id === null || isNaN(Number(product_id))) {
    return res.status(400).json({ code: 400, message: "商品ID不合法" });
  }

  const sql = `
    UPDATE carousel
    SET image_url = ?, product_id = ?
    WHERE id = ?
  `;

  db.query(sql, [image_url.trim(), Number(product_id), Number(id)], (err, result) => {
    if (err) {
      logCarouselError("更新", err);
      return res.status(500).json({ code: 500, message: "更新轮播图失败" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ code: 404, message: "轮播图不存在" });
    }

    return res.json({ code: 200, message: "更新成功" });
  });
});

// ✅ 删除轮播图
app.delete("/api/carousel/delete/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!id || isNaN(id)) {
    return res.status(400).json({ code: 400, message: "轮播图ID不合法" });
  }

  const sql = "DELETE FROM carousel WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      logCarouselError("删除", err);
      return res.status(500).json({ code: 500, message: "删除轮播图失败" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ code: 404, message: "轮播图不存在" });
    }

    return res.json({ code: 200, message: "删除成功" });
  });
});

// ✅ 根据ID获取单个轮播图
app.get("/api/carousel/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!id || isNaN(id)) {
    return res.status(400).json({ code: 400, message: "轮播图ID不合法" });
  }

  const sql = "SELECT id, image_url, product_id FROM carousel WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      logCarouselError("查询单个", err);
      return res.status(500).json({ code: 500, message: "获取轮播图详情失败" });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ code: 404, message: "轮播图不存在" });
    }

    return res.json({ code: 200, data: results[0] });
  });
});


/**
 * ✅ 微信支付结果回调（由 Go 支付服务转发过来）
 * POST /api/pay/wechat/notify
 *
 * body 示例：
 * {
 *   "orderNo": "ORD20251122000123",
 *   "transaction_id": "4200001234202311221234567890",
 *   "total": 100   // 单位：分，可选
 * }
 */
app.post('/api/pay/wechat/notify', (req, res) => {
  const { orderNo, transaction_id, total } = req.body || {};

  if (!orderNo || !transaction_id) {
    return res.status(400).json({
      code: 400,
      message: 'orderNo 或 transaction_id 不能为空',
    });
  }

  console.log('👉 收到支付成功回调:', { orderNo, transaction_id, total });

  // 获取数据库连接
  db.getConnection((err, connection) => {
    if (err) {
      console.error('获取数据库连接失败:', err);
      return res.status(500).json({ code: 500, message: '获取数据库连接失败' });
    }

    // 开始事务
    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        console.error('开启事务失败:', err);
        return res.status(500).json({ code: 500, message: '开启事务失败' });
      }

      // 1️⃣ 查询订单，并锁定行（FOR UPDATE）
      const selectSql = `
        SELECT id, status, pay_amount, items_snapshot
        FROM orders
        WHERE order_no = ?
        FOR UPDATE
      `;
      connection.query(selectSql, [orderNo], (err1, rows) => {
        if (err1) {
          connection.rollback(() => {
            connection.release();
            console.error('查询订单失败:', err1);
            return res.status(500).json({ code: 500, message: '查询订单失败' });
          });
        }

        if (!rows || rows.length === 0) {
          connection.rollback(() => {
            connection.release();
            console.error('订单不存在:', orderNo);
            return res.status(404).json({ code: 404, message: '订单不存在' });
          });
        }

        const order = rows[0];

        // 如果已经是已支付，直接返回成功（幂等）
        if (order.status === 1) {
          console.log('订单已是已支付状态，直接返回:', orderNo);
          return connection.commit((errCommit) => {
            if (errCommit) {
              connection.rollback(() => {
                connection.release();
                console.error('提交事务失败:', errCommit);
                return res.status(500).json({ code: 500, message: '提交事务失败' });
              });
            }
            connection.release();
            return res.json({ code: 200, message: '已处理(幂等)', data: { orderId: order.id } });
          });
        }

        // 校验金额（微信返回 total 单位为分，你这边 pay_amount 是元）
        if (typeof total === 'number') {
          const orderAmountFen = Math.round(Number(order.pay_amount || 0) * 100);
          if (orderAmountFen !== total) {
            console.warn('⚠️ 金额不一致，orderNo=', orderNo, '本地=', orderAmountFen, '回调=', total);
            // 根据业务可以选择直接失败或记录告警
            // 这里我们只是打日志，不中断流程
          }
        }

        // 解析 items_snapshot，得到要扣库存的 SKU 列表
        let items = [];
        try {
          if (order.items_snapshot) {
            const parsed = JSON.parse(order.items_snapshot);
            if (Array.isArray(parsed)) {
              items = parsed;
            }
          }
        } catch (e) {
          console.error('解析 items_snapshot 失败:', e, order.items_snapshot);
          return connection.rollback(() => {
            connection.release();
            res.status(500).json({ code: 500, message: '解析订单商品失败' });
          });
        }

        // 如果订单里没有商品，就只更新状态
        const updateOrderAndCommit = () => {
          const updateSql = `
            UPDATE orders
            SET status = 1,
                wx_transaction_id = ?,
                pay_time = NOW(),
                updated_at = NOW()
            WHERE id = ?
          `;
          connection.query(updateSql, [transaction_id, order.id], (err3) => {
            if (err3) {
              console.error('更新订单状态失败:', err3);
              return connection.rollback(() => {
                connection.release();
                res.status(500).json({ code: 500, message: '更新订单状态失败' });
              });
            }

            connection.commit((errCommit) => {
              if (errCommit) {
                console.error('提交事务失败:', errCommit);
                return connection.rollback(() => {
                  connection.release();
                  res.status(500).json({ code: 500, message: '提交事务失败' });
                });
              }

              console.log('✅ 订单支付成功已处理完成:', orderNo);
              connection.release();
              res.json({
                code: 200,
                message: '订单支付处理成功',
                data: {
                  orderId: order.id,
                  orderNo,
                  transaction_id,
                },
              });
            });
          });
        };

        if (!items.length) {
          console.log('订单无商品快照，只更新状态:', orderNo);
          return updateOrderAndCommit();
        }

        // 2️⃣ 按 SKU 扣库存（逐条加锁）
        let index = 0;

        const processNextSku = () => {
          if (index >= items.length) {
            // 所有 SKU 处理完成，更新订单状态
            return updateOrderAndCommit();
          }

          const it = items[index];
          const skuId = it.sku_id || it.skuId || it.id; // 兜底，按你的实际结构调整
          const qty = Number(it.quantity || 0);

          if (!skuId || qty <= 0) {
            console.warn('SKU 数据不合法，跳过一条:', it);
            index++;
            return processNextSku();
          }

          // 🔒 先锁定 SKU 行
          const skuSelectSql = `
            SELECT id, stock
            FROM product_skus
            WHERE id = ?
            FOR UPDATE
          `;
          connection.query(skuSelectSql, [skuId], (errSku, skuRows) => {
            if (errSku) {
              console.error('查询 SKU 失败:', errSku);
              return connection.rollback(() => {
                connection.release();
                res.status(500).json({ code: 500, message: '查询 SKU 失败' });
              });
            }

            if (!skuRows || skuRows.length === 0) {
              console.error('SKU 不存在，id=', skuId);
              return connection.rollback(() => {
                connection.release();
                res.status(500).json({ code: 500, message: 'SKU 不存在: ' + skuId });
              });
            }

            const currentStock = Number(skuRows[0].stock || 0);
            if (currentStock < qty) {
              console.error('库存不足，skuId=', skuId, '当前库存=', currentStock, '需要=', qty);
              return connection.rollback(() => {
                connection.release();
                res.status(500).json({ code: 500, message: '库存不足，SKU: ' + skuId });
              });
            }

            // 3️⃣ 扣减库存
            const updateStockSql = `
              UPDATE product_skus
              SET stock = stock - ?
              WHERE id = ?
            `;
            connection.query(updateStockSql, [qty, skuId], (errUpdate) => {
              if (errUpdate) {
                console.error('扣减库存失败，skuId=', skuId, errUpdate);
                return connection.rollback(() => {
                  connection.release();
                  res.status(500).json({ code: 500, message: '扣减库存失败' });
                });
              }

              console.log(`SKU ${skuId} 库存扣减成功: -${qty}`);
              index++;
              processNextSku();
            });
          });
        };

        // 启动 SKU 扣减流程
        processNextSku();
      });
    });
  });
});




app.get('/api/order/detail', (req, res) => {
  const { order_id, order_no } = req.query;

  if (!order_id && !order_no) {
    return res.json({ code: 400, msg: "order_id 或 order_no 必传" });
  }

  let sql = `
    SELECT 
      id,
      order_no,
      user_id,
      user_name,
      id_card_no,
      student_school,
      student_grade,
      mobile,
      total_amount,
      pay_amount,
      status,
      refund_status,
      refund_amount,
      refund_time,
      audit_status,
      created_at,
      pay_time,
      items_snapshot
    FROM orders
    WHERE ${order_id ? 'id = ?' : 'order_no = ?'}
    LIMIT 1
  `;

  db.query(sql, [order_id || order_no], (err, rows) => {
    if (err) {
      console.error("订单详情查询失败:", err);
      return res.json({ code: 500, msg: "服务器异常" });
    }

    if (!rows.length) {
      return res.json({ code: 404, msg: "订单不存在" });
    }

    let info = rows[0];

    // items_snapshot 转成对象
    try {
      info.goodsList = JSON.parse(info.items_snapshot || '[]');
    } catch (e) {
      info.goodsList = [];
    }

    return res.json({ code: 200, data: info });
  });
});

// 查询当前用户退款相关订单
app.get('/api/order/refund/list', (req, res) => {
  const openid = req.query.openid;

  if (!openid) {
    return res.json({
      code: 400,
      msg: 'openid 必传',
    });
  }

  // 查出该用户所有已支付 / 退款中 / 已退款订单
  const sql = `
    SELECT
      id,
      order_no,
      user_id,
      user_name,
      mobile,
      total_amount,
      pay_amount,
      status,
      refund_status,
      refund_amount,
      refund_reason,
      created_at,
      pay_time,
      refund_time,
      items_snapshot
    FROM orders
    WHERE user_id = ?
      AND status IN (1, 2, 3)
    ORDER BY created_at DESC
  `;

  db.query(sql, [openid], (err, rows) => {
    if (err) {
      console.error('查询退款订单列表失败:', err);
      return res.json({
        code: 500,
        msg: '服务器异常',
      });
    }

    const now = Date.now();
    const H72 = 72 * 60 * 60 * 1000;

    const refundableOrders = [];        // 可申请退款（72 小时内已支付 & 未申请）
    const refundProcessingOrders = [];  // 退款中
    const refundSuccessOrders = [];     // 已退款

    rows.forEach((o) => {
      const status = Number(o.status || 0);
      const refundStatus = Number(o.refund_status || 0);

      let payTimeMs = 0;
      if (o.pay_time) {
        const dt = new Date(o.pay_time);
        if (!isNaN(dt.getTime())) {
          payTimeMs = dt.getTime();
        }
      }

      const within72h = !!(payTimeMs && now - payTimeMs <= H72);

      if (
        status === 1 &&             // 已支付
        refundStatus === 0 &&       // 无退款
        within72h
      ) {
        // 可申请退款
        refundableOrders.push(o);
      } else if (
        refundStatus === 1 ||       // 退款中
        status === 2
      ) {
        refundProcessingOrders.push(o);
      } else if (
        refundStatus === 2 ||       // 退款成功
        status === 3
      ) {
        refundSuccessOrders.push(o);
      }
    });

    return res.json({
      code: 200,
      data: {
        refundable_orders: refundableOrders,             // 可申请退款的订单
        refund_processing_orders: refundProcessingOrders, // 正在处理退款的订单
        refund_success_orders: refundSuccessOrders,       // 已退款订单（可选）
      },
    });
  });
});

// 申请退款（只更新 orders 表，不调用微信）
// POST /api/order/refund/apply
app.post('/api/order/refund/apply', (req, res) => {
  const openid = req.body.openid;
  const orderId = req.body.order_id;
  const reason = req.body.reason || '';

  if (!openid || !orderId) {
    return res.json({
      code: 400,
      msg: 'openid 和 order_id 必传',
    });
  }

  // 1. 先查出订单，校验归属、状态、时间
  const sqlSelect = `
    SELECT
      id,
      order_no,
      user_id,
      status,
      refund_status,
      pay_time
    FROM orders
    WHERE id = ?
      AND user_id = ?
    LIMIT 1
  `;

  db.query(sqlSelect, [orderId, openid], (err, rows) => {
    if (err) {
      console.error('查询订单失败:', err);
      return res.json({
        code: 500,
        msg: '服务器异常',
      });
    }

    if (!rows || rows.length === 0) {
      return res.json({
        code: 404,
        msg: '订单不存在',
      });
    }

    const order = rows[0];
    const status = Number(order.status || 0);
    const refundStatus = Number(order.refund_status || 0);

    // 只能对 已支付 且 无退款 的订单 申请退款
    if (status !== 1 || refundStatus !== 0) {
      return res.json({
        code: 400,
        msg: '当前订单无法申请退款',
      });
    }

    // 必须有支付时间
    if (!order.pay_time) {
      return res.json({
        code: 400,
        msg: '订单未支付，无法申请退款',
      });
    }

    // 校验是否在 72 小时内
    const payTime = new Date(order.pay_time);
    if (isNaN(payTime.getTime())) {
      return res.json({
        code: 400,
        msg: '订单支付时间异常',
      });
    }

    const now = Date.now();
    const H72 = 72 * 60 * 60 * 1000;
    const diff = now - payTime.getTime();

    if (diff > H72) {
      return res.json({
        code: 400,
        msg: '已超过 72 小时，无法申请退款',
      });
    }

    // 生成一个简单的退款单号
    const pad2 = (n) => (n < 10 ? '0' + n : '' + n);
    const d = new Date();
    const refundNo =
      'RF' +
      d.getFullYear() +
      pad2(d.getMonth() + 1) +
      pad2(d.getDate()) +
      pad2(d.getHours()) +
      pad2(d.getMinutes()) +
      pad2(d.getSeconds()) +
      Math.floor(Math.random() * 9000 + 1000); // 4 位随机数

    // 2. 更新订单为 退款中，只改 orders 表
    const sqlUpdate = `
      UPDATE orders
      SET
        status = 2,           -- 订单状态：退款中
        refund_status = 1,    -- 退款状态：退款中
        refund_reason = ?,
        refund_no = ?,
        refund_time = NULL,
        updated_at = NOW()
      WHERE id = ?
        AND user_id = ?
        AND status = 1
        AND refund_status = 0
    `;

    db.query(
      sqlUpdate,
      [reason, refundNo, orderId, openid],
      (err2, result) => {
        if (err2) {
          console.error('更新订单退款状态失败:', err2);
          return res.json({
            code: 500,
            msg: '服务器异常',
          });
        }

        if (result.affectedRows === 0) {
          // 并发下可能被别人改过了
          return res.json({
            code: 400,
            msg: '订单状态已发生变化，请稍后重试',
          });
        }

        return res.json({
          code: 200,
          msg: '申请退款已提交',
          data: {
            order_id: orderId,
            refund_no: refundNo,
          },
        });
      }
    );
  });
});


// 获取用户订单列表（可选按状态筛选）
// GET /api/order/list?openid=xxx[&status=0/1/2/3]
app.get('/api/order/list', (req, res) => {
  const { openid, status } = req.query;

  if (!openid) {
    return res.json({
      code: 400,
      msg: 'openid 必传',
    });
  }

  // 基础 SQL
  let sql = `
    SELECT 
      id,
      order_no,
      user_id,
      user_name,
      id_card_no,
      student_school,
      student_grade,
      mobile,
      total_amount,
      pay_amount,
      status,
      refund_status,
      refund_amount,
      refund_time,
      audit_status,
      receiver_name,
      receiver_mobile,
      receiver_address,
      items_snapshot,
      created_at,
      pay_time
    FROM orders
    WHERE user_id = ?
  `;
  const params = [openid];

  // 如果传了 status，就追加条件
  if (status !== undefined && status !== '') {
    sql += ' AND status = ?';
    params.push(Number(status)); // 转成数字更保险
  }

  // 按创建时间倒序
  sql += ' ORDER BY created_at DESC';

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error('查询订单失败: ', err);
      return res.json({
        code: 500,
        msg: '服务器异常',
      });
    }

    return res.json({
      code: 200,
      data: rows,
    });
  });
});



app.get('/api/system/check-timezone', (req, res) => {
  const sysTime = new Date();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  res.json({
    code: 200,
    server_time: sysTime,
    time_zone: timezone,
    offset_minutes: sysTime.getTimezoneOffset()   // -480 表示 UTC+8
  });
});


// 管理后台：获取待审核退款订单列表
app.get('/api/admin/refund/pending', (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const pageSize = parseInt(req.query.pageSize, 10) || 20;
  const offset = (page - 1) * pageSize;

  // 先查总数
  const countSql = `
    SELECT COUNT(*) AS total
    FROM orders
    WHERE refund_status = 1
      AND audit_status = 0
  `;

  db.query(countSql, (err, countRows) => {
    if (err) {
      console.error('查询待审核退款订单总数失败: ', err);
      return res.json({
        code: 500,
        msg: '服务器异常',
      });
    }

    const total = countRows[0].total || 0;

    // 再查列表数据
    const listSql = `
      SELECT
        id,
        order_no,
        user_id,
        user_name,
        id_card_no,
        student_school,
        student_grade,
        mobile,
        total_amount,
        pay_amount,
        status,
        refund_status,
        refund_amount,
        refund_reason,
        audit_status,
        audit_remark,
        created_at,
        pay_time,
        refund_time,
        items_snapshot
      FROM orders
      WHERE refund_status = 1
        AND audit_status = 0
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    db.query(listSql, [pageSize, offset], (err2, rows) => {
      if (err2) {
        console.error('查询待审核退款订单列表失败: ', err2);
        return res.json({
          code: 500,
          msg: '服务器异常',
        });
      }

      return res.json({
        code: 200,
        data: {
          list: rows,
          page,
          pageSize,
          total,
        },
      });
    });
  });
});


// 记得上面要有：const axios = require('axios');

// 管理后台：审核退款申请（同意 / 拒绝）
// app.post('/api/admin/refund/audit', (req, res) => {
//   const { order_id, action, remark, admin_id } = req.body || {};

//   if (!order_id || !action) {
//     return res.json({
//       code: 400,
//       msg: 'order_id 和 action 必传',
//     });
//   }

//   if (action !== 'approve' && action !== 'reject') {
//     return res.json({
//       code: 400,
//       msg: 'action 只支持 approve 或 reject',
//     });
//   }

//   const auditRemark = remark || '';
//   const adminId = admin_id || null;

//   // 先查订单，防止乱改
//   const selectSql = `
//     SELECT 
//       id,
//       order_no,
//       pay_amount,
//       status,
//       refund_status,
//       audit_status,
//       wx_transaction_id,
//       refund_reason
//     FROM orders
//     WHERE id = ?
//     LIMIT 1
//   `;

//   db.query(selectSql, [order_id], async (err, rows) => {
//     if (err) {
//       console.error('查询订单失败: ', err);
//       return res.json({
//         code: 500,
//         msg: '服务器异常',
//       });
//     }

//     if (!rows || rows.length === 0) {
//       return res.json({
//         code: 404,
//         msg: '订单不存在',
//       });
//     }

//     const order = rows[0];

//     // 只允许审核：退款中 + 待审核
//     if (order.refund_status !== 1 || order.audit_status !== 0) {
//       return res.json({
//         code: 400,
//         msg: '当前订单不在待审核状态，无法操作',
//       });
//     }

//     // ====== 如果是“拒绝退款”，只改数据库，不调微信 ======
//     if (action === 'reject') {
//       const updateSql = `
//         UPDATE orders
//         SET
//           refund_status = 3,      -- 退款失败 / 拒绝
//           status = 1,             -- 继续保持已支付
//           audit_status = 2,       -- 审核拒绝
//           audit_remark = ?,
//           audit_by = ?,
//           audit_time = NOW(),
//           updated_at = NOW()
//         WHERE id = ?
//           AND refund_status = 1
//           AND audit_status = 0
//       `;
//       const updateParams = [auditRemark, adminId, order_id];

//       return db.query(updateSql, updateParams, (err2, result) => {
//         if (err2) {
//           console.error('更新订单退款审核状态失败: ', err2);
//           return res.json({
//             code: 500,
//             msg: '服务器异常',
//           });
//         }

//         if (result.affectedRows === 0) {
//           return res.json({
//             code: 409,
//             msg: '订单状态已变更，请刷新后重试',
//           });
//         }

//         return res.json({
//           code: 200,
//           msg: '审核已拒绝',
//         });
//       });
//     }

//     // ====== 走到这里就是“同意退款” ======

//     // 微信支付那边真正退款，需要用到微信支付的交易号
//     if (!order.wx_transaction_id) {
//       return res.json({
//         code: 400,
//         msg: '订单缺少微信支付交易号(wx_transaction_id)，无法退款',
//       });
//     }

//     // 退款金额（单位：分），这里用订单实付金额 full refund
//     const payAmountNumber = Number(order.pay_amount || 0);
//     const refundAmountFen = Math.round(payAmountNumber * 100);

//     if (refundAmountFen <= 0) {
//       return res.json({
//         code: 400,
//         msg: '退款金额非法',
//       });
//     }

//     // 退款单号：你可以用自己的规则，这里简单用时间戳
//     const outRefundNo = `REFUND_${Date.now()}_${order_id}`;

//     // 退款原因：优先用订单里的 refund_reason，其次管理员备注，再不行就给个默认值
//     const finalReason =
//       order.refund_reason ||
//       auditRemark ||
//       '后台审核通过，发起退款';

//     try {
//       // ===== 调用 Go 退款服务，真正走微信退款 =====
//       const resp = await axios.post('https://pay.jzzw-tech.cn/refund', {
//         transaction_id: order.wx_transaction_id,
//         out_refund_no: outRefundNo,
//         reason: finalReason,
//         refund_amount: refundAmountFen, // 0.01元 => 1
//       }, {
//         timeout: 10000,
//       });

//       console.log('调用 Go 退款服务返回：', resp.data);

//       // 这里根据你 Go 服务的返回结构做判断
//       // 假设成功就直接认为退款成功，否则返回错误
//       // 比如 Go 返回 { code: 0, msg: 'ok', refund_id: 'xxx' }
//       const body = resp.data || {};
//       if (body.code !== 0) {
//         return res.json({
//           code: 500,
//           msg: '退款接口返回失败：' + (body.msg || '未知错误'),
//         });
//       }

//       const wxRefundId = body.refund_id || null;

//       // ===== Go 那边已成功发起退款，这里更新订单表，标记为退款成功 =====
//       const updateSql = `
//         UPDATE orders
//         SET
//           refund_status = 2,          -- 退款成功
//           status = 3,                 -- 已退款
//           audit_status = 1,           -- 审核通过
//           audit_remark = ?,
//           audit_by = ?,
//           audit_time = NOW(),
//           refund_amount = pay_amount, -- 全额退款，如果部分退款这里自己算
//           refund_time = NOW(),
//           wx_refund_id = ?,           -- 记录微信退款单号（Go 返回的）
//           updated_at = NOW()
//         WHERE id = ?
//           AND refund_status = 1
//           AND audit_status = 0
//       `;
//       const updateParams = [auditRemark, adminId, wxRefundId, order_id];

//       db.query(updateSql, updateParams, (err2, result) => {
//         if (err2) {
//           console.error('更新订单退款状态失败: ', err2);
//           return res.json({
//             code: 500,
//             msg: '退款成功但更新订单失败，请人工核对',
//           });
//         }

//         if (result.affectedRows === 0) {
//           return res.json({
//             code: 409,
//             msg: '订单状态已变更，请刷新后重试',
//           });
//         }

//         return res.json({
//           code: 200,
//           msg: '审核通过，退款已发起/完成',
//           data: {
//             refund_id: wxRefundId,
//           },
//         });
//       });
//     } catch (e) {
//       console.error('调用退款服务异常: ', e.response ? e.response.data : e.message);
//       return res.json({
//         code: 500,
//         msg: '调用退款服务失败，请稍后重试或人工处理',
//       });
//     }
//   });
// });

app.post('/api/admin/refund/audit', (req, res) => {
  const { order_id, action, remark, admin_id } = req.body || {};

  if (!order_id || !action) {
    return res.json({ code: 400, msg: "order_id 和 action 必传" });
  }

  const auditRemark = remark || "";
  const adminId = admin_id || null;

  // 查询订单
  const sql = `
    SELECT id, pay_amount, wx_transaction_id, refund_status, audit_status, items_snapshot
    FROM orders WHERE id = ? LIMIT 1
  `;

  db.query(sql, [order_id], async (err, rows) => {
    if (err) return res.json({ code: 500, msg: "服务器异常" });
    if (!rows.length) return res.json({ code: 404, msg: "订单不存在" });

    const order = rows[0];

    if (order.refund_status !== 1 || order.audit_status !== 0) {
      return res.json({
        code: 400,
        msg: "订单不在待审核退款状态"
      });
    }

    // ❌ ===== 拒绝退款 =====
    if (action === "reject") {
      const sqlUpdate = `
        UPDATE orders SET
          refund_status = 3,
          status = 1,
          audit_status = 2,
          audit_remark = ?,
          audit_by = ?,
          audit_time = NOW(),
          updated_at = NOW()
        WHERE id = ? AND refund_status = 1 AND audit_status = 0
      `;
      db.query(sqlUpdate, [auditRemark, adminId, order_id], () => {
        return res.json({ code: 200, msg: "审核已拒绝" });
      });
      return;
    }

    // ======================
    // ✅ 同意退款（调用 Go API，但不管结果）
    // ======================
    try {
      await axios.post("https://pay.jzzw-tech.cn/refund", {
        transaction_id: order.wx_transaction_id,
        out_refund_no: "REFUND_" + Date.now(),
        reason: auditRemark || "后台审核退款",
        refund_amount: Math.round(Number(order.pay_amount) * 100)
      });
    } catch (e) {
      console.log("退款接口调用失败（忽略）:", e.message);
    }

    // ======================
    // ✅ 恢复 SKU 库存
    // ======================
    try {
      const items = JSON.parse(order.items_snapshot || "[]");

      for (const it of items) {
        const skuId = Number(it.sku_id);
        const qty = Number(it.quantity || 1);

        if (skuId > 0 && qty > 0) {
          const sqlAddStock = `
            UPDATE product_skus
            SET stock = stock + ?
            WHERE id = ?
          `;

          db.query(sqlAddStock, [qty, skuId], (err3) => {
            if (err3) console.log("恢复库存失败 SKU:", skuId, err3);
          });
        }
      }
    } catch (e) {
      console.log("解析 items_snapshot 失败，不影响退款:", e);
    }

    // ======================
    // ✅ 标记退款成功
    // ======================
    const okSql = `
      UPDATE orders SET
        refund_status = 2,
        status = 3,
        audit_status = 1,
        audit_remark = ?,
        audit_by = ?,
        audit_time = NOW(),
        refund_amount = pay_amount,
        refund_time = NOW(),
        updated_at = NOW()
      WHERE id = ? AND refund_status = 1 AND audit_status = 0
    `;

    db.query(okSql, [auditRemark, adminId, order_id], () => {
      return res.json({
        code: 200,
        msg: "审核通过，已退款成功（含库存恢复）"
      });
    });
  });
});


app.post('/api/user/save', (req, res) => {
  const { openid, nickname, avatar, mobile } = req.body || {};

  if (!openid) {
    return res.json({ code: 400, msg: "openid 必传" });
  }

  const sql = `
    INSERT INTO xcx_users (openid, nickname, avatar, mobile)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      nickname = VALUES(nickname),
      avatar = VALUES(avatar),
      mobile = VALUES(mobile),
      updated_at = NOW()
  `;

  db.query(sql, [openid, nickname, avatar, mobile], (err) => {
    if (err) {
      console.error("保存用户失败:", err);
      return res.json({ code: 500, msg: "服务器异常" });
    }
    return res.json({ code: 200, msg: "保存成功" });
  });
});

app.get('/api/user/info', (req, res) => {
  const { openid } = req.query;

  if (!openid) {
    return res.json({ code: 400, msg: "openid 必传" });
  }

  const sql = `SELECT id, openid, nickname, avatar, mobile FROM xcx_users WHERE openid = ? LIMIT 1`;

  db.query(sql, [openid], (err, rows) => {
    if (err) {
      console.error("查询用户失败:", err);
      return res.json({ code: 500, msg: "服务器异常" });
    }

    if (!rows || rows.length === 0) {
      return res.json({ code: 404, msg: "用户不存在" });
    }

    return res.json({
      code: 200,
      data: rows[0]
    });
  });
});

app.get('/api/admin/user/list', (req, res) => {
  const page = Number(req.query.page || 1);
  const pageSize = Number(req.query.pageSize || 20);
  const keyword = req.query.keyword || "";

  const offset = (page - 1) * pageSize;

  let where = "WHERE 1=1";
  const params = [];

  if (keyword) {
    where += " AND (nickname LIKE ? OR mobile LIKE ? OR openid LIKE ?)";
    params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
  }

  // 总数
  const countSql = `SELECT COUNT(*) AS total FROM xcx_users ${where}`;
  
  db.query(countSql, params, (err, countRows) => {
    if (err) {
      console.error(err);
      return res.json({ code: 500, msg: "服务器异常" });
    }

    const total = countRows[0].total;

    // 列表数据
    const listSql = `
      SELECT id, openid, nickname, avatar, mobile, created_at, updated_at
      FROM xcx_users
      ${where}
      ORDER BY id DESC
      LIMIT ?, ?
    `;

    db.query(listSql, [...params, offset, pageSize], (err2, listRows) => {
      if (err2) {
        console.error(err2);
        return res.json({ code: 500, msg: "服务器异常" });
      }

      return res.json({
        code: 200,
        data: {
          page,
          pageSize,
          total,
          list: listRows
        }
      });
    });
  });
});


// 加入购物车
app.post('/api/cart/add', (req, res) => {
  const { openid, sku_id, quantity } = req.body || {};

  if (!openid || !sku_id) {
    return res.json({
      code: 400,
      msg: 'openid 和 sku_id 必传',
    });
  }

  const qty = Number(quantity || 1);
  if (!Number.isInteger(qty) || qty <= 0) {
    return res.json({
      code: 400,
      msg: 'quantity 必须是大于 0 的整数',
    });
  }

  // 1. 先检查 sku 是否存在
  const skuSql = `
    SELECT id, product_id, price, stock
    FROM product_skus
    WHERE id = ?
    LIMIT 1
  `;

  db.query(skuSql, [sku_id], (err, skuRows) => {
    if (err) {
      console.error('查询 SKU 失败:', err);
      return res.json({
        code: 500,
        msg: '服务器异常',
      });
    }

    if (!skuRows || skuRows.length === 0) {
      // ⭐ 按你的要求：sku_id 可能不存在，就跳过
      return res.json({
        code: 200,
        msg: '该 SKU 不存在，已忽略',
      });
    }

    // 2. 查询购物车是否已有这条
    const selectCartSql = `
      SELECT id, quantity
      FROM cart_items
      WHERE openid = ? AND sku_id = ?
      LIMIT 1
    `;
    db.query(selectCartSql, [openid, sku_id], (err2, cartRows) => {
      if (err2) {
        console.error('查询购物车失败:', err2);
        return res.json({
          code: 500,
          msg: '服务器异常',
        });
      }

      // 已存在：更新数量
      if (cartRows && cartRows.length > 0) {
        const cart = cartRows[0];
        const newQty = Number(cart.quantity) + qty;

        const updateSql = `
          UPDATE cart_items
          SET quantity = ?, updated_at = NOW()
          WHERE id = ?
        `;
        db.query(updateSql, [newQty, cart.id], (err3) => {
          if (err3) {
            console.error('更新购物车数量失败:', err3);
            return res.json({
              code: 500,
              msg: '服务器异常',
            });
          }

          return res.json({
            code: 200,
            msg: '购物车数量已更新',
          });
        });
      } else {
        // 不存在：插入
        const insertSql = `
          INSERT INTO cart_items (openid, sku_id, quantity)
          VALUES (?, ?, ?)
        `;
        db.query(insertSql, [openid, sku_id, qty], (err4) => {
          if (err4) {
            console.error('插入购物车失败:', err4);
            return res.json({
              code: 500,
              msg: '服务器异常',
            });
          }

          return res.json({
            code: 200,
            msg: '已加入购物车',
          });
        });
      }
    });
  });
});


// 查看购物车
app.get('/api/cart/list', (req, res) => {
  const { openid } = req.query;

  if (!openid) {
    return res.json({
      code: 400,
      msg: 'openid 必传',
    });
  }

  const sql = `
    SELECT
      c.id            AS cart_id,
      c.openid,
      c.sku_id,
      c.quantity,
      c.created_at,
      c.updated_at,
      s.product_id,
      s.sku_name,
      s.attr1,
      s.attr2,
      s.attr3,
      s.attr4,
      s.price,
      s.stock,
      s.image,
      p.name          AS product_name,
      p.description   AS product_desc
    FROM cart_items c
    JOIN product_skus s ON c.sku_id = s.id
    JOIN products p     ON s.product_id = p.id
    WHERE c.openid = ?
    ORDER BY c.created_at DESC
  `;

  db.query(sql, [openid], (err, rows) => {
    if (err) {
      console.error('查询购物车失败:', err);
      return res.json({
        code: 500,
        msg: '服务器异常',
      });
    }

    return res.json({
      code: 200,
      data: rows,
    });
  });
});


// 修改购物车数量：quantity > 0 则更新，quantity = 0 则删除
app.post("/api/cart/update", (req, res) => {
  const { openid, sku_id, quantity } = req.body || {};

  // 参数校验
  if (!openid || !sku_id || quantity == null) {
    return res.json({
      code: 400,
      msg: "openid, sku_id, quantity 必传",
    });
  }

  // 如果 quantity = 0 → 删除
  if (Number(quantity) === 0) {
    const delSql = `
      DELETE FROM cart_items
      WHERE openid = ? AND sku_id = ?
    `;
    db.query(delSql, [openid, sku_id], (err, result) => {
      if (err) {
        console.error("删除购物车失败:", err);
        return res.json({ code: 500, msg: "服务器错误" });
      }

      return res.json({
        code: 200,
        msg: "已删除",
      });
    });
    return;
  }

  // quantity > 0 → 先检查 sku 是否存在
  const skuSQL = `
    SELECT id, stock
    FROM product_skus
    WHERE id = ?
    LIMIT 1
  `;

  db.query(skuSQL, [sku_id], (err, skuRows) => {
    if (err) {
      return res.json({ code: 500, msg: "服务器错误" });
    }
    if (!skuRows || skuRows.length === 0) {
      // sku 不存在，直接跳过
      return res.json({
        code: 404,
        msg: "SKU 不存在",
      });
    }

    // 检查购物车是否存在
    const checkSql = `
      SELECT id
      FROM cart_items
      WHERE openid = ? AND sku_id = ?
      LIMIT 1
    `;

    db.query(checkSql, [openid, sku_id], (err2, rows) => {
      if (err2) {
        return res.json({ code: 500, msg: "服务器错误" });
      }

      // 如果没有记录 → 插入
      if (!rows || rows.length === 0) {
        const insertSql = `
          INSERT INTO cart_items (openid, sku_id, quantity)
          VALUES (?, ?, ?)
        `;
        db.query(insertSql, [openid, sku_id, quantity], (err3) => {
          if (err3) {
            return res.json({ code: 500, msg: "服务器错误" });
          }
          return res.json({
            code: 200,
            msg: "已新增",
          });
        });
        return;
      }

      // 有记录 → 更新数量
      const updateSql = `
        UPDATE cart_items
        SET quantity = ?
        WHERE openid = ? AND sku_id = ?
      `;
      db.query(updateSql, [quantity, openid, sku_id], (err4) => {
        if (err4) {
          return res.json({ code: 500, msg: "服务器错误" });
        }
        return res.json({
          code: 200,
          msg: "已更新",
        });
      });
    });
  });
});


app.get("/api/cart/list", (req, res) => {
  const { openid } = req.query;
  if (!openid) {
    return res.json({ code: 400, msg: "openid 必传" });
  }

  const sql = `
    SELECT c.id AS cart_id,
           c.sku_id,
           c.quantity,
           s.product_id,
           s.sku_name,
           s.price,
           s.stock,
           s.image,
           p.name AS product_name,
           p.images
    FROM cart c
    LEFT JOIN product_skus s ON c.sku_id = s.id
    LEFT JOIN products p ON s.product_id = p.id
    WHERE c.openid = ?
  `;

  db.query(sql, [openid], (err, rows) => {
    if (err) return res.json({ code: 500, msg: "服务器错误" });

    const list = rows.map(r => ({
      cart_id: r.cart_id,
      sku_id: r.sku_id,
      quantity: r.quantity,
      product_id: r.product_id,
      name: r.product_name,
      sku_text: r.sku_name || "",
      price: r.price,
      image: r.image || (JSON.parse(r.images || "[]")[0] || ""),
      stock: r.stock
    }));

    res.json({
      code: 200,
      data: list
    });
  });
});


// ================== 用户反馈相关接口 ==================

/**
 * 新增反馈
 * POST /api/feedback
 * body: { content: string }
 */
app.post('/api/feedback', (req, res) => {
  const { content } = req.body || {};

  if (!content || !content.trim()) {
    return res.status(400).json({
      code: 400,
      message: 'content 不能为空'
    });
  }

  const sql = 'INSERT INTO feedback (content) VALUES (?)';
  const params = [content.trim()];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('新增反馈失败:', err);
      return res.status(500).json({
        code: 500,
        message: '新增反馈失败'
      });
    }

    return res.json({
      code: 200,
      message: '新增反馈成功',
      data: {
        id: result.insertId,
        content: content.trim()
      }
    });
  });
});

/**
 * 查询反馈列表
 * GET /api/feedback
 * 可选：你以后想加分页，可以加 query 参数 page / pageSize
 */
app.get('/api/feedback', (req, res) => {
  const sql = 'SELECT id, content, created_at FROM feedback ORDER BY id DESC';

  db.query(sql, (err, rows) => {
    if (err) {
      console.error('查询反馈列表失败:', err);
      return res.status(500).json({
        code: 500,
        message: '查询反馈失败'
      });
    }

    return res.json({
      code: 200,
      message: '查询成功',
      data: rows
    });
  });
});


// ✅ 启动服务
app.listen(8088, () => console.log("🚀 Server running at http://localhost:8088"));
