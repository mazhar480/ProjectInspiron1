import React from 'react';
import { Link } from 'react-router-dom';

function AssetList({ assets, onDelete }) {
  if (!assets || assets.length === 0) return <p>No assets found.</p>;

  return (
    <table className="table-auto w-full border">
      <thead>
        <tr>
          <th className="border px-4 py-2">ID</th>
          <th className="border px-4 py-2">Name</th>
          <th className="border px-4 py-2">Tag</th>
          <th className="border px-4 py-2">Status</th>
          <th className="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {assets.map(asset => (
          <tr key={asset.id}>
            <td className="border px-4 py-2">{asset.id}</td>
            <td className="border px-4 py-2">{asset.name}</td>
            <td className="border px-4 py-2">{asset.assetTag}</td>
            <td className="border px-4 py-2">{asset.status}</td>
            <td className="border px-4 py-2 space-x-2">
              <Link
                to={`/assets/${asset.id}`}
                className="text-green-600 hover:underline"
              >
                View
              </Link>
              <Link
                to={`/assets/${asset.id}/edit`}
                className="text-blue-600 hover:underline"
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
  );
}

export default AssetList;
