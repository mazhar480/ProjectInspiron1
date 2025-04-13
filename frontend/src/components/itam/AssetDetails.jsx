// Frontend/src/components/itam/AssetDetails.js

import React from 'react';
import { Link } from 'react-router-dom';

function AssetDetails({ asset }) {
    if (!asset) {
        return <div>Loading...</div>; // Or a "No Asset Found" message
    }

    return (
        <div>
            <h2>Asset Details</h2>
            <p>Asset Tag: {asset.assetTag}</p>
            <p>Name: {asset.name}</p>
            <p>Type: {asset.assetType}</p>
            <p>Serial Number: {asset.serialNumber}</p>
            {/* Display other details */}
            <Link to={`/assets/${asset.id}/edit`}>Edit Asset</Link>
        </div>
    );
}

export default AssetDetails;