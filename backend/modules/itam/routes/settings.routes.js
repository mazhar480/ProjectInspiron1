const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const authenticateToken = require('../../../middleware/authMiddleware');
const { isAdmin } = require('../../../middleware/roleMiddleware'); // Assuming you have role middleware

// --- Custom Dropdowns (already exists) ---
router.get('/custom', authenticateToken, settingsController.getCustomSettings);
router.post('/custom', authenticateToken, isAdmin, settingsController.updateCustomSettings);

// --- Asset Form Field Configuration ---
router.get(
    '/form-config',
    authenticateToken,
    settingsController.getFormConfig // Add isAdmin if only admins can view
);
router.post(
    '/form-config',
    authenticateToken,
    isAdmin, // Ensure only admins can update
    settingsController.saveFormConfig
);

// --- Lifecycle Status Configuration ---
router.get(
    '/lifecycle-statuses',
    authenticateToken,
    settingsController.getLifecycleStatuses // Add isAdmin if only admins can view
);
router.post(
    '/lifecycle-statuses',
    authenticateToken,
    isAdmin, // Ensure only admins can update
    settingsController.saveLifecycleStatuses
);

// --- General Dropdown Value Configuration (e.g., locations, departments) ---
router.get(
    '/dropdown-config',
    authenticateToken,
    settingsController.getDropdownConfig // Add isAdmin if only admins can view
);
router.post(
    '/dropdown-config',
    authenticateToken,
    isAdmin, // Ensure only admins can update
    settingsController.saveDropdownConfig
);

// --- (Optional) Check if Value is in Use --- 
// Example for lifecycle status - implement similar for others if needed
router.get(
    '/lifecycle-statuses/:statusId/in-use',
    authenticateToken,
    isAdmin,
    settingsController.checkLifecycleStatusInUse
);

// Add routes for checking dropdowns in use as needed

module.exports = router;