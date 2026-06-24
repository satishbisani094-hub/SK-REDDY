const supabase = require('../config/supabase');
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

      // Verify token directly with Supabase
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return res.status(401).json({ message: 'Not authorized, token verification failed' });
      }

      // Find the local admin using the user's phone number
      const normalizedPhone = user.phone;
      const admins = readData('admins');
      
      const admin = admins.find(u => {
        const p1 = u.phoneNumber ? u.phoneNumber.replace(/[^\d+]/g, '') : '';
        const p2 = normalizedPhone ? normalizedPhone.replace(/[^\d+]/g, '') : '';
        return p1 === p2;
      });

      if (!admin) {
        return res.status(401).json({ message: 'Not authorized, admin user not found' });
      }

      // Exclude OTP sensitive info and append to request
      const { otp, otpExpiresAt, ...adminWithoutSecrets } = admin;
      req.admin = adminWithoutSecrets;

      next();
    } catch (error) {
      console.error('Supabase token verification error:', error);
      return res.status(401).json({ message: 'Not authorized, token verification failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protectAdmin };
