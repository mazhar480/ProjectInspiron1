import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Card, CardContent, Button, Box, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, Tooltip, CircularProgress, Stack, Divider
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
// import itamSettingsService from '../../services/itamSettings.service'; // Placeholder for API service

// --- Mock Data (Replace with API call) ---
const initialStatuses = [
  { id: 'status-1', name: 'Deployed', description: 'Asset is actively used.' },
  { id: 'status-2', name: 'In Stock', description: 'Asset is available for deployment.' },
  { id: 'status-3', name: 'In Repair', description: 'Asset is undergoing maintenance.' },
  { id: 'status-4', name: 'Retired', description: 'Asset is no longer in use.' },
  { id: 'status-5', name: 'Lost/Stolen', description: 'Asset is missing.' },
];
// --- End Mock Data ---

function LifecycleConfigPage() {
  const [statuses, setStatuses] = useState(initialStatuses);
  const [editingStatus, setEditingStatus] = useState(null); // { id, name, description } or null
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusDescription, setNewStatusDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Placeholder for fetching config
  useEffect(() => {
    // setLoading(true);
    // itamSettingsService.getLifecycleStatuses()
    //   .then(data => {
    //     setStatuses(data);
    //     setLoading(false);
    //   })
    //   .catch(err => {
    //     setError('Failed to load lifecycle statuses.');
    //     console.error(err);
    //     setLoading(false);
    //   });
  }, []);

  // Placeholder for saving config
  const handleSaveChanges = () => {
    // setLoading(true);
    // itamSettingsService.saveLifecycleStatuses(statuses)
    //   .then(() => {
    //     setLoading(false);
    //     alert('Lifecycle statuses saved successfully!'); // Replace with Snackbar
    //   })
    //   .catch(err => {
    //     setError('Failed to save lifecycle statuses.');
    //     console.error(err);
    //     setLoading(false);
    //     alert('Error saving statuses.'); // Replace with Snackbar
    //   });
     alert('Save functionality is a placeholder.');
     console.log('Saving statuses:', statuses);
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setNewStatusName('');
    setNewStatusDescription('');
    setEditingStatus(null); // Ensure not in edit mode
  };

  const handleCancelAddEdit = () => {
    setIsAdding(false);
    setEditingStatus(null);
    setNewStatusName('');
    setNewStatusDescription('');
  };

  const handleSaveNewStatus = () => {
    if (!newStatusName.trim()) {
      alert('Status name cannot be empty.'); // Replace with better validation/feedback
      return;
    }
    const newId = `status-${Date.now()}`; // Simple unique ID generation for demo
    const newStatus = { id: newId, name: newStatusName.trim(), description: newStatusDescription.trim() };
    setStatuses([...statuses, newStatus]);
    handleCancelAddEdit();
    // NOTE: In a real app, you might want to save immediately via API or wait for main save
  };

  const handleEditClick = (status) => {
    setEditingStatus(status);
    setNewStatusName(status.name);
    setNewStatusDescription(status.description);
    setIsAdding(false); // Ensure not in add mode
  };

  const handleUpdateStatus = () => {
    if (!newStatusName.trim() || !editingStatus) {
      alert('Status name cannot be empty.'); // Replace with better validation/feedback
      return;
    }
    setStatuses(statuses.map(s =>
      s.id === editingStatus.id
        ? { ...s, name: newStatusName.trim(), description: newStatusDescription.trim() }
        : s
    ));
    handleCancelAddEdit();
     // NOTE: In a real app, you might want to save immediately via API or wait for main save
  };

  const handleDeleteStatus = (statusId) => {
    if (window.confirm('Are you sure you want to delete this status?')) { // Simple confirmation
        // Check if status is in use before deleting (Requires API call)
        // E.g., itamService.isStatusInUse(statusId).then(isInUse => { if (!isInUse) ... })
        setStatuses(statuses.filter(s => s.id !== statusId));
         // NOTE: In a real app, you might want to save immediately via API or wait for main save
    }
  };

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  }

  if (error) {
    return <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>{error}</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Configure Lifecycle Status
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Define the different stages an asset can be in throughout its lifecycle.
      </Typography>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Asset Statuses</Typography>
          <List>
            {statuses.map((status) => (
              <ListItem key={status.id} divider sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                <ListItemText primary={status.name} secondary={status.description || 'No description'} />
                <ListItemSecondaryAction>
                   <Tooltip title="Edit Status">
                       <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(status)} disabled={isAdding || !!editingStatus}>
                           <EditIcon />
                       </IconButton>
                   </Tooltip>
                   <Tooltip title="Delete Status">
                       {/* Add check here: Disable delete if status is in use or core */}
                       <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteStatus(status.id)} disabled={isAdding || !!editingStatus}>
                           <DeleteIcon />
                       </IconButton>
                   </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          {(isAdding || editingStatus) && (
            <Box sx={{ mt: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                {editingStatus ? 'Edit Status' : 'Add New Status'}
              </Typography>
              <TextField
                label="Status Name"
                value={newStatusName}
                onChange={(e) => setNewStatusName(e.target.value)}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Description (Optional)"
                value={newStatusDescription}
                onChange={(e) => setNewStatusDescription(e.target.value)}
                fullWidth
                multiline
                rows={2}
                margin="normal"
              />
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                 <Button
                   variant="contained"
                   startIcon={<SaveIcon />}
                   onClick={editingStatus ? handleUpdateStatus : handleSaveNewStatus}
                   disabled={!newStatusName.trim()}
                 >
                   {editingStatus ? 'Update Status' : 'Save New Status'}
                 </Button>
                 <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancelAddEdit}
                 >
                    Cancel
                 </Button>
              </Stack>
            </Box>
          )}

          {!isAdding && !editingStatus && (
            <Button
              variant="outlined"
              startIcon={<AddCircleIcon />}
              onClick={handleAddClick}
              sx={{ mt: 2 }}
            >
              Add New Status
            </Button>
          )}
        </CardContent>
      </Card>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveChanges}
          disabled={loading || isAdding || !!editingStatus} // Disable save while adding/editing or loading
          startIcon={<SaveIcon />}
        >
          Save All Changes
        </Button>
      </Box>
    </Container>
  );
}

export default LifecycleConfigPage;
