// backend/modules/itam/services/asset.service.js

const pool = require('../../../database/db'); // Import the database connection pool
const Asset = require('../models/asset.model');

class AssetService {
    async createAsset(name, assetTag, category, status, acquisitionDate) {
        if (!name || !assetTag || !category || !status || !acquisitionDate) {
            throw new Error('Missing required asset fields.');
        }

        const [existingAsset] = await pool.execute('SELECT * FROM assets WHERE assetTag = ?', [assetTag]);
        if (existingAsset.length > 0) {
            throw new Error('Asset tag already exists.');
        }

        const [result] = await pool.execute('INSERT INTO assets (name, assetTag, category, status, acquisitionDate) VALUES (?, ?, ?, ?, ?)', [name, assetTag, category, status, acquisitionDate]);
        const assetId = result.insertId;

        const [newAsset] = await pool.execute('SELECT * FROM assets WHERE id = ?', [assetId]);
        return newAsset[0];
    }

    async getAssetById(id) {
        const [rows] = await pool.execute('SELECT * FROM assets WHERE id = ?', [id]);
        return rows[0];
    }

    async getAllAssets() {
        const [rows] = await pool.execute('SELECT * FROM assets');
        return rows;
    }

    async updateAsset(id, name, assetTag, category, status, acquisitionDate) {
        if (!name || !assetTag || !category || !status || !acquisitionDate) {
            throw new Error('Missing required asset fields for update.');
        }

        const [existingAsset] = await pool.execute('SELECT * FROM assets WHERE assetTag = ? AND id != ?', [assetTag, id]);
        if (existingAsset.length > 0) {
            throw new Error('Asset tag already exists for another asset.');
        }

        const [result] = await pool.execute('UPDATE assets SET name = ?, assetTag = ?, category = ?, status = ?, acquisitionDate = ? WHERE id = ?', [name, assetTag, category, status, acquisitionDate, id]);

        if (result.affectedRows > 0) {
            const [updatedAsset] = await pool.execute('SELECT * FROM assets WHERE id = ?', [id]);
            return updatedAsset[0];
        } else {
            return null; // Asset not found or no changes made
        }
    }

    async deleteAsset(id) {
        const [result] = await pool.execute('DELETE FROM assets WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new AssetService();