const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config();

const dbPath = path.resolve(__dirname, '../bd/test');
const db = new sqlite3.Database(dbPath);

async function seed() {
  console.log('Starting seed process for SQLite...');

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
    const hashes = {
      super: await bcrypt.hash('super123admin', salt),
      coach: await bcrypt.hash('coach123', salt),
      player: await bcrypt.hash('jugador123', salt),
      parent: await bcrypt.hash('padre123', salt),
      admin: await bcrypt.hash('admin123', salt)
    };

    // 1. Seed Users
    const users = [
      ['superadmin', 'superadmin@gmail.com', hashes.super, 'superadmin'],
      ['coach', 'coach@gmail.com', hashes.coach, 'coach'],
      ['jugador', 'jugador@gmail.com', hashes.player, 'player'],
      ['padre', 'padre@gmail.com', hashes.parent, 'parent'],
      ['admin', 'admin@gmail.com', hashes.admin, 'admin']
    ];

    console.log('Seeding users...');
    for (const [username, email, pass, role] of users) {
       await run(
         'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?) ON CONFLICT(email) DO UPDATE SET password_hash=excluded.password_hash, role=excluded.role',
         [username, email, pass, role]
       );
    }

    // Get IDs for relation seeding
    const superadmin = await get('SELECT id FROM users WHERE email = ?', ['superadmin@gmail.com']);
    const coach = await get('SELECT id FROM users WHERE email = ?', ['coach@gmail.com']);
    const player = await get('SELECT id FROM users WHERE email = ?', ['jugador@gmail.com']);
    const parent = await get('SELECT id FROM users WHERE email = ?', ['padre@gmail.com']);

    // 2. Seed Profiles
    console.log('Seeding profiles...');
    const profiles = [
      [superadmin.id, 'Golea', 'Superadmin', '600000001', 'Administrador principal del sistema'],
      [coach.id, 'Golea', 'Coach', '600000002', 'Entrenador del primer equipo'],
      [player.id, 'Golea', 'Jugador', '600000003', 'Jugador delantero'],
      [parent.id, 'Golea', 'Padre', '600000004', 'Padre del jugador']
    ];

    for (const [uid, fn, ln, ph, bio] of profiles) {
      await run(
        'INSERT INTO profiles (user_id, first_name, last_name, phone, bio) VALUES (?, ?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET first_name=excluded.first_name, last_name=excluded.last_name',
        [uid, fn, ln, ph, bio]
      );
    }

    // 3. Seed Family Relations (Parent -> Child)
    console.log('Seeding family relations...');
    await run('INSERT INTO family_relations (parent_id, child_id) VALUES (?, ?) ON CONFLICT DO NOTHING', [parent.id, player.id]);

    // 4. Seed Teams
    console.log('Seeding teams...');
    const teams = [
      ['Primer Equipo', 'Senior', coach.id],
      ['Juvenil A', 'Juvenil', coach.id]
    ];

    for (const [name, cat, cid] of teams) {
      await run('INSERT INTO teams (name, category, coach_id) VALUES (?, ?, ?) ON CONFLICT DO NOTHING', [name, cat, cid]);
    }

    const primerEquipo = await get('SELECT id FROM teams WHERE name = ?', ['Primer Equipo']);
    const juvenilA = await get('SELECT id FROM teams WHERE name = ?', ['Juvenil A']);

    // 5. Seed Team Players
    console.log('Seeding team players...');
    await run('INSERT INTO team_players (team_id, player_id, jersey_number, position) VALUES (?, ?, ?, ?) ON CONFLICT DO NOTHING', [primerEquipo.id, player.id, 10, 'Delantero']);

    // 6. Seed Matches
    console.log('Seeding matches...');
    const matches = [
      [primerEquipo.id, 'Galaxy United', '2026-04-18', '10:30', '09:30', 'Estadio Local', 1]
    ];
    for (const [tid, opp, d, t, dt, loc, home] of matches) {
      await run(
        'INSERT INTO matches (team_id, opponent, match_date, match_time, departure_time, location, is_home) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [tid, opp, d, t, dt, loc, home]
      );
    }

    // 7. Seed Trainings
    console.log('Seeding trainings...');
    const trainings = [
      [primerEquipo.id, '2026-04-15', '18:00', 'Campo 1', 'Entrenamiento Táctico - Salida de balón'],
      [juvenilA.id, '2026-04-16', '17:30', 'Gimnasio', 'Físico - Trabajo preventivo']
    ];
    for (const [tid, d, t, loc, desc] of trainings) {
      await run(
        'INSERT INTO trainings (team_id, training_date, training_time, location, description) VALUES (?, ?, ?, ?, ?)',
        [tid, d, t, loc, desc]
      );
    }

    // 8. Seed Notifications
    console.log('Seeding notifications...');
    await run(
      'INSERT INTO notifications (sender_id, recipient_id, team_id, scope, type, title, message) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [coach.id, player.id, primerEquipo.id, 'individual', 'informative', 'Bienvenido', 'Hola! Bienvenido al sistema de Golea. Estamos listos para empezar la temporada.']
    );

    console.log('SQLite Seed completed successfully.');
  } catch (err) {
    console.error('Error seeding SQLite database:', err);
  } finally {
    db.close();
  }
}

seed();
