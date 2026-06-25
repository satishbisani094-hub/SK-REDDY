const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get admin from MongoDB or local JSON database
      let admin;
      if (global.isMongoConnected) {
        admin = await Admin.findById(decoded.id).select('-password');
      } else {
        const { readData } = require('../config/jsonDb');
        const admins = readData('admins');
        const found = admins.find(a => a._id === decoded.id);
        if (found) {
          const { password, ...adminWithoutPassword } = found;
          admin = adminWithoutPassword;
        }
      }

      if (!admin) {
        return res.status(401).json({ message: 'Not authorized, admin user not found' });
      }

      req.admin = admin;

      next();
    } catch (error) {
      console.error('JWT Verification Error:', error);
      return res.status(401).json({ message: 'Not authorized, token verification failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protectAdmin };
