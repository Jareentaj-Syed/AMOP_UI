"use client";
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 9999 }}>
      <div className="bg-white p-6 rounded shadow-lg w-3/4 max-w-4xl createPopup">

        <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
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
            className="cancel-btn"
          >
            <XMarkIcon className="h-5 w-5 text-black-500 mr-2" />

            Cancel
          </button>
          <button
            onClick={handleSave}
            className="save-btn"
          >
          <CheckIcon className="h-5 w-5 text-black-500 mr-2" />

            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
