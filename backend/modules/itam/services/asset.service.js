const pool = require('../../../core/database/db');

class AssetService {
  async createAsset(
    name, assetTag, category, status, acquisitionDate, make, model,
    serialNumber, location, assignedUser, department, ipAddress,
    operatingSystem, processor, ramGb, storageType, storageCapacityGb,
    purchasePrice, warrantyStartDate, warrantyEndDate, assetType, project,
    projectLocation, disposalMethod, retirementDate, notes,
    configurationDetails, relatedAssets, owner, manufacturer
  ) {
    if (!name || !assetTag || !category || !status || !acquisitionDate || !assetType) {
      throw new Error('Missing required asset fields.');
    }

    const [existingAsset] = await pool.execute('SELECT * FROM assets WHERE assetTag = ?', [assetTag]);
    if (existingAsset.length > 0) {
      throw new Error('Asset tag already exists.');
    }

    const [result] = await pool.execute(`
      INSERT INTO assets (
        name, assetTag, category, status, acquisitionDate, make, model,
        serial_number, location, assigned_user, department,
        ip_address, operating_system, processor, ram_gb, storage_type,
        storage_capacity_gb, purchase_price, warranty_start_date,
        warranty_end_date, asset_type, project, project_location,
        disposal_method, retirement_date, notes
        , configuration_details, related_assets, owner, manufacturer
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name ?? null, assetTag ?? null, category ?? null, status ?? null, acquisitionDate ?? null,
      make ?? null, model ?? null, serialNumber ?? null, location ?? null, assignedUser ?? null, department ?? null,
      ipAddress ?? null, operatingSystem ?? null, processor ?? null, ramGb ?? null, storageType ?? null, storageCapacityGb ?? null,
      purchasePrice ?? null, warrantyStartDate ?? null, warrantyEndDate ?? null, assetType ?? null, project ?? null, projectLocation ?? null,
      disposalMethod ?? null, retirementDate ?? null, notes ?? null
    ]);
    configurationDetails?? null, relatedAssets?? null, owner ?? null, manufacturer ?? null
    
    const assetId = result.insertId;
    const [newAsset] = await pool.execute('SELECT * FROM assets WHERE id = ?', [assetId]);

    // Log creation
    await pool.execute(`
      INSERT INTO asset_logs (asset_id, action_type, changed_by, changes)
      VALUES (?, 'CREATE', ?, ?)
    `, [assetId, 'system', JSON.stringify(newAsset[0])]);

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

  async updateAsset(
    id, name, assetTag, category, status, acquisitionDate, make, model,
    serialNumber, location, assignedUser, department, ipAddress,
    operatingSystem, processor, ramGb, storageType, storageCapacityGb,
    purchasePrice, warrantyStartDate, warrantyEndDate, assetType, project,
    projectLocation, disposalMethod, retirementDate, notes,
     configurationDetails, relatedAssets, owner, manufacturer
  ) {
    if (!name || !assetTag || !category || !status || !acquisitionDate || !assetType) {
      throw new Error('Missing required asset fields for update.');
    }

    const [existingAsset] = await pool.execute('SELECT * FROM assets WHERE assetTag = ? AND id != ?', [assetTag, id]);
    if (existingAsset.length > 0) {
      throw new Error('Asset tag already exists for another asset.');
    }
    const updateFields = {
      configuration_details: configurationDetails,
      related_assets: relatedAssets,
      owner: owner,
      manufacturer: manufacturer,
    }

    const [result] = await pool.execute(`
      UPDATE assets SET
        name = ?, assetTag = ?, category = ?, status = ?, acquisitionDate = ?,
        make = ?, model = ?, serial_number = ?, location = ?, assigned_user = ?, department = ?,
        ip_address = ?, operating_system = ?, processor = ?, ram_gb = ?, storage_type = ?, storage_capacity_gb = ?,
        purchase_price = ?, warranty_start_date = ?, warranty_end_date = ?, asset_type = ?, project = ?, project_location = ?,
        disposal_method = ?, retirement_date = ?, notes = ?, configuration_details = ?, related_assets = ?, owner = ?, manufacturer= ?
      WHERE id = ?
      `, [

      name ?? null, assetTag ?? null, category ?? null, status ?? null, acquisitionDate ?? null,
      make ?? null, model ?? null, serialNumber ?? null, location ?? null, assignedUser ?? null, department ?? null,
      ipAddress ?? null, operatingSystem ?? null, processor ?? null, ramGb ?? null, storageType ?? null, storageCapacityGb ?? null,
      purchasePrice ?? null, warrantyStartDate ?? null, warrantyEndDate ?? null, assetType ?? null, project ?? null, projectLocation ?? null,
      disposalMethod ?? null, retirementDate ?? null, notes ?? null, id
    ]);


    if (result.affectedRows > 0) {
      const [updatedAsset] = await pool.execute('SELECT * FROM assets WHERE id = ?', [id]);

      // Log update
      await pool.execute(`
        INSERT INTO asset_logs (asset_id, action_type, changed_by, changes)
        VALUES (?, 'UPDATE', ?, ?)
      `, [id, 'system', JSON.stringify(updatedAsset[0])]);

      return updatedAsset[0];
    } else {
      return null;
    }
  }

  async deleteAsset(id) {
    const [asset] = await pool.execute('SELECT * FROM assets WHERE id = ?', [id]);
    const [result] = await pool.execute('DELETE FROM assets WHERE id = ?', [id]);

    if (result.affectedRows > 0) {
      await pool.execute(`
        INSERT INTO asset_logs (asset_id, action_type, changed_by, changes)
        VALUES (?, 'DELETE', ?, ?)
      `, [id, 'system', JSON.stringify(asset[0])]);
      return true;
    } else {
      return false;
    }
  }
}

module.exports = new AssetService();
