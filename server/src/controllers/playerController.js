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
