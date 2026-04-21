const db = require('../server/src/config/db');

async function verifyFix() {
  try {
    console.log('Testing sendNotification logic...');
    const sender_id = 1;
    const recipient_id = null;
    const team_id = null;
    const scope = 'global';
    const type = 'informative';
    const title = 'Verified fix';
    const message = 'The superadmin can now send notifications.';
    const target_roles = 'coach,player';

    const result = await db.query(
      `INSERT INTO notifications (sender_id, recipient_id, team_id, scope, type, title, message, target_roles) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [sender_id, recipient_id, team_id, scope, type, title, message, target_roles]
    );
    console.log('Success:', result);

    console.log('Testing getNotifications logic for a coach...');
    const coachRes = await db.query(
      `SELECT * FROM notifications 
       WHERE recipient_id = $1 
       OR team_id IN (SELECT team_id FROM team_players WHERE player_id = $1) 
       OR scope = $2 
       OR (target_roles IS NOT NULL AND target_roles LIKE $3)
       ORDER BY created_at DESC`,
      [2, 'global', '%coach%']
    );
    console.log(`Found ${coachRes.rows.length} notifications for coach.`);
    
  } catch (err) {
    console.error('Error during verification:', err);
  }
}

verifyFix();
