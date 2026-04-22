const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// All routes here are protected and exclusive to players
router.use(authenticateToken);
router.use(authorizeRoles('player', 'superadmin'));

router.post('/generate-linking-code', playerController.generateLinkingCode);

module.exports = router;
