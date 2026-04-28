const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config();

const dbPath = path.resolve(__dirname, '../bd/test');
const db = new sqlite3.Database(dbPath);

async function addTeams() {
  console.log('Adding 6 teams and coaches...');

  const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });

  const get = (sql, params = []) => new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('1234', salt);

    const categories = ['Cadete A', 'Cadete B', 'Infantil A', 'Infantil B', 'Alevín A', 'Alevín B'];
    const teamNames = ['Rayo Golea', 'Golea United', 'Real Golea', 'Sporting Golea', 'Golea City', 'Atlético Golea'];

    for (let i = 0; i < 6; i++) {
      const username = `coach_team_${i + 1}`;
      const email = `coach${i + 1}@golea.com`;
      const firstName = `Entrenador`;
      const lastName = `Equipo ${i + 1}`;

      console.log(`Creating coach: ${username}...`);
      
      // Insert User
      await run(
        'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?) ON CONFLICT(email) DO UPDATE SET password_hash=excluded.password_hash',
        [username, email, passwordHash, 'coach']
      );

      const user = await get('SELECT id FROM users WHERE email = ?', [email]);

      // Insert Profile
      await run(
        'INSERT INTO profiles (user_id, first_name, last_name, phone, bio) VALUES (?, ?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET first_name=excluded.first_name, last_name=excluded.last_name',
        [user.id, firstName, lastName, `60000001${i}`, `Entrenador del equipo ${teamNames[i]}`]
      );

      // Insert Team (Manual check for existence since there's no UNIQUE constraint)
      console.log(`Checking/Creating team: ${teamNames[i]} (${categories[i]})...`);
      const existingTeam = await get('SELECT id FROM teams WHERE name = ?', [teamNames[i]]);
      if (existingTeam) {
          await run('UPDATE teams SET coach_id = ?, category = ? WHERE id = ?', [user.id, categories[i], existingTeam.id]);
      } else {
          await run('INSERT INTO teams (name, category, coach_id) VALUES (?, ?, ?)', [teamNames[i], categories[i], user.id]);
      }
    }

    console.log('Success: 6 teams and coaches added.');
  } catch (err) {
    console.error('Error adding teams:', err);
  } finally {
    db.close();
  }
}

addTeams();
