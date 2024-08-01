import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { Checkbox, Input, Modal } from 'antd';
import Select from 'react-select';
import { DropdownStyles, NonEditableDropdownStyles } from './css/dropdown';
import CreateUser from '../partner/users/createUser/page';
import axios from 'axios';
import { useAuth } from './auth_context';
import { DatePicker } from 'antd';
import moment from 'moment';
import dayjs from 'dayjs';
interface Column {
  display_name: string;
  db_column_name: string;
  type: string;
  default: string;
  mandatory: string;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedRow: any) => void;
  rowData: any;
  createModalData: Column[];
  isEditable: boolean;
  heading: string;
  isTabEdit: any;
  generalFields?: Record<string, any>; // To store general fields for dropdowns
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  rowData,
  createModalData = [],
  isEditable,
  heading,
  isTabEdit,
  generalFields
}) => {
  const [formData, setFormData] = useState<any>({});
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const editableDrp = DropdownStyles;
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(isTabEdit);
  const { username, tenantNames, role, partner } = useAuth();
  // console.log("createModalData",createModalData)
  // console.log("formData",createModalData)

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
    console.log("form data:", formData);
    onSave(formData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const showConfirmation = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmSave = async () => {
    if (formData) {
      try {
        const url =
          "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management";

        let data;
        if (heading === "Customer Group") {
          if (formData) {
            formData["modifiedby"] = username;
          }
          data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/update_partner_info",
            role_name: role,
            module_name: "Customer groups",
            action: "update",
            updated_data: formData
          };
        }
        if (heading === "Carrier") {
          if (formData) {
            formData["lastmodifiedby"] = username;
          }
          data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/update_superadmin_data",
            role_name: role,
            "sub_module": "Partner API",
            "sub_tab": "Carrier APIs",
            "table_name": "carrier_apis",
            "changed_data": formData
          };
        }

        if (heading === "API") {
          if (formData) {
            formData["last_modified_by"] = username;
          }
          data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/update_superadmin_data",
            role_name: role,
            "sub_module": "Partner API",
            "sub_tab": "Amop APIs",
            "table_name": "amop_apis",
            "changed_data": formData
          };
        }

        if (heading === "E911 Customer") {
          if (formData) {
            formData["modified_by"] = username;
          }
          data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/update_people_data",
            role_name: role,
            "parent_module": "People",
            "module": "E911 Customer Customer",
            "table_name": "weste911customer",
            action: "update",
            "changed_data": formData
          };
        }
        if (heading === " NetSapien Customer") {
          if (formData) {
            formData["modifiedby"] = username;
          }
          data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/update_people_data",
            role_name: role,
            "parent_module": "People",
            "module": " NetSapien Customer",
            "table_name": "customers",
            action: "update",
            "changed_data": formData
          };
        }
        if (heading === "RevIO Customer") {
          if (formData) {
            formData["modifiedby"] = username;
          }
          data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/update_people_data",
            role_name: role,
            "parent_module": "People",
            "module": "RevIO Customer",
            "table_name": "customers",
            action: "update",
            "changed_data": formData
          };
        }

        const response = await axios.post(url, { data });
      } catch (err) {
        console.error("Error fetching data:", err);
      }
      setIsConfirmationOpen(false);
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
  const getKey = (obj:any) => {
    if(obj){
      const list=Object.values(obj)
      console.log("list[0]",list[0])
      return list[0]
    }
    
  };

  // const formatColumnName = (name: string) => {
  //   return name
  //     .replace(/_/g, ' ')          // Replace underscores with spaces
  //     .split(' ')                  // Split the string into words
  //     .map(word =>                 // Capitalize each word
  //       word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  //     )
  //     .join(' ');                  // Join the words back into a single string
  // };

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
                {createModalData.map((column: Column) => (
                  <div key={column.db_column_name} className="flex flex-col mb-4">
                    <label className="field-label">
                      {column.display_name} {column.mandatory === 'true' && <span className="text-red-500">*</span>}
                    </label>
                    {column.type === 'text' && (
                      <Input
                        type="text"
                        name={formData[column.db_column_name] && formData[column.db_column_name] !== "None" ? column.db_column_name : ""}
                        value={formData[column.db_column_name] && formData[column.db_column_name] !== "None" ? formData[column.db_column_name] : ''}
                        onChange={(e) => handleChange(column.db_column_name, e.target.value)}
                        className={isEditable ? "input" : "non-editable-input"}
                        disabled={!isEditable}
                      />
                    )}
                    {column.type === 'dropdown' && (
                      <Select
                        styles={!isEditable ? NonEditableDropdownStyles : editableDrp}
                        isDisabled={!isEditable}
                        classNamePrefix="select"
                        placeholder="Select..."
                        value={
                          generalFields &&
                            generalFields[column.db_column_name] &&
                            Array.isArray(generalFields[column.db_column_name])
                            ? generalFields[column.db_column_name].find((option: any) => option.tenant_name === formData[column.db_column_name])
                              ? { label: formData[column.db_column_name], value: formData[column.db_column_name] }
                              : null
                            : null
                        }
                        onChange={(selectedOption) => handleChange(column.db_column_name, selectedOption?.value)}
                        options={
                          generalFields && generalFields[column.db_column_name] && Array.isArray(generalFields[column.db_column_name])
                            ? generalFields[column.db_column_name].map((option: any) => ({
                              label:getKey(option),
                              value:getKey(option)
                            }))
                            : [{ label: "No options", value: "No options" }]
                        }
                      />
                    )}

                    {column.type === 'checkbox' && (
                      <Checkbox
                        checked={formData[column.db_column_name] && column.db_column_name !== "None" ? formData[column.db_column_name] : false}
                        onChange={(e) => handleChange(column.db_column_name, e.target.checked)}
                        className="mt-1"
                      >
                        {column.display_name}
                      </Checkbox>
                    )}
                    {column.type === 'date' && (
                      <DatePicker
                        value={formData[column.db_column_name] ? dayjs(formData[column.db_column_name]) : null}
                        onChange={(date) => handleChange(column.db_column_name, date ? date.format('YYYY-MM-DD') : null)}
                        className="input"
                        format="YYYY-MM-DD"
                        placeholder="Select a date"
                        disabled={!isEditable}
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
            style={{ zIndex: 10000 }}
            title="Confirmation"
            centered
          >
            <p>Are you sure you want to save the changes?</p>
          </Modal>

        </>
      )}
    </div>
  );
};

export default EditModal;
