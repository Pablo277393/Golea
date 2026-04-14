const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

router.get('/', authenticateToken, teamController.getTeams);
router.get('/:id', authenticateToken, teamController.getTeamById);
router.post('/', authenticateToken, authorizeRoles('superadmin'), teamController.createTeam);

module.exports = router;
