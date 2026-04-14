const db = require('../config/db');

exports.getChildren = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT u.id, u.username, p.first_name, p.last_name 
       FROM family_relations fr 
       JOIN users u ON fr.child_id = u.id 
       JOIN profiles p ON u.id = p.user_id 
       WHERE fr.parent_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching children' });
  }
};

exports.addChild = async (req, res) => {
  const { child_id } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO family_relations (parent_id, child_id) VALUES ($1, $2) RETURNING *',
      [req.user.id, child_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error linking child' });
  }
};
