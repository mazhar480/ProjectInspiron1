// backend/modules/itam/models/asset.model.js

class Asset {
    constructor(id, name, assetTag, category, status, acquisitionDate,
                make, model, serialNumber, location, assignedUser, department,
                ipAddress, operatingSystem, processor, ramGb, storageType, storageCapacityGb,
                purchasePrice, warrantyStartDate, warrantyEndDate, assetType, project, projectLocation,
                disposalMethod, retirementDate, notes) {
        this.id = id;
        this.name = name;
        this.assetTag = assetTag;
        this.category = category;
        this.status = status;
        this.acquisitionDate = acquisitionDate;
        this.make = make;
        this.model = model;
        this.serialNumber = serialNumber;
        this.location = location;
        this.assignedUser = assignedUser;
        this.department = department;
        this.ipAddress = ipAddress;
        this.operatingSystem = operatingSystem;
        this.processor = processor;
        this.ramGb = ramGb;
        this.storageType = storageType;
        this.storageCapacityGb = storageCapacityGb;
        this.purchasePrice = purchasePrice;
        this.warrantyStartDate = warrantyStartDate;
        this.warrantyEndDate = warrantyEndDate;
        this.assetType = assetType; // e.g., "Laptop", "Desktop", "Server"
        this.project = project;
        this.projectLocation = projectLocation;
        this.disposalMethod = disposalMethod;
        this.retirementDate = retirementDate;
        this.notes = notes;
    }
}

module.exports = Asset;