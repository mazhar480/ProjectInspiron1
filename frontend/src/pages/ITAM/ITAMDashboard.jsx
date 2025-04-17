import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, Box } from '@mui/material';
import { Link, Routes, Route, Outlet } from 'react-router-dom';
import itamService from '../../services/itam.service';
import AssetListPage from './AssetListPage';
import AssetFormPage from './AssetFormPage';
import AssetDetailsPage from './AssetDetailsPage';

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
          itamService.getAllLogs()
        ]);

        const totalAssets = assets.length;
        const assetsByStatus = assets.reduce((acc, asset) => {
          acc[asset.status] = (acc[asset.status] || 0) + 1;
          return acc;
        }, {});
        const assetsByCategory = assets.reduce((acc, asset) => {
            asset.assetType.forEach(type => {
                acc[type] = (acc[type] || 0) + 1;
            });
          return acc;
        }, {});

        const recentActivities = logs.slice(0, 5).map(log => ({
          action: log.action_type,
          time: new Date(log.timestamp).toLocaleString(),
          changes: log.changes
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
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  IT Asset Management Dashboard
                </Typography>
              </Box>
              {loading && <Typography>Loading...</Typography>}
              {error && (
                <Typography color="error">Error: {error}</Typography>
              )}
              <Grid container spacing={3}>
                {/* KPI Cards */}
                <Grid item xs={12} md={3}>
                  <Card sx={{ boxShadow: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h5" component="div" gutterBottom>
                        Total Assets
                      </Typography>
                      <Typography variant="h3">{kpiData.totalAssets}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  {Object.entries(kpiData.assetsByStatus).map(
                    ([status, count]) => (
                      <Grid key={status} item xs={12} md={12}>
                        <Card sx={{ boxShadow: 3 }}>
                          <CardContent sx={{ p: 3 }}>
                            <Typography variant="h5" gutterBottom>
                              {`Assets by ${status}`}
                            </Typography>
                            <Typography variant="h3">{count}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    )
                  )}
                </Grid>
                <Grid item xs={12} md={3}>
                  {Object.entries(kpiData.assetsByCategory).map(
                    ([category, count]) => (
                      <Grid key={category} item xs={12} md={12}>
                        <Card sx={{ boxShadow: 3 }}>
                          <CardContent sx={{ p: 3 }}>
                            <Typography variant="h5" gutterBottom>
                              {`Assets by ${category}`}
                            </Typography>
                            <Typography variant="h3">{count}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    )
                  )}
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ boxShadow: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h5" component="h2" gutterBottom>
                        Other Metrics
                      </Typography>
                      <Typography variant="h3">Data: Available</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Summary Information */}
                <Grid item xs={12}>
                  <Card sx={{ mt: 4 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h5" component="h2" gutterBottom>
                        Recent Activities
                      </Typography>
                      <Typography variant="body1" component="div">
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
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/assets"
                  >
                    Go to Asset List
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ ml: 2 }}
                    component={Link}
                    to="/assets/new"
                  >
                    Create New Asset
                  </Button>
                </Grid>
              </Grid>
            </Container>
          }
        />
        <Route path="/assets" element={<AssetListPage />} />
        <Route path="/assets/new" element={<AssetFormPage />} />
        <Route path="/assets/:id" element={<AssetDetailsPage />} />
        <Route path="/assets/:id/edit" element={<AssetFormPage />} />
      </Routes>
      <Outlet />
    </>
  );
}

export default ITAMDashboard;