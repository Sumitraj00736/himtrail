const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Not authorized' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'Admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  return next();
};

module.exports = { protect, adminOnly };
