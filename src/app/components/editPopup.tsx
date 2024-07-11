import React, { useState, useEffect } from 'react';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedRow: any) => void;
  rowData: any;
  columnNames: string[];
  isEditable: boolean; // Added isEditable prop
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, rowData, columnNames = [], isEditable }) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    // Set formData to rowData when rowData changes
    setFormData(rowData || {});
  }, [rowData]);

  useEffect(() => {
    // Reset formData when modal closes without saving
    if (!isOpen) {
      setFormData(rowData || {});
    }
  }, [isOpen, rowData]);

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
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50  ${isOpen ? '' : 'hidden'}`} style={{ zIndex: 9999}}>
      <div className="bg-white p-6 rounded shadow-lg w-3/4 max-w-4xl editPopup">
        <h2 className="text-xl font-semibold mb-4">{isEditable?(<span>Edit Customer</span>):(<span>Customer Details</span>)}</h2>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
         >
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
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm "
                  readOnly={!isEditable} 
                  style={{ width: '100%' }}
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
