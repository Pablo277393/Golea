const db = require('../src/config/db');

async function migrate() {
  try {
    console.log('Starting MVP schema migration...');
    
    // 1. Create temporary table
    await db.query(`
      CREATE TABLE weekly_mvps_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        team_id INTEGER UNIQUE,
        player_id INTEGER,
        week_number INTEGER DEFAULT 0,
        year INTEGER DEFAULT 0,
        votes_count INTEGER DEFAULT 0,
        FOREIGN KEY(team_id) REFERENCES teams(id) ON DELETE CASCADE,
        FOREIGN KEY(player_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 2. Copy data (only the latest MVP per team if any exists)
    // We'll take the one with highest id as a simple heuristic for "latest"
    await db.query(`
      INSERT INTO weekly_mvps_new (team_id, player_id, week_number, year, votes_count)
      SELECT team_id, player_id, week_number, year, votes_count
      FROM weekly_mvps
      GROUP BY team_id
      HAVING id = MAX(id)
    `);

    // 3. Drop old table
    await db.query('DROP TABLE weekly_mvps');

    // 4. Rename new table
    await db.query('ALTER TABLE weekly_mvps_new RENAME TO weekly_mvps');

    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit();
  }
}

migrate();
