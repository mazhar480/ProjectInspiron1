import React, { useEffect, useState } from 'react';
import itamService from '../../services/itam.service';
import AssetList from '../../components/itam/AssetList';
import { Link } from 'react-router-dom';

function AssetListPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await itamService.getAllAssets();
        console.log("🟢 Assets fetched:", data);
        setAssets(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  // ✅ Delete Handler
  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this asset?');
    if (!confirm) return;

    try {
      await itamService.deleteAsset(id);
      setAssets(prev => prev.filter(asset => asset.id !== id));
    } catch (err) {
      console.error('Error deleting asset:', err);
      alert('Failed to delete asset');
    }
  };

  if (loading) return <div>Loading assets...</div>;
  if (error) return <div>Error loading assets: {error.message}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Asset List</h1>
        <Link
          to="/assets/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          ➕ Add Asset
        </Link>
      </div>

      <AssetList assets={assets} onDelete={handleDelete} />
    </div>
  );
}

export default AssetListPage;
