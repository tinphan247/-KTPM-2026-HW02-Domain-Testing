const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Connecting to SQLite at:', dbPath);

db.serialize(() => {
  db.run('DELETE FROM categories', (err) => {
    if (err) console.error('Error deleting categories:', err);
    else console.log('Deleted all records from categories.');
  });

  db.run("DELETE FROM sqlite_sequence WHERE name = 'categories'", (err) => {
    if (err) console.error('Error resetting sqlite_sequence:', err);
    else console.log('Reset auto-increment sequence for categories.');
  });

  const insertCategory = db.prepare('INSERT INTO categories (id, name) VALUES (?, ?)');
  insertCategory.run(1, 'Điện thoại');
  insertCategory.run(2, 'Laptop');
  insertCategory.run(3, 'Phụ kiện');
  insertCategory.finalize((err) => {
    if (err) console.error('Error seeding categories:', err);
    else console.log('Seeded 3 default categories: Điện thoại, Laptop, Phụ kiện.');
  });

  db.all('SELECT * FROM categories', [], (err, rows) => {
    if (err) {
      console.error('Error fetching categories:', err);
    } else {
      console.log('\n--- CURRENT CATEGORIES IN DB ---');
      console.table(rows);
    }
    db.close();
  });
});
