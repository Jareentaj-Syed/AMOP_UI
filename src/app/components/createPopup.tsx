import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useState, useEffect, useRef } from 'react';
import { Checkbox, Input, Modal } from 'antd';
import Select from 'react-select';
import { DropdownStyles } from './css/dropdown';
import axios from 'axios';
import { useAuth } from './auth_context';

interface Column {
  label: string;
  type: string;
  value: any[];
  mandatory: string;
  header?:string[]
}

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newRow: any) => void;
  columnNames: any[];
  heading: string;
  header?:string[]

}

const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose, onSave, columnNames, heading ,header=[]}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isScrollable, setIsScrollable] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const {username, tenantNames, role, partner}=useAuth()
  const editableDrp=DropdownStyles
  useEffect(() => {
    if (modalContentRef.current) {
      const isOverflowing = modalContentRef.current.scrollHeight > modalContentRef.current.clientHeight;
      setIsScrollable(isOverflowing);
    }
  }, [columnNames, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      const initialFormData = Object.fromEntries(header.map((h) => [h, "None"]));
      setFormData(initialFormData);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (name: string, value: any) => {
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };
  const handleSave= async() => {
    // Validate mandatory fields
    const missingFields = columnNames
      .filter(column => column.mandatory === 'true' && !formData[column.label])
      .map(column => column.label);

      if(formData){
        try {
          const url =
            "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management";
  
          let data;
          if(heading==="E911 Customer"){
            if(formData){
              formData["modifiedby"]=username
            }
            data = {
              tenant_name: partner || "default_value",
              username: username,
              path:"/update_poeple_data",
              role_name: role,
              "parent_module": "People", 
              "module": "E9 Customer Customer",
              "table_name": "customers",
              "changed_data":formData
            };
          }
          if(heading===" NetSapien Customer"){
            if(formData){
              formData["modifiedby"]=username
              
            }
            data = {
              tenant_name: partner || "default_value",
              username: username,
              path:"/update_poeple_data",
              role_name: role,
              "parent_module": "People", 
              "module": " NetSapien Customer",
              "table_name": "customers",
              "changed_data":formData
            };
          }
          if(heading==="RevIO Customer"){
            if(formData){
              formData["modifiedby"]=username
              
            }
            data = {
              tenant_name: partner || "default_value",
              username: username,
              path:"/update_poeple_data",
              role_name: role,
              "parent_module": "People", 
              "module": "RevIO Customer",
              "table_name": "customers",
              "changed_data":formData
            };
          }
          if(heading===" Bandwidth Customer"){
            if(formData){
              formData["modifiedby"]=username
              
            }
            data = {
              tenant_name: partner || "default_value",
              username: username,
              path:"/update_poeple_data",
              role_name: role,
              "parent_module": "People", 
              "module": "Bandwidth Customer",
              "table_name": "customers",
              "changed_data":formData
            };
          }
         
       
          const response = await axios.post(url, { data });
         
        } catch (err) {
          console.error("Error fetching data:", err);
        }
      }

    onSave(formData);
    onClose();
    console.log("formData",formData)
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
  const formatColumnName = (name: string) => {
    return name
      .replace(/_/g, ' ')          // Replace underscores with spaces
      .split(' ')                  // Split the string into words
      .map(word =>                 // Capitalize each word
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(' ');                  // Join the words back into a single string
  };
  
  const modalWidth = (window.innerWidth * 2.5) / 4;
  const modalHeight = (window.innerHeight * 2.5) / 4;

  return (
    <>
      <Modal
        visible={isOpen}
        onCancel={onClose}
        title={
          <h3 className='popup-heading'>{`Add New ${heading}`}</h3>
        }
        footer={
          <div className="flex justify-center space-x-2">
          <button onClick={onClose} className="cancel-btn">
            <XMarkIcon className="h-5 w-5 text-black-500 mr-2" />
            Cancel
          </button>
          <button onClick={handleSaveClick} className="save-btn">
            <CheckIcon className="h-5 w-5 text-black-500 mr-2" />
            Save
          </button>
        </div>
        }
        width={modalWidth}
        styles={{ body: { height: modalHeight, padding: '4px' } }}
      >
        <div ref={modalContentRef} className="popup">
          <form>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
              {columnNames.map(({ label, type, value, mandatory }) => (
                <div key={label} className="flex flex-col mb-4">
                  <label className="field-label">
                  {formatColumnName(label)} {mandatory === 'true' && <span className="text-red-500">*</span>}
                  </label>
                  {type === 'text' && (
                    <Input
                      type="text"
                      name={formatColumnName(label)}
                      value={formData[label] || ''}
                      onChange={(e) => handleChange(label, e.target.value)}
                      className="input"
                    />
                  )}
                  {type === 'dropdown' && (
                      <Select
                        value={{ label: formData[label], value: formData[label] }}
                        onChange={(selectedOption:any) => handleChange(label, selectedOption.value)}
                        options={value.map((option: any) => ({ label: option, value: option }))}
                        styles={editableDrp}
                      />
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
                      className="input"
                    />
                  )}
                </div>
              ))}
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        visible={isConfirmationOpen}
        onOk={handleConfirmSave}
        onCancel={handleCancel}
        style={{ zIndex: 10000 }}
        centered
      >
        <h3 className='confirm-popup-heading'>{`Add New ${heading}`}</h3>
        <p>Do you want to save?</p>
      </Modal>
    </>
  );
};

export default CreateModal;
