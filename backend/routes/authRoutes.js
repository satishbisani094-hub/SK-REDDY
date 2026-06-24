const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, getMe } = require('../controllers/authController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.get('/me', protectAdmin, getMe);

module.exports = router;
