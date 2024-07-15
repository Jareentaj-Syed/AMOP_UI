"use client";
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useState, useEffect, useRef } from 'react';

interface Column {
  label: string;
  type: string;
  value: any;
  mandatory: string;
}

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newRow: any) => void;
  columnNames: Column[];
  heading: string;
}

const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose, onSave, columnNames, heading }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isScrollable, setIsScrollable] = useState(false);
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalContentRef.current) {
      const isOverflowing = modalContentRef.current.scrollHeight > modalContentRef.current.clientHeight;
      setIsScrollable(isOverflowing);
    }
  }, [columnNames, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSave = () => {
    // Validate mandatory fields
    const missingFields = columnNames
      .filter(column => column.mandatory === 'true' && !formData[column.label])
      .map(column => column.label);

    if (missingFields.length > 0) {
      alert(`Please fill in the mandatory fields: ${missingFields.join(', ')}`);
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 9999 }}>
      <div className="bg-white p-6 rounded shadow-lg w-3/4 max-w-4xl relative createPopup" style={{ paddingBottom: isScrollable ? '0' : '2rem' }}>
        <h2 className="text-xl font-semibold mb-4">{`Add New ${heading}`}</h2>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div ref={modalContentRef} className="createPopup-height overflow-auto">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
            {columnNames.map(({ label, type, value, mandatory }) => (
              <div key={label} className="flex flex-col mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  {label} {mandatory === 'true' && <span className="text-red-500">*</span>}
                </label>
                {type === 'text' && (
                  <input
                    type="text"
                    name={label}
                    value={formData[label] || ''}
                    onChange={handleChange}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                )}
                {type === 'dropdown' && (
                  <select
                    name={label}
                    value={formData[label] || ''}
                    onChange={handleChange}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    {value.map((option: string) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
                {type === 'checkbox' && (
                  <input
                    type="checkbox"
                    name={label}
                    checked={formData[label] || false}
                    onChange={handleChange}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                )}
                {type === 'date' && (
                  <input
                    type="date"
                    name={label}
                    value={formData[label] || ''}
                    onChange={handleChange}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className={`flex justify-end space-x-4 mt-4 ${isScrollable ? 'relative' : 'absolute bottom-4 right-4'}`}>
          <button onClick={onClose} className="cancel-btn">
            <XMarkIcon className="h-5 w-5 text-black-500 mr-2" />
            Cancel
          </button>
          <button onClick={handleSave} className="save-btn">
            <CheckIcon className="h-5 w-5 text-black-500 mr-2" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
