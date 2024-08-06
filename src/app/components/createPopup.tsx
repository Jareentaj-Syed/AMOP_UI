import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { Checkbox, Input, Modal, notification, Spin } from 'antd';
import Select from 'react-select';
import { DropdownStyles } from './css/dropdown';
import axios from 'axios';
import { useAuth } from './auth_context';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { message } from 'antd';
import { getCurrentDateTime } from './header_constants';

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
  onSave: (newData: any,tableData:any) => void;
  columnNames: Column[];
  heading: string;
  generalFields?: Record<string, any>;
  header: any[];
  tableData?: any
}

const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  columnNames = [],
  heading,
  generalFields,
  header,
  tableData = []

}) => {
  const [formData, setFormData] = useState<any>({});
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const editableDrp = DropdownStyles;
  const { username, tenantNames, role, partner, settabledata,setStoredPagination } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initialFormData = header?.reduce((acc, column) => {
      acc[column] = ''; // Initialize each header item as an empty string
      return acc;
    }, {} as Record<string, any>);

    setFormData(initialFormData);
  }, [columnNames, isOpen]);

  const handleChange = (name: string, value: any) => {
    setFormData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreate = () => {
    onSave(formData,tableData);
    onClose();
  };

  const showConfirmation = () => {
    setIsConfirmationOpen(true);
  };

  const messageStyle = {
    fontSize: '14px',  // Adjust font size
    fontWeight: 'bold', // Make the text bold
    padding: '16px',
    // Add padding
  };


  const handleConfirmCreate = async () => {
    const initialFormData = header.reduce((acc, column) => {
      acc[column] = formData[column] ? formData[column] : 'None';
      return acc;
    }, {} as Record<string, any>);

    setFormData(initialFormData);
    if (formData) {
      try {
        const url =
          'https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management';

        let data;
        if (heading === 'Customer Group') {
          if (formData) {
            formData['created_by'] = username;
            // formData["modified_date"]= getCurrentDateTime()
            formData["is_deleted"] = false
            formData["is_active"] = true
          }
          data = {
            tenant_name: partner || 'default_value',
            username: username,
            path: '/update_partner_info',
            role_name: role,
            module_name: 'Customer groups',
            action: 'create',
            changed_data: formData,
            Partner:partner,
            request_received_at: getCurrentDateTime()

          };
        }
        if (heading === 'Carrier') {
          if (formData) {
            formData['created_by'] = username;
            formData["modified_date"]= getCurrentDateTime()
          }
          data = {
            tenant_name: partner || 'default_value',
            username: username,
            path: '/create_superadmin_data',
            role_name: role,
            sub_module: 'Partner API',
            sub_tab: 'Carrier APIs',
            table_name: 'carrier_apis',
            changed_data: formData,
            Partner:partner,
            request_received_at: getCurrentDateTime()

          };
        }

        if (heading === 'API') {
          if (formData) {
            formData['created_by'] = username;
            formData["modified_date"]= getCurrentDateTime()
          }
          data = {
            tenant_name: partner || 'default_value',
            username: username,
            path: '/create_superadmin_data',
            role_name: role,
            sub_module: 'Partner API',
            sub_tab: 'Amop APIs',
            table_name: 'amop_apis',
            changed_data: formData,
            Partner:partner,
            request_received_at: getCurrentDateTime()

          };
        }

        if (heading === 'E911 Customer') {
          if (formData) {
            formData["is_deleted"] = false
            formData["is_active"] = true
            formData['created_by'] = username;
            formData["modified_date"]= getCurrentDateTime()
          }
          data = {
            tenant_name: partner || 'default_value',
            username: username,
            path: '/update_people_data',
            role_name: role,
            parent_module: 'People',
            module: 'E911 Customers',
            table_name: 'e911_customers',
            action: 'create',
            changed_data: formData,
            Partner:partner,
            request_received_at: getCurrentDateTime()

          };
        }
        if (heading === 'NetSapien Customer') {
          if (formData) {
            formData["is_deleted"] = false
            formData["is_active"] = true
            formData['created_by'] = username;
            formData["modified_date"]= getCurrentDateTime()
          }
          data = {
            tenant_name: partner || 'default_value',
            username: username,
            path: '/update_people_data',
            role_name: role,
            parent_module: 'People',
            module: 'NetSapiens Customers',
            table_name: 'customers',
            action: 'create',
            changed_data: formData,
            Partner:partner,
            request_received_at: getCurrentDateTime()

          };
        }
        if (heading === 'Bandwidth Customer') {
          if (formData) {
            formData["is_deleted"] = false
            formData["is_active"] = true
            formData['created_by'] = username;
            formData["modified_date"]= getCurrentDateTime()
          }
          data = {
            tenant_name: partner || 'default_value',
            username: username,
            path: '/update_people_data',
            role_name: role,
            parent_module: 'People',
            module: 'Bandwidth Customers',
            table_name: 'customers',
            changed_data: formData,
            action: 'create',
            Partner:partner,
            request_received_at: getCurrentDateTime()


          };
        }
        // if (heading === 'RevIO Customer') {
        //   if (formData) {
        //     formData['created_by'] = username;
        //   }
        //   data = {
        //     tenant_name: partner || 'default_value',
        //     username: username,
        //     path: '/update_people_data',
        //     role_name: role,
        //     parent_module: 'People',
        //     module: 'RevIO Customer',
        //     action: 'create',
        //     table_name: 'customers',
        //     changed_data: formData,
        //   };
        // }

        const response = await axios.post(url, { data });
        if (response.data.statusCode === 200) {
          if (heading === "Carrier") {
            if (formData) {
              formData["last_modified_by"] = username;
            }
            data = {
              tenant_name: partner || "default_value",
              username: username,
              path: "/update_superadmin_data",
              role_name: role,
              "sub_module": "Partner API",
              "sub_tab": "Carrier APIs",
              "table_name": "carrier_apis",
              "changed_data": formData,
              Partner:partner,
              request_received_at: getCurrentDateTime()
  
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
              "changed_data": formData,
              Partner:partner,
              request_received_at: getCurrentDateTime()
  
            };
          }

          if (heading === "E911 Customer") {
            const url = `https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management`;
            const data = {
              tenant_name: partner || "default_value",
              username: username,
              path: "/get_module_data",
              role_name: role,
              parent_module: "people",
              module_name: "E911 Customers",
              mod_pages: {
                start: 0,
                end: 500,
              },
              Partner:partner,
              request_received_at: getCurrentDateTime()
  
            };

            const response = await axios.post(url, { data });
            const parsedData = JSON.parse(response.data.body);
            if (parsedData.flag === false) {
              Modal.error({
                title: 'Data Fetch Error',
                content: parsedData.message || 'An error occurred while fetching E911 Customers data. Please try again.',
                centered: true,
              });
            } else {
              const headerMap = parsedData.headers_map["E911 Customers"]["header_map"];
              const createModalData = parsedData.headers_map["E911 Customers"]["pop_up"];
              const customertableData = parsedData.data.e911_customers;
              settabledata(customertableData);
            }
          }
          if (heading === "NetSapien Customer") {
            const url = `https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management`;
            const data = {
              tenant_name: partner || "default_value",
              username: username,
              path: "/get_module_data",
              role_name: role,
              parent_module: "people", // Corrected spelling from 'poeple'
              module_name: "NetSapiens Customers",
              mod_pages: {
                start: 0,
                end: 500,
              },
              Partner:partner,
              request_received_at: getCurrentDateTime()
  
            };

            const response = await axios.post(url, { data });
            const parsedData = JSON.parse(response.data.body);
            console.log(parsedData)
            // Check if the flag is false in the parsed data
            const tableData = parsedData.data.customers;
            const headerMap = parsedData.headers_map["NetSapiens Customers"]["header_map"]
            const createModalData = parsedData.headers_map["NetSapiens Customers"]["pop_up"]
            const generalFields = parsedData.data
            settabledata(tableData);
          }
          if (heading === "Bandwidth Customer") {
            const url =
              "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management";
            const data = {
              tenant_name: partner || "default_value",
              username: username,
              path: "/get_module_data",
              role_name: role,
              parent_module: "people",
              module_name: "Bandwidth Customers",
              mod_pages: {
                start: 0,
                end: 500,
              },
              Partner:partner,
              request_received_at: getCurrentDateTime()
  
            };
            const response = await axios.post(url, { data });
            const parsedData = JSON.parse(response.data.body);
            if (parsedData.flag === false) {
              Modal.error({
                title: 'Data Fetch Error',
                content: parsedData.message || 'An error occurred while fetching E911 Customers data. Please try again.',
                centered: true,
              });
            } else {
              const tableData = parsedData.data.customers;
              const headerMap = parsedData.headers_map["Bandwidth Customers"]["header_map"]
              const createModalData = parsedData.headers_map["Bandwidth Customers"]["pop_up"]
              const generalFields = parsedData.data
              settabledata(tableData);
            }
          }
          if (heading === "Customer Group") {
            const url =
              "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management";
            const data = {
              tenant_name: partner || "default_value",
                        username: username,
                        path: "/get_partner_info",
                        role_name: role,
                        parent_module:"Partner",
                        modules_list: ["Customer groups"],
                        pages: {
                            "Customer groups": { start: 0, end: 500 },
                            "Partner users": { start: 0, end: 500 }
                        },
                        Partner:partner,
                        request_received_at: getCurrentDateTime(),
            };
            const response = await axios.post(url, { data });
            const parsedData = JSON.parse(response.data.body);
            if (parsedData.flag === false) {
              setLoading(false)
              Modal.error({
                title: 'Data Fetch Error',
                content: parsedData.message || 'An error occurred while fetching E911 Customers data. Please try again.',
                centered: true,
              });
            } else {
              const tableData =parsedData?.data?.["Customer groups"]?.customergroups || [];
              console.log("tableData",tableData)
              settabledata(tableData);
              setLoading(false)
            }
          }
        
          // if (heading === "RevIO Customer") {
          //   if (formData) {
          //     formData["modified_by"] = username;
          //   }
          //   data = {
          //     tenant_name: partner || "default_value",
          //     username: username,
          //     path: "/update_people_data",
          //     role_name: role,
          //     "parent_module": "People",
          //     "module": "RevIO Customer",
          //     "table_name": "customers",
          //     action: "update",
          //     "changed_data": formData
          //   };
          // }
        }
        else {
          const errorMsg = JSON.parse(response.data.body).message
          Modal.error({
            title: 'Saving Error',
            content: errorMsg,
            centered: true,
          });
        }
        if (response && response.data.statusCode===200) {
          // Show success message
          notification.success({
            message: 'Success',
            description: 'Successfully created the record!',
            style: messageStyle,
            placement: 'top', // Apply custom styles here
          });
        }
        else{
          const errorMsg = JSON.parse(response.data.body).message
          Modal.error({
            title: 'Saving Error',
            content: errorMsg,
            centered: true,
          });
        }
          

      } catch (err) {
        console.error('Error fetching data:', err);
        notification.error({
          message: 'Error',
          description: 'Failed to create the record. Please try again.',
          style: messageStyle,
          placement: 'top',// Apply custom styles here
        });
      }
    }
    handleCreate();
    setIsConfirmationOpen(false);
  };

  const handleCancelConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  const modalWidth =
    typeof window !== 'undefined' ? (window.innerWidth * 2.5) / 4 : 0;
  const modalHeight =
    typeof window !== 'undefined' ? (window.innerHeight * 2.5) / 4 : 0;
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <Spin size="large" />
        </div>
      );
    }
  

  return (
    <div>
      <Modal
        open={isOpen}
        onCancel={onClose}
        title={<h3 className="popup-heading">Create {heading}</h3>}
        footer={
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
        }
        width={modalWidth}
        styles={{ body: { height: modalHeight, padding: '4px' } }}
      >
        <div className="popup">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
            {columnNames.map((column: Column) => (
              <div key={column.db_column_name} className="flex flex-col mb-4">
                <label className="field-label">
                  {column.display_name}{' '}
                  {column.mandatory === 'true' && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                {column.type === 'text' && (
                  <Input
                    type="text"
                    value={formData[column.db_column_name] || ''}
                    onChange={(e) =>
                      handleChange(column.db_column_name, e.target.value)
                    }
                    className="input"
                  />
                )}
                {column.type === 'dropdown' && (
                  <Select
                  isMulti={column.db_column_name === "customer_names"||column.db_column_name === "rate_plan_name"}
                  styles={editableDrp}
                  classNamePrefix="select"
                  placeholder="Select..."
                  value={
                    formData[column.db_column_name]
                      ? Array.isArray(formData[column.db_column_name])
                        ? formData[column.db_column_name].map((item: string) => ({
                            label: item,
                            value: item,
                          }))
                        : {
                            label: formData[column.db_column_name],
                            value: formData[column.db_column_name],
                          }
                      : null
                  }
                  onChange={(selectedOption) =>
                    handleChange(
                      column.db_column_name,
                      selectedOption
                        ? Array.isArray(selectedOption)
                          ? selectedOption.map((option) => option.value)
                          : selectedOption.value
                        : ''
                    )
                  }
                  options={
                    column.db_column_name!==null?(generalFields &&
                    generalFields[column.db_column_name] &&
                    Array.isArray(generalFields[column.db_column_name])
                      ? generalFields[column.db_column_name].map((option: string) => ({
                          label: option,
                          value: option,
                        }))
                      : [{ label: 'No options', value: '' }]):[{ label: 'No options', value: '' }]
                  }
                />
                
                )}

                {column.type === 'checkbox' && (
                  <Checkbox
                    checked={formData[column.db_column_name] || false}
                    onChange={(e) =>
                      handleChange(column.db_column_name, e.target.checked)
                    }
                    className="checkbox"
                  >
                    {column.display_name}
                  </Checkbox>
                )}
                {column.type === 'date' && (
                  <DatePicker
                    value={
                      formData[column.db_column_name]
                        ? dayjs(formData[column.db_column_name])
                        : null
                    }
                    onChange={(date, dateString) =>
                      handleChange(column.db_column_name, dateString)
                    }
                    className="input"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </Modal>
      <Modal
        title="Confirmation"
        open={isConfirmationOpen}
        onOk={handleConfirmCreate}
        onCancel={handleCancelConfirmation}
        centered
      >
        <p>Are you sure you want to create this {heading}?</p>
      </Modal>
    </div>
  );
};

export default CreateModal;
