const db = require('../src/config/db');

async function test() {
  const team_id = 2;
  const player_id = 9;
  const coach_id = 2;

  try {
    console.log('Testing selectMVP logic...');
    
    // Simulate selectMVP
    await db.query(
      `INSERT INTO weekly_mvps (team_id, player_id) 
       VALUES ($1, $2)
       ON CONFLICT(team_id) DO UPDATE SET player_id = $2`,
      [team_id, player_id]
    );
    console.log('MVP selected successfully (upsert)');

    // Fetch back
    const res = await db.query(
      `SELECT mvp.*, u.username, p.first_name, p.last_name 
       FROM weekly_mvps mvp 
       JOIN users u ON mvp.player_id = u.id 
       LEFT JOIN profiles p ON u.id = p.user_id 
       WHERE mvp.team_id = $1`,
      [team_id]
    );
    console.log('Fetched MVP:', res.rows[0]);

    // Test replacement
    const new_player_id = 8;
    await db.query(
      `INSERT INTO weekly_mvps (team_id, player_id) 
       VALUES ($1, $2)
       ON CONFLICT(team_id) DO UPDATE SET player_id = $2`,
      [team_id, new_player_id]
    );
    console.log('MVP replaced successfully');

    const res2 = await db.query('SELECT * FROM weekly_mvps WHERE team_id = $1', [team_id]);
    console.log('Current MVP rows for team 2:', res2.rows);

  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    process.exit();
  }
}

test();
