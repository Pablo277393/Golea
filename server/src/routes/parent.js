const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// All routes here are protected and exclusive to parents
router.use(authenticateToken);
router.use(authorizeRoles('parent', 'superadmin'));

router.get('/players', parentController.getPlayers);
router.post('/link-player', parentController.linkPlayer);
router.get('/notifications', parentController.getNotifications);
router.get('/matches', parentController.getMatches);
router.get('/calendar/matches', parentController.getMatches);
router.get('/upcoming-matches', parentController.getUpcomingMatches);

module.exports = router;
