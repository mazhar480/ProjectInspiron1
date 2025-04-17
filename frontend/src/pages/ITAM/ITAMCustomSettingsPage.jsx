import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Card, CardContent, Button,
  Box, Tabs, Tab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert'; // Import Alert for Snackbar severity
import SettingsList from '../../components/itam/SettingsList'; // Corrected import path

function ITAMCustomSettingsPage() {
  const API_BASE_URL = '/api'; // Replace with your backend API base URL
  const [tabValue, setTabValue] = useState(0);
  const [customAssetTypes, setCustomAssetTypes] = useState([]);
  const [customAssetStatuses, setCustomAssetStatuses] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', 'warning', 'info'
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchCustomSettings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/itam/settings/custom`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        setCustomAssetTypes(response.data.assetTypes || []);
        setCustomAssetStatuses(response.data.assetStatuses || []);
      }
    } catch (error) {
      console.error('Error fetching custom settings:', error);
      showSnackbar(error.response?.data?.message || 'Error fetching settings', 'error');
    }
  };

  const saveCustomSettings = async (newSettings) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/itam/settings/custom`,
        newSettings,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        showSnackbar('Custom settings saved successfully', 'success');
      }
    } catch (error) {
        console.error('Error saving custom settings:', error);
        const errorMessage = error.response?.data?.message || 'Error saving settings';
        showSnackbar(errorMessage, 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (user.role !== 'admin') {
      navigate('/itam/dashboard');
      // Show a message or redirect immediately
      showSnackbar('Access denied. Admin privileges required.', 'error');
    }
  }, [user.role, navigate]);

  useEffect(() => {
    if (user.role === 'admin') { // Only fetch if admin
        fetchCustomSettings();
    }
  }, [user.role]); // Re-fetch if role changes (unlikely but good practice)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // --- Asset Type Handlers ---
  const handleAddAssetType = (newType) => {
      // Optional: Add validation to prevent duplicates client-side
      if (customAssetTypes.includes(newType)) {
          showSnackbar(`Asset type "${newType}" already exists.`, 'warning');
          return;
      }
      setCustomAssetTypes([...customAssetTypes, newType]);
  };

  const handleUpdateAssetType = (oldType, newType) => {
     // Optional: Add validation to prevent duplicates client-side
     if (oldType !== newType && customAssetTypes.includes(newType)) {
          showSnackbar(`Asset type "${newType}" already exists.`, 'warning');
          return;
      }
    const updatedTypes = customAssetTypes.map(t => (t === oldType ? newType : t));
    setCustomAssetTypes(updatedTypes);
  };

  const handleDeleteAssetType = (typeToDelete) => {
    setCustomAssetTypes(customAssetTypes.filter(t => t !== typeToDelete));
  };

  // --- Asset Status Handlers ---
  const handleAddAssetStatus = (newStatus) => {
      if (customAssetStatuses.includes(newStatus)) {
          showSnackbar(`Asset status "${newStatus}" already exists.`, 'warning');
          return;
      }
      setCustomAssetStatuses([...customAssetStatuses, newStatus]);
  };

  const handleUpdateAssetStatus = (oldStatus, newStatus) => {
      if (oldStatus !== newStatus && customAssetStatuses.includes(newStatus)) {
          showSnackbar(`Asset status "${newStatus}" already exists.`, 'warning');
          return;
      }
      const updatedStatuses = customAssetStatuses.map(s => (s === oldStatus ? newStatus : s));
      setCustomAssetStatuses(updatedStatuses);
  };

  const handleDeleteAssetStatus = (statusToDelete) => {
    setCustomAssetStatuses(customAssetStatuses.filter(s => s !== statusToDelete));
  };

  // --- Save Handler ---
  const handleSave = () => {
    saveCustomSettings({
      assetTypes: customAssetTypes,
      assetStatuses: customAssetStatuses,
    });
  };


  // Render nothing or a loading indicator if not admin
  if (user.role !== 'admin') {
      return null; // Or a loading spinner, or an access denied message
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        ITAM Custom Settings
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary" sx={{ mb: 3 }}>
        <Tab label="Asset Types" />
        <Tab label="Asset Statuses" />
      </Tabs>

      <Card>
        <CardContent>
            {tabValue === 0 && (
                <SettingsList
                    title="Custom Asset Types"
                    items={customAssetTypes}
                    onAdd={handleAddAssetType}
                    onUpdate={handleUpdateAssetType}
                    onDelete={handleDeleteAssetType}
                    itemName="Asset Type"
                />
            )}
            {tabValue === 1 && (
                <SettingsList
                    title="Custom Asset Statuses"
                    items={customAssetStatuses}
                    onAdd={handleAddAssetStatus}
                    onUpdate={handleUpdateAssetStatus}
                    onDelete={handleDeleteAssetStatus}
                    itemName="Asset Status"
                />
            )}
        </CardContent>
      </Card>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ mt: 3 }}
        // Disable save if there are no changes (more complex logic needed for perfect check)
        // disabled={!hasChanges} // Placeholder for potential future enhancement
      >
        Save Changes
      </Button>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Position Snackbar
      >
        {/* Use Alert component inside Snackbar for severity styling */}
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Container>
  );
}

export default ITAMCustomSettingsPage;