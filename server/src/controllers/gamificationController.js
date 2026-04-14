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

exports.submitPrediction = async (req, res) => {
  const { match_id, predicted_home_score, predicted_away_score } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO predictions (match_id, user_id, predicted_home_score, predicted_away_score) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (match_id, user_id) 
       DO UPDATE SET predicted_home_score = $3, predicted_away_score = $4
       RETURNING *`,
      [match_id, req.user.id, predicted_home_score, predicted_away_score]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error submitting prediction' });
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
