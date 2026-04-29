const db = require('../config/db');
const { generateLinkingCode } = require('../utils/codeGenerator');

/**
 * Generate or retrieve the linking code for the authenticated player
 */
exports.generateLinkingCode = async (req, res) => {
  try {
    // 1. Get current user's linking code
    const userResult = await db.query(
      'SELECT linking_code FROM users WHERE id = $1',
      [req.user.id]
    );

    let linkingCode = userResult.rows[0]?.linking_code;

    // 2. If no code exists, generate one
    if (!linkingCode) {
      let isUnique = false;
      while (!isUnique) {
        linkingCode = generateLinkingCode('JUG');
        const existing = await db.query('SELECT id FROM users WHERE linking_code = $1', [linkingCode]);
        if (existing.rows.length === 0) isUnique = true;
      }

      await db.query(
        'UPDATE users SET linking_code = $1 WHERE id = $2',
        [linkingCode, req.user.id]
      );
    }

    res.json({ linkingCode });
  } catch (err) {
    console.error('Error generating linking code:', err);
    res.status(500).json({ message: 'Error al generar el código de vinculación' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT u.id, u.username, u.email, u.role,
              p.first_name, p.last_name, p.phone, p.bio, p.birth_date,
              tp.jersey_number, tp.position, t.name as team_name
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       LEFT JOIN team_players tp ON u.id = tp.player_id
       LEFT JOIN teams t ON tp.team_id = t.id
       WHERE u.id = $1
       LIMIT 1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener el perfil' });
  }
};

exports.updateProfile = async (req, res) => {
  const { first_name, last_name, phone, bio, birth_date } = req.body;
  try {
    // 1. Update profiles table
    await db.query(
      `INSERT INTO profiles (user_id, first_name, last_name, phone, bio, birth_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT(user_id) 
       DO UPDATE SET 
         first_name = EXCLUDED.first_name,
         last_name = EXCLUDED.last_name,
         phone = EXCLUDED.phone,
         bio = EXCLUDED.bio,
         birth_date = EXCLUDED.birth_date`,
      [req.user.id, first_name, last_name, phone, bio, birth_date]
    );

    res.json({ message: 'Perfil actualizado correctamente' });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Error al actualizar el perfil' });
  }
};
