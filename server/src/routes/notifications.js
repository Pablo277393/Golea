const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

router.get('/', authenticateToken, notificationController.getNotifications);
router.post('/', authenticateToken, authorizeRoles('coach', 'admin'), notificationController.sendNotification);
router.patch('/:id/read', authenticateToken, notificationController.markAsRead);

module.exports = router;
