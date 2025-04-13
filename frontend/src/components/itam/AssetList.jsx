import React from 'react';
import { Link } from 'react-router-dom';

function AssetList({ assets, onDelete }) {
  if (!assets || assets.length === 0) return <p>No assets found.</p>;

  return (
    <div className="overflow-x-auto rounded-lg shadow border">
      <table className="min-w-full bg-white text-sm text-left">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 border-b font-semibold text-gray-600">ID</th>
            <th className="px-4 py-3 border-b font-semibold text-gray-600">Name</th>
            <th className="px-4 py-3 border-b font-semibold text-gray-600">Tag</th>
            <th className="px-4 py-3 border-b font-semibold text-gray-600">Status</th>
            <th className="px-4 py-3 border-b font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map(asset => (
            <tr key={asset.id} className="hover:bg-gray-50 transition">
              <td className="px-4 py-2 border-b">{asset.id}</td>
              <td className="px-4 py-2 border-b">{asset.name}</td>
              <td className="px-4 py-2 border-b">{asset.assetTag}</td>
              <td className="px-4 py-2 border-b">
                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                  ${asset.status === 'In Use' ? 'bg-green-100 text-green-800' :
                    asset.status === 'Retired' ? 'bg-gray-200 text-gray-700' :
                    'bg-yellow-100 text-yellow-800'}`}>
                  {asset.status || 'Unknown'}
                </span>
              </td>
              <td className="px-4 py-2 border-b space-x-2">
                <Link
                  to={`/assets/${asset.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
                <Link
                  to={`/assets/${asset.id}/edit`}
                  className="text-indigo-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => onDelete(asset.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AssetList;
