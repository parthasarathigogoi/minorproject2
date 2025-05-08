const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate all users
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');
    
    // Find user
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid authentication token' });
  }
};

// Middleware to authenticate teachers only
const teacherAuthMiddleware = async (req, res, next) => {
  try {
    // First run the standard auth middleware
    await authMiddleware(req, res, () => {
      // Check if user is a teacher
      if (req.user.role !== 'teacher') {
        return res.status(403).json({ message: 'Access denied: Teachers only' });
      }
      
      next();
    });
  } catch (error) {
    console.error('Teacher auth middleware error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// Middleware to authenticate admins only
const adminAuthMiddleware = async (req, res, next) => {
  try {
    // First run the standard auth middleware
    await authMiddleware(req, res, () => {
      // Check if user is an admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
      }
      
      next();
    });
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = {
  authMiddleware,
  teacherAuthMiddleware,
  adminAuthMiddleware
}; 