const db = require('../config/db');

exports.getMatches = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT m.*, t.name as team_name 
      FROM matches m 
      JOIN teams t ON m.team_id = t.id 
      ORDER BY m.match_date DESC, m.match_time DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching matches' });
  }
};

exports.createMatch = async (req, res) => {
  const { team_id, opponent, match_date, match_time, departure_time, location, is_home } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO matches (team_id, opponent, match_date, match_time, departure_time, location, is_home) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [team_id, opponent, match_date, match_time, departure_time, location, is_home]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating match' });
  }
};

exports.updateScore = async (req, res) => {
  const { home_score, away_score } = req.body;
  try {
    const result = await db.query(
      'UPDATE matches SET home_score = $1, away_score = $2 WHERE id = $3 RETURNING *',
      [home_score, away_score, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error updating score' });
  }
};
