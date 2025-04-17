// Frontend/src/pages/ITAM/AssetDetailsPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import moment from 'moment';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

import itamService from '../../services/itam.service';
import axios from 'axios';

function AssetDetailsPage() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssetAndLogs = async () => {
      try {
        const [assetRes, logsRes] = await Promise.all([
          itamService.getAssetById(id),
          axios.get(`/api/assets/${id}/logs`)
        ]);
        setAsset(assetRes);
        setLogs(logsRes.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssetAndLogs();
  }, [id]);

  if (loading) return <div>Loading asset details...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!asset) return <div>Asset not found.</div>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Asset Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {/* Display all asset details in a grid */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>ID:</strong> {asset.id}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Name:</strong> {asset.name}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Asset Tag:</strong> {asset.assetTag}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Status:</strong> {asset.status}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Category:</strong> {asset.category}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Asset Type:</strong> {asset.assetType.join(', ')}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Manufacturer:</strong> {asset.manufacturer}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Owner:</strong> {asset.owner}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Make:</strong> {asset.make}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Model:</strong> {asset.model}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Serial Number:</strong> {asset.serialNumber}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Location:</strong> {asset.location}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Assigned User:</strong> {asset.assignedUser}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Department:</strong> {asset.department}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>IP Address:</strong> {asset.ipAddress}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Operating System:</strong> {asset.operatingSystem}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Processor:</strong> {asset.processor}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>RAM (GB):</strong> {asset.ramGb}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Storage Type:</strong> {asset.storageType}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Storage Capacity (GB):</strong> {asset.storageCapacityGb}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Purchase Price:</strong> {asset.purchasePrice}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Warranty Start Date:</strong>{' '}
                  {asset.warrantyStartDate
                    ? moment(asset.warrantyStartDate).format('YYYY-MM-DD')
                    : 'N/A'}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Warranty End Date:</strong>{' '}
                  {asset.warrantyEndDate
                    ? moment(asset.warrantyEndDate).format('YYYY-MM-DD')
                    : 'N/A'}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Project:</strong> {asset.project}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Project Location:</strong> {asset.projectLocation}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Acquisition Date:</strong>{' '}
                  {asset.acquisitionDate
                    ? moment(asset.acquisitionDate).format('YYYY-MM-DD')
                    : 'N/A'}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Warranty Information:</strong> {asset.warrantyInformation}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Configuration Details:</strong> {asset.configurationDetails}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h5" component="h3" gutterBottom sx={{ mt: 4 }}>
        <Box display="flex" alignItems="center">
          <Typography variant="h5" component="h3" color="primary">
          🕓
          </Typography>
          <Typography variant="h5" component="h3" sx={{ml: 1}}>Asset History</Typography>
        </Box>
      </Typography>
      {logs.length === 0 ? (
        <Typography variant="body1">No logs available for this asset.</Typography>
      ) : (
        <Paper elevation={3} sx={{ p: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Action</TableCell>
                  <TableCell>Changed By</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Changes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
            {logs.map((log, index) => {
              let parsedChanges = {};
              try {
                parsedChanges =
                  typeof log.changes === 'string'
                    ? JSON.parse(log.changes)
                    : log.changes;
              } catch (e) {
                console.error('Invalid JSON in log.changes', e);
                return null; // Skip rendering for this log if JSON is invalid
              }

              const filteredChanges = Object.entries(parsedChanges).filter(
                ([key, values]) => values.new !== null && values.new !== '' || values.old !== null && values.old !== ''
              );

              return (
                <TableRow key={index}>
                  <TableCell>{log.action_type}</TableCell>
                  <TableCell>{log.changed_by}</TableCell>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    {filteredChanges.map(([field, values]) => (
                      <div key={field} style={{ marginBottom: '8px' }}>
                        <Typography variant="body2" style={{ textTransform: 'capitalize' }}>
                          <strong>{field}:</strong>
                        </Typography>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Chip
                            label={`Old: ${values.old !== null ? String(values.old) : 'N/A'}`}
                            color="default"
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Chip
                            label={`New: ${values.new !== null ? String(values.new) : 'N/A'}`}
                            color="success"
                            size="small"
                          />
                        </div>
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              );
            })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
}

export default AssetDetailsPage;
