// AssetList.jsx refined with width, alignment, ellipsis, and tooltips
import React from 'react';
import { Link } from 'react-router-dom';

function AssetList({ assets, onDelete, sortKey, sortDirection, onSort, compactMode }) {
  if (!assets || assets.length === 0) return <p className="text-gray-500">No assets found.</p>;

  const renderSortIcon = (key) => {
    if (sortKey !== key) return '↕';
    return sortDirection === 'asc' ? '▲' : '▼';
  };

  const rowPadding = compactMode ? 'py-2' : 'py-4';
  const cellPadding = compactMode ? 'px-3' : 'px-5';
  const textSize = compactMode ? 'text-sm' : 'text-base';

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full table-auto bg-white">
        <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm text-sm text-gray-600">
          <tr>
            <th className={`w-1/12 border-b font-medium ${cellPadding} ${rowPadding} text-right cursor-pointer`} onClick={() => onSort('id')}>
              ID {renderSortIcon('id')}
            </th>
            <th className={`w-1/4 border-b font-medium ${cellPadding} ${rowPadding} text-left cursor-pointer`} onClick={() => onSort('name')}>
              Name {renderSortIcon('name')}
            </th>
            <th className={`w-1/4 border-b font-medium ${cellPadding} ${rowPadding} text-left cursor-pointer`} onClick={() => onSort('assetTag')}>
              Tag {renderSortIcon('assetTag')}
            </th>
            <th className={`w-1/6 border-b font-medium ${cellPadding} ${rowPadding} text-left cursor-pointer`} onClick={() => onSort('status')}>
              Status {renderSortIcon('status')}
            </th>
            <th className={`w-1/6 border-b font-medium ${cellPadding} ${rowPadding} text-left`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map(asset => (
            <tr
              key={asset.id}
              className={`hover:bg-gray-50 odd:bg-white even:bg-gray-50 transition-colors duration-150 ease-in-out ${textSize}`}
            >
              <td className={`${cellPadding} ${rowPadding} border-b text-right text-gray-700`}>{asset.id}</td>
              <td className={`${cellPadding} ${rowPadding} border-b text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-xs`} title={asset.name}>{asset.name}</td>
              <td className={`${cellPadding} ${rowPadding} border-b text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-xs`} title={asset.assetTag}>{asset.assetTag}</td>
              <td className={`${cellPadding} ${rowPadding} border-b`}>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold 
                  ${asset.status === 'In Use' ? 'bg-green-100 text-green-800' :
                    asset.status === 'Retired' ? 'bg-gray-200 text-gray-700' :
                    'bg-yellow-100 text-yellow-800'}`}>
                  {asset.status || 'Unknown'}
                </span>
              </td>
              <td className={`${cellPadding} ${rowPadding} border-b space-x-3 whitespace-nowrap`}>
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