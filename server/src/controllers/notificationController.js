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
  const { recipient_id, team_id, team_ids, scope, type, title, message, target_roles } = req.body;
  const userRole = req.user.role.toLowerCase();

  try {
    // 1. Enforce Scope permissions
    if (scope === 'global' && !['admin', 'superadmin'].includes(userRole)) {
      return res.status(403).json({ message: 'No tienes permisos para enviar notificaciones globales' });
    }

    const targetTeams = team_ids || (team_id ? [team_id] : []);

    if (scope === 'team') {
      if (targetTeams.length === 0) {
        return res.status(400).json({ message: 'Debe seleccionar al menos un equipo para notificaciones de equipo' });
      }
      
      // If coach, verify they manage ALL selected teams
      if (userRole === 'coach') {
        for (const tid of targetTeams) {
          const teamCheck = await db.query('SELECT id FROM teams WHERE id = $1 AND coach_id = $2', [tid, req.user.id]);
          if (teamCheck.rows.length === 0) {
            return res.status(403).json({ message: `No tienes permisos para enviar notificaciones al equipo con ID ${tid}` });
          }
        }
      }
    }

    // 2. Insert notifications
    if (scope === 'team' && targetTeams.length > 0) {
      for (const tid of targetTeams) {
        await db.query(
          `INSERT INTO notifications (sender_id, team_id, scope, type, title, message, target_roles) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [req.user.id, tid, 'team', type || 'informative', title, message, target_roles]
        );
      }
    } else {
      await db.query(
        `INSERT INTO notifications (sender_id, recipient_id, team_id, scope, type, title, message, target_roles) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [req.user.id, recipient_id || null, team_id || null, scope, type || 'informative', title, message, target_roles]
      );
    }
    
    res.status(201).json({ message: 'Notification sent successfully' });
  } catch (err) {
    console.error('Error sending notification:', err);
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
