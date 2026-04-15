const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../../bd/test');
const schemaPath = path.resolve(__dirname, '../../db/schema.sql');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database for initialization.');
});

const schema = fs.readFileSync(schemaPath, 'utf8');

db.serialize(() => {
  console.log('Dropping existing tables for a clean start...');
  const tables = [
    'weekly_mvps', 'predictions', 'notifications', 'callups', 
    'trainings', 'matches', 'team_players', 'teams', 
    'family_relations', 'profiles', 'users'
  ];
  
  tables.forEach(table => {
    db.run(`DROP TABLE IF EXISTS ${table}`);
  });

  console.log('Applying schema...');
  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  db.run('BEGIN TRANSACTION');
  
  statements.forEach((stmt) => {
    db.run(stmt, (err) => {
      if (err) {
        console.error('Error executing statement:', stmt);
        console.error(err.message);
      }
    });
  });

  db.run('COMMIT', (err) => {
    if (err) {
      console.error('Error committing transaction:', err.message);
    } else {
      console.log('Database initialized successfully with NEW schema.');
    }
    db.close();
  });
});
