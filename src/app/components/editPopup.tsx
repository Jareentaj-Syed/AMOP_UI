import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { Checkbox, Input, Modal } from 'antd';
import Select from 'react-select';
import { DropdownStyles } from './css/dropdown';
import CreateUser from '../partner/users/createUser/page';
import axios from 'axios';
import { useAuth } from './auth_context';

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
  editColumns: Column[];
  isEditable: boolean;
  heading: string;
  isTabEdit: any
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, rowData, infoColumns = [], editColumns = [], isEditable, heading, isTabEdit }) => {
  const [formData, setFormData] = useState<any>({});
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const editableDrp = DropdownStyles
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(isTabEdit);
  const {username, tenantNames, role, partner}=useAuth()
  
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
  const fetchData = async () => {
    try {
    
      const url = `https://zff5caoge3.execute-api.ap-south-1.amazonaws.com/dev/get_partner_info`;
      const data = {
        tenant_name: partner || "default_value",
        username: username,
        path:"/update_superadmin_data",
        role_name: role,
        "sub_module": "Partner API", 
        "sub_tab": "Carrier APIs",
        flag: "withoutparameters",
       "changed_data":" "
      };
      const response = await axios.post(url, { data: data });
      const resp = JSON.parse(response.data.body);

      const carrierApis = resp.data.Carrier_apis_data.carrier_apis;

     
    } catch (err) {

      console.error(err);
    }finally {
      // Set loading to false after the request is done
    }
  
  };
  const handleSave = () => {
    console.log("form data:",formData)
    onSave(formData);
    
    onClose();
  };


  const handleCancel = () => {
    onClose();
  };
  const showConfirmation = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmSave = async() => {
    formData["lastmodifiedby"]=username
    if(formData){
      try {
        const url =
          "https://zff5caoge3.execute-api.ap-south-1.amazonaws.com/dev/get_partner_info";

        let data;
        if(heading==="Carrier"){
          if(formData){
            formData["lastmodifiedby"]=username
          }
           data = {
            tenant_name: partner || "default_value",
            username: username,
            path:"/update_superadmin_data",
            role_name: role,
            "sub_module": "Partner API", 
            "sub_tab": "Carrier APIs",
            "table_name": "carrier_apis",
           "changed_data":formData
          };
        }
        
        if(heading==="API"){
          if(formData){
            formData["last_modified_by"]=username
            
          }
          data = {
            tenant_name: partner || "default_value",
            username: username,
            path:"/update_superadmin_data",
            role_name: role,
            "sub_module": "Partner API", 
            "sub_tab": "Amop APIs",
            "table_name": "amop_apis",
            "changed_data":formData
          };
        }
     
        const response = await axios.post(url, { data });
       
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    handleSave();
    setIsConfirmationOpen(false);
  };

  const handleCancelConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  const handleTabEditClose = () => {
    setIsCreateUserOpen(false);
  };

  const handleTabEditOpen = () => {
    setIsCreateUserOpen(true);
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
  

  const modalWidth = typeof window !== 'undefined' ? (window.innerWidth * 2.5) / 4 : 0;
  const modalHeight = typeof window !== 'undefined' ? (window.innerHeight * 2.5) / 4 : 0;  
  return (
    <div>
       {isTabEdit ? (
        <>
        <Modal
        title={"Edit User"}
        open={isOpen}
        onCancel={handleCancel}
        width={modalWidth}
        styles={{ body: { height: modalHeight, padding: '4px' } }}
        footer={null}
        >
          <div className='popup'>
          <CreateUser 
          isPopup={true}
          rowData={rowData}
          />

          </div>
        </Modal>
        </>
        
      ) : (
        <>
          <Modal
            open={isOpen}
            onCancel={handleCancel}
            title={
              <h3 className='popup-heading'>{isEditable ? `Edit ${heading}` : `${heading} Details`}</h3>
            }
            footer={isEditable ? (
              <div className="justify-center flex space-x-2">
                <button onClick={handleCancel} className="cancel-btn">
                  <CloseOutlined className="h-5 w-5 text-black-500 mr-2" />
                  Cancel
                </button>
                <button onClick={showConfirmation} className="save-btn">
                  <CheckOutlined className="h-5 w-5 text-black-500 mr-2" />
                  Save
                </button>
              </div>
            ) : null
            }
            width={modalWidth}
            styles={{ body: { height: modalHeight, padding: '4px' } }}
          >
            <div className='popup'>
              <div className='grid grid-cols-2 gap-4 md:grid-cols-2'>
                {!isEditable
                  ? infoColumns.map((column: Column) => (
                    <div key={column.label} className="flex flex-col mb-4">
                      <label className="field-label">
                        {formatColumnName(column.label)} {column.mandatory === 'true' && <span className="text-red-500">*</span>}
                      </label>
                      <Input
                        type="text"
                        name={column.label}
                        value={formData[column.label] || ''}
                        readOnly={!isEditable}
                        className="input"
                      />
                    </div>
                  ))
                  : editColumns.map((column: Column) => (
                    <div key={column.label} className="flex flex-col mb-4">
                      <label className="field-label">
                      {formatColumnName(column.label)} {column.mandatory === 'true' && <span className="text-red-500">*</span>}
                      </label>
                      {column.type === 'text' && (
                        <Input
                          type="text"
                          name={column.label}
                          value={formData[column.label] || ''}
                          onChange={(e) => handleChange(column.label, e.target.value)}
                          className="input"
                        />
                      )}
                      {column.type === 'dropdown' && (
                        <Select
                          name={column.label}
                          value={{ label: formData[column.label], value: formData[column.label] }}
                          onChange={(selectedOption: any) => handleChange(column.label, selectedOption.value)}
                          options={column.value.map((option: string) => ({ label: option, value: option }))}
                          styles={editableDrp}
                        />
                      )}
                      {column.type === 'checkbox' && (
                        <Checkbox
                          checked={formData[column.label] || false}
                          onChange={(e) => handleChange(column.label, e.target.checked)}
                          className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          {column.label}
                        </Checkbox>
                      )}
                      {column.type === 'date' && (
                        <Input
                          type="date"
                          name={column.label}
                          value={formData[column.label] || ''}
                          onChange={(e) => handleChange(column.label, e.target.value)}
                          className="input"
                        />
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </Modal>

          <Modal
            visible={isConfirmationOpen}
            onOk={handleConfirmSave}
            onCancel={handleCancelConfirmation}
            okText="Save"
            cancelText="Cancel"
            centered
          >
            <h3 className='confirm-popup-heading'>{isEditable ? `Edit ${heading}` : `${heading} Details`}</h3>
            <p>Are you sure you want to save changes?</p>
          </Modal>
        </>
      )
      }
    </div>

  );
};

export default EditModal;
