const db = require('../src/config/db');

async function migrate() {
  try {
    console.log('Starting MVP schema migration v2 (Weekly history)...');
    
    // 1. Create temporary table
    await db.query(`
      CREATE TABLE weekly_mvps_v2 (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        team_id INTEGER,
        player_id INTEGER,
        week_number INTEGER,
        year INTEGER,
        votes_count INTEGER DEFAULT 0,
        UNIQUE(team_id, week_number, year),
        FOREIGN KEY(team_id) REFERENCES teams(id) ON DELETE CASCADE,
        FOREIGN KEY(player_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 2. Copy current data
    await db.query(`
      INSERT INTO weekly_mvps_v2 (team_id, player_id, week_number, year, votes_count)
      SELECT team_id, player_id, week_number, year, votes_count
      FROM weekly_mvps
    `);

    // 3. Drop old table
    await db.query('DROP TABLE weekly_mvps');

    // 4. Rename new table
    await db.query('ALTER TABLE weekly_mvps_v2 RENAME TO weekly_mvps');

    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit();
  }
}

migrate();
