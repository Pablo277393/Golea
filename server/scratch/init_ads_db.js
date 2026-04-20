const { query } = require('../src/config/db');

const dropTable = 'DROP TABLE IF EXISTS ads;';
const createTable = `
CREATE TABLE IF NOT EXISTS ads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  image TEXT,
  url TEXT NOT NULL,
  active BOOLEAN DEFAULT 1,
  start_date DATE,
  end_date DATE,
  clicks INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

async function init() {
  try {
    // We don't drop if we want to preserve data, but for first setup it's fine.
    // Commenting out dropTable for safety if re-run.
    await query(createTable);
    console.log('Ads table initialized successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error initializing ads table:', err);
    process.exit(1);
  }
}

init();
