// src/pages/ITAM/ITAMSettingsPage.jsx

import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, Divider, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import BuildIcon from '@mui/icons-material/Build';
import TuneIcon from '@mui/icons-material/Tune';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const ITAMSettingsPage = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin' || user.role === 'superadmin';

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        <SettingsIcon sx={{ mr: 1 }} /> ITAM Settings
      </Typography>

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Configuration</Typography>
          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<BuildIcon />}
              component={Link}
              to="/itam/settings/form-fields"
            >
              Manage Asset Form Fields
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<TuneIcon />}
              component={Link}
              to="/itam/settings/lifecycle"
            >
              Configure Lifecycle Status
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<TuneIcon />}
              component={Link}
              to="/itam/settings/dropdowns"
            >
              Manage Dropdown Values
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<PictureAsPdfIcon />}
              component={Link}
              to="/itam/settings/export-options"
            >
              Export & Branding
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<NotificationsActiveIcon />}
              component={Link}
              to="/itam/settings/notifications"
            >
              Notification Settings
            </Button>

            {user.role === 'superadmin' && (
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AdminPanelSettingsIcon />}
                component={Link}
                to="/itam/settings/system"
              >
                System Settings (Super Admin)
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ITAMSettingsPage;
