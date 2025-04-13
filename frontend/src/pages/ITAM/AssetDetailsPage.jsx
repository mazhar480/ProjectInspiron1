// Frontend/src/pages/ITAM/AssetDetailsPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
      <div className="bg-white rounded shadow p-4 mb-6">
        <p><strong>ID:</strong> {asset.id}</p>
        <p><strong>Name:</strong> {asset.name}</p>
        <p><strong>Asset Tag:</strong> {asset.assetTag}</p>
        <p><strong>Status:</strong> {asset.status}</p>
        <p><strong>Category:</strong> {asset.category}</p>
        {/* Add more fields as needed */}
      </div>

      <h3 className="text-xl font-semibold mb-2">🕓 Asset History</h3>
      {logs.length === 0 ? (
        <p>No logs available for this asset.</p>
      ) : (
        <div className="bg-gray-100 p-4 rounded">
          <ul className="space-y-3">
            {logs.map((log, index) => {
              let parsedChanges = {};
              try {
                parsedChanges = typeof log.changes === 'string' ? JSON.parse(log.changes) : log.changes;
              } catch (e) {
                console.error('Invalid JSON in log.changes');
              }

              const filteredChanges = Object.entries(parsedChanges).filter(
                ([key, value]) => value !== null && value !== ''
              );

              return (
                <li key={index} className="border-b pb-2">
                  <p><strong>Action:</strong> {log.action_type}</p>
                  <p><strong>By:</strong> {log.changed_by}</p>
                  <p><strong>Time:</strong> {new Date(log.timestamp).toLocaleString()}</p>
                  <ul className="mt-2 pl-4 list-disc text-sm">
                    {filteredChanges.map(([field, value]) => (
                      <li key={field}>
                        <strong>{field}</strong>: {String(value)}
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
