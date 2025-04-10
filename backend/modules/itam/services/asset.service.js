// backend/modules/itam/services/asset.service.js

const Asset = require('../models/asset.model');

// For now, we'll use an in-memory array to store assets.
// In a real application, this would interact with a database.
const assets = [];
let nextAssetId = 1;

class AssetService {
    createAsset(name, assetTag, category, status, acquisitionDate) {
        const newAsset = new Asset(nextAssetId++, name, assetTag, category, status, acquisitionDate);
        assets.push(newAsset);
        return newAsset;
    }

    getAssetById(id) {
        return assets.find(asset => asset.id === parseInt(id));
    }

    getAllAssets() {
        return assets;
    }

    // We'll add methods for updating, deleting, etc., later.
}

module.exports = new AssetService();