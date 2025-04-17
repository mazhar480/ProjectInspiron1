import React, { useState } from 'react';
import { List, ListItem, ListItemText, IconButton, TextField, Button, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function SettingsList({ title, items, onAdd, onUpdate, onDelete, itemName = "Item" }) {
  const [newItem, setNewItem] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  const handleAddItem = () => {
    if (newItem.trim()) {
      onAdd(newItem);
      setNewItem('');
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setNewItem(item);
  };

  const handleUpdateItem = () => {
    if (newItem.trim() && editingItem) {
      onUpdate(editingItem, newItem);
      setEditingItem(null);
      setNewItem('');
    }
  };


  return (
    <div>
      <List>
        {items.map((item, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <Box>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditItem(item)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => onDelete(item)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
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
      <Button
        variant="contained"
        onClick={editingItem ? handleUpdateItem : handleAddItem}
        disabled={!newItem.trim()}
        sx={{ mt: 2 }}
      >
        {editingItem ? `Update ${itemName}` : `Add ${itemName}`}
      </Button>
    </div>
  );
}

export default SettingsList;