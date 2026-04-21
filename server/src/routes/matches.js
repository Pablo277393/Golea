const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

router.get('/', authenticateToken, matchController.getMatches);
router.post('/', authenticateToken, authorizeRoles('coach', 'superadmin', 'admin'), matchController.createMatch);
router.patch('/:id/publish', authenticateToken, authorizeRoles('coach', 'superadmin', 'admin'), matchController.publishMatch);
router.patch('/:id/score', authenticateToken, authorizeRoles('coach', 'superadmin', 'admin'), matchController.updateScore);
router.delete('/:id', authenticateToken, authorizeRoles('superadmin', 'admin'), matchController.deleteMatch);

module.exports = router;
