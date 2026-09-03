const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'airbnb_jwt_secret_key_2026_super_secure';

const verifyHost = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Host authentication token is missing or invalid.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.hostUser = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token. Please log in again.'
    });
  }
};

module.exports = {
  verifyHost,
  JWT_SECRET
};
