import React, { useState, useEffect } from 'react';

function AssetForm({ initialValues = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    assetTag: '',
    category: '',
    status: '',
    acquisitionDate: '',
    assetType: '',
  });

  useEffect(() => {
    setFormData({
      name: initialValues.name || '',
      assetTag: initialValues.assetTag || '',
      category: initialValues.category || '',
      status: initialValues.status || '',
      acquisitionDate: initialValues.acquisitionDate?.split('T')[0] || '',
      assetType: initialValues.assetType || '',
    });
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
      {[
        { label: 'Asset Name', name: 'name' },
        { label: 'Asset Tag', name: 'assetTag' },
        { label: 'Category', name: 'category' },
        { label: 'Status', name: 'status' },
        { label: 'Asset Type', name: 'assetType' },
      ].map(({ label, name }) => (
        <div key={name}>
          <label className="block mb-1 font-medium">{label}</label>
          <input
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
      ))}

      <div>
        <label className="block mb-1 font-medium">Acquisition Date</label>
        <input
          type="date"
          name="acquisitionDate"
          value={formData.acquisitionDate}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {initialValues.id ? 'Update Asset' : 'Create Asset'}
      </button>
    </form>
  );
}

export default AssetForm;
