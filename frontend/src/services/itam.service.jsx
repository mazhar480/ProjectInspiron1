// Frontend/src/services/itam.service.js

import axios from 'axios';

const API_BASE_URL = '/api/assets'; //  Adjust if your backend route is different

const itamService = {
    getAllAssets: async () => {
        try {
            const response = await axios.get(API_BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching assets:', error);
            throw error;
        }
    },

    getAssetLogs: async (id) => {
        const response = await axios.get(`/api/assets/${id}/logs`);
        return response.data;
      },
      

    getAssetById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching asset with id ${id}:`, error);
            throw error;
        }
    },
    
    createAsset: async (assetData) => {
        // Map frontend form data to backend asset data structure
        const backendAssetData = {
          name: assetData.name,
          assetTag: assetData.assetTag,
          category: assetData.category,
          status: assetData.status,
          acquisitionDate: assetData.acquisitionDate,
          assetType: assetData.assetType,
          manufacturer: assetData.manufacturer,
          owner: assetData.owner,
          warrantyInformation: assetData.warrantyInformation,
          configurationDetails: assetData.configurationDetails,
          relatedAssets: assetData.relatedAssets,
          make: assetData.make || null,
          model: assetData.model || null,
          serialNumber: assetData.serialNumber || null,
          location: assetData.location || null,
          assignedUser: assetData.assignedUser || null,
          department: assetData.department || null,
          ipAddress: assetData.ipAddress || null,
          operatingSystem: assetData.operatingSystem || null,
          processor: assetData.processor || null,
          ramGb: assetData.ramGb || null,
          storageType: assetData.storageType || null,
          storageCapacityGb: assetData.storageCapacityGb || null,
          purchasePrice: assetData.purchasePrice || null,
          warrantyStartDate: assetData.warrantyStartDate || null,
          warrantyEndDate: assetData.warrantyEndDate || null,
          project: assetData.project || null,
          projectLocation: assetData.projectLocation || null,
          disposalMethod: assetData.disposalMethod || null,
          retirementDate: assetData.retirementDate || null,
          notes: assetData.notes || null,
        };
      console.log('backendAssetData:', backendAssetData);
        try {
            const response = await axios.post(API_BASE_URL, backendAssetData);
            return response.data;
        } catch (error) {
            console.error('Error creating asset:', error);
            throw error;
        }
    },
    
    updateAsset: async (id, assetData) => {
        const backendAssetData = {
            ...assetData,
            manufacturer: assetData.manufacturer,
            owner: assetData.owner,
            warrantyInformation: assetData.warrantyInformation,
            configurationDetails: assetData.configurationDetails,
            relatedAssets: assetData.relatedAssets,
        };
      
      
    console.log('updateAsset - backendAssetData:', backendAssetData);


        try {
            const response = await axios.put(`${API_BASE_URL}/${id}`, backendAssetData);
            return response.data;
        } catch (error) {
            console.error(`Error updating asset with id ${id}:`, error);
            throw error;
        }
    },

    deleteAsset: async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/${id}`);
        } catch (error) {
            console.error(`Error deleting asset with id ${id}:`, error);
            throw error;
        }
    }
};
    
export default itamService;