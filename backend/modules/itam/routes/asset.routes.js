// backend/modules/itam/routes/asset.routes.js

const express = require('express');
const assetController = require('../controllers/asset.controller');
const router = express.Router();
const authenticateToken = require('../../../middleware/authMiddleware'); // Assuming auth is needed for asset management

// Define routes for assets
router.post('/assets', authenticateToken, assetController.createAsset);
router.get('/assets/:id', authenticateToken, assetController.getAssetById);
router.get('/assets', authenticateToken, assetController.getAllAssets);

module.exports = router;