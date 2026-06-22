const jwt = require('jsonwebtoken');
const { readData } = require('../config/jsonDb');

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

      // Get admin from the local JSON file database
      const admins = readData('admins');
      const admin = admins.find(u => u._id === decoded.id);

      if (!admin) {
        return res.status(401).json({ message: 'Not authorized, admin user not found' });
      }

      // Exclude password and append to request
      const { password, ...adminWithoutPassword } = admin;
      req.admin = adminWithoutPassword;

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
