const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        username: admin.username,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get logged in admin data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // req.admin is already loaded in protectAdmin middleware
    res.json(req.admin);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Seed default admin account
const seedAdmin = async () => {
  try {
    const username = process.env.ADMIN_USERNAME || 'skreddy';
    const password = process.env.ADMIN_PASSWORD || 'skreddy#1234';
    
    const count = await Admin.countDocuments();
    
    if (count === 0) {
      // Create new admin (Admin.js pre-save hook will hash password automatically)
      await Admin.create({
        username,
        password
      });
      console.log(`Default admin account seeded successfully. (Username: ${username})`);
    } else {
      // Update existing first admin's credentials to match latest env settings
      const firstAdmin = await Admin.findOne();
      firstAdmin.username = username;
      firstAdmin.password = password; // triggers pre-save hook for password hash updating
      await firstAdmin.save();
      console.log(`Admin account credentials updated to match env files. (Username: ${username})`);
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

module.exports = {
  loginAdmin,
  getMe,
  seedAdmin
};
