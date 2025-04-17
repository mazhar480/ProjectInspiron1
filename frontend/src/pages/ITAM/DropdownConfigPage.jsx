import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Card, CardContent, Button, Box, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, Tooltip, CircularProgress, Stack, Tabs, Tab, Divider
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
// import itamSettingsService from '../../services/itamSettings.service'; // Placeholder for API service

// --- Mock Data (Replace with API call) ---
// Structure: { categoryKey: { label: 'Display Label', items: [{id: '...', value: '...'}] } }
const initialDropdowns = {
  locations: {
    label: 'Locations',
    items: [
      { id: 'loc-1', value: 'Head Office - Floor 1' },
      { id: 'loc-2', value: 'Head Office - Floor 2' },
      { id: 'loc-3', value: 'Warehouse A' },
      { id: 'loc-4', value: 'Remote Office X' },
    ],
  },
  departments: {
    label: 'Departments',
    items: [
      { id: 'dept-1', value: 'IT' },
      { id: 'dept-2', value: 'Human Resources' },
      { id: 'dept-3', value: 'Finance' },
      { id: 'dept-4', value: 'Operations' },
    ],
  },
  customCategory1: {
      label: 'Supplier', // Example custom category
      items: [
          { id: 'cc1-1', value: 'Supplier A' },
          { id: 'cc1-2', value: 'Supplier B' },
      ]
  }
};
// --- End Mock Data ---

