const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const authenticateToken = require('../../../middleware/authMiddleware');

// Fetch custom settings
router.get('/custom', authenticateToken, settingsController.getCustomSettings);

// Update custom settings
router.post('/custom', authenticateToken, settingsController.updateCustomSettings);

module.exports = router;