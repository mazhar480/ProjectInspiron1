// backend/modules/itam/controllers/asset.controller.js

const assetService = require('../services/asset.service');
const pool = require('../../../core/database/db');

class AssetController {
  async createAsset(req, res) {
    try {
      
      const {
        assetId, name, assetType, manufacturer, model, serialNumber,
        status, location, owner, department, purchaseDate,
        warrantyInformation, configurationDetails, relatedAssets,
        assetTag, category, acquisitionDate, make, assignedUser,
        ipAddress, operatingSystem, processor, ramGb, storageType, storageCapacityGb,
        purchasePrice, warrantyStartDate, warrantyEndDate, project, projectLocation,
        disposalMethod, retirementDate, notes,
      } = req.body;

      const newAsset = await assetService.createAsset(
        assetId, name, assetType, manufacturer, model, serialNumber,
        status, location, owner, department, purchaseDate,
        warrantyInformation, configurationDetails, relatedAssets,
        assetTag, category, acquisitionDate, make, assignedUser, ipAddress,
        operatingSystem, processor, ramGb, storageType, storageCapacityGb, purchasePrice,
        warrantyStartDate, warrantyEndDate, project, projectLocation, disposalMethod, retirementDate, notes
      );

      res.status(201).json(newAsset);
    } catch (error) {
      console.error('Error creating asset:', error);
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
      console.error('Error fetching asset by ID:', error);
      res.status(500).json({ message: 'Error fetching asset.' });
    }
  }

  async getAllAssets(req, res) {
    try {
      const assets = await assetService.getAllAssets();
      res.json(assets);
    } catch (error) {
      console.error('Error fetching all assets:', error);
      res.status(500).json({ message: 'Error fetching all assets.' });
    }
  }

  async updateAsset(req, res) {
    const assetId = req.params.id;
    const {
      name, assetType, manufacturer, model, serialNumber, status,
      location, owner, department, purchaseDate, warrantyInformation,
      configurationDetails, relatedAssets,assetTag, category, acquisitionDate,
      make, assignedUser, ipAddress, operatingSystem, processor, ramGb,
      storageType, storageCapacityGb, purchasePrice, warrantyStartDate,
      warrantyEndDate, project, projectLocation, disposalMethod, retirementDate, notes,
    } = req.body;

    try {
      const updatedAsset = await assetService.updateAsset(
        assetId,
        name, assetType, manufacturer, model, serialNumber,
        status, location, owner, department, purchaseDate,
        warrantyInformation, configurationDetails, relatedAssets,
        assetTag, category, acquisitionDate, make, assignedUser,
        ipAddress, operatingSystem, processor, ramGb, storageType,
        storageCapacityGb, purchasePrice, warrantyStartDate,
        warrantyEndDate, project, projectLocation, disposalMethod, retirementDate, notes,
      );

      if (updatedAsset) {
        res.json(updatedAsset);
      } else {
        res.status(404).json({ message: 'Asset not found.' });
      }
    } catch (error) {
      console.error('Error updating asset:', error);
      res.status(400).json({ message: error.message });
    }
  }

  async deleteAsset(req, res) {
    const assetId = req.params.id;
    try {
      const isDeleted = await assetService.deleteAsset(assetId);
      if (isDeleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Asset not found.' });
      }
    } catch (error) {
      console.error('Error deleting asset:', error);
      res.status(500).json({ message: 'Error deleting asset.' });
    }
  }

  async getAssetLogs(req, res) {
    const assetId = req.params.id;
    try {
      const [logs] = await pool.execute(
        'SELECT * FROM asset_logs WHERE asset_id = ? ORDER BY timestamp DESC',
        [assetId]
      );

      const parsedLogs = logs.map(log => {
        let parsedChanges;
        try {
          parsedChanges = JSON.parse(log.changes);
        } catch (e) {
          parsedChanges = log.changes;
        }
        return {
          ...log,
          changes: parsedChanges,
        };
      });

      res.json(parsedLogs);
    } catch (error) {
      console.error('Error fetching asset logs:', error);
      res.status(500).json({ message: 'Failed to fetch asset logs' });
    }
  }
}

module.exports = new AssetController();
