const express = require('express');
const router = express.Router();
const { loginAdmin, getMe } = require('../controllers/authController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/login', loginAdmin);
router.get('/me', protectAdmin, getMe);
router.get('/status', (req, res) => {
  const dbUrl = process.env.DATABASE_URL || '';
  let provider = 'unknown';
  if (dbUrl.startsWith('file:') || dbUrl.includes('.db')) {
    provider = 'sqlite';
  } else if (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://')) {
    provider = 'postgresql';
  }
  
  res.json({
    isDbConnected: !!global.isDbConnected,
    isMongoConnected: !!global.isDbConnected, // Kept for backward compatibility
    provider
  });
});

module.exports = router;
