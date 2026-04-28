const db = require('../config/db');

exports.getMatches = async (req, res) => {
  try {
    let query = `
      SELECT m.*, t.name as team_name, t.coach_id 
      FROM matches m 
      JOIN teams t ON m.team_id = t.id 
      WHERE 
        ($1 IN ('admin', 'superadmin'))
        OR ($1 = 'coach' AND t.coach_id = $2)
        OR ($1 = 'player' AND m.published = 1 AND EXISTS (
            SELECT 1 FROM team_players tp WHERE tp.team_id = m.team_id AND tp.player_id = $2
        ))
        OR ($1 = 'parent' AND m.published = 1 AND EXISTS (
            SELECT 1 FROM parent_player pp 
            JOIN team_players tp ON pp.player_id = tp.player_id 
            WHERE pp.parent_id = $2 AND tp.team_id = m.team_id
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
  const userRole = req.user.role.toLowerCase();

  try {
    // Security check for coaches
    if (userRole === 'coach') {
       const teamCheck = await db.query('SELECT id FROM teams WHERE id = $1 AND coach_id = $2', [team_id, req.user.id]);
       if (teamCheck.rows.length === 0) {
         return res.status(403).json({ message: 'No tienes permisos para crear partidos para este equipo' });
       }
    }

    const result = await db.query(
      `INSERT INTO matches (team_id, opponent, match_date, match_time, departure_time, location, is_home, published, convocation, notes, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [team_id, opponent, match_date, match_time, departure_time, location, is_home, published || 0, convocation, notes, req.user.id]
    );

    const matchId = result.lastID;
    const fetchResult = await db.query('SELECT * FROM matches WHERE id = $1', [matchId]);

    res.status(201).json(fetchResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating match' });
  }
};

exports.publishMatch = async (req, res) => {
  const matchId = req.params.id;
  try {
    // 1. Update match to published
    await db.query(
      'UPDATE matches SET published = 1 WHERE id = $1',
      [matchId]
    );
    
    // 2. Fetch match data for notifications
    const result = await db.query(
      'SELECT * FROM matches WHERE id = $1',
      [matchId]
    );
    
    const match = result.rows[0];
    if (!match) return res.status(404).json({ message: 'Match not found' });

    // 2. Automated Notifications (Segmented by Team)
    const title = `¡Partido Publicado! vs ${match.opponent}`;
    const message = `Equipo: ${match.team_id === 1 ? 'Primer Equipo' : 'Su categoría'}\nRival: ${match.opponent}\nLugar: ${match.location}\nFecha: ${match.match_date}\nHora: ${match.match_time}\n\nConvocatoria: ${match.convocation || 'Ver en el calendario'}\n\nNotas: ${match.notes || 'Sin observaciones'}`;

    // All matches are now segmented by team unless an admin explicitly sends a global message
    await db.query(
      `INSERT INTO notifications (sender_id, team_id, scope, type, title, message, target_roles) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [req.user.id, match.team_id, 'team', 'match', title, message, 'player,parent']
    );

    res.json(match);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error publishing match' });
  }
};

exports.updateScore = async (req, res) => {
  const { home_score, away_score } = req.body;
  const matchId = req.params.id;
  const userId = req.user.id;
  const userRole = req.user.role.toLowerCase();

  try {
    // 1. Authorization Check
    const matchRes = await db.query(
      'SELECT m.*, t.coach_id FROM matches m JOIN teams t ON m.team_id = t.id WHERE m.id = $1',
      [matchId]
    );

    if (matchRes.rows.length === 0) {
      return res.status(404).json({ message: 'Match not found' });
    }

    const matchData = matchRes.rows[0];

    if (!['admin', 'superadmin'].includes(userRole)) {
      if (userRole !== 'coach' || matchData.coach_id !== userId) {
        return res.status(403).json({ message: 'No tienes permiso para actualizar el marcador de este partido' });
      }
    }

    // 2. Update Score
    await db.query(
      'UPDATE matches SET home_score = $1, away_score = $2 WHERE id = $3',
      [home_score, away_score, matchId]
    );

    // Fetch updated data
    const updatedMatch = await db.query(
      'SELECT m.*, t.name as team_name FROM matches m JOIN teams t ON m.team_id = t.id WHERE m.id = $1',
      [matchId]
    );
    const updatedMatchData = updatedMatch.rows[0];

    if (updatedMatchData) {
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

      // NOTIFICATIONS LOGIC
      // 1. Get all users who hit this match
      const hits = await db.query(
        'SELECT p.user_id, u.username FROM predictions p JOIN users u ON p.user_id = u.id WHERE p.match_id = $1 AND p.points_earned = 1',
        [matchId]
      );

      for (const hit of hits.rows) {
        const userIdHit = hit.user_id;
        
        // Notify single hit
        await db.query(
          `INSERT INTO notifications (sender_id, recipient_id, scope, type, title, message) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [1, userIdHit, 'individual', 'informative', '¡Acierto en la Quiniela!', `Has acertado el resultado del partido ${updatedMatchData.team_name} vs ${updatedMatchData.opponent}.`]
        );

        // 2. Check for Prizes (Prize or Bonus)
        // We need to fetch the 3 matches that were part of the user's "combo"
        // For simplicity, we'll look at the user's correct predictions in the last 7 days
        // and categorize them.

        const userPredictions = await db.query(
          `SELECT p.*, m.team_id, m.opponent 
           FROM predictions p 
           JOIN matches m ON p.match_id = m.id 
           WHERE p.user_id = $1 AND p.created_at >= date('now', '-7 days')`,
          [userIdHit]
        );

        const correctPreds = userPredictions.rows.filter(rp => rp.points_earned === 1);
        
        // Identify matches
        const hitFirstTeam = correctPreds.some(rp => rp.team_id === 1);
        
        // Own teams
        const userTeamsRes = await db.query(
          `SELECT team_id FROM team_players WHERE player_id = $1
           UNION
           SELECT team_id FROM team_players WHERE player_id IN (SELECT child_id FROM family_relations WHERE parent_id = $1)`,
          [userIdHit]
        );
        const userTeamIds = userTeamsRes.rows.map(r => r.team_id);
        const hitOwnTeam = correctPreds.some(rp => userTeamIds.includes(rp.team_id) && rp.team_id !== 1);
        
        // Random/Filler (not first team and not own team)
        const hitRandom = correctPreds.some(rp => rp.team_id !== 1 && !userTeamIds.includes(rp.team_id));

        if (hitOwnTeam && hitRandom) {
          if (hitFirstTeam) {
            // BONUS PRIZE (All 3)
            await db.query(
              `INSERT INTO notifications (sender_id, recipient_id, scope, type, title, message) 
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [1, userIdHit, 'individual', 'informative', '¡PREMIO BONUS! Triple Desafío Completo', '¡HAS ACERTADO LOS 3 PARTIDOS! (Tu equipo, el random y el primer equipo). Reclama tu premio especial en las oficinas.']
            );
          } else {
            // STANDARD PRIZE (Own + Random)
            await db.query(
              `INSERT INTO notifications (sender_id, recipient_id, scope, type, title, message) 
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [1, userIdHit, 'individual', 'informative', '¡Has ganado un Premio!', '¡Enhorabuena! Has acertado tu partido y el resultado random. Tienes un premio esperándote.']
            );
          }
        }
      }
    }

    res.json(updatedMatchData);
  } catch (err) {
    console.error('Error updating score and sending notifications:', err);
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
