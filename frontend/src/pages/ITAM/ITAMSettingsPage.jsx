import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Button,
  Box, Snackbar
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ITAMSettingsPage() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/itam/settings/standard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      const errorMessage = error.response?.data?.message || 'Error fetching settings';
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await axios.post('/api/itam/settings/standard', newSettings, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSnackbar('Settings saved successfully', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      const errorMessage = error.response?.data?.message || 'Error saving settings';
      showSnackbar(errorMessage, 'error');
    }
  };

  useEffect(() => {
    fetchSettings().then(data => setSettings(data));
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        ITAM Settings
      </Typography>

      {loading ? (
        <Typography>Loading settings...</Typography>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Asset Types
                </Typography>
                {settings.assetTypes && settings.assetTypes.map((type, index) => (
                  <Typography key={index} variant="body1" gutterBottom>
                    {type}
                  </Typography>
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
                {settings.assetStatus && settings.assetStatus.map((status, index) => (
                  <Typography key={index} variant="body1" gutterBottom>
                    {status}
                  </Typography>
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
      )}
       <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Container>
  );
}

export default ITAMSettingsPage;