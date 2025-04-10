// backend/modules/itam/models/asset.model.js

class Asset {
    constructor(id, name, assetTag, category, status, acquisitionDate) {
        this.id = id;
        this.name = name;
        this.assetTag = assetTag;
        this.category = category;
        this.status = status;
        this.acquisitionDate = acquisitionDate;
        // We can add more properties later (e.g., purchase cost, assigned user, location, etc.)
    }
}

module.exports = Asset;