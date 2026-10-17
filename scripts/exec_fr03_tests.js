/**
 * Automated Test Script for FR-03: Forgot Password & Reset Password
 * Target: Backend API (localhost:3000) & SQLite DB (eshop.db) & Frontend Regex
 * Author: 23120346
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require(path.resolve(__dirname, '../../eshop-sut/backend/node_modules/sqlite3')).verbose();

const BASE_URL = 'http://localhost:3000';
const DB_PATH = path.resolve(__dirname, '../../eshop-sut/backend/database.sqlite');

async function request(endpoint, body) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

function queryDb(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH);
    db.all(sql, params, (err, rows) => {
      db.close();
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function runTests() {
  console.log('=== BẮT ĐẦU CHẠY SCRIPT AUTOMATED TESTING CHO FR-03 ===\n');
  const results = {
    feature: 'FR-03: Quên mật khẩu & Đặt lại mật khẩu',
    timestamp: new Date().toISOString(),
    steps: []
  };

  // Step 1: Request OTP with valid email
  console.log('[Step 1] Gửi yêu cầu OTP cho email hợp lệ (test@eshop.com)...');
  const step1 = await request('/api/forgot-password', { email: 'test@eshop.com' });
  const token = step1.data.resetToken;
  const is4Digits = token && token.length === 4;
  console.log(`-> Response: status=${step1.status}, resetToken=${token} (Độ dài: ${token ? token.length : 0} số)`);
  results.steps.push({
    step: 'A1_REQUEST_OTP_VALID',
    status: step1.status,
    resetToken: token,
    tokenLength: token ? token.length : 0,
    bugFound: is4Digits ? 'BUG-FR03-02: OTP chỉ có 4 số thay vì 6 số theo đặc tả' : null
  });

  // Step 2: Request OTP with non-existent email
  console.log('\n[Step 2] Gửi yêu cầu OTP cho email không tồn tại (unknown@eshop.com)...');
  const step2 = await request('/api/forgot-password', { email: 'unknown@eshop.com' });
  console.log(`-> Response: status=${step2.status}, error=${step2.data.error}`);
  results.steps.push({
    step: 'A2_REQUEST_OTP_NONEXISTENT',
    status: step2.status,
    response: step2.data
  });

  // Step 3: Test backend password reset with WEAK password (Bypass Frontend Validation)
  console.log('\n[Step 3] Test Backend Reset Password với mật khẩu quá yếu ("123")...');
  const step3 = await request('/api/reset-password', {
    email: 'test@eshop.com',
    resetToken: token,
    newPassword: '123'
  });
  console.log(`-> Response: status=${step3.status}, message=${JSON.stringify(step3.data)}`);
  const backendLacksValidation = step3.status === 200;
  results.steps.push({
    step: 'A3_RESET_WEAK_PASSWORD_BACKEND',
    status: step3.status,
    response: step3.data,
    bugFound: backendLacksValidation ? 'BUG-FR03-06: Backend chấp nhận mật khẩu "123", thiếu validate độ mạnh phía Server (CWE-602)' : null
  });

  // Step 4: Verify Plaintext Password in Database
  console.log('\n[Step 4] Kiểm tra CSDL SQLite xem mật khẩu lưu dạng Plaintext hay Hash...');
  const users = await queryDb('SELECT id, email, password, role FROM users WHERE email = ?', ['test@eshop.com']);
  const currentUser = users[0];
  const isPlaintext = currentUser && currentUser.password === '123';
  console.log(`-> User trong DB: id=${currentUser.id}, email=${currentUser.email}, password='${currentUser.password}'`);
  results.steps.push({
    step: 'A4_DB_INSPECTION_PLAINTEXT',
    user: currentUser,
    isPlaintext: isPlaintext,
    bugFound: isPlaintext ? 'BUG-FR03-07: Mật khẩu lưu dạng văn bản thô (Plaintext), vi phạm nghiêm trọng SEC-01' : null
  });

  // Step 5: Test Regex in Frontend against Domain Testing Partitions
  console.log('\n[Step 5] Đánh giá biểu thức chính quy (Regex) của ForgotPassword.jsx...');
  const flawedRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\s)[A-Za-z\d\s]{8,}$/;
  const testPasswords = [
    { pwd: 'Eshop@2026', desc: 'Chuẩn đặc tả (hoa, thường, số, ký tự đặc biệt @)' },
    { pwd: 'Admin123!', desc: 'Chuẩn đặc tả (hoa, thường, số, ký tự đặc biệt !)' },
    { pwd: 'Eshop 2026', desc: 'Sai đặc tả (chứa dấu cách, không có ký tự đặc biệt)' },
    { pwd: 'Admin 123', desc: 'Sai đặc tả (chứa dấu cách, không có ký tự đặc biệt)' },
    { pwd: 'eshop@2026', desc: 'Thiếu chữ hoa' },
    { pwd: 'ESHOP@2026', desc: 'Thiếu chữ thường' },
    { pwd: 'Eshop@abcd', desc: 'Thiếu chữ số' },
    { pwd: 'Esh@12', desc: 'Độ dài ngắn (< 8)' }
  ];

  const regexResults = testPasswords.map(t => {
    const passed = flawedRegex.test(t.pwd);
    return {
      password: t.pwd,
      description: t.desc,
      regexPassed: passed,
      status: (t.pwd.includes('@') || t.pwd.includes('!')) ? (passed ? 'CORRECT' : 'FAIL_FALSE_NEGATIVE') : (t.pwd.includes(' ') ? (passed ? 'FAIL_FALSE_POSITIVE' : 'CORRECT') : 'CORRECT')
    };
  });
  results.steps.push({
    step: 'A5_REGEX_EVALUATION',
    details: regexResults,
    bugFound: 'BUG-FR03-03: Regex bắt buộc khoảng trắng (?=.*\\s) và cấm mọi ký tự đặc biệt [@$!%*?&]'
  });

  // Reset password back to standard Test1234! so system stays consistent
  console.log('\n[Dọn dẹp] Khôi phục lại mật khẩu Test1234! cho user test@eshop.com...');
  await queryDb('UPDATE users SET password = ? WHERE email = ?', ['Test1234!', 'test@eshop.com']);
  console.log('-> Đã khôi phục hoàn tất!');

  // Save results JSON
  const jsonPath = path.resolve(__dirname, 'exec_fr03_results.json');
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n-> Đã lưu kết quả transcript vào: ${jsonPath}`);

  return results;
}

runTests().then(() => {
  console.log('\n=== HOÀN TẤT KIỂM THỬ TỰ ĐỘNG BẰNG SCRIPT! ===');
}).catch(err => {
  console.error('Lỗi khi chạy script:', err);
});
