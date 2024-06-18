const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

// Middleware to verify JWT token
const authenticateJWT = expressJwt({
  secret: 'authentication',  // replace with your own secret key
  algorithms: ['HS256']
});

module.exports = {
  authenticateJWT
};
