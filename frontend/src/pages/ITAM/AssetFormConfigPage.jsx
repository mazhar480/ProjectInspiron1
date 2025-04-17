// src/pages/ITAM/AssetFormConfigPage.jsx

import React, { useEffect, useState } from 'react';
import {
  Container, Typography, TextField, Checkbox, FormControlLabel, Button, Card, CardContent, IconButton,
  Table, TableHead, TableBody, TableRow, TableCell, CircularProgress
} from '@mui/material';
import { Add as AddIcon, Save as SaveIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { sortableKeyboardCoordinates, useSortable, DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor, closestCenter, SortableContext, verticalListSortingStrategy } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import axios from 'axios';

const AssetFormConfigPage = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newField, setNewField] = useState({
    label: '',
    fieldName: '',
    type: 'text',
    required: false,
    isVisible: true
  });

  const fetchFields = async () => {
    try {
      const res = await axios.get('/api/settings/asset-form');
      setFields(res.data.sort((a, b) => a.order - b.order)); // Sort by order
    } catch (err) {
      console.error('Error loading fields:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const handleAddField = async () => {
    try {
      const res = await axios.post('/api/settings/asset-form', newField);
      setFields(prev => [...prev, res.data]);
      setNewField({ label: '', fieldName: '', type: 'text', required: false, isVisible: true });
    } catch (err) {
      console.error('Error adding field:', err);
    }
  };

  const handleSaveField = async (field) => {
    try {
      await axios.put(`/api/settings/asset-form/${field.id}`, field);
    } catch (err) {
      console.error('Error saving field:', err);
    }
  };

  const handleDeleteField = async (id) => {
    try {
      await axios.delete(`/api/settings/asset-form/${id}`);
      setFields(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      console.error('Error deleting field:', err);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = fields.findIndex(f => f.id === active.id);
      const newIndex = fields.findIndex(f => f.id === over.id);
      const newOrder = arrayMove(fields, oldIndex, newIndex);
      setFields(newOrder);

      try {
        await axios.patch('/api/settings/asset-form/reorder', { orderedIds: newOrder.map(f => f.id) });
      } catch (err) {
        console.error('Error updating field order:', err);
      }
    }
  };

  const SortableRow = ({ field }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });
    const style = {
      transform: transform ? `translateY(${transform.y}px)` : undefined,
      transition
    };

    return (
      <TableRow ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <TableCell>{field.label}</TableCell>
        <TableCell>{field.fieldName}</TableCell>
        <TableCell>{field.type}</TableCell>
        <TableCell>
          <Checkbox checked={field.required} onChange={(e) => {
            const updated = { ...field, required: e.target.checked };
            setFields(prev => prev.map(f => f.id === field.id ? updated : f));
            handleSaveField(updated);
          }} />
        </TableCell>
        <TableCell>
          <Checkbox checked={field.isVisible} onChange={(e) => {
            const updated = { ...field, isVisible: e.target.checked };
            setFields(prev => prev.map(f => f.id === field.id ? updated : f));
            handleSaveField(updated);
          }} />
        </TableCell>
        <TableCell>
          <IconButton onClick={() => handleDeleteField(field.id)}><DeleteIcon /></IconButton>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Asset Form Field Configuration</Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">Add New Field</Typography>
          <TextField label="Label" size="small" sx={{ mr: 2 }} value={newField.label} onChange={(e) => setNewField({ ...newField, label: e.target.value })} />
          <TextField label="Field Name" size="small" sx={{ mr: 2 }} value={newField.fieldName} onChange={(e) => setNewField({ ...newField, fieldName: e.target.value })} />
          <Button startIcon={<AddIcon />} onClick={handleAddField}>Add Field</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Fields</Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Label</TableCell>
                      <TableCell>Field Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Required</TableCell>
                      <TableCell>Visible</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fields.map(field => (
                      <SortableRow key={field.id} field={field} />
                    ))}
                  </TableBody>
                </Table>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default AssetFormConfigPage;
