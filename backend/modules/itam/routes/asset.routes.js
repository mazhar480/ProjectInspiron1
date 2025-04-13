const express = require('express');
const router = express.Router();
const assetController = require('../controllers/asset.controller');
const authenticateToken = require('../../../middleware/authMiddleware'); // or destructured if applicable

router.get('/:id/logs', assetController.getAssetLogs);
// ✅ Use methods as bound instance functions
router.get('/',/* authenticateToken, */assetController.getAllAssets);
router.get('/:id', /*authenticateToken,*/ assetController.getAssetById);
router.post('/', /*authenticateToken,*/ assetController.createAsset);
router.put('/:id', /*authenticateToken,*/ assetController.updateAsset);
router.delete('/:id', /*authenticateToken,*/ assetController.deleteAsset);



module.exports = router;
