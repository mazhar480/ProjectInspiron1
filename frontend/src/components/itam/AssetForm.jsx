import React, { useState, useEffect } from 'react';

function AssetForm({ initialValues = {}, onSubmit }) {
  const assetTypeOptions = [
    'Hardware',
    'Software',
    'License',
    'Other',
  ];


  const [formData, setFormData] = useState({
    name: '',
    assetTag: '',
    category: '',
    status: '',
    assetId: '', // New field
    assetType: '', // New field
     manufacturer: '', // New field
    owner: '', // New field
    warrantyInformation: '', // New field
    configurationDetails: '', // New field
    acquisitionDate: '',
    assetType: '',
    make: '',
    model: '',
    serialNumber: '',
    location: '',
    assignedUser: '',
    department: '',
    ipAddress: '',
    operatingSystem: '',
    processor: '',
    ramGb: '',
    storageType: '',
    storageCapacityGb: '',
    purchasePrice: '',
    warrantyStartDate: '',
    warrantyEndDate: '',
    project: '',
    projectLocation: '',
  });

  useEffect(() => {
    setFormData({
      name: initialValues.name || '',
      assetTag: initialValues.assetTag || '',
      category: initialValues.category || '',
      assetId: initialValues.assetId || '', // New field
      assetType: initialValues.assetType || '', // New field
       manufacturer: initialValues.manufacturer || '', // New field
      owner: initialValues.owner || '', // New field
      warrantyInformation: initialValues.warrantyInformation || '', // New field
      configurationDetails: initialValues.configurationDetails || '', // New field
      status: initialValues.status || '',
      acquisitionDate: initialValues.acquisitionDate?.split('T')[0] || '',
      assetType: initialValues.assetType || '',
      make: initialValues.make || '',
      model: initialValues.model || '',
      serialNumber: initialValues.serialNumber || '',
      location: initialValues.location || '',
      assignedUser: initialValues.assignedUser || '',
      department: initialValues.department || '',
      ipAddress: initialValues.ipAddress || '',
      operatingSystem: initialValues.operatingSystem || '',
      processor: initialValues.processor || '',
      ramGb: initialValues.ramGb || '',
      storageType: initialValues.storageType || '',
      storageCapacityGb: initialValues.storageCapacityGb || '',
      purchasePrice: initialValues.purchasePrice || '',
      warrantyStartDate: initialValues.warrantyStartDate || '',
      warrantyEndDate: initialValues.warrantyEndDate || '',
      project: initialValues.project || '',
      projectLocation: initialValues.projectLocation || '',
    });
  }, [initialValues]);

  const handleChange = (e) => {
     const { name, value, type, checked } = e.target;
    if (name === 'assetType') {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prev => ({ ...prev, [name]: selectedOptions }));
    }else if (type === 'checkbox') {

      const selectedTypes = formData.assetType
        ? [...formData.assetType]
        : [];
      if (checked) {
        selectedTypes.push(value);
      } else {
        selectedTypes.splice(selectedTypes.indexOf(value), 1);
      }
      setFormData(prev => ({ ...prev, assetType: selectedTypes }));
    } else {
       setFormData(prev => ({ ...prev, [name]: value }));
    }
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
        { label: 'Asset ID', name: 'assetId' }, // New field
        { label: 'Manufacturer', name: 'manufacturer' }, // New field
        { label: 'Owner', name: 'owner' }, // New field
        { label: 'Make', name: 'make' },
        { label: 'Model', name: 'model' },
        { label: 'Serial Number', name: 'serialNumber' },
        { label: 'Location', name: 'location' },
        { label: 'Assigned User', name: 'assignedUser' },
        { label: 'Department', name: 'department' },
        { label: 'IP Address', name: 'ipAddress' },
        { label: 'Operating System', name: 'operatingSystem' },
        { label: 'Processor', name: 'processor' },
        { label: 'RAM (GB)', name: 'ramGb' },
        { label: 'Storage Type', name: 'storageType' },
        { label: 'Storage Capacity (GB)', name: 'storageCapacityGb' },
        { label: 'Purchase Price', name: 'purchasePrice' },
        { label: 'Warranty Start Date', name: 'warrantyStartDate' },
        { label: 'Warranty End Date', name: 'warrantyEndDate' },
        { label: 'Project', name: 'project' },
        { label: 'Project Location', name: 'projectLocation' },
      ].map(({ label, name }) => (
        

        
        <div key={name}>
          <label className="block mb-1 font-medium">{label}</label>
          <input
           {...(name === 'name' || name === 'assetTag' || name === 'category' || name === 'status' || name === 'assetType'
              ? { required: true }
              : {})}
            
            name={name}
            
            value={formData[name]}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
      ))}
      <div>

  <label className="block mb-1 font-medium">Asset Type</label>
  <select
    name="assetType"
    multiple={true}
    value={formData.assetType}
    onChange={handleChange}
    className="w-full border px-3 py-2 rounded"
    >
    {assetTypeOptions.map((option) => (
        <option key={option} value={option}>
        {option}
        </option>
    ))}
    </select>

    
     </div>
        

     






      <div>
        <label  className="block mb-1 font-medium">Acquisition Date</label>
        <input
          type="date"
          name="acquisitionDate"
          value={formData.acquisitionDate}
           onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Disposal Method</label>
        <input
          name="disposalMethod"
          value={formData.disposalMethod}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Retirement Date</label>
        <input
          type="date"
          name="retirementDate"
          value={formData.retirementDate}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div>
          <label className="block mb-1 font-medium">Warranty Information</label>
          <textarea
            name="warrantyInformation"
            value={formData.warrantyInformation}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Configuration Details</label>
          <textarea
            name="configurationDetails"
            value={formData.configurationDetails}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

<div>
<label className="block mb-1 font-medium">Notes</label>
<textarea
  name="notes"
  value={formData.notes}
  onChange={handleChange}
  className="w-full border px-3 py-2 rounded"
/>

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
