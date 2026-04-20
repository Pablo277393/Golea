const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const adController = require('../controllers/adController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type. Only JPEG, PNG and WEBP are allowed.'));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// PUBLIC ENDPOINTS
router.get('/', adController.getRandomAd);
router.post('/:id/click', adController.trackClick);
router.post('/:id/impression', adController.trackImpression);

// ADMIN ENDPOINTS (Superadmin Only)
router.get('/all', authenticateToken, authorizeRoles('superadmin'), adController.getAllAds);
router.post('/', authenticateToken, authorizeRoles('superadmin'), upload.single('image'), adController.createAd);
router.put('/:id', authenticateToken, authorizeRoles('superadmin'), upload.single('image'), adController.updateAd);
router.delete('/:id', authenticateToken, authorizeRoles('superadmin'), adController.deleteAd);

module.exports = router;
