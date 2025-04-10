// backend/modules/itam/controllers/asset.controller.js

const assetService = require('../services/asset.service');

class AssetController {
    createAsset(req, res) {
        const { name, assetTag, category, status, acquisitionDate } = req.body;
        if (!name || !assetTag || !category || !status || !acquisitionDate) {
            return res.status(400).json({ message: 'Missing required asset fields.' });
        }
        const newAsset = assetService.createAsset(name, assetTag, category, status, acquisitionDate);
        res.status(201).json(newAsset);
    }

    getAssetById(req, res) {
        const assetId = req.params.id;
        const asset = assetService.getAssetById(assetId);
        if (asset) {
            res.json(asset);
        } else {
            res.status(404).json({ message: 'Asset not found.' });
        }
    }

    getAllAssets(req, res) {
        const assets = assetService.getAllAssets();
        res.json(assets);
    }
}

module.exports = new AssetController();