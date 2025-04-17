import React from 'react';
import { Link } from 'react-router-dom';

function AssetDetails({ asset }) {
  if (!asset) {
    return <div>Loading...</div>; // Or a "No Asset Found" message
  }

  return (
    <div>
      <h2>Asset Details</h2>
      <p>Asset ID: {asset.asset_id}</p>
      <p>Asset Tag: {asset.assetTag}</p>
      <p>Name: {asset.name}</p>
      <p>Asset Type: {asset.asset_type}</p>
      <p>Manufacturer: {asset.manufacturer}</p>
      <p>Owner: {asset.owner}</p>
      {asset.warranty_information && (
        <p>Warranty Information: {asset.warranty_information}</p>
      )}

      {asset.configuration_details && (
        <p>Configuration Details: {asset.configuration_details}</p>
      )}

      {asset.related_assets && (
        <p>Related Assets: {asset.related_assets}</p>
      )}

      {/* Display other details */}
      <Link to={`/assets/${asset.id}/edit`}>Edit Asset</Link>
    </div>
  );
}

export default AssetDetails;