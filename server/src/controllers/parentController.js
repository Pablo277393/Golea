const db = require('../config/db');

/**
 * Get players associated with the parent
 */
exports.getPlayers = async (req, res) => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now - startOfYear) / 86400000;
  const currentWeek = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  const currentYear = now.getFullYear();

  try {
    const result = await db.query(
      `SELECT u.id, u.username, p.first_name, p.last_name, u.linking_code,
              EXISTS (
                SELECT 1 FROM weekly_mvps mvp 
                WHERE mvp.player_id = u.id AND mvp.week_number = $2 AND mvp.year = $3
              ) as is_mvp
       FROM users u
       JOIN parent_player pp ON u.id = pp.player_id
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE pp.parent_id = $1`,
      [req.user.id, currentWeek, currentYear]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching associated players:', err);
    res.status(500).json({ message: 'Error al obtener los jugadores asociados' });
  }
};

/**
 * Link a player using a linking code
 */
exports.linkPlayer = async (req, res) => {
  const { linkingCode } = req.body;

  if (!linkingCode) {
    return res.status(400).json({ message: 'El código de vinculación es obligatorio' });
  }

  try {
    // 1. Find player by code
    const playerResult = await db.query(
      "SELECT id, username FROM users WHERE linking_code = $1 AND role = 'player'",
      [linkingCode]
    );

    if (playerResult.rows.length === 0) {
      return res.status(404).json({ message: 'Código inválido. No se encontró ningún jugador con ese código.' });
    }

    const playerId = playerResult.rows[0].id;

    // 2. Check if already linked
    const existingLink = await db.query(
      'SELECT id FROM parent_player WHERE parent_id = $1 AND player_id = $2',
      [req.user.id, playerId]
    );

    if (existingLink.rows.length > 0) {
      return res.status(400).json({ message: 'Este jugador ya está asociado a tu cuenta.' });
    }

    // 3. Create relation
    await db.query(
      'INSERT INTO parent_player (parent_id, player_id) VALUES ($1, $2)',
      [req.user.id, playerId]
    );

    res.status(201).json({
      message: 'Jugador asociado correctamente',
      player: playerResult.rows[0]
    });
  } catch (err) {
    console.error('Error linking player:', err);
    res.status(500).json({ message: 'Error al asociar el jugador' });
  }
};

/**
 * Get aggregated notifications for all linked players
 */
exports.getNotifications = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT n.*, NULL as player_username, NULL as player_first_name
       FROM notifications n
       WHERE n.scope = 'global' OR (n.target_roles IS NOT NULL AND n.target_roles LIKE '%parent%')
       
       UNION
       
       SELECT n.*, u.username as player_username, p.first_name as player_first_name
       FROM notifications n
       JOIN parent_player pp ON pp.parent_id = $1
       JOIN users u ON u.id = pp.player_id
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE n.recipient_id = pp.player_id 
          OR n.team_id IN (SELECT team_id FROM team_players WHERE player_id = pp.player_id)
       
       ORDER BY created_at DESC
       LIMIT 30`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching aggregated notifications:', err);
    res.status(500).json({ message: 'Error al obtener las notificaciones de los jugadores' });
  }
};

/**
 * Get aggregated upcoming matches for all linked players
 */
exports.getMatches = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT DISTINCT m.*, t.name as team_name, u.username as player_username, p.first_name as player_first_name
       FROM matches m
       JOIN teams t ON m.team_id = t.id
       JOIN team_players tp ON t.id = tp.team_id
       JOIN parent_player pp ON tp.player_id = pp.player_id
       JOIN users u ON u.id = pp.player_id
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE pp.parent_id = $1
         AND m.published = 1
       ORDER BY m.match_date DESC, m.match_time DESC
       LIMIT 10`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching aggregated matches:', err);
    res.status(500).json({ message: 'Error al obtener los partidos de los jugadores' });
  }
};

/**
 * Get aggregated upcoming matches for all linked players (Future dates only)
 */
exports.getUpcomingMatches = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT DISTINCT m.*, t.name as team_name, u.username as player_username, p.first_name as player_first_name
       FROM matches m
       JOIN teams t ON m.team_id = t.id
       JOIN team_players tp ON t.id = tp.team_id
       JOIN parent_player pp ON tp.player_id = pp.player_id
       JOIN users u ON u.id = pp.player_id
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE pp.parent_id = $1
         AND m.published = 1
         AND m.match_date >= date('now')
       ORDER BY m.match_date ASC, m.match_time ASC
       LIMIT 5`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching upcoming parent matches:', err);
    res.status(500).json({ message: 'Error al obtener los próximos partidos de los jugadores' });
  }
};
