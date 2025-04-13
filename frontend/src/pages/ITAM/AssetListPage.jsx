import React, { useEffect, useState } from 'react';
import itamService from '../../services/itam.service';
import AssetList from '../../components/itam/AssetList';
import { Link } from 'react-router-dom';

function AssetListPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await itamService.getAllAssets();
        setAssets(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

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

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.assetTag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAssets = filteredAssets.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <div>Loading assets...</div>;
  if (error) return <div>Error loading assets: {error.message}</div>;

  return (
    <div className="p-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-sm text-gray-500">Total Assets</h3>
          <p className="text-2xl font-bold">{assets.length}</p>
        </div>
        {/* Add more KPI cards if needed */}
      </div>

      {/* Search & Add Button */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="🔍 Search by name or tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded w-1/2"
        />
        <Link
          to="/assets/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          ➕ Add Asset
        </Link>
      </div>

      {/* Asset Table */}
      <AssetList assets={currentAssets} onDelete={handleDelete} />

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default AssetListPage;