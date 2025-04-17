import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Button,
  Box, TextField, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Link } from 'react-router-dom';

const standardSettings = {
  assetTypes: [
    "Laptop",
    "Desktop",
    "Server",
    "Monitor",
    "Keyboard",
    "Mouse",
    "Software",
    "License",
    "Other"
  ],
  assetStatus: [
    "In Use",
    "Available",
    "Assigned",
    "In Repair",
    "Damaged",
    "Lost",
    "Stolen",
    "Retired"
  ]
};

function ITAMSettingsPage() {
  const [settings, setSettings] = useState(standardSettings);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Placeholder for fetching settings from the backend
  const fetchSettings = () => {
    // In a real app, this would make an API call
    return Promise.resolve(standardSettings);
  };

  // Placeholder for saving settings to the backend
  const saveSettings = (newSettings) => {
    // In a real app, this would make an API call
    console.log("Saving settings:", newSettings);
    // For now, we'll just update the local state
    setSettings(newSettings);
  };

  useEffect(() => {
    fetchSettings().then(data => setSettings(data));
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        ITAM Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Asset Types
              </Typography>
              {settings.assetTypes.map((type, index) => (
                <TextField
                  key={index}
                  label={`Asset Type ${index + 1}`}
                  value={type}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Asset Status Options
              </Typography>
              {settings.assetStatus.map((status, index) => (
                <TextField
                  key={index}
                  label={`Status Option ${index + 1}`}
                  value={status}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" disabled onClick={() => saveSettings(settings)}>
              Save Changes
            </Button>
            {user.role === 'admin' && (
              <Button variant="outlined" component={Link} to="/itam/settings/custom">
                Create Custom Settings
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ITAMSettingsPage;