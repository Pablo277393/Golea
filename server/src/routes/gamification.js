const express = require('express');
const router = express.Router();
const gamificationController = require('../controllers/gamificationController');
const { authenticateToken } = require('../middlewares/auth');

// Predictions
router.get('/predictions', authenticateToken, gamificationController.getPredictions);
router.get('/combo', authenticateToken, gamificationController.getQuinielaMatches);
router.post('/predictions', authenticateToken, gamificationController.submitPredictions);

// Prizes
router.get('/prizes/active', authenticateToken, gamificationController.getWeeklyPrize);

// MVP
router.get('/mvp/:team_id/:week_number/:year', authenticateToken, gamificationController.getWeeklyMVP);
router.get('/mvp/:team_id/history', authenticateToken, gamificationController.getTeamMVPHistory);
router.post('/mvp/select', authenticateToken, gamificationController.selectMVP);

module.exports = router;
