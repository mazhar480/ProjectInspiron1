import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Card, CardContent, Button, Box, Switch, FormControlLabel, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Tooltip
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; // Placeholder - install this library
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// import itamSettingsService from '../../services/itamSettings.service'; // Placeholder for API service

// --- Mock Data (Replace with API call) ---
const initialFields = [
  { id: 'assetName', label: 'Asset Name', isVisible: true, isRequired: true, isCore: true },
  { id: 'assetTag', label: 'Asset Tag', isVisible: true, isRequired: true, isCore: true },
  { id: 'serialNumber', label: 'Serial Number', isVisible: true, isRequired: false, isCore: false },
  { id: 'assetType', label: 'Asset Type', isVisible: true, isRequired: true, isCore: true },
  { id: 'status', label: 'Status', isVisible: true, isRequired: true, isCore: true },
  { id: 'location', label: 'Location', isVisible: true, isRequired: false, isCore: false },
  { id: 'purchaseDate', label: 'Purchase Date', isVisible: true, isRequired: false, isCore: false },
  { id: 'purchaseCost', label: 'Purchase Cost', isVisible: true, isRequired: false, isCore: false },
  { id: 'warrantyEndDate', label: 'Warranty End Date', isVisible: true, isRequired: false, isCore: false },
  { id: 'assignedUser', label: 'Assigned User', isVisible: true, isRequired: false, isCore: false },
  { id: 'notes', label: 'Notes', isVisible: true, isRequired: false, isCore: false },
  // Add more fields as needed
];
// --- End Mock Data ---


function AssetFormConfigPage() {
  const [formFields, setFormFields] = useState(initialFields);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Placeholder for fetching config
  useEffect(() => {
    // setLoading(true);
    // itamSettingsService.getFormConfig()
    //   .then(data => {
    //     setFormFields(data); // Assuming API returns fields in correct order
    //     setLoading(false);
    //   })
    //   .catch(err => {
    //     setError('Failed to load form configuration.');
    //     console.error(err);
    //     setLoading(false);
    //   });
  }, []);

  // Placeholder for saving config
  const handleSaveChanges = () => {
    // setLoading(true);
    // itamSettingsService.saveFormConfig(formFields)
    //   .then(() => {
    //     setLoading(false);
    //     // Show success message (e.g., using Snackbar)
    //     alert('Configuration saved successfully!');
    //   })
    //   .catch(err => {
    //     setError('Failed to save form configuration.');
    //     console.error(err);
    //     setLoading(false);
    //     // Show error message
    //     alert('Error saving configuration.');
    //   });
     alert('Save functionality is a placeholder.');
     console.log('Saving:', formFields);
  };

  const handleVisibilityToggle = (fieldId) => {
    setFormFields(prevFields =>
      prevFields.map(field =>
        field.id === fieldId ? { ...field, isVisible: !field.isVisible } : field
      )
    );
  };

  // Drag-and-Drop Handler (Requires react-beautiful-dnd)
  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination || destination.index === source.index) {
      return; // Dropped outside the list or in the same position
    }

    const reorderedFields = Array.from(formFields);
    const [removed] = reorderedFields.splice(source.index, 1);
    reorderedFields.splice(destination.index, 0, removed);

    setFormFields(reorderedFields);
  };

  if (loading) {
    // return <CircularProgress />; // Add loading state
     return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Manage Asset Form Fields
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Drag and drop fields to reorder them in the asset form. Use the toggle to show or hide fields. Core fields cannot be hidden.
      </Typography>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="formFields">
              {(provided) => (
                <List {...provided.droppableProps} ref={provided.innerRef}>
                  {formFields.map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id} index={index}>
                      {(provided, snapshot) => (
                        <ListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            mb: 1,
                            border: '1px solid #eee',
                            borderRadius: 1,
                            bgcolor: snapshot.isDragging ? 'action.hover' : 'background.paper',
                            display: 'flex',
                            alignItems: 'center',
                           }}
                        >
                          <Tooltip title="Drag to reorder">
                             <DragIndicatorIcon sx={{ mr: 1, cursor: 'grab', color: 'text.disabled' }} />
                          </Tooltip>
                          <ListItemText
                            primary={field.label}
                            secondary={field.isRequired ? 'Required' : 'Optional'}
                          />
                          <ListItemSecondaryAction>
                            <Tooltip title={field.isVisible ? "Hide Field" : "Show Field"}>
                               <span> {/* Span needed for Tooltip when button is disabled */}
                                <IconButton
                                    edge="end"
                                    onClick={() => handleVisibilityToggle(field.id)}
                                    disabled={field.isCore || field.isRequired} // Core/Required fields cannot be hidden
                                >
                                    {field.isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                               </span>
                            </Tooltip>
                          </ListItemSecondaryAction>
                        </ListItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveChanges}
          disabled={loading} // Disable button while saving
        >
          Save Changes
        </Button>
      </Box>
    </Container>
  );
}

export default AssetFormConfigPage;

