const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// Coach/Admin routes
router.get('/team/:team_id', authenticateToken, attendanceController.getTeamAttendance);
router.post('/session', authenticateToken, authorizeRoles('coach', 'admin', 'superadmin'), attendanceController.createQuickSession);
router.post('/training/:training_id', authenticateToken, authorizeRoles('coach', 'admin', 'superadmin'), attendanceController.updateAttendance);
router.post('/training/:training_id/player/:player_id', authenticateToken, authorizeRoles('coach', 'admin', 'superadmin'), attendanceController.toggleAttendance);

// Player/Parent routes
router.get('/player/:player_id', authenticateToken, attendanceController.getPlayerAttendance);

module.exports = router;
