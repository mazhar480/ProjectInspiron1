import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, Box, CircularProgress, Stack } from '@mui/material';
import { Link, Routes, Route, Outlet } from 'react-router-dom';
import itamService from '../../services/itam.service';
import AssetListPage from './AssetListPage';
import AssetFormPage from './AssetFormPage';
import AssetDetailsPage from './AssetDetailsPage';
import KPIWidget from '../../components/KPIWidget';
import PieChartWidget from '../../components/PieChartWidget';

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
              {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />}
              {error && <Typography color="error">Error: {error}</Typography>}

              {!loading && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <KPIWidget title="Total Assets" value={kpiData.totalAssets} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <PieChartWidget
                      title="Assets by Status"
                      data={Object.entries(kpiData.assetsByStatus).map(([name, value]) => ({ name, value }))}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <PieChartWidget
                      title="Assets by Category"
                      data={Object.entries(kpiData.assetsByCategory).map(([name, value]) => ({ name, value }))}
                    />
                  </Grid>
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
                  <Grid item xs={12}>
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                      <Button variant="contained" component={Link} to="/assets">Go to Asset List</Button>
                      <Button variant="contained" component={Link} to="/assets/new" sx={{marginLeft: 2}}>Create New Asset</Button>
                    </Stack>
                  </Grid>
                </Grid>
              )}
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