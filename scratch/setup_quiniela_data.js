const db = require('../server/src/config/db');

async function setupData() {
  try {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now - startOfYear) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);

    console.log(`Setting up data for Week ${weekNumber}, Year ${now.getFullYear()}`);

    // Prize
    await db.query(
      'INSERT INTO weekly_prizes (description, sponsor_name, active_week, year) VALUES ($1, $2, $3, $4)', 
      ['Balón Oficial Golea 2026', 'Nike Football', weekNumber, now.getFullYear()]
    );

    const today = now.toISOString().split('T')[0];

    // Senior match (ID 1)
    await db.query(
      'INSERT INTO matches (team_id, opponent, match_date, match_time, location, is_home) VALUES (1, $1, $2, $3, $4, 1)', 
      ['FC Barcelona B', today, '20:30:00', 'Estadi Golea']
    );

    // Another match (Team 2)
    await db.query(
      'INSERT INTO matches (team_id, opponent, match_date, match_time, location, is_home) VALUES (2, $1, $2, $3, $4, 0)', 
      ['Real Madrid Castilla', today, '21:00:00', 'Valdebebas']
    );

    // Another match (Team 3)
    await db.query(
      'INSERT INTO matches (team_id, opponent, match_date, match_time, location, is_home) VALUES (3, $1, $2, $3, $4, 1)', 
      ['Sevilla Atletico', today, '22:00:00', 'Anexo Golea']
    );

    console.log('Mock data inserted successfully');
    process.exit(0);
  } catch (e) {
    console.error('Error inserting mock data:', e);
    process.exit(1);
  }
}

setupData();
