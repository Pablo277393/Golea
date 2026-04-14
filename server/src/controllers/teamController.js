const db = require('../config/db');

exports.getTeams = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM teams ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching teams' });
  }
};

exports.createTeam = async (req, res) => {
  const { name, category, coach_id } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO teams (name, category, coach_id) VALUES ($1, $2, $3) RETURNING *',
      [name, category, coach_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error creating team' });
  }
};

exports.getTeamById = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM teams WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Team not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching team' });
  }
};
