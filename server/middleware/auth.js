const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const authHeader = req.header('Authorization');
  let token;
  
  if (authHeader) {
    // Handle both "Bearer token" and just "token" formats
    token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;
  }

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');

    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired, please login again' });
    }
    
    res.status(401).json({ message: 'Invalid authentication token' });
  }
}; 