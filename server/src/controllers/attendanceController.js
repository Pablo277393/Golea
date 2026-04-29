const db = require('../config/db');

// Get all attendance data for a team (Coach view)
exports.getTeamAttendance = async (req, res) => {
  const { team_id } = req.params;
  try {
    // 1. Get all players in the team
    const playersRes = await db.query(
      `SELECT u.id, u.username, p.first_name, p.last_name, tp.jersey_number 
       FROM team_players tp 
       JOIN users u ON tp.player_id = u.id 
       LEFT JOIN profiles p ON u.id = p.user_id 
       WHERE tp.team_id = $1 
       ORDER BY tp.jersey_number ASC`,
      [team_id]
    );

    // 2. Get all trainings for the team
    const trainingsRes = await db.query(
      `SELECT id, training_date, training_time, location 
       FROM trainings 
       WHERE team_id = $1 
       ORDER BY training_date DESC`,
      [team_id]
    );

    // 3. Get all attendance records for this team's trainings
    const attendanceRes = await db.query(
      `SELECT ta.* 
       FROM training_attendance ta 
       JOIN trainings tr ON ta.training_id = tr.id 
       WHERE tr.team_id = $1`,
      [team_id]
    );

    res.json({
      players: playersRes.rows,
      trainings: trainingsRes.rows,
      attendance: attendanceRes.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching team attendance' });
  }
};

// Get personal attendance for a player (Player/Parent view)
exports.getPlayerAttendance = async (req, res) => {
  const { player_id } = req.params;
  try {
    // Get all trainings for the teams the player is in
    const trainingsRes = await db.query(
      `SELECT tr.id, tr.training_date, tr.training_time, tr.location, t.name as team_name,
              ta.status, ta.is_golden_cone
       FROM trainings tr
       JOIN teams t ON tr.team_id = t.id
       JOIN team_players tp ON t.id = tp.team_id
       LEFT JOIN training_attendance ta ON tr.id = ta.training_id AND ta.player_id = $1
       WHERE tp.player_id = $1
       ORDER BY tr.training_date DESC`,
      [player_id]
    );

    res.json(trainingsRes.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching player attendance' });
  }
};

// Bulk update attendance for a training session
exports.updateAttendance = async (req, res) => {
  const { training_id } = req.params;
  const { attendanceData } = req.body; // Array of { player_id, status, is_golden_cone }

  if (!Array.isArray(attendanceData)) {
    return res.status(400).json({ message: 'Invalid attendance data format' });
  }

  try {
    // We do it without explicit transaction to avoid "database locked" in some environments
    for (const record of attendanceData) {
      const { player_id, status, is_golden_cone } = record;
      
      const tId = parseInt(training_id);
      const pId = parseInt(player_id);

      if (isNaN(tId) || isNaN(pId)) continue;

      await db.query(
        `INSERT INTO training_attendance (training_id, player_id, status, is_golden_cone)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT(training_id, player_id) 
         DO UPDATE SET status = $3, is_golden_cone = $4`,
        [tId, pId, status || 'present', is_golden_cone || 0]
      );
    }

    res.json({ message: 'Asistencia actualizada correctamente' });
  } catch (err) {
    console.error('Bulk update error:', err);
    res.status(500).json({ 
      message: 'Error al procesar la lista de asistencia', 
      error: err.message 
    });
  }
};

// Create a quick training session for today
exports.createQuickSession = async (req, res) => {
  const { team_id } = req.body;
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toTimeString().split(' ')[0].substring(0, 5);

  try {
    const result = await db.query(
      `INSERT INTO trainings (team_id, training_date, training_time, location)
       VALUES ($1, $2, $3, $4)`,
      [team_id, today, now, 'Campo Principal']
    );

    const newId = result.lastID;
    const fetchNew = await db.query(
      'SELECT id, training_date, training_time, location FROM trainings WHERE id = $1',
      [newId]
    );

    res.status(201).json(fetchNew.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear sesión rápida' });
  }
};

// Toggle single attendance (for convenience in the Excel view)
exports.toggleAttendance = async (req, res) => {
    const { training_id, player_id } = req.params;
    const { status, is_golden_cone } = req.body;

    // Map undefined to null for SQL CASE logic
    const safeStatus = status !== undefined ? status : null;
    const safeGolden = is_golden_cone !== undefined ? is_golden_cone : null;

    try {
        await db.query(
            `INSERT INTO training_attendance (training_id, player_id, status, is_golden_cone)
             VALUES ($1, $2, COALESCE($3, 'present'), COALESCE($4, 0))
             ON CONFLICT(training_id, player_id) 
             DO UPDATE SET 
                status = CASE WHEN $3 IS NOT NULL THEN $3 ELSE status END,
                is_golden_cone = CASE WHEN $4 IS NOT NULL THEN $4 ELSE is_golden_cone END`,
            [training_id, player_id, safeStatus, safeGolden]
        );
        res.json({ message: 'Registro actualizado' });
    } catch (err) {
        console.error('Error in toggleAttendance:', err);
        res.status(500).json({ message: 'Error al actualizar registro', error: err.message });
    }
};
