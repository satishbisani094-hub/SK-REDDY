const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');

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
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretadventurekey12345');

      // Get admin from database using Prisma
      const admin = await prisma.admin.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          username: true,
          createdAt: true,
          updatedAt: true
        }
      });

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
