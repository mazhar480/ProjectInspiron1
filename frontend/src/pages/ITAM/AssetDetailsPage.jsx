// Enhanced AssetListPage.jsx with compact/spacious view toggle
import React, { useEffect, useState } from 'react';
import itamService from '../../services/itam.service';
import AssetList from '../../components/itam/AssetList';
import { Link } from 'react-router-dom';

function AssetListPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [compactMode, setCompactMode] = useState(true);
  const itemsPerPage = 5;

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const data = await itamService.getAllAssets();
      setAssets(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assetTag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? asset.status === statusFilter : true;
    const matchesCategory = categoryFilter ? asset.category === categoryFilter : true;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    const valA = a[sortKey]?.toString().toLowerCase() || '';
    const valB = b[sortKey]?.toString().toLowerCase() || '';
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedAssets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAssets = sortedAssets.slice(startIndex, startIndex + itemsPerPage);

  const uniqueStatuses = [...new Set(assets.map(a => a.status).filter(Boolean))];
  const uniqueCategories = [...new Set(assets.map(a => a.category).filter(Boolean))];

  if (loading) return <div className="text-center py-8">Loading assets...</div>;
  if (error) return <div className="text-center text-red-600 py-8">Error loading assets: {error.message}</div>;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 shadow rounded-lg border border-gray-100">
          <h3 className="text-sm text-gray-500">Total Assets</h3>
          <p className="text-3xl font-bold text-blue-600">{assets.length}</p>
        </div>
      </div>

      <div className="bg-white p-4 shadow rounded-lg mb-6 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
          <input
            type="text"
            placeholder="🔍 Search by name or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded w-full md:w-[250px]"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded"
          >
            <option value="">All Statuses</option>
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded"
          >
            <option value="">All Categories</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={() => setCompactMode(!compactMode)}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-sm"
          >
            {compactMode ? 'Expand View' : 'Compact View'}
          </button>

          <button
            onClick={fetchAssets}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-sm"
          >
            🔁 Refresh
          </button>

          <Link
            to="/assets/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            ➕ Add Asset
          </Link>
        </div>
      </div>

      {currentAssets.length > 0 ? (
        <AssetList
          assets={currentAssets}
          onDelete={handleDelete}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
          compactMode={compactMode}
        />
      ) : (
        <div className="text-gray-500 text-center py-12">No assets match your search or filters.</div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AssetListPage;