const { Client } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function seed() {
  try {
    await client.connect();
    console.log('Connected to DB for seeding...');

    const salt = await bcrypt.genSalt(10);
    const superPass = await bcrypt.hash('super123admin', salt);
    const jugPass = await bcrypt.hash('jugador123', salt);
    const padPass = await bcrypt.hash('padre123', salt);
    const coachPass = await bcrypt.hash('coach123', salt);
    const adminPass = await bcrypt.hash('admin123', salt);

    // Initial users
    const users = [
      ['superadmin', 'superadmin@gmail.com', superPass, 'superadmin'],
      ['jugador', 'jugador@gmail.com', jugPass, 'player'],
      ['padre', 'padre@gmail.com', padPass, 'parent'],
      ['coach', 'coach@gmail.com', coachPass, 'coach'],
      ['admin', 'admin@gmail.com', adminPass, 'admin']
    ];

    for (const [username, email, pass, role] of users) {
      await client.query(
        'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO UPDATE SET password_hash = $3, role = $4',
        [username, email, pass, role]
      );
      console.log(`User ${username} seeded/updated.`);
    }

    console.log('Seed completed successfully.');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await client.end();
  }
}

seed();
