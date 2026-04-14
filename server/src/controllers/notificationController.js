const db = require('../config/db');

exports.getNotifications = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM notifications WHERE recipient_id = $1 OR team_id IN (SELECT team_id FROM team_players WHERE player_id = $1) OR scope = $2 ORDER BY created_at DESC',
      [req.user.id, 'global']
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

exports.sendNotification = async (req, res) => {
  const { recipient_id, team_id, scope, type, title, message } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO notifications (sender_id, recipient_id, team_id, scope, type, title, message) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.user.id, recipient_id, team_id, scope, type, title, message]
    );
    res.status(201).json(result.rows[0]);
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
