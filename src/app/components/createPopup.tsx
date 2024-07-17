import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useState, useEffect, useRef } from 'react';
import { Checkbox, Input, Modal } from 'antd';

interface Column {
  label: string;
  type: string;
  value: any[];
  mandatory: string;
}

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newRow: any) => void;
  columnNames: any[];
  heading: string;
}

const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose, onSave, columnNames, heading }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isScrollable, setIsScrollable] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalContentRef.current) {
      const isOverflowing = modalContentRef.current.scrollHeight > modalContentRef.current.clientHeight;
      setIsScrollable(isOverflowing);
    }
  }, [columnNames, isOpen]);

  if (!isOpen) return null;

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
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

  const handleSaveClick = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmSave = () => {
    handleSave();
    setIsConfirmationOpen(false);
  };

  const handleCancel = () => {
    setIsConfirmationOpen(false);
  };

  const modalWidth = (window.innerWidth * 2.5) / 4;
  const modalHeight = (window.innerHeight * 2.5) / 4;

  return (
    <>
      <Modal
        title={`Add New ${heading}`}
        visible={isOpen}
        onCancel={onClose}
        footer={null}
        width={modalWidth}
        bodyStyle={{ height: modalHeight }}
      >
        <div ref={modalContentRef} className="createPopup-height overflow-auto" style={{ height: '100%' }}>
          <form>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
              {columnNames.map(({ label, type, value, mandatory }) => (
                <div key={label} className="flex flex-col mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {label} {mandatory === 'true' && <span className="text-red-500">*</span>}
                  </label>
                  {type === 'text' && (
                    <Input
                      type="text"
                      name={label}
                      value={formData[label] || ''}
                      onChange={(e) => handleChange(label, e.target.value)}
                      className="input"
                    />
                  )}
                  {type === 'dropdown' && (
                    <div className="relative mt-1 block w-full">
                      <select
                        value={formData[label]}
                        onChange={(e) => handleChange(label, e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        {value.map((option: any) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
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
                      onChange={(e) => handleChange(label, e.target.value)}
                      className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </form>
        </div>
        <div className={`flex justify-end space-x-4 mt-4 ${isScrollable ? 'relative' : 'absolute bottom-4 right-4'}`}>
          <button onClick={onClose} className="cancel-btn">
            <XMarkIcon className="h-5 w-5 text-black-500 mr-2" />
            Cancel
          </button>
          <button onClick={handleSaveClick} className="save-btn">
            <CheckIcon className="h-5 w-5 text-black-500 mr-2" />
            Save
          </button>
        </div>
      </Modal>

      <Modal
        title={`Add New ${heading}`}
        visible={isConfirmationOpen}
        onOk={handleConfirmSave}
        onCancel={handleCancel}
        style={{ zIndex: 10000 }}
        centered
      >
        <p>Do you want to save?</p>
      </Modal>
    </>
  );
};

export default CreateModal;
