const path = require('path');
const sqlite3 = require(path.resolve(__dirname, '../backend/node_modules/sqlite3'));
const db = new sqlite3.Database(path.resolve(__dirname, '../backend/database.sqlite'));

console.log("\n================ DANH SÁCH TÀI KHOẢN TRONG BẢNG USERS (SQLITE) ================");
db.all("SELECT id, name, email, password, role FROM users", (err, rows) => {
  if (err) {
    console.error("Lỗi truy vấn CSDL:", err);
    process.exit(1);
  }
  console.table(rows);
  console.log("================================================================================\n");
  db.close();
});
