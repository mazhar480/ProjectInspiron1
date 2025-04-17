import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Button,
  Box, TextField, Tabs, Tab, List, ListItem, ListItemText,
  IconButton, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

import EditIcon from '@mui/icons-material/Edit';

function ITAMCustomSettingsPage() {
  const [tabValue, setTabValue] = useState(0);
  const [customAssetTypes, setCustomAssetTypes] = useState([]);
  const [customAssetStatuses, setCustomAssetStatuses] = useState([]);
  const [newAssetType, setNewAssetType] = useState('');
  const [newAssetStatus, setNewAssetStatus] = useState('');
  const [editingAssetType, setEditingAssetType] = useState(null);
  const [editingAssetStatus, setEditingAssetStatus] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  // Placeholder for fetching custom settings from the backend
  const fetchCustomSettings = () => {
    // In a real app, this would make an API call
    return Promise.resolve({
      assetTypes: ['Custom Laptop', 'Custom Server'],
      assetStatuses: ['In Stock', 'Awaiting Approval'],
    });
  };

  // Placeholder for saving custom settings to the backend
  const saveCustomSettings = (newSettings) => {
    // In a real app, this would make an API call
    console.log("Saving custom settings:", newSettings);
    // For now, we'll just update the local state
    setCustomAssetTypes(newSettings.assetTypes);
    setCustomAssetStatuses(newSettings.assetStatuses);
  };

  useEffect(() => {
    if (user.role !== 'admin') {
      navigate('/itam/dashboard');
    }
  }, [user.role, navigate]);


  useEffect(() => {
    fetchCustomSettings().then(data => {
      setCustomAssetTypes(data.assetTypes);
      setCustomAssetStatuses(data.assetStatuses);
    });
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddAssetType = () => {
    if (newAssetType.trim()) {
      const updatedTypes = [...customAssetTypes, newAssetType];
      setCustomAssetTypes(updatedTypes);
      setNewAssetType('');
    }
  };

  const handleEditAssetType = (type) => {
    setEditingAssetType(type);
    setNewAssetType(type);
  };

  const handleUpdateAssetType = () => {
    if (newAssetType.trim() && editingAssetType) {
      const updatedTypes = customAssetTypes.map(t => (t === editingAssetType ? newAssetType : t));
      setCustomAssetTypes(updatedTypes);
      setEditingAssetType(null);
      setNewAssetType('');
    }
  };

  const handleDeleteAssetType = (type) => {
    const updatedTypes = customAssetTypes.filter(t => t !== type);
    setCustomAssetTypes(updatedTypes);
  };

  const handleAddAssetStatus = () => {
    if (newAssetStatus.trim()) {
      const updatedStatuses = [...customAssetStatuses, newAssetStatus];
      setCustomAssetStatuses(updatedStatuses);
      setNewAssetStatus('');
    }
  };

  const handleEditAssetStatus = (status) => {
    setEditingAssetStatus(status);
    setNewAssetStatus(status);
  };

  const handleUpdateAssetStatus = () => {
    if (newAssetStatus.trim() && editingAssetStatus) {
      const updatedStatuses = customAssetStatuses.map(s => (s === editingAssetStatus ? newAssetStatus : s));
      setCustomAssetStatuses(updatedStatuses);
      setEditingAssetStatus(null);
      setNewAssetStatus('');
    }
  };

  const handleDeleteAssetStatus = (status) => {
    const updatedStatuses = customAssetStatuses.filter(s => s !== status);
    setCustomAssetStatuses(updatedStatuses);
  };

  const handleSave = () => {
    saveCustomSettings({
      assetTypes: customAssetTypes,
      assetStatuses: customAssetStatuses,
    });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        ITAM Custom Settings
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Asset Types" />
        <Tab label="Asset Statuses" />
      </Tabs>

      {tabValue === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Custom Asset Types
            </Typography>
            <List>
              {customAssetTypes.map((type, index) => (
                <ListItem
                  key={index}
                  secondaryAction=
                    <Box>
                      <IconButton edge="end" aria-label="edit" onClick={() => handleEditAssetType(type)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteAssetType(type)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  
                >
                  <ListItemText primary={type} />
                </ListItem>
              ))}
            </List>
            <TextField
              label={editingAssetType ? "Update Asset Type" : "New Asset Type"}
              value={newAssetType}
              onChange={(e) => setNewAssetType(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              onClick={editingAssetType ? handleUpdateAssetType : handleAddAssetType}
              disabled={!newAssetType.trim()}
              sx={{ mt: 2 }}
            >
              {editingAssetType ? "Update Asset Type" : "Add Asset Type"}
            </Button>
          </CardContent>
        </Card>
      )}

      {tabValue === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Custom Asset Statuses
            </Typography>
            <List>
              {customAssetStatuses.map((status, index) => (
                <ListItem
                  key={index}
                  secondaryAction=
                    <Box>
                      <IconButton edge="end" aria-label="edit" onClick={() => handleEditAssetStatus(status)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteAssetStatus(status)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  
                >
                  <ListItemText primary={status} />
                </ListItem>
              ))}
            </List>
            <TextField
              label={editingAssetStatus ? "Update Asset Status" : "New Asset Status"}
              value={newAssetStatus}
              onChange={(e) => setNewAssetStatus(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              onClick={editingAssetStatus ? handleUpdateAssetStatus : handleAddAssetStatus}
              disabled={!newAssetStatus.trim()}
              sx={{ mt: 2 }}
            >
              {editingAssetStatus ? "Update Asset Status" : "Add Asset Status"}
            </Button>
          </CardContent>
        </Card>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ mt: 3 }}
      >
        Save Changes
      </Button>
    </Container>
  );
}


export default ITAMCustomSettingsPage;