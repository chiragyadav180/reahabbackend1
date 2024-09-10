const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const requireAuth = async (req, res, next) => {
  // Check for authorization header
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  // Extract token from header
  const token = authorization.split(' ')[1];

  try {
    // Verify token and extract user ID
    const decoded = jwt.verify(token, process.env.SECRET);
    const { _id } = decoded;

    if (!_id) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Retrieve user from database
    const user = await User.findOne({ _id }).select('_id');
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authorization error:', error.message);
    res.status(401).json({ error: 'Request is not authorized' });
  }
};

module.exports = requireAuth;
