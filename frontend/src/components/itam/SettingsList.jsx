import React, { useState } from 'react';
import {
  List, ListItem, ListItemText, IconButton, TextField, Button, Box, Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function SettingsList({ title, items, onAdd, onUpdate, onDelete, itemName = "Item" }) {
  const [newItem, setNewItem] = useState('');
  const [editingItem, setEditingItem] = useState(null); // Store the original item being edited

  const handleAddItem = () => {
    if (newItem.trim()) {
      onAdd(newItem);
      setNewItem('');
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setNewItem(item); // Pre-fill the text field with the current value
  };

  const handleUpdateItem = () => {
    if (newItem.trim() && editingItem) {
      onUpdate(editingItem, newItem); // Pass both old and new item values
      setEditingItem(null);
      setNewItem('');
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setNewItem('');
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <List>
        {items.map((item, index) => (
          <ListItem
            key={index}
            secondaryAction=
              <Box>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditItem(item)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => onDelete(item)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            
          >
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
      <TextField
        label={editingItem ? `Update ${itemName}` : `New ${itemName}`}
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        fullWidth
        margin="normal"
      />
       <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          onClick={editingItem ? handleUpdateItem : handleAddItem}
          disabled={!newItem.trim() || (editingItem === newItem)} // Disable if not changed
        >
          {editingItem ? `Update ${itemName}` : `Add ${itemName}`}
        </Button>
        {editingItem && (
          <Button
            variant="outlined"
            onClick={handleCancelEdit}
          >
            Cancel
          </Button>
        )}
       </Box>
    </>
  );
}

export default SettingsList;