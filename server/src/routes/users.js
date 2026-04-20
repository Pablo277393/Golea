const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// Get current user profile
router.get('/me', authenticateToken, (req, res) => {
  res.json(req.user);
});

// Get users by role (admin only)
router.get('/', authenticateToken, authorizeRoles('admin', 'superadmin'), userController.getUsersByRole);

// Create detailed user (superadmin only)
router.post('/', authenticateToken, authorizeRoles('superadmin'), userController.createUser);

// Update user details (superadmin or specific admin)
router.put('/:id', authenticateToken, authorizeRoles('superadmin', 'admin'), userController.updateUser);

// Delete user entirely (superadmin only)
router.delete('/:id', authenticateToken, authorizeRoles('superadmin'), userController.deleteUser);

module.exports = router;
