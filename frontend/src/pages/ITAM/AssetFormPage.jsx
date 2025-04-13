import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AssetForm from '../../components/itam/AssetForm';
import itamService from '../../services/itam.service';

function AssetFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [initialValues, setInitialValues] = useState({});
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      itamService.getAssetById(id)
        .then(data => setInitialValues(data))
        .catch(err => {
          setError(err.message);
          console.error('Failed to load asset:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditMode]);

  const handleSubmit = async (formData) => {
    try {
      if (isEditMode) {
        await itamService.updateAsset(id, formData); // 🔁 PUT
        alert('Asset updated!');
        navigate('/assets');
      } else {
        const newAsset = await itamService.createAsset(formData); // 🆕 POST
        alert('Asset created!');
        navigate(`/assets/${newAsset.id}`);
      }
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="p-4">Loading asset data...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">
        {isEditMode ? 'Edit Asset' : 'Add New Asset'}
      </h1>
      <AssetForm onSubmit={handleSubmit} initialValues={initialValues} />
    </div>
  );
}

export default AssetFormPage;
