const db = require('../config/db');
const bcrypt = require('bcrypt');

/**
 * Get users filtered by role
 */
exports.getUsersByRole = async (req, res) => {
  const { role } = req.query;
  try {
    let sql = `
      SELECT u.id, u.username, u.email, u.role, p.first_name, p.last_name, p.phone, p.bio 
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
    `;
    const params = [];
    
    if (role) {
      sql += ' WHERE u.role = $1';
      params.push(role);
    }
    
    sql += ' ORDER BY u.username';
    
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

/**
 * Create a new user (General)
 */
exports.createUser = async (req, res) => {
  const { username, email, password, role, firstName, lastName, phone, bio } = req.body;
  const passwordToHash = password || 'golea2026';

  try {
    const userExist = await db.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ message: 'El usuario o email ya existe' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwordToHash, salt);

    const result = await db.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)',
      [username, email, passwordHash, role || 'player']
    );

    const userId = result.lastID || (result.rows && result.rows[0]?.id);
    
    await db.query(
      'INSERT INTO profiles (user_id, first_name, last_name, phone, bio) VALUES ($1, $2, $3, $4, $5)',
      [userId, firstName, lastName, phone || null, bio || null]
    );

    const fetchUser = await db.query('SELECT id, username, email, role FROM users WHERE id = $1', [userId]);

    res.status(201).json({
      message: 'Usuario creado correctamente',
      user: fetchUser.rows[0],
      passwordUsed: passwordToHash
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creando usuario' });
  }
};

/**
 * Update user and profile
 */
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, firstName, lastName, phone, bio, role } = req.body;

  try {
    // 1. Update User Account
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      await db.query(
        'UPDATE users SET username = $1, email = $2, password_hash = $3, role = $4 WHERE id = $5',
        [username, email, passwordHash, role, id]
      );
    } else {
      await db.query(
        'UPDATE users SET username = $1, email = $2, role = $3 WHERE id = $4',
        [username, email, role, id]
      );
    }

    // 2. Update/Insert Profile
    const profileExist = await db.query('SELECT * FROM profiles WHERE user_id = $1', [id]);
    if (profileExist.rows.length > 0) {
      await db.query(
        'UPDATE profiles SET first_name = $1, last_name = $2, phone = $3, bio = $4 WHERE user_id = $5',
        [firstName, lastName, phone, bio, id]
      );
    } else {
      await db.query(
        'INSERT INTO profiles (user_id, first_name, last_name, phone, bio) VALUES ($1, $2, $3, $4, $5)',
        [id, firstName, lastName, phone, bio]
      );
    }

    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error actualizando usuario' });
  }
};

/**
 * Delete user and all relations
 */
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // Foreign keys should handle cascade if configured, but let's be safe
    await db.query('DELETE FROM profiles WHERE user_id = $1', [id]);
    await db.query('DELETE FROM team_players WHERE player_id = $1', [id]);
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error eliminando usuario' });
  }
};
