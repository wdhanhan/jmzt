const http = require('http');

// API 基础地址
const API_BASE = 'http://115.159.6.27:8088';

// 图片URL
const FILLING_IMAGE = 'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1768836272193_54dcd058-7453-40ca-87a9-cd1e6a4fc13c.jpg';
const DUMPLING_IMAGE = 'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1768836358116_c33e5434-d8a1-4eda-a748-c7e05ec68ef9.jpg';

// 分类ID
const CATEGORY_DUMPLING = 14; // 水饺
const CATEGORY_FILLING = 15;   // 馅料

/**
 * 发送HTTP GET请求
 */
function httpGet(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname + (urlObj.search || ''),
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://115.159.6.27:5205'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve({ data: result, status: res.statusCode });
        } catch (e) {
          resolve({ data: body, status: res.statusCode });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

/**
 * 发送HTTP PUT请求
 */
function httpPut(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const putData = JSON.stringify(data);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(putData),
        'Origin': 'http://115.159.6.27:5205'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve({ data: result, status: res.statusCode });
        } catch (e) {
          resolve({ data: body, status: res.statusCode });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(putData);
    req.end();
  });
}

/**
 * 更新商品图片
 */
async function updateProductImage(product, imageUrl) {
  try {
    console.log(`正在更新: ${product.name} (ID: ${product.id})...`);
    
    // 准备更新数据
    const payload = {
      id: product.id,
      name: product.name,
      description: product.description,
      category_id: product.category_id,
      limit_purchase: product.limit_purchase || 0,
      images: [imageUrl], // 商品主图
      skus: product.skus.map(sku => ({
        sku_id: sku.sku_id,
        sku_name: sku.sku_name,
        attr1: sku.attr1,
        attr2: sku.attr2,
        attr3: sku.attr3,
        attr4: sku.attr4,
        price: parseFloat(sku.price) || 0,
        stock: sku.stock || 999,
        limit_qty: sku.limit_qty || 0,
        image: imageUrl // SKU图片也更新
      }))
    };

    const response = await httpPut(`${API_BASE}/api/products/update/${product.id}`, payload);

    if (response.data.code === 200 || response.data.message?.includes('成功')) {
      console.log(`✅ ${product.name} 更新成功`);
      return { success: true, product: product.name };
    } else {
      console.error(`❌ ${product.name} 更新失败:`, response.data.message || response.data.msg);
      return { success: false, product: product.name, error: response.data.message || response.data.msg };
    }
  } catch (error) {
    console.error(`❌ ${product.name} 更新异常:`, error.message);
    return { success: false, product: product.name, error: error.message };
  }
}

/**
 * 批量更新商品图片
 */
async function batchUpdateImages() {
  console.log('🚀 开始批量更新商品图片...\n');
  
  const results = {
    success: [],
    failed: []
  };

  // 1. 获取所有商品列表
  console.log('📦 获取商品列表...');
  const listResponse = await httpGet(`${API_BASE}/api/products/list`);
  
  if (listResponse.data.code !== 200) {
    console.error('❌ 获取商品列表失败:', listResponse.data);
    return;
  }

  const allProducts = listResponse.data.data || [];
  
  // 2. 筛选馅料商品（category_id = 15）
  const fillingProducts = allProducts.filter(p => p.category_id === CATEGORY_FILLING);
  console.log(`\n📦 找到 ${fillingProducts.length} 个馅料商品，开始更新图片...`);
  
  for (const product of fillingProducts) {
    const result = await updateProductImage(product, FILLING_IMAGE);
    if (result.success) {
      results.success.push(result);
    } else {
      results.failed.push(result);
    }
    // 避免请求过快
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // 3. 筛选水饺商品（category_id = 14）
  const dumplingProducts = allProducts.filter(p => p.category_id === CATEGORY_DUMPLING);
  console.log(`\n📦 找到 ${dumplingProducts.length} 个水饺商品，开始更新图片...`);
  
  for (const product of dumplingProducts) {
    const result = await updateProductImage(product, DUMPLING_IMAGE);
    if (result.success) {
      results.success.push(result);
    } else {
      results.failed.push(result);
    }
    // 避免请求过快
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // 输出结果统计
  console.log('\n' + '='.repeat(50));
  console.log('📊 更新结果统计:');
  console.log(`✅ 成功: ${results.success.length} 个`);
  console.log(`❌ 失败: ${results.failed.length} 个`);
  
  if (results.failed.length > 0) {
    console.log('\n失败的商品:');
    results.failed.forEach(item => {
      console.log(`  - ${item.product}: ${item.error}`);
    });
  }
  
  console.log('='.repeat(50));
}

// 执行更新
batchUpdateImages().catch(err => {
  console.error('批量更新异常:', err);
  process.exit(1);
});
