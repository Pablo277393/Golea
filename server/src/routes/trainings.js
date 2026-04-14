const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/trainingController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

router.get('/', authenticateToken, trainingController.getTrainings);
router.post('/', authenticateToken, authorizeRoles('coach', 'superadmin'), trainingController.createTraining);

// Call-ups
router.get('/callups/:event_type/:event_id', authenticateToken, trainingController.getCallups);
router.post('/callups/:event_type/:event_id', authenticateToken, authorizeRoles('coach', 'superadmin'), trainingController.updateCallups);

module.exports = router;
