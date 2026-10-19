const path = require('path');
const sqlite3 = require(path.resolve(__dirname, '../backend/node_modules/sqlite3'));
const db = new sqlite3.Database(path.resolve(__dirname, '../backend/database.sqlite'));

db.run("UPDATE users SET login_attempts = 0, locked_until = NULL WHERE email = 'test@eshop.com'", (err) => {
  if (err) {
    console.error("Lỗi cập nhật CSDL:", err);
    process.exit(1);
  }
  console.log("\n✅ Đã reset tài khoản test@eshop.com: login_attempts = 0, locked_until = NULL\n");
  db.close();
});
