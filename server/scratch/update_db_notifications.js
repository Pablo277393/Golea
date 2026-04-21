const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../bd/test');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run("ALTER TABLE notifications ADD COLUMN target_roles TEXT", (err) => {
    if (err) {
      if (err.message.includes('duplicate column name')) {
        console.log('Column target_roles already exists.');
      } else {
        console.error('Error adding column:', err.message);
      }
    } else {
      console.log('Column target_roles added successfully.');
    }
    db.close();
  });
});
