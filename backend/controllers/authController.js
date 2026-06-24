const jwt = require('jsonwebtoken');
const { readData, writeData, generateId } = require('../config/jsonDb');
const supabase = require('../config/supabase');

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

// @desc    Send OTP to phone using Supabase
// @route   POST /api/auth/send-otp
const sendOTP = async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }
  const normalizedPhone = normalizePhoneNumber(phoneNumber);
  try {
    // 1. Verify this phone is allowed to log in as an Admin locally
    const admins = readData('admins');
    const admin = admins.find(a => normalizePhoneNumber(a.phoneNumber) === normalizedPhone);
    if (!admin) {
      return res.status(404).json({ message: 'Phone number is not registered as Admin' });
    }
    // 2. Request Supabase to send a SMS OTP
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: normalizedPhone,
    });
    if (error) {
      return res.status(400).json({ message: 'Supabase Error: ' + error.message });
    }
    res.json({ message: 'OTP sent successfully to your mobile number' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Verify OTP with Supabase & authenticate
// @route   POST /api/auth/verify-otp
const verifyOTP = async (req, res) => {
  const { phoneNumber, otp } = req.body;
  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required' });
  }
  const normalizedPhone = normalizePhoneNumber(phoneNumber);
  try {
    // 1. Find local admin profile
    const admins = readData('admins');
    const admin = admins.find(a => normalizePhoneNumber(a.phoneNumber) === normalizedPhone);
    if (!admin) {
      return res.status(400).json({ message: 'Invalid request' });
    }
    // 2. Validate OTP using Supabase
    const { data, error } = await supabase.auth.verifyOtp({
      phone: normalizedPhone,
      token: otp,
      type: 'sms',
    });
    if (error) {
      return res.status(400).json({ message: 'Incorrect or expired OTP code' });
    }
    // 3. Use the access token provided in `data.session.access_token`
    const token = data.session.access_token;
    res.json({
      _id: admin._id,
      phoneNumber: admin.phoneNumber,
      token: token,
      supabaseUser: data.user // Useful if you want profile metadata
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
