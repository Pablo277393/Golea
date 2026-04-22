const db = require('../config/db');

exports.getTeams = async (req, res) => {
  const managedOnly = req.query.managedOnly === 'true';
  try {
    let sql;
    let params;
    
    if (managedOnly && req.user.role === 'coach') {
      sql = `
        SELECT t.*, p.first_name || ' ' || p.last_name as coach_name 
        FROM teams t
        LEFT JOIN users u ON t.coach_id = u.id
        LEFT JOIN profiles p ON u.id = p.user_id
        WHERE t.coach_id = $1
        ORDER BY t.name
      `;
      params = [req.user.id];
    } else {
      sql = `
        SELECT t.*, p.first_name || ' ' || p.last_name as coach_name 
        FROM teams t
        LEFT JOIN users u ON t.coach_id = u.id
        LEFT JOIN profiles p ON u.id = p.user_id
        WHERE 
          ($1 IN ('admin', 'superadmin'))
          OR (t.id = 1)
          OR ($1 = 'coach' AND t.coach_id = $2)
          OR ($1 = 'player' AND EXISTS (
              SELECT 1 FROM team_players tp WHERE tp.team_id = t.id AND tp.player_id = $2
          ))
          OR ($1 = 'parent' AND EXISTS (
              SELECT 1 FROM family_relations fr 
              JOIN team_players tp ON fr.child_id = tp.player_id 
              WHERE fr.parent_id = $2 AND tp.team_id = t.id
          ))
        ORDER BY t.name
      `;
      params = [req.user.role, req.user.id];
    }

    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching teams:', err);
    res.status(500).json({ message: 'Error fetching teams' });
  }
};

exports.getTeamPlayers = async (req, res) => {
  const { id } = req.params;
  try {
    const sql = `
      SELECT p.*, tp.jersey_number, tp.position, prof.first_name, prof.last_name, 
             prof.first_name || ' ' || prof.last_name as full_name
      FROM team_players tp
      JOIN users p ON tp.player_id = p.id
      JOIN profiles prof ON p.id = prof.user_id
      WHERE tp.team_id = $1
    `;
    const result = await db.query(sql, [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching team players' });
  }
};

exports.createTeam = async (req, res) => {
  const { name, category, coach_id } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO teams (name, category, coach_id) VALUES ($1, $2, $3)',
      [name, category, coach_id]
    );
    
    // SQLite compatibility: use lastID if RETURNING not available
    const newTeamId = result.lastID || (result.rows && result.rows[0]?.id);
    const fetchNew = await db.query('SELECT * FROM teams WHERE id = $1', [newTeamId]);
    
    res.status(201).json(fetchNew.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating team' });
  }
};

exports.addPlayerToTeam = async (req, res) => {
  const { id } = req.params; // team_id
  const { player_id, jersey_number, position } = req.body;
  try {
    // Check if player already in team
    const exist = await db.query('SELECT * FROM team_players WHERE team_id = $1 AND player_id = $2', [id, player_id]);
    if (exist.rows.length > 0) {
      return res.status(400).json({ message: 'Player already in this team' });
    }

    await db.query(
      'INSERT INTO team_players (team_id, player_id, jersey_number, position) VALUES ($1, $2, $3, $4)',
      [id, player_id, jersey_number, position]
    );
    res.status(201).json({ message: 'Player added to team successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding player to team' });
  }
};

exports.removePlayerFromTeam = async (req, res) => {
  const { id, playerId } = req.params;
  try {
    await db.query('DELETE FROM team_players WHERE team_id = $1 AND player_id = $2', [id, playerId]);
    res.json({ message: 'Jugador quitado del equipo correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error quitando jugador del equipo' });
  }
};

exports.updateTeam = async (req, res) => {
  const { id } = req.params;
  const { name, category, coach_id } = req.body;
  try {
    await db.query(
      'UPDATE teams SET name = $1, category = $2, coach_id = $3 WHERE id = $4',
      [name, category, coach_id, id]
    );
    res.json({ message: 'Equipo actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error actualizando equipo' });
  }
};

exports.deleteTeam = async (req, res) => {
  const { id } = req.params;
  try {
    // Manual cleanup of relations to ensure integrity
    await db.query('DELETE FROM team_players WHERE team_id = $1', [id]);
    await db.query('DELETE FROM matches WHERE team_id = $1', [id]);
    await db.query('DELETE FROM trainings WHERE team_id = $1', [id]);
    await db.query('DELETE FROM notifications WHERE team_id = $1', [id]);
    
    // Finally delete the team
    const result = await db.query('DELETE FROM teams WHERE id = $1', [id]);
    
    res.json({ message: 'Equipo eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error eliminando equipo' });
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
