const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/userController');

router.post('/register', registerUser);

module.exports = router;
// Compare this snippet from backend/src/app.js: