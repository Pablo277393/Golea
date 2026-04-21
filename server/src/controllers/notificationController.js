const db = require('../config/db');

exports.getNotifications = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM notifications 
       WHERE recipient_id = $1 
       OR team_id IN (SELECT team_id FROM team_players WHERE player_id = $1) 
       OR scope = $2 
       OR (target_roles IS NOT NULL AND target_roles LIKE $3)
       ORDER BY created_at DESC`,
      [req.user.id, 'global', `%${req.user.role}%`]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

exports.sendNotification = async (req, res) => {
  const { recipient_id, team_id, scope, type, title, message, target_roles } = req.body;
  try {
    // Security check for coaches
    if (req.user.role === 'coach' && team_id) {
       const teamCheck = await db.query('SELECT * FROM teams WHERE id = $1 AND coach_id = $2', [team_id, req.user.id]);
       if (teamCheck.rows.length === 0) {
         return res.status(403).json({ message: 'No tiene permisos para enviar notificaciones a este equipo' });
       }
    }

    await db.query(
      `INSERT INTO notifications (sender_id, recipient_id, team_id, scope, type, title, message, target_roles) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [req.user.id, recipient_id || null, team_id || null, scope, type, title, message, target_roles]
    );
    res.status(201).json({ message: 'Notification sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending notification' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await db.query('UPDATE notifications SET is_read = TRUE WHERE id = $1 AND (recipient_id = $2 OR scope = $3)', [req.params.id, req.user.id, 'global']);
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating notification' });
  }
};
