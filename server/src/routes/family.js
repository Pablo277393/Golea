const express = require('express');
const router = express.Router();
const familyController = require('../controllers/familyController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

router.get('/children', authenticateToken, authorizeRoles('parent', 'admin', 'superadmin'), familyController.getChildren);
router.post('/add-child', authenticateToken, authorizeRoles('parent', 'admin', 'superadmin'), familyController.addChild);

module.exports = router;
