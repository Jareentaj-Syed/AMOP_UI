import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { Checkbox, Input, Modal } from 'antd';

interface Column {
  label: string;
  type: string;
  value: any;
  mandatory: string;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedRow: any) => void;
  rowData: any;
  infoColumns: Column[];
  editColumns: string[];
  isEditable: boolean;
  heading: string;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, rowData, infoColumns = [], editColumns = [], isEditable, heading }) => {
  const [formData, setFormData] = useState<any>({});
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  useEffect(() => {
    setFormData(rowData || {});
  }, [rowData]);

  useEffect(() => {
    if (!isOpen) {
      setFormData(rowData || {});
    }
  }, [isOpen, rowData]);

  const handleChange = (name: string, value: any) => {
    setFormData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const showConfirmation = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmSave = () => {
    handleSave();
    setIsConfirmationOpen(false);
  };

  const handleCancelConfirmation = () => {
    setIsConfirmationOpen(false);
  };
  const modalWidth = (window.innerWidth * 2.5) / 4;
  const modalHeight = (window.innerHeight * 2.5) / 4;

  return (
    <>
      <Modal
        title={isEditable ? `Edit ${heading}` : `${heading} Details`}
        visible={isOpen}
        onCancel={handleCancel}
        footer={null}
        width={modalWidth} // Example: Adjust width as needed
        maskClosable={false} // Prevent closing on mask click
        bodyStyle={{ height: modalHeight, padding:'4px'}}

      >
        <div className={`overflow-auto ${isEditable ? 'max-h-85' : 'max-h-full'}`}>
        <div className='grid grid-cols-2 gap-4 md:grid-cols-2'>
          {isEditable ? (
            editColumns.map((key) => (
              <div key={key} className="flex flex-col mb-4">
                <label className="block text-sm font-medium text-gray-700">{key}</label>
                <Input
                  type="text"
                  name={key}
                  value={formData[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  style={{ width: '100%' }}
                />
              </div>
            ))
          ) : (
            infoColumns.map(({ label, type, value, mandatory }) => (
              <div key={label} className="flex flex-col mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  {label} {mandatory === 'true' && <span className="text-red-500">*</span>}
                </label>
                {type === 'text' && (
                  <Input
                    type="text"
                    name={label}
                    value={formData[label] || ''}
                    readOnly
                    className="input"
                    style={{ width: '100%' }}
                  />
                )}
                {type === 'dropdown' && (
                  <select
                    name={label}
                    value={formData[label]}
                    disabled
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    style={{ width: '100%' }}
                  >
                    {value.map((option: string) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
                {type === 'checkbox' && (
                  <Checkbox
                    checked={formData[label] || false}
                    onChange={(e) => handleChange(label, e.target.checked)}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    {label}
                  </Checkbox>
                )}
                {type === 'date' && (
                  <Input
                    type="date"
                    name={label}
                    value={formData[label] || ''}
                    readOnly
                    className="input"
                    style={{ width: '100%' }}
                  />
                )}
              </div>
            ))
          )}
        </div>
        </div>
        {isEditable && (
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button onClick={handleCancel} className="cancel-btn">
              <CloseOutlined className="h-5 w-5 text-black-500 mr-2" />
              Cancel
            </button>
            <button onClick={showConfirmation} className="save-btn">
              <CheckOutlined className="h-5 w-5 text-black-500 mr-2" />
              Save
            </button>
          </div>
        )}
      </Modal>

      <Modal
        title={`Save Changes to ${heading}`}
        visible={isConfirmationOpen}
        onOk={handleConfirmSave}
        onCancel={handleCancelConfirmation}
        okText="Save"
        cancelText="Cancel"
        centered
      >
        <p>Are you sure you want to save changes?</p>
      </Modal>
    </>
  );
};

export default EditModal;
