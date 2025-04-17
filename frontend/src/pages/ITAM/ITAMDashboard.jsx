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

  const fetchKpiData = async (filters = {}) => {
    try {
      setLoading(true);
      const [assets, logs] = await Promise.all([
        itamService.getAllAssets(filters),
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
        changes: log.changes,
      }));

      setKpiData({ totalAssets, assetsByStatus, assetsByCategory, recentActivities });
    } catch (err) {
      setError(err.message || 'An error occurred');
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
      }
    };

    loadProjects();
    fetchKpiData();
  }, []);

  useEffect(() => {
    const found = projects.find(p => p.projectId === selectedProject);
    setProjectName(found ? found.projectName : 'AllProjects');
  }, [selectedProject, projects]);

  const handleFilterApply = () => {
    fetchKpiData({
      projectId: selectedProject,
      fromDate: dateRange.from,
      toDate: dateRange.to
    });
  };

  const handleExport = () => {
    const fileSuffix = `${projectName}_${dayjs().format('YYYYMMDD')}`;
    if (exportFormat === 'pdf') {
      html2canvas(dashboardRef.current).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;

        pdf.setFontSize(12);
        pdf.text(`MetaMates Group`, 10, 10);
        pdf.text(`Project: ${projectName}`, 10, 18);
        pdf.text(`Date Range: ${dateRange.from || '-'} to ${dateRange.to || '-'}`, 10, 26);
        pdf.addImage(imgData, 'PNG', 0, 30, width, height);
        pdf.save(`ITAM_Dashboard_${fileSuffix}.pdf`);
      });
    } else {
      const statusSheet = Object.entries(kpiData.assetsByStatus).map(([k, v]) => ({ Status: k, Count: v }));
      const categorySheet = Object.entries(kpiData.assetsByCategory).map(([k, v]) => ({ Category: k, Count: v }));

      const wb = XLSX.utils.book_new();
      const ws1 = XLSX.utils.json_to_sheet([
        { 'Total Assets': kpiData.totalAssets },
        { 'Project': projectName },
        { 'Date Range': `${dateRange.from || '-'} to ${dateRange.to || '-'}` }
      ]);
      const ws2 = XLSX.utils.json_to_sheet(statusSheet);
      const ws3 = XLSX.utils.json_to_sheet(categorySheet);

      XLSX.utils.book_append_sheet(wb, ws1, 'Overview');
      XLSX.utils.book_append_sheet(wb, ws2, 'By Status');
      XLSX.utils.book_append_sheet(wb, ws3, 'By Category');

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
              No data available for this chart.
            </Typography>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" component="h1">
          IT Asset Management Dashboard
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <FormControl size="small">
            <Select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
              <MenuItem value="pdf">Export as PDF</MenuItem>
              <MenuItem value="excel">Export as Excel</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={handleExport}>
            Export
          </Button>
        </Stack>
      </Box>

      <Box ref={dashboardRef}>
        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="project-label">Project</InputLabel>
              <Select
                labelId="project-label"
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
          <Grid item xs={6} md={3}>
            <TextField
              label="From"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              label="To"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button variant="contained" fullWidth sx={{ height: '100%' }} onClick={handleFilterApply}>
              Apply Filters
            </Button>
          </Grid>
        </Grid>

        {loading ? (
          <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
        ) : error ? (
          <Typography color="error">Error: {error}</Typography>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
                  <DashboardIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">Total Assets</Typography>
                  <Typography variant="h5">{kpiData.totalAssets}</Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>{renderPieChart('Assets by Status', kpiData.assetsByStatus)}</Grid>
            <Grid item xs={12} md={4}>{renderPieChart('Assets by Category', kpiData.assetsByCategory)}</Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Recent Activities</Typography>
                  {kpiData.recentActivities.length > 0 ? (
                    <Stack spacing={1}>
                      {kpiData.recentActivities.map((activity, index) => (
                        <Box key={index}>
                          <Typography variant="body2">{activity.action}</Typography>
                          <Chip label={activity.time} size="small" sx={{ mt: 0.5 }} />
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Typography>No recent activities available.</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" startIcon={<ListAltIcon />} component={Link} to="/itam/assets">
                  View Asset List
                </Button>
                <Button variant="outlined" startIcon={<AddBoxIcon />} component={Link} to="/itam/assets/new">
                  Register New Asset
                </Button>
              </Stack>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
}

export default ITAMDashboard;