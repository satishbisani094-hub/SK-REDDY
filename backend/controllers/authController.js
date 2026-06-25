const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { prisma } = require('../config/db');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretadventurekey12345', {
    expiresIn: '30d',
  });
};

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const trimmedUsername = username ? username.trim() : '';
    const trimmedPassword = password ? password.trim() : '';

    const admins = await prisma.admin.findMany();
    const admin = admins.find(a => a.username && a.username.toLowerCase() === trimmedUsername.toLowerCase());

    let isMatch = false;
    if (admin) {
      isMatch = await bcrypt.compare(trimmedPassword, admin.password);
    }

    if (admin && isMatch) {
      res.json({
        _id: admin.id,
        username: admin.username,
        token: generateToken(admin.id),
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
    const username = (process.env.ADMIN_USERNAME || 'skreddy').trim();
    const password = (process.env.ADMIN_PASSWORD || 'skreddy#1234').trim();
    
    const count = await prisma.admin.count();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (count === 0) {
      // Create new admin with fixed ID matching local JSON DB
      await prisma.admin.create({
        data: {
          id: "6a38e9f3ca8f37ad00a223aa",
          username,
          password: hashedPassword
        }
      });
      console.log(`Default admin account seeded successfully. (Username: ${username})`);
    } else {
      const firstAdmin = await prisma.admin.findFirst();
      if (firstAdmin) {
        await prisma.admin.update({
          where: { id: firstAdmin.id },
          data: {
            username,
            password: hashedPassword
          }
        });
        console.log(`Admin account credentials updated to match env files. (Username: ${username})`);
      }
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
