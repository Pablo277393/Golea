const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

router.get('/', authenticateToken, teamController.getTeams);
router.get('/:id', authenticateToken, teamController.getTeamById);
router.get('/:id/players', authenticateToken, teamController.getTeamPlayers);

router.post('/', authenticateToken, authorizeRoles('superadmin'), teamController.createTeam);
router.put('/:id', authenticateToken, authorizeRoles('superadmin'), teamController.updateTeam);
router.delete('/:id', authenticateToken, authorizeRoles('superadmin'), teamController.deleteTeam);
router.post('/:id/players', authenticateToken, authorizeRoles('superadmin', 'coach'), teamController.addPlayerToTeam);
router.delete('/:id/players/:playerId', authenticateToken, authorizeRoles('superadmin', 'coach'), teamController.removePlayerFromTeam);

module.exports = router;
