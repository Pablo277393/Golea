process.on('exit', (code) => console.log('process.exit called with code:', code));
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const teamRoutes = require('./routes/teams');
const matchRoutes = require('./routes/matches');
const trainingRoutes = require('./routes/trainings');
const notificationRoutes = require('./routes/notifications');
const gamificationRoutes = require('./routes/gamification');
const familyRoutes = require('./routes/family');
const parentRoutes = require('./routes/parent');
const playerRoutes = require('./routes/player');
const adRoutes = require('./routes/ads');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/player', playerRoutes);
app.use('/api/ads', adRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Golea API is running' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
setInterval(() => {}, 100000);
