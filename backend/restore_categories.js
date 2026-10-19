const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run('DELETE FROM categories');
  
  const stmt = db.prepare('INSERT INTO categories (id, name) VALUES (?, ?)');
  stmt.run(1, 'Điện thoại');
  stmt.run(2, 'Laptop');
  stmt.run(3, 'Phụ kiện');
  stmt.finalize();

  db.run("DELETE FROM sqlite_sequence WHERE name = 'categories'");
  db.run("INSERT INTO sqlite_sequence (name, seq) VALUES ('categories', 3)");

  db.all('SELECT * FROM categories', (err, rows) => {
    if (err) {
      console.error('Error fetching categories:', err);
    } else {
      console.log('Categories restored successfully:', rows);
    }
  });
});

db.close();
