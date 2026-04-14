const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');

// Placeholder for user profile
router.get('/me', authenticateToken, (req, res) => {
  res.json(req.user);
});

module.exports = router;
