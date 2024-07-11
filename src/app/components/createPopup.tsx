"use client";
import React, { useState } from 'react';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newRow: any) => void;
  columnNames: string[];
}

const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose, onSave, columnNames }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"  style={{ zIndex: 9999}}>
      <div className="bg-white p-6 rounded shadow-lg w-3/4 max-w-4xl createPopup">
        <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>
        <div className="space-y-4">
          {columnNames.map((key) => (
            key !== 'api_state' && (
            <div key={key} className="flex flex-col mb-4">
              <label className="block text-sm font-medium text-gray-700">{key}</label>
              <input
                type="text"
                name={key}
                value={formData[key] || ''}
                onChange={handleChange}
                className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            )
          ))}
        </div>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 w-[80px] text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 w-[80px] text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
