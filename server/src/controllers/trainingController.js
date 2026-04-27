const db = require('../config/db');

exports.getTrainings = async (req, res) => {
  try {
    let query = `
      SELECT tr.*, t.name as team_name 
      FROM trainings tr 
      JOIN teams t ON tr.team_id = t.id 
    `;
    const params = [];

    if (req.user.role === 'coach') {
      query += ` WHERE t.coach_id = $1 `;
      params.push(req.user.id);
    }

    query += ` ORDER BY tr.training_date DESC, tr.training_time DESC `;

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trainings' });
  }
};

exports.createTraining = async (req, res) => {
  const { team_id, training_date, training_time, location, description } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO trainings (team_id, training_date, training_time, location, description) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [team_id, training_date, training_time, location, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error creating training' });
  }
};

exports.getCallups = async (req, res) => {
  const { event_type, event_id } = req.params;
  try {
    const result = await db.query(
      'SELECT c.*, u.username, p.first_name, p.last_name FROM callups c JOIN users u ON c.player_id = u.id LEFT JOIN profiles p ON u.id = p.user_id WHERE event_type = $1 AND event_id = $2',
      [event_type, event_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching call-ups' });
  }
};

exports.updateCallups = async (req, res) => {
  const { event_type, event_id } = req.params;
  const { player_ids } = req.body;

  try {
    await db.query('BEGIN');
    
    // Remove existing callups for this event
    await db.query('DELETE FROM callups WHERE event_type = $1 AND event_id = $2', [event_type, event_id]);
    
    // Insert new callups one by one
    if (player_ids && player_ids.length > 0) {
      for (const playerId of player_ids) {
        await db.query(
          'INSERT INTO callups (event_type, event_id, player_id, status) VALUES ($1, $2, $3, $4)',
          [event_type, event_id, playerId, 'called']
        );
      }
    }
    
    await db.query('COMMIT');
    res.json({ message: 'Call-ups updated successfully' });
  } catch (err) {
    try { await db.query('ROLLBACK'); } catch (e) {}
    console.error(err);
    res.status(500).json({ message: 'Error updating call-ups' });
  }
};
