const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Solve path for the database file
const dbPath = path.resolve(__dirname, '../../../bd/test');

// Ensure directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON;');
  }
});

/**
 * Wrapper to mimic pg's query method
 * Translates $n placeholders to ? and returns { rows }
 */
const query = (text, params = []) => {
  return new Promise((resolve, reject) => {
    // Translate $1, $2... to ?
    const translatedText = text.replace(/\$(\d+)/g, '?');
    
    // Check if it's a SELECT query
    const isSelect = translatedText.trim().toUpperCase().startsWith('SELECT');

    if (isSelect) {
      db.all(translatedText, params, (err, rows) => {
        if (err) return reject(err);
        resolve({ rows: rows || [] });
      });
    } else {
      // For INSERT, UPDATE, DELETE
      db.run(translatedText, params, function(err) {
        if (err) return reject(err);
        
        // SQLite RETURNING support is available in 3.35+
        // If the query didn't return rows automatically, we simulate for INSERTs
        resolve({ 
          rows: this.lastID ? [{ id: this.lastID }] : [],
          lastID: this.lastID,
          changes: this.changes 
        });
      });
    }
  });
};

module.exports = {
  query,
  pool: db
};
