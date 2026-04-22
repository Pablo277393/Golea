const db = require('../config/db');
const { generateLinkingCode } = require('../utils/codeGenerator');

async function migrate() {
  console.log('Starting migration: adding linking_code and parent_player table...');

  try {
    // 1. Add linking_code column if it doesn't exist
    try {
      await db.query('ALTER TABLE users ADD COLUMN linking_code TEXT');
      console.log('Added linking_code column to users table.');
    } catch (err) {
      if (err.message.includes('duplicate column name')) {
        console.log('linking_code column already exists.');
      } else {
        throw err;
      }
    }

    // 2. Create parent_player table
    await db.query(`
      CREATE TABLE IF NOT EXISTS parent_player (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        parent_id INTEGER,
        player_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(parent_id, player_id),
        FOREIGN KEY(parent_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(player_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Table parent_player is ready.');

    // 3. Generate codes for existing players who don't have one
    const players = await db.query("SELECT id FROM users WHERE role = 'player' AND (linking_code IS NULL OR linking_code = '')");
    console.log(`Found ${players.rows.length} players without linking code.`);

    for (const player of players.rows) {
      let code;
      let isUnique = false;
      while (!isUnique) {
        code = generateLinkingCode();
        const existing = await db.query('SELECT id FROM users WHERE linking_code = $1', [code]);
        if (existing.rows.length === 0) isUnique = true;
      }
      await db.query('UPDATE users SET linking_code = $1 WHERE id = $2', [code, player.id]);
    }
    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrate();
