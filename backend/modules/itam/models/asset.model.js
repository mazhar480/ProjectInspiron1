// backend/modules/itam/models/asset.model.js

class Asset {
    constructor(assetId, assetName, assetType, manufacturer, model, serialNumber, status, location, owner, department, purchaseDate, warrantyInformation, configurationDetails, relatedAssets) {
        this.assetId = assetId; // Unique identifier
        this.assetName = assetName;
        this.assetType = assetType; // e.g., hardware, software
        this.manufacturer = manufacturer;
        this.model = model;
        this.serialNumber = serialNumber;
        this.status = status; // e.g., in use, available, retired
        this.location = location;
        this.owner = owner;
        this.department = department;
        this.purchaseDate = purchaseDate;
        this.warrantyInformation = warrantyInformation;
        this.configurationDetails = configurationDetails; // e.g., OS, software versions
        this.relatedAssets = relatedAssets; // e.g., connected peripherals
    }
}

module.exports = Asset;