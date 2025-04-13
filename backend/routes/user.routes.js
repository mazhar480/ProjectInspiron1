// routes/user.routes.js

const express = require('express');
const router = express.Router();
const userController = require('../core/user/user.controller');
const cors = require('cors');

// Define routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
// Add more routes as needed
router.options('/register', cors());
router.post('/register', cors(), userController.registerUser);

module.exports = router;
