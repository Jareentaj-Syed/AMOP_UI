"use client";
import React, { useState, useEffect } from 'react';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedRow: any) => void;
  rowData: any;
  columnNames: string[];
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, rowData, columnNames = [] }) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    setFormData(rowData || {});  // Ensure formData is updated when rowData changes
  }, [rowData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState:any) => ({
      ...prevState,
      [name]: value.trim() === '' ? '' : value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-3/4 max-w-4xl">
        <h2 className="text-xl font-semibold mb-4">Edit Row</h2>
        <div className="space-y-4">
          {columnNames.map((key) => (
            key !== 'api_state' && (
              <div key={key} className="flex flex-col mb-4">
                <label className="block text-sm font-medium text-gray-700">{key}</label>
                <input
                  type="text"
                  name={key}
                  value={formData[key] || ''}  // Ensure default value for empty fields
                  onChange={handleChange}
                  className={`mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    key === 'api_url' || key === 'api_params' ? 'bg-gray-100 text-gray-500' : ''
                  }`}
                  readOnly={key === 'api_url' || key === 'api_params'}
                  style={{ width: '100%' }}  // Ensure input fields do not affect the layout
                />
              </div>
            )
          ))}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
