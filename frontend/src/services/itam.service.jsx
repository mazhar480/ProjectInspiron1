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
        ...assetData,
        assetId: assetData.assetId, 
        assetType: assetData.assetType,
        manufacturer: assetData.manufacturer,
        owner: assetData.owner,
        warrantyInformation: assetData.warrantyInformation,
        configurationDetails: assetData.configurationDetails,
        relatedAssets: assetData.relatedAssets,
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
      const backendAssetData = {...assetData, assetId: assetData.assetId,assetType: assetData.assetType,manufacturer: assetData.manufacturer,owner: assetData.owner,warrantyInformation: assetData.warrantyInformation,configurationDetails: assetData.configurationDetails,relatedAssets: assetData.relatedAssets};
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