function DropdownConfigPage() {
  const [dropdowns, setDropdowns] = useState(initialDropdowns);
  const [selectedTab, setSelectedTab] = useState(Object.keys(initialDropdowns)[0] || ''); // Select first tab by default
  const [editingItem, setEditingItem] = useState(null); // { category: 'key', id: 'item-id', value: '...' }
  const [newItemValue, setNewItemValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dropdownCategories = Object.keys(dropdowns);

  // Placeholder for fetching config
  useEffect(() => {
    // setLoading(true);
    // itamSettingsService.getDropdownConfig()
    //   .then(data => {
    //     setDropdowns(data);
    //     if (Object.keys(data).length > 0) {
    //         setSelectedTab(Object.keys(data)[0]);
    //     }
    //     setLoading(false);
    //   })
    //   .catch(err => {
    //     setError('Failed to load dropdown configurations.');
    //     console.error(err);
    //     setLoading(false);
    //   });
     if (dropdownCategories.length > 0 && !selectedTab) {
        setSelectedTab(dropdownCategories[0]);
     }
  }, []); // Empty dependency array for initial load

  // Placeholder for saving config
  const handleSaveChanges = () => {
    // setLoading(true);
    // itamSettingsService.saveDropdownConfig(dropdowns)
    //   .then(() => {
    //     setLoading(false);
    //     alert('Dropdown configurations saved successfully!'); // Replace with Snackbar
    //   })
    //   .catch(err => {
    //     setError('Failed to save dropdown configurations.');
    //     console.error(err);
    //     setLoading(false);
    //     alert('Error saving configurations.'); // Replace with Snackbar
    //   });
    alert('Save functionality is a placeholder.');
    console.log('Saving dropdowns:', dropdowns);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    handleCancelAddEdit(); // Cancel any pending add/edit when switching tabs
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setNewItemValue('');
    setEditingItem(null);
  };

  const handleCancelAddEdit = () => {
    setIsAdding(false);
    setEditingItem(null);
    setNewItemValue('');
  };

  const handleSaveNewItem = () => {
    if (!newItemValue.trim() || !selectedTab) return;

    const categoryItems = dropdowns[selectedTab].items;
    if (categoryItems.some(item => item.value.toLowerCase() === newItemValue.trim().toLowerCase())) {
      alert('This value already exists in this category.'); // Use Snackbar
      return;
    }

    const newId = `${selectedTab.substring(0, 3)}-${Date.now()}`; // Simple unique ID
    const newItem = { id: newId, value: newItemValue.trim() };

    setDropdowns(prevDropdowns => ({
      ...prevDropdowns,
      [selectedTab]: {
        ...prevDropdowns[selectedTab],
        items: [...prevDropdowns[selectedTab].items, newItem],
      },
    }));
    handleCancelAddEdit();
  };

  const handleEditClick = (item) => {
    setEditingItem({ ...item, category: selectedTab });
    setNewItemValue(item.value);
    setIsAdding(false);
  };

  const handleUpdateItem = () => {
    if (!newItemValue.trim() || !editingItem) return;

    const categoryItems = dropdowns[editingItem.category].items;
     // Check if the new value exists *excluding* the item being edited
    if (categoryItems.some(item => item.id !== editingItem.id && item.value.toLowerCase() === newItemValue.trim().toLowerCase())) {
        alert('This value already exists in this category.'); // Use Snackbar
        return;
    }

    setDropdowns(prevDropdowns => ({
      ...prevDropdowns,
      [editingItem.category]: {
        ...prevDropdowns[editingItem.category],
        items: prevDropdowns[editingItem.category].items.map(item =>
          item.id === editingItem.id ? { ...item, value: newItemValue.trim() } : item
        ),
      },
    }));
    handleCancelAddEdit();
  };

  const handleDeleteItem = (itemId) => {
    if (!selectedTab) return;
    if (window.confirm('Are you sure you want to delete this value?')) { // Use Dialog
        // Add check here: Prevent deletion if value is in use (requires API)
        setDropdowns(prevDropdowns => ({
          ...prevDropdowns,
          [selectedTab]: {
            ...prevDropdowns[selectedTab],
            items: prevDropdowns[selectedTab].items.filter(item => item.id !== itemId),
          },
        }));
    }
  };

  const currentItems = selectedTab ? dropdowns[selectedTab]?.items || [] : [];

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  }

  if (error) {
    return <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>{error}</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Manage Dropdown Values
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Configure the options available in various dropdown menus within the ITAM module.
      </Typography>

      <Card sx={{ mt: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="Dropdown Categories"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {dropdownCategories.map((key) => (
            <Tab key={key} label={dropdowns[key]?.label || key} value={key} />
          ))}
        </Tabs>

        <CardContent>
          {selectedTab && (
            <Box>
                <Typography variant="h6" gutterBottom>{dropdowns[selectedTab]?.label || selectedTab}</Typography>
                <List dense>
                    {currentItems.map((item) => (
                    <ListItem key={item.id} divider sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                        <ListItemText primary={item.value} />
                        <ListItemSecondaryAction>
                        <Tooltip title="Edit Value">
                            <span> {/* Span needed for disabled button tooltip */}
                                <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(item)} disabled={isAdding || !!editingItem}>
                                    <EditIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Delete Value">
                             <span> {/* Span needed for disabled button tooltip */}
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteItem(item.id)} disabled={isAdding || !!editingItem /* || isValueInUse(item.id) */}>
                                    <DeleteIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                        </ListItemSecondaryAction>
                    </ListItem>
                    ))}
                    {currentItems.length === 0 && !isAdding && (
                        <ListItem>
                            <ListItemText primary="No values defined for this category yet." />
                        </ListItem>
                    )}
                </List>

                {(isAdding || editingItem) && (
                    <Box sx={{ mt: 2, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        {editingItem ? `Edit Value in ${dropdowns[selectedTab]?.label}` : `Add New Value to ${dropdowns[selectedTab]?.label}`}
                    </Typography>
                    <TextField
                        label={editingItem ? "Update Value" : "New Value"}
                        value={newItemValue}
                        onChange={(e) => setNewItemValue(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                        autoFocus
                    />
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Button
                        variant="contained"
                        size="small"
                        startIcon={<SaveIcon />}
                        onClick={editingItem ? handleUpdateItem : handleSaveNewItem}
                        disabled={!newItemValue.trim()}
                        >
                        {editingItem ? 'Update' : 'Add Value'}
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<CancelIcon />}
                            onClick={handleCancelAddEdit}
                        >
                            Cancel
                        </Button>
                    </Stack>
                    </Box>
                )}

                {!isAdding && !editingItem && (
                    <Button
                    variant="outlined"
                    startIcon={<AddCircleIcon />}
                    onClick={handleAddClick}
                    sx={{ mt: 2 }}
                    size="small"
                    >
                    Add New Value
                    </Button>
                )}
            </Box>
          )}
          {!selectedTab && dropdownCategories.length === 0 && (
                <Typography>No dropdown categories configured yet.</Typography>
          )}
           {!selectedTab && dropdownCategories.length > 0 && (
                <Typography>Select a category tab to manage its values.</Typography>
          )}
        </CardContent>
      </Card>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveChanges}
          disabled={loading || isAdding || !!editingItem} // Disable save while interacting or loading
          startIcon={<SaveIcon />}
        >
          Save All Dropdown Changes
        </Button>
      </Box>
    </Container>
  );
}

export default DropdownConfigPage;
