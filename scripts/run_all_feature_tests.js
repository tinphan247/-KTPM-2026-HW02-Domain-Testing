/**
 * Master Test Runner for all HW02 Features
 * - FR-03: Quên mật khẩu & Đặt lại mật khẩu (Web & API)
 * - FR-07: Giỏ hàng - Shopping Cart (Web & API)
 * - FR-15: Quản lý Sản phẩm - Product CRUD (Admin Web & API)
 * - FR-04 Mobile: Quản lý Hồ sơ cá nhân (Mobile App & API)
 * 
 * Author: 23120346
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('================================================================');
console.log('🚀 CHẠY TỔNG HỢP KIỂM THỬ TẤT CẢ CÁC TÍNH NĂNG (HW02 - 23120346)');
console.log('================================================================\n');

const testScripts = [
  { name: 'FR-03 (Quên mật khẩu)', file: 'exec_fr03_tests.js', resultFile: 'exec_fr03_results.json' },
  { name: 'FR-07 (Giỏ hàng)', file: 'exec_fr07_cart_tests.js', resultFile: 'exec_fr07_results.json' },
  { name: 'FR-15 (Quản lý Sản phẩm)', file: 'exec_fr15_product_tests.js', resultFile: 'exec_fr15_results.json' },
  { name: 'FR-04 Mobile (Hồ sơ cá nhân)', file: 'exec_fr04_mobile_profile_tests.js', resultFile: 'exec_fr04_results.json' }
];

const summary = [];

for (const suite of testScripts) {
  console.log(`\n▶ ĐANG CHẠY SUITE: ${suite.name}...`);
  try {
    execSync(`node ${path.resolve(__dirname, suite.file)}`, { stdio: 'inherit' });
    const resPath = path.resolve(__dirname, suite.resultFile);
    if (fs.existsSync(resPath)) {
      const data = JSON.parse(fs.readFileSync(resPath, 'utf8'));
      const bugs = data.steps.filter(s => s.bugFound || s.bugId);
      summary.push({
        suite: suite.name,
        totalSteps: data.steps.length,
        bugsFound: bugs.length,
        status: 'PASSED_WITH_BUGS_LOGGED'
      });
    }
  } catch (err) {
    console.error(`❌ Lỗi khi chạy ${suite.name}:`, err.message);
    summary.push({
      suite: suite.name,
      status: 'EXECUTION_ERROR'
    });
  }
}

console.log('\n================================================================');
console.log('📊 BẢNG TỔNG KẾT KẾT QUẢ KIỂM THỬ TOÀN BỘ CÁC TÍNH NĂNG:');
console.log('================================================================');
console.table(summary);
console.log(`Tổng số Bug hệ thống được phát hiện: ${summary.reduce((acc, s) => acc + (s.bugsFound || 0), 0)} lỗi!\n`);
