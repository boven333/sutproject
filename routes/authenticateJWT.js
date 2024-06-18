const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('./auth'); // Assuming you put your middleware in a file named 'auth.js'

router.get('/protected-route', authenticateJWT, (req, res) => {
  // Only accessible if token is valid
  res.json({ message: 'This is a protected route.' });
});

module.exports = router;
