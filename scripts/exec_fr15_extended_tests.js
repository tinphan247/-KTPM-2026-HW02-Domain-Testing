/**
 * Extended Automated Test Script for Product Management & Discovery (FR-15, FR-05, FR-06, FR-16)
 * Target: Backend API (localhost:3000), SQLite DB & Frontend Code
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

async function runExtendedProductTests() {
  console.log('========================================================================');
  console.log('🚀 BẮT ĐẦU CHẠY KIỂM THỬ MỞ RỘNG TOÀN DIỆN CHO PHÂN HỆ SẢN PHẨM (FR-15)');
  console.log('========================================================================\n');

  const results = {
    feature: 'FR-15 & Discovery: Quản lý Sản phẩm & Trải nghiệm Sản phẩm Toàn diện',
    timestamp: new Date().toISOString(),
    testsRun: 0,
    bugsDetected: []
  };

  function logBug(bugId, title, severity, evidence) {
    console.log(`❌ [PHÁT HIỆN BUG] ${bugId} (${severity}): ${title}`);
    console.log(`   -> Chi tiết: ${evidence}\n`);
    results.bugsDetected.push({ bugId, title, severity, evidence });
  }

  // TEST 1: Broken Access Control (Anonymous POST)
  results.testsRun++;
  console.log('[Test 01] Kiểm tra kiểm soát truy cập: POST /api/products không có Token...');
  const res1 = await request('/api/products', 'POST', {
    name: 'Sản phẩm Test Anonymous',
    price: 100000,
    category_id: 1
  });
  if (res1.status === 200) {
    logBug('BUG-FR15-01', 'Broken Access Control trên API Tạo sản phẩm (CWE-306)', 'Critical',
      `POST /api/products không gửi Authorization header vẫn trả về HTTP 200 OK và tạo sản phẩm ID=${res1.data.id}.`);
    if (res1.data.id) await request(`/api/products/${res1.data.id}`, 'DELETE');
  }

  // TEST 2: Broken Access Control with Normal User Token (Role = user)
  results.testsRun++;
  console.log('[Test 02] Kiểm tra phân quyền: User thường (role="user") gọi POST /api/products...');
  const userLogin = await request('/api/login', 'POST', { email: 'test@eshop.com', password: 'Test1234!' });
  const userToken = userLogin.data.token;
  const res2 = await request('/api/products', 'POST', {
    name: 'Sản phẩm Test Normal User',
    price: 120000,
    category_id: 1
  }, userToken);
  if (res2.status === 200) {
    logBug('BUG-FR15-01B', 'Thiếu kiểm tra quyền Admin: User thường có thể thêm/sửa/xóa sản phẩm', 'High',
      `Tài khoản role='user' gửi request POST /api/products vẫn được chấp nhận thành công (Kỳ vọng: 403 Forbidden).`);
    if (res2.data.id) await request(`/api/products/${res2.data.id}`, 'DELETE');
  }

  // TEST 3: BVA Giá âm (price = -50000)
  results.testsRun++;
  console.log('[Test 03] BVA Giá: Thêm sản phẩm có giá âm (price = -50000)...');
  const res3 = await request('/api/products', 'POST', {
    name: 'Sản phẩm Giá Âm',
    price: -50000,
    category_id: 1
  });
  if (res3.status === 200) {
    logBug('BUG-FR15-02', 'Backend chấp nhận giá âm (-50,000 ₫), vi phạm đặc tả số dương', 'High',
      `POST /api/products với price = -50000 lưu thành công vào CSDL với ID=${res3.data.id}.`);
    if (res3.data.id) await request(`/api/products/${res3.data.id}`, 'DELETE');
  }

  // TEST 4: BVA Giá bằng 0 (price = 0)
  results.testsRun++;
  console.log('[Test 04] BVA Giá: Thêm sản phẩm có giá bằng 0 (price = 0)...');
  const res4 = await request('/api/products', 'POST', {
    name: 'Sản phẩm Giá 0đ',
    price: 0,
    category_id: 1
  });
  if (res4.status === 200) {
    logBug('BUG-FR15-02B', 'Backend chấp nhận giá bằng 0 ₫, vi phạm đặc tả giá phải > 0', 'Medium',
      `POST /api/products với price = 0 được chấp nhận thành công với ID=${res4.data.id}.`);
    if (res4.data.id) await request(`/api/products/${res4.data.id}`, 'DELETE');
  }

  // TEST 5: Tên sản phẩm để trống (name = "")
  results.testsRun++;
  console.log('[Test 05] Kiểm tra ràng buộc bắt buộc: Tên sản phẩm rỗng (name = "")...');
  const res5 = await request('/api/products', 'POST', {
    name: '',
    price: 200000,
    category_id: 1
  });
  if (res5.status === 200) {
    logBug('BUG-FR15-03', 'Backend chấp nhận tên sản phẩm rỗng, thiếu validation (CWE-20)', 'Medium',
      `POST /api/products với name = "" lưu thành công vào CSDL với ID=${res5.data.id}.`);
    if (res5.data.id) await request(`/api/products/${res5.data.id}`, 'DELETE');
  }

  // TEST 6: BVA Độ dài Tên vượt quá 255 ký tự (name.length = 300)
  results.testsRun++;
  console.log('[Test 06] BVA Tên: Thêm sản phẩm có tên dài 300 ký tự (vượt quá 255 ký tự)...');
  const longName = 'A'.repeat(300);
  const res6 = await request('/api/products', 'POST', {
    name: longName,
    price: 300000,
    category_id: 1
  });
  if (res6.status === 200) {
    logBug('BUG-FR15-03B', 'Backend không kiểm tra độ dài tối đa 255 ký tự của tên sản phẩm', 'Low',
      `Tên dài 300 ký tự được chèn thành công vào CSDL SQLite không hề có cảnh báo hay cắt ngắn.`);
    if (res6.data.id) await request(`/api/products/${res6.data.id}`, 'DELETE');
  }

  // TEST 7: Khóa ngoại Danh mục không tồn tại (category_id = 99999)
  results.testsRun++;
  console.log('[Test 07] Ràng buộc Khóa ngoại: Thêm sản phẩm với category_id không tồn tại (99999)...');
  const res7 = await request('/api/products', 'POST', {
    name: 'Sản phẩm Danh mục Ảo',
    price: 150000,
    category_id: 99999
  });
  if (res7.status === 200) {
    logBug('BUG-FR15-03C', 'Backend chấp nhận category_id không tồn tại, thiếu ràng buộc Khóa ngoại', 'Medium',
      `SQLite thiếu PRAGMA foreign_keys = ON, chấp nhận chèn category_id=99999 vào bảng products.`);
    if (res7.data.id) await request(`/api/products/${res7.data.id}`, 'DELETE');
  }

  // TEST 8: SQL Injection trên API Search
  results.testsRun++;
  console.log('[Test 08] Kiểm tra An toàn Bảo mật: SQL Injection trên GET /api/products?search=...');
  const sqliRes = await request("/api/products?search=' OR '1'='1");
  if (Array.isArray(sqliRes.data) && sqliRes.data.length >= 5) {
    logBug('BUG-FR15-06', 'Lỗ hổng SQL Injection nghiêm trọng trong API Tìm kiếm (CWE-89)', 'Critical',
      `server.js:144 nối chuỗi trực tiếp: SELECT * FROM products WHERE name LIKE '%${sqliRes}%'. Truy vấn search=' OR '1'='1 dump toàn bộ danh sách sản phẩm!`);
  }

  // TEST 9: Type Inconsistency trong GET /api/products/:id
  results.testsRun++;
  console.log('[Test 09] Kiểm tra tính nhất quán dữ liệu: GET /api/products/1 vs /api/products/2...');
  const p1 = await request('/api/products/1');
  const p2 = await request('/api/products/2');
  if (typeof p1.data.price !== typeof p2.data.price) {
    logBug('BUG-FR15-04', 'Lệch kiểu dữ liệu price (String vs Number) giữa ID chẵn và lẻ', 'Medium',
      `ID=1 trả về price dạng ${typeof p1.data.price}, trong khi ID=2 trả về price dạng ${typeof p2.data.price}. server.js:162 cố tình ép kiểu row.price.toString() khi ID chẵn.`);
  }

  // TEST 10: Xử lý khi xem sản phẩm không tồn tại (GET /api/products/99999)
  results.testsRun++;
  console.log('[Test 10] Kiểm tra HTTP Status: GET /api/products/99999 (ID không tồn tại)...');
  const notFoundRes = await request('/api/products/99999');
  if (notFoundRes.status === 200 && Object.keys(notFoundRes.data).length === 0) {
    logBug('BUG-FR15-10', 'API trả về HTTP 200 OK với object rỗng {} khi sản phẩm không tồn tại (Thay vì HTTP 404)', 'Medium',
      `server.js:161 trả về res.status(200).json({}), khiến client tưởng sản phẩm tồn tại và gây lỗi render trắng trang.`);
  }

  // TEST 11: Static Analysis Frontend Admin (Mass UI Overwrite Bug)
  results.testsRun++;
  console.log('[Test 11] Phân tích mã nguồn Admin: Sửa sản phẩm trong frontend-admin/src/App.jsx:110...');
  const adminAppSource = fs.readFileSync(path.resolve(__dirname, '../../eshop-sut/frontend-admin/src/App.jsx'), 'utf8');
  if (adminAppSource.includes('fakeMassUpdatedProducts')) {
    logBug('BUG-FR15-05', 'Lỗi logic giao diện Admin: Khi sửa 1 sản phẩm, toàn bộ sản phẩm trên UI bị đổi tên theo', 'High',
      `App.jsx:110 duyệt qua products.map và gán name: productForm.name cho toàn bộ danh sách.`);
  }

  // TEST 12: Static Analysis Frontend Web (Reflected XSS trên Home.jsx)
  results.testsRun++;
  console.log('[Test 12] Phân tích mã nguồn Web: Reflected XSS trong frontend-web/src/pages/Home.jsx:64...');
  const homeSource = fs.readFileSync(path.resolve(__dirname, '../../eshop-sut/frontend-web/src/pages/Home.jsx'), 'utf8');
  if (homeSource.includes('dangerouslySetInnerHTML={{ __html: search }}')) {
    logBug('BUG-FR15-07', 'Lỗ hổng Reflected XSS nguy hiểm trên thanh tìm kiếm trang chủ (CWE-79)', 'High',
      `Home.jsx:64 render trực tiếp input search qua dangerouslySetInnerHTML, vi phạm đặc tả: "Từ khóa tìm kiếm phải được hiển thị an toàn (không render HTML)".`);
  }

  // TEST 13: Static Analysis ProductDetail (Double-click Bug)
  results.testsRun++;
  console.log('[Test 13] Phân tích mã nguồn Web: Nút Thêm vào giỏ trong ProductDetail.jsx:22-25...');
  const detailSource = fs.readFileSync(path.resolve(__dirname, '../../eshop-sut/frontend-web/src/pages/ProductDetail.jsx'), 'utf8');
  if (detailSource.includes('if (clickCount === 0)') && detailSource.includes('return; // Không làm gì cả ở lần đầu tiên')) {
    logBug('BUG-FR15-08', 'Lỗi nút Thêm vào giỏ hàng: Cố tình bỏ qua lượt click đầu tiên, bắt buộc Double-Click', 'Medium',
      `ProductDetail.jsx:22-25 chặn click lần đầu bằng if (clickCount === 0) return, gây trải nghiệm người dùng tệ hại và hiểu nhầm nút bị đơ.`);
  }

  // TEST 14: CSV Import Atomicity (Rollback violation)
  results.testsRun++;
  console.log('[Test 14] Phân tích cơ chế Import CSV trong server.js:213-240...');
  const serverSource = fs.readFileSync(path.resolve(__dirname, '../../eshop-sut/backend/server.js'), 'utf8');
  const hasRollback = /ROLLBACK|BEGIN TRANSACTION/i.test(serverSource.slice(serverSource.indexOf('import-products'), serverSource.indexOf('import-products') + 800));
  if (!hasRollback) {
    logBug('BUG-FR15-09', 'API Import CSV thiếu cơ chế Transaction Rollback (Không tuân thủ All-or-Nothing)', 'Medium',
      `server.js:199-241 chèn từng dòng độc lập, nếu có dòng lỗi thì các dòng trước vẫn được lưu vào DB, vi phạm đặc tả: "Nếu có lỗi ở bất kỳ dòng nào, toàn bộ import phải được rollback".`);
  }

  // Ghi kết quả ra JSON
  const outPath = path.resolve(__dirname, 'exec_fr15_extended_results.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');

  console.log('========================================================================');
  console.log(`📊 TỔNG KẾT: ĐÃ CHẠY ${results.testsRun} TEST CASES`);
  console.log(`🔥 PHÁT HIỆN TỔNG CỘNG: ${results.bugsDetected.length} BUGS NGHIÊM TRỌNG!`);
  console.log(`💾 Đã lưu toàn bộ transcript vào: ${outPath}`);
  console.log('========================================================================\n');

  return results;
}

runExtendedProductTests().catch(err => {
  console.error('Lỗi khi chạy bộ test mở rộng:', err);
});
