const db = require('../config/db');

exports.getMatches = async (req, res) => {
  try {
    let query = `
      SELECT m.*, t.name as team_name 
      FROM matches m 
      JOIN teams t ON m.team_id = t.id 
      WHERE 
        ($1 IN ('admin', 'superadmin'))
        OR (m.team_id = 1 AND m.published = 1)
        OR ($1 = 'coach' AND t.coach_id = $2)
        OR ($1 = 'player' AND m.published = 1 AND EXISTS (
            SELECT 1 FROM team_players tp WHERE tp.team_id = m.team_id AND tp.player_id = $2
        ))
        OR ($1 = 'parent' AND m.published = 1 AND EXISTS (
            SELECT 1 FROM family_relations fr 
            JOIN team_players tp ON fr.child_id = tp.player_id 
            WHERE fr.parent_id = $2 AND tp.team_id = m.team_id
        ))
      ORDER BY m.match_date DESC, m.match_time DESC
    `;
    const params = [req.user.role, req.user.id];

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching matches:', err);
    res.status(500).json({ message: 'Error fetching matches' });
  }
};

exports.createMatch = async (req, res) => {
  const { team_id, opponent, match_date, match_time, departure_time, location, is_home, published, convocation, notes } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO matches (team_id, opponent, match_date, match_time, departure_time, location, is_home, published, convocation, notes, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [team_id, opponent, match_date, match_time, departure_time, location, is_home, published || 0, convocation, notes, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating match' });
  }
};

exports.publishMatch = async (req, res) => {
  const matchId = req.params.id;
  try {
    // 1. Update match to published
    const result = await db.query(
      'UPDATE matches SET published = 1 WHERE id = $1 RETURNING *',
      [matchId]
    );
    
    const match = result.rows[0];
    if (!match) return res.status(404).json({ message: 'Match not found' });

    // 2. Automated Notifications
    const title = `¡Partido Publicado! vs ${match.opponent}`;
    const message = `Equipo: ${match.team_id === 1 ? 'Primer Equipo' : 'Su categoría'}\nRival: ${match.opponent}\nLugar: ${match.location}\nFecha: ${match.match_date}\nHora: ${match.match_time}\n\nConvocatoria: ${match.convocation || 'Ver en el calendario'}\n\nNotas: ${match.notes || 'Sin observaciones'}`;

    if (match.team_id === 1) {
      // Global Notification for everyone
      await db.query(
        `INSERT INTO notifications (sender_id, scope, type, title, message) 
         VALUES ($1, $2, $3, $4, $5)`,
        [req.user.id, 'global', 'match', title, message]
      );
    } else {
      // Team specific notification
      // In this system, notifications are either individual, team-specific, or global.
      // We'll use the team_id field in notifications which is already handled by getNotifications.
      await db.query(
        `INSERT INTO notifications (sender_id, team_id, scope, type, title, message) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [req.user.id, match.team_id, 'team', 'match', title, message]
      );
    }

    res.json(match);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error publishing match' });
  }
};

exports.updateScore = async (req, res) => {
  const { home_score, away_score } = req.body;
  const matchId = req.params.id;
  try {
    const result = await db.query(
      'UPDATE matches SET home_score = $1, away_score = $2 WHERE id = $3 RETURNING *',
      [home_score, away_score, matchId]
    );

    const matchData = result.rows[0];
    if (matchData) {
      // Determine actual result
      let actualResult = 'EMPATE';
      if (home_score > away_score) actualResult = 'LOCAL';
      else if (away_score > home_score) actualResult = 'VISITANTE';

      // Update points in predictions table (1 if hit, 0 if fail)
      await db.query(
        `UPDATE predictions 
         SET points_earned = CASE WHEN prediction = $1 THEN 1 ELSE 0 END 
         WHERE match_id = $2`,
        [actualResult, matchId]
      );
      
      console.log(`[EVALUATION] Predictions for Match ${matchId} evaluated as ${actualResult}`);
    }

    res.json(matchData);
  } catch (err) {
    res.status(500).json({ message: 'Error updating score' });
  }
};

exports.deleteMatch = async (req, res) => {
  const matchId = req.params.id;
  try {
    await db.query('DELETE FROM matches WHERE id = $1', [matchId]);
    res.json({ message: 'Match deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting match' });
  }
};
