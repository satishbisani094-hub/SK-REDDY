const express = require('express');
const router = express.Router();
const { loginAdmin, getMe } = require('../controllers/authController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/login', loginAdmin);
router.get('/me', protectAdmin, getMe);
router.get('/status', (req, res) => {
  res.json({ isMongoConnected: !!global.isMongoConnected });
});

module.exports = router;
