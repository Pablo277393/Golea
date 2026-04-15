const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../../bd/test.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database.');
});

const schemaPath = path.resolve(__dirname, '../../db/schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

db.serialize(() => {
  console.log('Applying schema safely (no drops)...');

  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  db.run('BEGIN TRANSACTION');

  statements.forEach((stmt) => {
    db.run(stmt, (err) => {
      if (err) {
        console.log('Skipping (already exists or error):', err.message);
      }
    });
  });

  db.run('COMMIT', (err) => {
    if (err) console.error(err.message);
    else console.log('Database ready (no data deleted).');

    db.close();
  });
});