const http = require('http');

// API 基础地址
const API_BASE = 'http://115.159.6.27:8088';

/**
 * 发送HTTP POST请求
 */
function httpPost(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
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

    req.write(postData);
    req.end();
  });
}

// 鲜饺价格表（元/份，400克/份）
const dumplingProducts = [
  { name: '鲅鱼水饺', market: 39.4, newCustomer: 18.4, monthCard: 28.9, yearCard: 26.8 },
  { name: '牛肉大葱水饺', market: 32.0, newCustomer: 15.0, monthCard: 23.5, yearCard: 21.8 },
  { name: '羊肉胡萝卜水饺', market: 35.0, newCustomer: 16.4, monthCard: 25.7, yearCard: 23.8 },
  { name: '猪肉大葱水饺', market: 18.8, newCustomer: 8.8, monthCard: 13.8, yearCard: 12.8 },
  { name: '猪肉芹菜水饺', market: 18.8, newCustomer: 8.8, monthCard: 13.8, yearCard: 12.8 },
  { name: '猪肉香菇水饺', market: 18.8, newCustomer: 8.8, monthCard: 13.8, yearCard: 12.8 },
  { name: '猪肉白菜水饺', market: 18.8, newCustomer: 8.8, monthCard: 13.8, yearCard: 12.8 },
  { name: '猪肉荠菜水饺', market: 18.8, newCustomer: 8.8, monthCard: 13.8, yearCard: 12.8 },
  { name: '猪肉玉米水饺', market: 18.8, newCustomer: 8.8, monthCard: 13.8, yearCard: 12.8 },
  { name: '猪肉酸菜水饺', market: 18.8, newCustomer: 8.8, monthCard: 13.8, yearCard: 12.8 },
  { name: '猪肉莲藕水饺', market: 18.8, newCustomer: 8.8, monthCard: 13.8, yearCard: 12.8 },
  { name: '猪肉韭菜水饺', market: 18.8, newCustomer: 8.8, monthCard: 13.8, yearCard: 12.8 },
  { name: '韭菜鸡蛋水饺', market: 18.8, newCustomer: 8.8, monthCard: 13.8, yearCard: 12.8 },
  { name: '荠菜鸡蛋水饺', market: 18.8, newCustomer: 8.8, monthCard: 13.8, yearCard: 12.8 },
];

// 馅料价格表（元/斤，500克/斤）- 注意：鲅鱼馅料暂不出售，新客价没有
const fillingProducts = [
  { name: '牛肉大葱水饺馅料', market: 31.8, newCustomer: null, monthCard: 30.8, yearCard: 29.8 },
  { name: '羊肉胡萝卜水饺馅料', market: 27.8, newCustomer: null, monthCard: 26.8, yearCard: 25.8 },
  { name: '猪肉大葱水饺馅料', market: 16.8, newCustomer: null, monthCard: 15.8, yearCard: 14.8 },
  { name: '猪肉芹菜水饺馅料', market: 16.8, newCustomer: null, monthCard: 15.8, yearCard: 14.8 },
  { name: '猪肉香菇水饺馅料', market: 16.8, newCustomer: null, monthCard: 15.8, yearCard: 14.8 },
  { name: '猪肉白菜水饺馅料', market: 16.8, newCustomer: null, monthCard: 15.8, yearCard: 14.8 },
  { name: '猪肉荠菜水饺馅料', market: 16.8, newCustomer: null, monthCard: 15.8, yearCard: 14.8 },
  { name: '猪肉玉米水饺馅料', market: 16.8, newCustomer: null, monthCard: 15.8, yearCard: 14.8 },
  { name: '猪肉酸菜水饺馅料', market: 16.8, newCustomer: null, monthCard: 15.8, yearCard: 14.8 },
  { name: '猪肉莲藕水饺馅料', market: 16.8, newCustomer: null, monthCard: 15.8, yearCard: 14.8 },
  { name: '猪肉韭菜水饺馅料', market: 16.8, newCustomer: null, monthCard: 15.8, yearCard: 14.8 },
  { name: '韭菜鸡蛋水饺馅料', market: 13.8, newCustomer: null, monthCard: 12.8, yearCard: 11.8 },
  { name: '荠菜鸡蛋水饺馅料', market: 13.8, newCustomer: null, monthCard: 12.8, yearCard: 11.8 },
];

// 分类ID
const CATEGORY_DUMPLING = 14; // 水饺
const CATEGORY_FILLING = 15;   // 馅料

// 默认图片（如果需要，可以后续替换）
const DEFAULT_IMAGE = 'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1768834948214_f420de1c6e2a741316ab6624bc6912c4.jpg';

/**
 * 导入单个商品
 */
async function importProduct(product, categoryId) {
  try {
    // 构建SKU数据
    // attr1: 规格名称（商品名称）
    // price: 门市价
    // attr2: 新客价（可能为null）
    // attr3: 月卡价
    // attr4: 年卡价
    const sku = {
      attr1: product.name,           // 规格名称
      price: product.market,          // 门市价
      attr2: product.newCustomer || product.market,  // 新客价，如果没有则用门市价
      attr3: product.monthCard,       // 月卡价
      attr4: product.yearCard,        // 年卡价
      stock: 999,                     // 默认库存
      limit_qty: 0,                   // 限购数量
      image: ''                       // 图片（暂时为空，后续可以上传）
    };

    const payload = {
      name: product.name,
      description: `${product.name}，${categoryId === CATEGORY_DUMPLING ? '400克/份' : '500克/斤'}`,
      category_id: categoryId,
      limit_purchase: 0,              // 每日限购，0表示不限
      images: [],                      // 商品图片（暂时为空）
      skus: [sku]
    };

    console.log(`正在导入: ${product.name}...`);
    
    const response = await httpPost(`${API_BASE}/api/products/add`, payload);

    if (response.data.code === 200) {
      console.log(`✅ ${product.name} 导入成功`);
      return { success: true, product: product.name };
    } else {
      console.error(`❌ ${product.name} 导入失败:`, response.data.message || response.data.msg);
      return { success: false, product: product.name, error: response.data.message || response.data.msg };
    }
  } catch (error) {
    console.error(`❌ ${product.name} 导入异常:`, error.message);
    return { success: false, product: product.name, error: error.message };
  }
}

/**
 * 批量导入
 */
async function batchImport() {
  console.log('🚀 开始批量导入商品...\n');
  
  const results = {
    success: [],
    failed: []
  };

  // 导入鲜饺商品
  console.log('📦 开始导入鲜饺商品（分类ID: 14）...');
  for (const product of dumplingProducts) {
    const result = await importProduct(product, CATEGORY_DUMPLING);
    if (result.success) {
      results.success.push(result);
    } else {
      results.failed.push(result);
    }
    // 避免请求过快
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n📦 开始导入馅料商品（分类ID: 15）...');
  // 导入馅料商品
  for (const product of fillingProducts) {
    const result = await importProduct(product, CATEGORY_FILLING);
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
  console.log('📊 导入结果统计:');
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

// 执行导入
batchImport().catch(err => {
  console.error('批量导入异常:', err);
  process.exit(1);
});
