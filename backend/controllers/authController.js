const jwt = require('jsonwebtoken');
const { readData, writeData, generateId } = require('../config/jsonDb');

// Helper to normalize phone numbers (e.g. clean spaces/formatting, prepend +91 for 10-digit Indian numbers)
const normalizePhoneNumber = (phone) => {
  if (!phone) return '';
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.length === 10 && /^\d+$/.test(cleaned)) {
    return `+91${cleaned}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned}`;
  }
  return cleaned;
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Generate and "send" OTP to phone
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  const normalizedPhone = normalizePhoneNumber(phoneNumber);

  try {
    const admins = readData('admins');
    const admin = admins.find(a => normalizePhoneNumber(a.phoneNumber) === normalizedPhone);

    if (!admin) {
      return res.status(404).json({ message: 'Phone number is not registered as Admin' });
    }

    // Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5-minute expiry

    // Save the OTP details to the JSON database
    admin.otp = otp;
    admin.otpExpiresAt = otpExpiresAt;
    writeData('admins', admins);

    // MOCK SMS: Output OTP to console log for copy-pasting
    console.log(`\n===================================`);
    console.log(`[SMS SEND MOCK] OTP for admin: ${otp}`);
    console.log(`===================================\n`);

    res.json({ message: 'OTP sent successfully to your mobile number' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Verify OTP & sign token
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required' });
  }

  const normalizedPhone = normalizePhoneNumber(phoneNumber);

  try {
    const admins = readData('admins');
    const admin = admins.find(a => normalizePhoneNumber(a.phoneNumber) === normalizedPhone);

    if (!admin || !admin.otp) {
      return res.status(400).json({ message: 'Invalid request or OTP not generated' });
    }

    // Check expiry
    if (new Date() > new Date(admin.otpExpiresAt)) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one' });
    }

    // Check match
    if (admin.otp !== otp) {
      return res.status(400).json({ message: 'Incorrect OTP code' });
    }

    // Clear OTP on successful login
    admin.otp = null;
    admin.otpExpiresAt = null;
    writeData('admins', admins);

    res.json({
      _id: admin._id,
      phoneNumber: admin.phoneNumber,
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get logged in admin data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.json(req.admin);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Seed default admin account
const seedAdmin = async () => {
  try {
    // Falls back to a mock default phone number if not defined in .env
    const rawPhoneNumber = process.env.ADMIN_PHONE || '+919999999999';
    const phoneNumber = normalizePhoneNumber(rawPhoneNumber);

    const admins = readData('admins');

    if (admins.length === 0) {
      const newAdmin = {
        _id: generateId(),
        phoneNumber,
        createdAt: new Date().toISOString()
      };
      admins.push(newAdmin);
      writeData('admins', admins);
      console.log(`Default admin account seeded successfully. (Phone: ${phoneNumber})`);
    } else {
      admins[0].phoneNumber = phoneNumber;
      writeData('admins', admins);
      console.log(`Admin account credentials updated to match env files. (Phone: ${phoneNumber})`);
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  getMe,
  seedAdmin
};
