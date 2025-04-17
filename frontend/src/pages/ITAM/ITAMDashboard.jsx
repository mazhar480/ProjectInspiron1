/* eslint-disable no-unused-vars */
// File: src/pages/itam/ITAMDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Button,
  Box, CircularProgress, Stack, Avatar, Chip, MenuItem,
  FormControl, InputLabel, Select, TextField
} from '@mui/material';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import itamService from '../../services/itam.service';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SettingsIcon from '@mui/icons-material/Settings';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#aa66cc'];

function ITAMDashboard() {
  const dashboardRef = useRef(null);
  const [kpiData, setKpiData] = useState({
    totalAssets: 0,
    assetsByStatus: {},
    assetsByCategory: {},
    recentActivities: [],
  });
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [projectName, setProjectName] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [exportFormat, setExportFormat] = useState('pdf');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}'); // Get user info

  const fetchKpiData = async (filters = {}) => {
    try {
      setLoading(true);
      const [assets, logs] = await Promise.all([
        itamService.getAllAssets(filters),
        itamService.getAllLogs() // Consider filtering logs if needed
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

      // Map logs more carefully to include relevant info
      const recentActivities = logs.slice(0, 5).map(log => ({
        id: log.id, // Assuming logs have an ID
        action: log.action_type,
        time: dayjs(log.timestamp).format('YYYY-MM-DD HH:mm'), // Format date
        details: log.details || 'No details', // Include details if available
        user: log.userId ? `User ${log.userId}` : 'System' // Identify user if available
      }));

      setKpiData({ totalAssets, assetsByStatus, assetsByCategory, recentActivities });
    } catch (err) {
      console.error('Failed to fetch KPI data:', err); // Log the error
      setError(err.response?.data?.message || err.message || 'An error occurred while loading dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await itamService.getProjects();
        setProjects(data);
      } catch (err) {
        console.error('Failed to load projects:', err);
        // Optionally set an error state for projects loading
      }
    };

    loadProjects();
    fetchKpiData(); // Initial fetch without filters
  }, []);

  useEffect(() => {
    const found = projects.find(p => p.projectId === selectedProject);
    setProjectName(found ? found.projectName : 'All Projects');
  }, [selectedProject, projects]);

  const handleFilterApply = () => {
    fetchKpiData({
      projectId: selectedProject,
      fromDate: dateRange.from || undefined, // Pass undefined if empty
      toDate: dateRange.to || undefined // Pass undefined if empty
    });
  };

  const handleExport = () => {
    const fileSuffix = `${projectName.replace(/\s+/g, '')}_${dayjs().format('YYYYMMDDHHmm')}`;
    const exportTitle = `ITAM Dashboard Report`;
    const projectInfo = `Project: ${projectName}`;
    const dateInfo = `Date Range: ${dateRange.from || 'Start'} to ${dateRange.to || 'End'}`;

    if (exportFormat === 'pdf') {
      html2canvas(dashboardRef.current, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth - 20; // Add margin
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let position = 0;

        pdf.setFontSize(16);
        pdf.text(exportTitle, 10, 15);
        pdf.setFontSize(10);
        pdf.text(projectInfo, 10, 22);
        pdf.text(dateInfo, 10, 27);
        pdf.text(`Exported on: ${dayjs().format('YYYY-MM-DD HH:mm')}`, 10, 32);

        // Adjust image position based on text height
        position = 40; // Start image after header
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);

        // Handle multi-page PDF if content exceeds one page
        let heightLeft = imgHeight;
        while (heightLeft >= pdfHeight - position - 10) { // Check if content needs new page
          pdf.addPage();
          position = 10; // Reset position for new page
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= (pdfHeight - position - 10);
        }

        pdf.save(`ITAM_Dashboard_${fileSuffix}.pdf`);
      });
    } else { // Excel Export
      const overviewData = [
        { 'Report': exportTitle },
        { 'Project': projectName },
        { 'Date Range': dateInfo },
        { 'Exported On': dayjs().format('YYYY-MM-DD HH:mm') },
        // Removed the empty {} from the previous version
        { 'Metric': 'Total Assets', 'Value': kpiData.totalAssets },
      ];

      const statusData = Object.entries(kpiData.assetsByStatus).map(([Status, Count]) => ({ Status, Count }));
      const categoryData = Object.entries(kpiData.assetsByCategory).map(([Category, Count]) => ({ Category, Count }));
      const activityData = kpiData.recentActivities.map(act => ({ Time: act.time, User: act.user, Action: act.action, Details: act.details }));

      const wb = XLSX.utils.book_new();
      const wsOverview = XLSX.utils.json_to_sheet(overviewData, { skipHeader: true });
      const wsStatus = XLSX.utils.json_to_sheet(statusData);
      const wsCategory = XLSX.utils.json_to_sheet(categoryData);
      const wsActivity = XLSX.utils.json_to_sheet(activityData);

      // Set column widths (optional but recommended)
      wsOverview['!cols'] = [{ wch: 20 }, { wch: 20 }];
      wsStatus['!cols'] = [{ wch: 20 }, { wch: 10 }];
      wsCategory['!cols'] = [{ wch: 20 }, { wch: 10 }];
      wsActivity['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 30 }, { wch: 40 }];

      XLSX.utils.book_append_sheet(wb, wsOverview, 'Overview');
      XLSX.utils.book_append_sheet(wb, wsStatus, 'Assets by Status');
      XLSX.utils.book_append_sheet(wb, wsCategory, 'Assets by Category');
      XLSX.utils.book_append_sheet(wb, wsActivity, 'Recent Activities');

      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `ITAM_Dashboard_${fileSuffix}.xlsx`);
    }
  };

  const renderPieChart = (title, data) => {
    const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
    return (
      <Card sx={{ height: 340 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>{title}</Typography>
          {chartData.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No data available.
            </Typography>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          IT Asset Management Dashboard
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Export</InputLabel>
            <Select value={exportFormat} label="Export" onChange={(e) => setExportFormat(e.target.value)}>
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="excel">Excel</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={handleExport} disabled={loading}>
            Export
          </Button>
        </Stack>
      </Box>

      {/* Filters Section */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Project</InputLabel>
              <Select
                value={selectedProject}
                label="Project"
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <MenuItem value="">All Projects</MenuItem>
                {projects.map((proj) => (
                  <MenuItem key={proj.projectId} value={proj.projectId}>
                    {proj.projectName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3} md={3}>
            <TextField
              label="From Date"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={3}>
            <TextField
              label="To Date"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button variant="contained" fullWidth sx={{ height: '100%' }} onClick={handleFilterApply} disabled={loading}>
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Dashboard Content Area */}      
      <Box ref={dashboardRef}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
             <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ textAlign: 'center', my: 4 }}>{error}</Typography>
        ) : (
          <Grid container spacing={3}>
            {/* KPI Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ display: 'flex', alignItems: 'center', p: 2, height: '100%' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}>
                  <DashboardIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="text.secondary">Total Assets</Typography>
                  <Typography variant="h4" component="div">{kpiData.totalAssets}</Typography>
                </Box>
              </Card>
            </Grid>

            {/* Pie Charts */}
            <Grid item xs={12} sm={6} md={4}>{renderPieChart('Assets by Status', kpiData.assetsByStatus)}</Grid>
            <Grid item xs={12} sm={6} md={4}>{renderPieChart('Assets by Category', kpiData.assetsByCategory)}</Grid>

            {/* Recent Activities */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Recent Activities</Typography>
                  {kpiData.recentActivities.length > 0 ? (
                    <Stack spacing={1.5}>
                      {kpiData.recentActivities.map((activity) => (
                        <Box key={activity.id || activity.time} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', pb: 1 }}>
                          <Box>
                              <Typography variant="body2" component="span">{activity.action}</Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}> by {activity.user}</Typography>
                              <Typography variant="body2" sx={{ mt: 0.5 }}>{activity.details}</Typography>
                          </Box>
                          <Chip label={activity.time} size="small" variant="outlined" />
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Typography>No recent activities available.</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-start">
                <Button variant="contained" startIcon={<ListAltIcon />} component={Link} to="/itam/assets">
                  View Asset List
                </Button>
                <Button variant="outlined" startIcon={<AddBoxIcon />} component={Link} to="/itam/assets/new">
                  Register New Asset
                </Button>
                <Button variant="outlined" startIcon={<SettingsIcon />} component={Link} to="/itam/settings">
                  ITAM Settings
                </Button>
                {/* Conditionally render Custom Settings button for admin */}                
                {user.role === 'admin' && (
                    <Button variant="outlined" startIcon={<SettingsIcon />} component={Link} to="/itam/settings/custom">
                        Custom Settings
                    </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
}

export default ITAMDashboard;
