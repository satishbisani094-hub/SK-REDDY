const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { prisma } = require('../config/db');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretadventurekey12345', {
    expiresIn: '30d',
  });
};

const ADMIN_PHONES = ['8520016332', '9000012345', '7989245079'];

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  const { phone } = req.body;

  try {
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const cleanPhone = phone.replace(/\D/g, '');
    const normalizedPhone = cleanPhone.length > 10 && cleanPhone.startsWith('91') 
      ? cleanPhone.slice(-10) 
      : cleanPhone;

    if (!ADMIN_PHONES.includes(normalizedPhone)) {
      return res.status(401).json({ message: 'This mobile number is not authorized for Admin access' });
    }

    // Get or create the admin account with a fixed ID
    let admin = await prisma.admin.findUnique({
      where: { username: normalizedPhone }
    });

    if (!admin) {
      admin = await prisma.admin.create({
        data: {
          id: "6a38e9f3ca8f37ad00a223aa", // Maintain database consistency
          username: normalizedPhone,
          password: 'otp-authenticated-account'
        }
      });
    }

    res.json({
      _id: admin.id,
      username: admin.username,
      token: generateToken(admin.id),
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
    const defaultPhone = '8520016332';
    
    const count = await prisma.admin.count();
    if (count === 0) {
      await prisma.admin.create({
        data: {
          id: "6a38e9f3ca8f37ad00a223aa",
          username: defaultPhone,
          password: 'otp-authenticated-account'
        }
      });
      console.log(`Default admin account seeded successfully. (Phone: ${defaultPhone})`);
    } else {
      const firstAdmin = await prisma.admin.findFirst();
      if (firstAdmin && !ADMIN_PHONES.includes(firstAdmin.username)) {
        await prisma.admin.update({
          where: { id: firstAdmin.id },
          data: {
            username: defaultPhone,
            password: 'otp-authenticated-account'
          }
        });
        console.log(`Admin account credentials updated to match phone-based auth. (Phone: ${defaultPhone})`);
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
