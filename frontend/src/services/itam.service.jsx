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
        try {
            const response = await axios.post(API_BASE_URL, assetData);
            return response.data;
        } catch (error) {
            console.error('Error creating asset:', error);
            throw error;
        }
    },

    updateAsset: async (id, assetData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/${id}`, assetData);
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