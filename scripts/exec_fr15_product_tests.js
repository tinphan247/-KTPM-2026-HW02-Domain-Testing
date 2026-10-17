/**
 * Automated Test Script for FR-15: Quản lý Sản phẩm (Product CRUD)
 * Target: Backend API (localhost:3000) & Frontend Admin (App.jsx)
 * Author: 23120346
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

async function request(endpoint, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function runProductTests() {
  console.log('================================================================');
  console.log('=== BẮT ĐẦU CHẠY SCRIPT AUTOMATED TESTING CHO FR-15: SẢN PHẨM ===');
  console.log('================================================================\n');

  const results = {
    feature: 'FR-15: Quản lý Sản phẩm (Product CRUD)',
    timestamp: new Date().toISOString(),
    steps: []
  };

  // 1. Test Broken Access Control (Anonymous can modify products)
  console.log('[Step 1] Test Bảo mật: Gọi POST /api/products mà KHÔNG CÓ TOKEN...');
  const anonPostRes = await request('/api/products', 'POST', {
    name: 'Sản phẩm Hacker Test',
    price: 99000,
    description: 'Hacked without auth',
    imageUrl: 'https://via.placeholder.com/150',
    category_id: 1
  });
  console.log(`-> Kết quả POST /api/products không token: status=${anonPostRes.status}`);
  const createdId = anonPostRes.data.id;
  if (anonPostRes.status === 200) {
    results.steps.push({
      step: 'FR15_SEC_NO_AUTH_PRODUCT_CREATE',
      bugId: 'BUG-FR15-01',
      title: 'API POST/PUT/DELETE /api/products không yêu cầu xác thực Admin, cho phép người dùng ẩn danh thao tác (CWE-306)',
      severity: 'Critical',
      evidence: `Anonymous request tới POST /api/products trả về HTTP 200 và tạo sản phẩm thành công với ID=${createdId}. Thiếu middleware authenticateToken và checkAdmin theo yêu cầu FR-12.`
    });
  }

  // 2. Test BVA Giá sản phẩm: Giá âm (price = -50000) và Giá = 0
  console.log('\n[Step 2] Test BVA Giá: Gửi sản phẩm có giá âm (price = -50000)...');
  const negPriceRes = await request('/api/products', 'POST', {
    name: 'Sản phẩm Giá Âm BVA',
    price: -50000,
    description: 'Negative price test',
    imageUrl: 'https://via.placeholder.com/150',
    category_id: 1
  });
  console.log(`-> Kết quả POST /api/products giá âm: status=${negPriceRes.status}`);
  if (negPriceRes.status === 200) {
    results.steps.push({
      step: 'FR15_BVA_NEGATIVE_PRICE_ACCEPTED',
      bugId: 'BUG-FR15-02',
      title: 'Backend chấp nhận thêm sản phẩm có giá âm (-50,000 ₫), thiếu xác thực số dương theo đặc tả',
      severity: 'High',
      evidence: `server.js:167-177 không kiểm tra price > 0, chấp nhận ghi giá âm vào CSDL với ID=${negPriceRes.data.id}.`
    });
    // Dọn dẹp
    if (negPriceRes.data.id) await request(`/api/products/${negPriceRes.data.id}`, 'DELETE');
  }

  // 3. Test Tên sản phẩm rỗng (name = "")
  console.log('\n[Step 3] Test Ràng buộc Tên: Gửi sản phẩm có tên rỗng (name = "")...');
  const emptyNameRes = await request('/api/products', 'POST', {
    name: '',
    price: 100000,
    description: 'Empty name test',
    imageUrl: '',
    category_id: 1
  });
  console.log(`-> Kết quả POST /api/products tên rỗng: status=${emptyNameRes.status}`);
  if (emptyNameRes.status === 200) {
    results.steps.push({
      step: 'FR15_EMPTY_NAME_ACCEPTED',
      bugId: 'BUG-FR15-03',
      title: 'Backend chấp nhận sản phẩm có tên rỗng, vi phạm ràng buộc bắt buộc (CWE-20)',
      severity: 'Medium',
      evidence: `server.js:167-177 chèn trực tiếp chuỗi rỗng vào cột name của bảng products (ID=${emptyNameRes.data.id}).`
    });
    if (emptyNameRes.data.id) await request(`/api/products/${emptyNameRes.data.id}`, 'DELETE');
  }

  // 4. Test Type Inconsistency Bug trong GET /api/products/:id
  console.log('\n[Step 4] Test tính nhất quán kiểu dữ liệu trong GET /api/products/:id (ID chẵn vs ID lẻ)...');
  const oddProd = await request('/api/products/1', 'GET');
  const evenProd = await request('/api/products/2', 'GET');
  const oddPriceType = typeof oddProd.data.price;
  const evenPriceType = typeof evenProd.data.price;
  console.log(`-> ID=1 (lẻ) price type: ${oddPriceType} (${oddProd.data.price})`);
  console.log(`-> ID=2 (chẵn) price type: ${evenPriceType} (${evenProd.data.price})`);
  if (oddPriceType !== evenPriceType) {
    results.steps.push({
      step: 'FR15_TYPE_INCONSISTENCY_PRICE',
      bugId: 'BUG-FR15-04',
      title: 'API GET /api/products/:id trả về kiểu dữ liệu price không nhất quán (String cho ID chẵn, Number cho ID lẻ)',
      severity: 'Medium',
      evidence: `server.js:162 cố tình ép kiểu row.id % 2 === 0 => row.price = row.price.toString(), dẫn đến lỗi xử lý phép tính và hiển thị trên frontend.`
    });
  }

  // 5. Static Analysis trên frontend-admin/src/App.jsx: Mass Update Bug
  console.log('\n[Step 5] Phân tích mã nguồn frontend-admin (Mass UI Overwrite Bug)...');
  const adminAppPath = path.resolve(__dirname, '../../eshop-sut/frontend-admin/src/App.jsx');
  const adminAppSource = fs.readFileSync(adminAppPath, 'utf8');
  const hasMassUpdateBug = /fakeMassUpdatedProducts\s*=\s*products\.map/i.test(adminAppSource);
  console.log(`-> Phát hiện lỗi Mass UI Overwrite trong App.jsx: ${hasMassUpdateBug}`);
  if (hasMassUpdateBug) {
    results.steps.push({
      step: 'FR15_ADMIN_UI_MASS_UPDATE_BUG',
      bugId: 'BUG-FR15-05',
      title: 'Lỗi giao diện Admin: Khi sửa 1 sản phẩm, toàn bộ danh sách sản phẩm trên UI bị đổi tên theo sản phẩm đó',
      severity: 'High',
      evidence: `frontend-admin/src/App.jsx:110 map qua toàn bộ mảng products và gán name: productForm.name cho tất cả sản phẩm, vi phạm trực tiếp đặc tả: "Khi Sửa một sản phẩm, chỉ sản phẩm đó bị thay đổi — các sản phẩm khác giữ nguyên".`
    });
  }

  // Dọn dẹp sản phẩm test
  if (createdId) {
    await request(`/api/products/${createdId}`, 'DELETE');
    console.log(`-> Đã dọn dẹp sản phẩm test ID=${createdId}`);
  }

  // Ghi kết quả
  const outPath = path.resolve(__dirname, 'exec_fr15_results.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n-> Đã lưu kết quả transcript kiểm thử FR-15 vào: ${outPath}`);

  return results;
}

runProductTests().then(res => {
  console.log('\n=== HOÀN TẤT KIỂM THỬ TỰ ĐỘNG FR-15 ===');
  console.log(`Tổng số Bug phát hiện được cho FR-15: ${res.steps.filter(s => s.bugId).length} lỗi!`);
}).catch(err => {
  console.error('Lỗi khi chạy script FR-15:', err);
});
