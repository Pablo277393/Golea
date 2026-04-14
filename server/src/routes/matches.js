const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

router.get('/', authenticateToken, matchController.getMatches);
router.post('/', authenticateToken, authorizeRoles('coach', 'superadmin'), matchController.createMatch);
router.patch('/:id/score', authenticateToken, authorizeRoles('coach', 'superadmin'), matchController.updateScore);

module.exports = router;
