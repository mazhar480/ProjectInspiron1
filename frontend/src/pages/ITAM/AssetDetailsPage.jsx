// Frontend/src/pages/ITAM/AssetDetailsPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Asset Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded shadow p-4 mb-6">
        {/* Display all asset details in a grid */}
        <div><strong>ID:</strong> {asset.id}</div>
        <div><strong>Name:</strong> {asset.name}</div>
        <div><strong>Asset Tag:</strong> {asset.assetTag}</div>
        <div><strong>Status:</strong> {asset.status}</div>
        <div><strong>Category:</strong> {asset.category}</div>
        <div><strong>Asset Type:</strong> {asset.assetType.join(', ')}</div>
        <div><strong>Manufacturer:</strong> {asset.manufacturer}</div>
        <div><strong>Owner:</strong> {asset.owner}</div>
        <div><strong>Make:</strong> {asset.make}</div>
        <div><strong>Model:</strong> {asset.model}</div>
        <div><strong>Serial Number:</strong> {asset.serialNumber}</div>
        <div><strong>Location:</strong> {asset.location}</div>
        <div><strong>Assigned User:</strong> {asset.assignedUser}</div>
        <div><strong>Department:</strong> {asset.department}</div>
        <div><strong>IP Address:</strong> {asset.ipAddress}</div>
        <div><strong>Operating System:</strong> {asset.operatingSystem}</div>
        <div><strong>Processor:</strong> {asset.processor}</div>
        <div><strong>RAM (GB):</strong> {asset.ramGb}</div>
        <div><strong>Storage Type:</strong> {asset.storageType}</div>
        <div><strong>Storage Capacity (GB):</strong> {asset.storageCapacityGb}</div>
        <div><strong>Purchase Price:</strong> {asset.purchasePrice}</div>
        <div>
          <strong>Warranty Start Date:</strong>{' '}
          {asset.warrantyStartDate
            ? moment(asset.warrantyStartDate).format('YYYY-MM-DD')
            : 'N/A'}
        </div>
        <div>
          <strong>Warranty End Date:</strong>{' '}
          {asset.warrantyEndDate
            ? moment(asset.warrantyEndDate).format('YYYY-MM-DD')
            : 'N/A'}
        </div>
        <div><strong>Project:</strong> {asset.project}</div>
        <div><strong>Project Location:</strong> {asset.projectLocation}</div>
        <div>
          <strong>Acquisition Date:</strong>{' '}
          {asset.acquisitionDate
            ? moment(asset.acquisitionDate).format('YYYY-MM-DD')
            : 'N/A'}
        </div>
        <div><strong>Warranty Information:</strong> {asset.warrantyInformation}</div>
        <div><strong>Configuration Details:</strong> {asset.configurationDetails}</div>
      </div>

      <h3 className="text-xl font-semibold mb-2">🕓 Asset History</h3>
      {logs.length === 0 ? (
        <p>No logs available for this asset.</p>
      ) : (
        <div className="bg-gray-100 p-4 rounded">
          <ul className="space-y-4">
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
                ([key, values]) => values.new !== null && values.new !== ''
              );

              return (
                <li
                  key={index}
                  className="border-b border-gray-300 pb-4 last:border-b-0"
                >
                  <div className="flex justify-between items-center mb-2">
                    <p><strong>Action:</strong> {log.action_type}</p>
                    <p className="text-sm"><strong>By:</strong> {log.changed_by}</p>
                    <p className="text-sm"><strong>Time:</strong> {new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                  <ul className="ml-4">
                    {filteredChanges.map(([field, values]) => (
                      <li key={field} className="mb-1">
                        <strong className="capitalize">{field}:</strong>
                        <span className="block ml-4">
                          <span className="text-gray-500">Old: {String(values.old)}</span>
                          <span className="text-green-600">New: {String(values.new)}</span>
                        </span>

                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AssetDetailsPage;
