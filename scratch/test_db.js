const db = require('../server/src/config/db');

async function testInsert() {
  try {
    const result = await db.query(
      `INSERT INTO notifications (sender_id, recipient_id, team_id, scope, type, title, message, target_roles) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [1, undefined, undefined, 'global', 'informative', 'Test Title', 'Test Message', 'coach,player']
    );
    console.log('Success:', result);
  } catch (err) {
    console.error('Error:', err);
  }
}

testInsert();
