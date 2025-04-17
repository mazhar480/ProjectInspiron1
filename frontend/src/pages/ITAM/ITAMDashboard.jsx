// File: src/pages/itam/ITAMDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent,
  Button, Box, CircularProgress, Stack
} from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import itamService from '../../services/itam.service';

function ITAMDashboard() {
  const [kpiData, setKpiData] = useState({
    totalAssets: 0,
    assetsByStatus: {},
    assetsByCategory: {},
    recentActivities: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKpiData = async () => {
      try {
        const [assets, logs] = await Promise.all([
          itamService.getAllAssets(),
          itamService.getAllLogs(),
        ]);

        const totalAssets = assets.length;

        const assetsByStatus = assets.reduce((acc, asset) => {
          acc[asset.status] = (acc[asset.status] || 0) + 1;
          return acc;
        }, {});

        const assetsByCategory = assets.reduce((acc, asset) => {
          if (Array.isArray(asset.assetType)) {
            asset.assetType.forEach(type => {
              acc[type] = (acc[type] || 0) + 1;
            });
          } else if (typeof asset.assetType === 'string') {
            acc[asset.assetType] = (acc[asset.assetType] || 0) + 1;
          }
          return acc;
        }, {});

        const recentActivities = logs.slice(0, 5).map(log => ({
          action: log.action_type,
          time: new Date(log.timestamp).toLocaleString(),
          changes: log.changes,
        }));

        setKpiData({
          totalAssets,
          assetsByStatus,
          assetsByCategory,
          recentActivities,
        });
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchKpiData();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          IT Asset Management Dashboard
        </Typography>
      </Box>

      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />}
      {error && <Typography color="error">Error: {error}</Typography>}

      {!loading && (
        <Grid container spacing={3}>
          {/* KPI Card: Total Assets */}
          <Grid item xs={12} md={4}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Total Assets</Typography>
                <Typography variant="h3">{kpiData.totalAssets}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* KPI Card: Assets by Status */}
          <Grid item xs={12} md={4}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Assets by Status</Typography>
                {Object.entries(kpiData.assetsByStatus).map(([status, count]) => (
                  <Typography key={status} variant="body1">{`${status}: ${count}`}</Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* KPI Card: Assets by Category */}
          <Grid item xs={12} md={4}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Assets by Category</Typography>
                {Object.entries(kpiData.assetsByCategory).map(([category, count]) => (
                  <Typography key={category} variant="body1">{`${category}: ${count}`}</Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Activities */}
          <Grid item xs={12}>
            <Card sx={{ mt: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Activities
                </Typography>
                {kpiData.recentActivities.length > 0 ? (
                  <ul>
                    {kpiData.recentActivities.map((activity, index) => (
                      <li key={index}>
                        {`[${activity.time}] - ${activity.action}`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  'No recent activities to display.'
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Navigation */}
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button variant="contained" component={Link} to="assets">
                Go to Asset List
              </Button>
              <Button variant="outlined" component={Link} to="assets/new">
                New Asset
              </Button>
            </Stack>
          </Grid>
        </Grid>
      )}

      {/* Child Route Outlet */}
      <Box sx={{ mt: 6 }}>
        <Outlet />
      </Box>
    </Container>
  );
}

export default ITAMDashboard;
