const { query } = require('../src/config/db');

async function migrate() {
  try {
    console.log('Running migration: Adding priority column to ads...');
    await query('ALTER TABLE ads ADD COLUMN priority INTEGER DEFAULT 1;');
    console.log('Migration successful: Priority column added.');
    process.exit(0);
  } catch (err) {
    if (err.message.includes('duplicate column name')) {
      console.log('Migration already applied: priority column exists.');
      process.exit(0);
    }
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
