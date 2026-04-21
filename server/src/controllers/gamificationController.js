const db = require('../config/db');

// Predictions
exports.getPredictions = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM predictions WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching predictions' });
  }
};

exports.getQuinielaMatches = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // 1. Get user's/children's teams
    let teamIds = [];
    if (userRole === 'player') {
       const userTeams = await db.query('SELECT team_id FROM team_players WHERE player_id = $1', [userId]);
       teamIds = userTeams.rows.map(r => r.team_id);
    } else if (userRole === 'parent') {
       const childrenTeams = await db.query(
         'SELECT team_id FROM team_players WHERE player_id IN (SELECT child_id FROM family_relations WHERE parent_id = $1)',
         [userId]
       );
       teamIds = childrenTeams.rows.map(r => r.team_id);
    } else if (userRole === 'admin' || userRole === 'superadmin') {
       // Admins see Senior + Fillers
    }
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Priority 1: Senior match (ID 1)
    const seniorMatches = await db.query(
      `SELECT m.*, t.name as team_name 
       FROM matches m 
       JOIN teams t ON m.team_id = t.id 
       WHERE m.team_id = 1 AND m.match_date >= $1 AND m.published = 1
       ORDER BY m.match_date ASC LIMIT 1`,
      [today]
    );
    
    // Priority 2: User/Children matches (max 2 if possible)
    let userMatchesResult = [];
    if (teamIds.length > 0) {
      const placeholders = teamIds.map((_, i) => `$${i+2}`).join(',');
      const res = await db.query(
        `SELECT m.*, t.name as team_name 
         FROM matches m 
         JOIN teams t ON m.team_id = t.id 
         WHERE m.team_id IN (${placeholders}) AND m.team_id != 1 AND m.match_date >= $1 AND m.published = 1
         ORDER BY m.match_date ASC LIMIT 2`,
        [today, ...teamIds]
      );
      userMatchesResult = res.rows;
    }
    
    const initialMatches = [...seniorMatches.rows, ...userMatchesResult];
    const selectedIds = initialMatches.map(m => m.id);
    
    // Priority 3: Fillers if < 3
    let fillers = [];
    if (selectedIds.length < 3) {
      const limit = 3 - selectedIds.length;
      const notInClause = selectedIds.length > 0 ? `AND m.id NOT IN (${selectedIds.join(',')})` : '';
      const res = await db.query(
        `SELECT m.*, t.name as team_name 
         FROM matches m 
         JOIN teams t ON m.team_id = t.id 
         WHERE m.match_date >= $1 AND m.published = 1 ${notInClause} 
         ORDER BY m.match_date ASC LIMIT $2`,
        [today, limit]
      );
      fillers = res.rows;
    }
    
    const combo = [...initialMatches, ...fillers].slice(0, 3);
    res.json(combo);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching quiniela matches' });
  }
};

exports.submitPredictions = async (req, res) => {
  const { predictions } = req.body; // Array of { match_id, prediction }
  if (!predictions || !Array.isArray(predictions)) {
    return res.status(400).json({ message: 'Invalid predictions format' });
  }

  try {
    const now = new Date();
    const results = [];
    
    for (const p of predictions) {
      const { match_id, prediction } = p;
      
      // Check closure rule (1 hour before)
      const matchRes = await db.query('SELECT match_date, match_time FROM matches WHERE id = $1', [match_id]);
      if (matchRes.rows.length === 0) continue;
      
      const matchDateTime = new Date(`${matchRes.rows[0].match_date}T${matchRes.rows[0].match_time}`);
      const diffMs = matchDateTime - now;
      const diffMins = diffMs / (1000 * 60);
      
      if (diffMins < 60) {
        // Skip or return error? We'll skip for now but in a real app better to warn
        continue;
      }

      const resInsert = await db.query(
        `INSERT INTO predictions (match_id, user_id, prediction) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (match_id, user_id) 
         DO UPDATE SET prediction = $3
         RETURNING *`,
        [match_id, req.user.id, prediction]
      );
      results.push(resInsert.rows[0]);
    }
    
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error submitting predictions' });
  }
};

exports.getWeeklyPrize = async (req, res) => {
  try {
    // Basic week calculation
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now - startOfYear) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
    
    const result = await db.query(
      'SELECT * FROM weekly_prizes WHERE active_week = $1 AND year = $2 LIMIT 1',
      [weekNumber, now.getFullYear()]
    );
    res.json(result.rows[0] || { description: 'Próximamente el premio de esta semana' });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching weekly prize' });
  }
};

// Weekly MVP
exports.getWeeklyMVP = async (req, res) => {
  const { team_id, week_number, year } = req.params;
  try {
    const result = await db.query(
      'SELECT mvp.*, u.username, p.first_name, p.last_name FROM weekly_mvps mvp JOIN users u ON mvp.player_id = u.id JOIN profiles p ON u.id = p.user_id WHERE team_id = $1 AND week_number = $2 AND year = $3',
      [team_id, week_number, year]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching MVP' });
  }
};

exports.voteMVP = async (req, res) => {
  const { team_id, player_id, week_number, year } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO weekly_mvps (team_id, player_id, week_number, year, votes_count) 
       VALUES ($1, $2, $3, $4, 1) 
       ON CONFLICT (team_id, week_number, year) 
       DO UPDATE SET votes_count = weekly_mvps.votes_count + 1 
       RETURNING *`,
      [team_id, player_id, week_number, year]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error voting MVP' });
  }
};
