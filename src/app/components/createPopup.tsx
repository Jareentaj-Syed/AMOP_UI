import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { Checkbox, Input, Modal } from 'antd';
import Select from 'react-select';
import { DropdownStyles } from './css/dropdown';
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

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newData: any) => void;
  columnNames: Column[];
  heading: string;
  generalFields?: Record<string, any>;
  header:any[] // To store general fields for dropdowns
}

const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  columnNames = [],
  heading,
  generalFields,
  header
}) => {
  const [formData, setFormData] = useState<any>({});
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const editableDrp = DropdownStyles;
  const { username, tenantNames, role, partner } = useAuth();
  useEffect(() => {
    if (!isOpen) {
      const initialFormData = Object.fromEntries(header.map((h) => [h, "None"]));
      setFormData(initialFormData);
    }
  }, [isOpen]);
  const handleChange = (name: string, value: any) => {
    setFormData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreate = () => {
    console.log("form data:", formData);
    onSave(formData);
    onClose();
  };

  const showConfirmation = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmCreate = async () => {
    if (formData) {
      try {
        const url =
          "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management";

        let data;
        if (heading === "Customer Group") {
          if (formData) {
            formData["createdby"] = username;
          }
          data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/create_partner_info",
            role_name: role,
            module_name: "Customer groups",
            action: "create",
            new_data: formData
          };
        }
        if (heading === "Carrier") {
          if (formData) {
            formData["createdby"] = username;
          }
          data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/create_superadmin_data",
            role_name: role,
            "sub_module": "Partner API",
            "sub_tab": "Carrier APIs",
            "table_name": "carrier_apis",
            "new_data": formData
          };
        }

        if (heading === "API") {
          if (formData) {
            formData["created_by"] = username;
          }
          data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/create_superadmin_data",
            role_name: role,
            "sub_module": "Partner API",
            "sub_tab": "Amop APIs",
            "table_name": "amop_apis",
            "new_data": formData
          };
        }

        if (heading === "E911 Customer") {
          if (formData) {
            formData["created_by"] = username;
          }
          data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/create_people_data",
            role_name: role,
            "parent_module": "People",
            "module": "E911 Customer Customer",
            "table_name": "weste911customer",
            action: "create",
            "new_data": formData
          };
        }
        if (heading === " NetSapien Customer") {
          if (formData) {
            formData["createdby"] = username;
          }
          data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/create_people_data",
            role_name: role,
            "parent_module": "People",
            "module": " NetSapien Customer",
            "table_name": "customers",
            action: "create",
            "new_data": formData
          };
        }
        if (heading === "RevIO Customer") {
          if (formData) {
            formData["createdby"] = username;
          }
          data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/create_people_data",
            role_name: role,
            "parent_module": "People",
            "module": "RevIO Customer",
            action: "create",
            "table_name": "customers",
            "new_data": formData
          };
        }

        const response = await axios.post(url, { data });
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    handleCreate();
    setIsConfirmationOpen(false);
  };

  const handleCancelConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  const modalWidth = typeof window !== 'undefined' ? (window.innerWidth * 2.5) / 4 : 0;
  const modalHeight = typeof window !== 'undefined' ? (window.innerHeight * 2.5) / 4 : 0;

  return (
    <div>
      <Modal
        open={isOpen}
        onCancel={onClose}
        title={
          <h3 className='popup-heading'>Create {heading}</h3>
        }
        footer={(
          <div className="justify-center flex space-x-2">
            <button onClick={onClose} className="cancel-btn">
              <CloseOutlined className="h-5 w-5 text-black-500 mr-2" />
              Cancel
            </button>
            <button onClick={showConfirmation} className="save-btn">
              <CheckOutlined className="h-5 w-5 text-black-500 mr-2" />
              Create
            </button>
          </div>
        )}
        width={modalWidth}
        styles={{ body: { height: modalHeight, padding: '4px' } }}
      >
        <div className='popup'>
          <div className='grid grid-cols-2 gap-4 md:grid-cols-2'>
            {columnNames.map((column: Column) => (
              <div key={column.db_column_name} className="flex flex-col mb-4">
                <label className="field-label">
                  {column.display_name} {column.mandatory === 'true' && <span className="text-red-500">*</span>}
                </label>
                {column.type === 'text' && (
                  <Input
                    type="text"
                    // name={column.db_column_name}
                    // value={formData[column.db_column_name] || ''}
                    onChange={(e) => handleChange(column.db_column_name, e.target.value)}
                    className="input"
                  />
                )}
                {column.type === 'dropdown' && (
                  <Select
                    styles={editableDrp}
                    classNamePrefix="select"
                    placeholder="Select..."
                    value={
                      generalFields &&
                      generalFields[column.db_column_name] &&
                      Array.isArray(generalFields[column.db_column_name])
                        ? generalFields[column.db_column_name].find(
                            (option: any) => option.value === formData[column.db_column_name]
                          ) || null
                        : null
                    }
                    onChange={(selectedOption) => handleChange(column.db_column_name, selectedOption?.value)}
                    options={
                      generalFields && generalFields[column.db_column_name] && Array.isArray(generalFields[column.db_column_name])
                        ? generalFields[column.db_column_name].map((option: any) => ({
                          label: option,
                          value: option,
                        }))
                        : [{ label: "No options", value: "No options" }]
                    }
                  />
                )}
                {column.type === 'checkbox' && (
                  <Checkbox
                    checked={formData[column.db_column_name] || false}
                    onChange={(e) => handleChange(column.db_column_name, e.target.checked)}
                    className="mt-1"
                  >
                    {column.display_name}
                  </Checkbox>
                )}
                {column.type === 'date' && (
                      <DatePicker
                        value={formData[column.db_column_name] ? dayjs(formData[column.db_column_name]) : null}
                        onChange={(date) => handleChange(column.db_column_name, date ? date.format('DD-MM-YYYY') : null)}
                        className="input"
                        format="DD-MM-YYYY"
                        placeholder="Select a date"
                      />
                    )}
              </div>
            ))}
          </div>
        </div>
      </Modal>

       <Modal
        visible={isConfirmationOpen}
        onOk={handleConfirmCreate}
        onCancel={handleCancelConfirmation}
        style={{ zIndex: 10000 }}
        centered
      >
        <h3 className='confirm-popup-heading'>{`Add New ${heading}`}</h3>
        <p>Do you want to save?</p>
      </Modal>
    </div>
  );
};

export default CreateModal;
