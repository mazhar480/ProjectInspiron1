// backend/modules/itam/controllers/asset.controller.js

const assetService = require('../services/asset.service');

class AssetController {
    async createAsset(req, res) {
        const { name, assetTag, category, status, acquisitionDate } = req.body;
        try {
            const newAsset = await assetService.createAsset(name, assetTag, category, status, acquisitionDate);
            res.status(201).json(newAsset);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAssetById(req, res) {
        const assetId = req.params.id;
        try {
            const asset = await assetService.getAssetById(assetId);
            if (asset) {
                res.json(asset);
            } else {
                res.status(404).json({ message: 'Asset not found.' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error fetching asset.' });
        }
    }

    async getAllAssets(req, res) {
        try {
            const assets = await assetService.getAllAssets();
            res.json(assets);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching all assets.' });
        }
    }

    async updateAsset(req, res) {
        const assetId = req.params.id;
        const { name, assetTag, category, status, acquisitionDate } = req.body;
        try {
            const updatedAsset = await assetService.updateAsset(assetId, name, assetTag, category, status, acquisitionDate);
            if (updatedAsset) {
                res.json(updatedAsset);
            } else {
                res.status(404).json({ message: 'Asset not found.' });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteAsset(req, res) {
        const assetId = req.params.id;
        try {
            const isDeleted = await assetService.deleteAsset(assetId);
            if (isDeleted) {
                res.status(204).send(); // 204 No Content for successful deletion
            } else {
                res.status(404).json({ message: 'Asset not found.' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting asset.' });
        }
    }
}

module.exports = new AssetController();