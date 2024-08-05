import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { Checkbox, Input, Modal, notification } from 'antd';
import Select from 'react-select';
import { DropdownStyles, NonEditableDropdownStyles } from './css/dropdown';
import CreateUser from '../partner/users/createUser/page';
import axios from 'axios';
import { useAuth } from './auth_context';
import { DatePicker } from 'antd';
import moment from 'moment';
import dayjs from 'dayjs';
import InfoPopup from '../people/info_popup';
import error from 'next/error';
import{ MultiValue, SingleValue } from 'react-select';

import { getCurrentDateTime } from './header_constants';
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
  onSave: (updatedRow: any, tableData: any) => void;
  rowData: any;
  createModalData: Column[];
  isEditable: boolean;
  heading: string;
  isTabEdit: any;
  generalFields?: Record<string, any>; // To store general fields for dropdowns
  tableData?: any
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
  generalFields,
  tableData = []
}) => {
  const [formData, setFormData] = useState<any>({});
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const editableDrp = DropdownStyles;
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(isTabEdit);
  const { username, tenantNames, role, partner, settabledata} = useAuth();
  const rate_plan_name_drp = generalFields && generalFields.rate_plan_name && Array.isArray(generalFields.rate_plan_name) ? generalFields.rate_plan_name : []
  // console.log("createModalData",createModalData)
  // console.log("formData",createModalData)
  const [initialData, setTableData] = useState<any>(tableData)

  useEffect(() => {
    if (isOpen) {
      setFormData(rowData || {});
    }

  }, [isOpen, rowData]);

  const handleChange = (name: string, value: any) => {
    setFormData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const getOptions = (column: any) => {

    if (column && generalFields && generalFields[column]) {
      const optionList = generalFields[column].map((option: any) => ({
        label: getKey(option),
        value: getKey(option)

      }))

      return optionList
    }
    else {
      return []
    }
  }

  const handleSave = () => {
    // console.log("editedData", initialData)
    onSave(formData, initialData);
    onClose();
  };

  const handleCancel = () => {
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

  const handleConfirmSave = async () => {
    if (formData) {
      try {
        const url =
          "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management";

        let data;
        if (heading === "Customer Group") {
          if (formData) {
            formData["modified_by"] = username;
          }
          data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/update_partner_info",
            role_name: role,
            module_name: "Customer Groups",
            action: "update",
            changed_data: formData,
            Partner:partner,
         
            request_received_at: getCurrentDateTime(),
          };
        }
        if (heading === "Carrier") {
          if (formData) {
            formData["last_modified_by"] = username;
            formData["last_modified_date_time"]=getCurrentDateTime()
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
            request_received_at: getCurrentDateTime(),
          };
        }

        if (heading === "API") {
          if (formData) {
            formData["last_modified_by"] = username;
            formData["last_modified_date_time"]=getCurrentDateTime()
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
            request_received_at: getCurrentDateTime(),
          };
        }

        if (heading === "E911 Customer") {
          if (formData) {
            formData["modified_by"] = username;
            formData["modified_date"]= getCurrentDateTime()
          }
          data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/update_people_data",
            role_name: role,
            "parent_module": "People",
            "module": "E911 Customers",
            "table_name": "weste911customer",
            action: "update",
            "changed_data": formData,
            Partner:partner,
            request_received_at: getCurrentDateTime(),
          };
        }
        if (heading === "NetSapien Customer") {
          if (formData) {
            formData["modified_by"] = username;
            formData["modified_date"]= getCurrentDateTime()
          }
          data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/update_people_data",
            role_name: role,
            "parent_module": "People",
            "module": "NetSapiens Customers",
            "table_name": "customers",
            action: "update",
            "changed_data": formData,
            Partner:partner,
            request_received_at: getCurrentDateTime(),
          };
        }
        if (heading === "Bandwidth Customer") {
          if (formData) {
            formData["modified_by"] = username;
            formData["modified_date"]= getCurrentDateTime()
          }
          data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/update_people_data",
            role_name: role,
            "parent_module": "People",
            "module": "Bandwidth Customers",
            "table_name": "customers",
            action: "update",
            "changed_data": formData,
            Partner:partner,
            request_received_at: getCurrentDateTime(),
          };
        }
        if (heading === "RevIO Customer") {
          if (formData) {
            formData["modified_by"] = username;
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
            "changed_data": formData,
            Partner:partner,
            request_received_at: getCurrentDateTime(),
          };
        }

        const response = await axios.post(url, { data });
        const resp = JSON.parse(response.data.body);
        console.log(resp)
        if (response.data.statusCode === 200 && resp.flag === true) {

          notification.success({
            message: 'Success',
            description: 'Successfully Edit the record!',
            style: messageStyle,
            placement: 'top', // Apply custom styles here
          });
          if (heading === "Carrier") {
          
            try {
              const url = `https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management`;
              const data = {
                tenant_name: partner || "default_value",
                username: username,
                path: "/get_superadmin_info",
                role_name: role,
                sub_module: "Partner API", 
                sub_tab: "Carrier APIs",
                Partner:partner,
                request_received_at: getCurrentDateTime(),
              };
              const response = await axios.post(url, { data: data });
              const resp = JSON.parse(response.data.body);
              console.log(resp)
              const carrierApis = resp.data.Carrier_apis_data.carrier_apis;
              console.log(carrierApis);
              settabledata(carrierApis)
            }
              catch (err) {
                console.error("Error fetching data:", err);
                // Modal.error({
                //   title: 'Data Fetch Error',
                //   content: err instanceof Error ? err.message : 'An unexpected error occurred while fetching data. Please try again.',
                //   centered: true,
                // });
              } finally {
                // setLoading(false); // Set loading to false after the request is done
              }
          }
          if (heading === "API") {
          
            try {
              const url = `https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management`;
              const data = {
                tenant_name: partner || "default_value",
                username: username,
                path: "/get_superadmin_info",
                role_name: role,
                sub_module: "Partner API",
                sub_tab: "Amop APIs",
                Partner:partner,
                request_received_at: getCurrentDateTime(),
              };
              
              const response = await axios.post(url, { data: data });
              const resp = JSON.parse(response.data.body);
              console.log(resp)
              const carrierApis = resp.data.amop_apis_data.amop_apis;
              console.log(carrierApis);
              settabledata(carrierApis)
           
            }
              catch (err) {
                console.error("Error fetching data:", err);
                // Modal.error({
                //   title: 'Data Fetch Error',
                //   content: err instanceof Error ? err.message : 'An unexpected error occurred while fetching data. Please try again.',
                //   centered: true,
                // });
              } finally {
                // setLoading(false); // Set loading to false after the request is done
              }
          }
          if (heading === "E911 Customer") {
            const url = `https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management`;
            const data = {
              tenant_name: partner || "default_value",
              username: username,
              path: "/get_module_data",
              role_name: role,
              parent_module_name: "people",
              module_name: "E911 Customers",
              mod_pages: {
                start: 0,
                end: 500,
              },
              Partner:partner,
              request_received_at: getCurrentDateTime(),
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
              const customertableData = parsedData.data.WestE911Customer;
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
              parent_module_name: "people", // Corrected spelling from 'poeple'
              module_name: "NetSapiens Customers",
              mod_pages: {
                start: 0,
                end: 500,
              },
              Partner:partner,
              request_received_at: getCurrentDateTime(),
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
              parent_module_name: "people",
              module_name: "Bandwidth Customers",
              mod_pages: {
                start: 0,
                end: 500,
              },
              Partner:partner,
              request_received_at: getCurrentDateTime(),
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
              Modal.error({
                title: 'Data Fetch Error',
                content: parsedData.message || 'An error occurred while fetching E911 Customers data. Please try again.',
                centered: true,
              });
            } else {
              const tableData =parsedData?.data?.["Customer groups"]?.customergroups || [];
              console.log("tableData",tableData)
              settabledata(tableData);
            }
          }

        }
          
      } catch (error) {
        if (error instanceof Error) {
          Modal.error({
            title: 'Saving Error',
            content: error.message || 'An unexpected error occurred during login. Please try again.',
            centered: true,
          });
        } else {
          Modal.error({
            title: 'Saving Error',
            content: 'An unexpected error occurred during login. Please try again.',
            centered: true,
          });
        }
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
  const getKey = (obj: any) => {
    if (obj) {
      const list = Object.values(obj)
      // console.log("list[0]",list[0])
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
  const infoModalHeight = typeof window !== 'undefined' ? (window.innerHeight * 2) / 4 : 0;


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
          {!isEditable && (heading === "NetSapien Customer" || heading === "Bandwidth Customer") ? (
            <Modal
              open={isOpen}
              onCancel={handleCancel}
              title={
                <h3 className='popup-heading'>{isEditable ? `Edit ${heading}` : `${heading} Details`}</h3>
              }
              width={modalWidth}
              styles={{ body: { height: infoModalHeight, padding: '4px' } }}
            >
              <div className='popup'>
                <InfoPopup rate_plan={rate_plan_name_drp} />

              </div>

            </Modal>
          ) :
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
                      isMulti={
                        column.db_column_name === "Customer_names" ||
                        column.db_column_name === "rate_plan_name"
                      }
                      styles={!isEditable ? NonEditableDropdownStyles : editableDrp}
                      isDisabled={!isEditable}
                      classNamePrefix="select"
                      placeholder="Select..."
                      value={
                        // Ensure formData[column.db_column_name] is not "None" or empty
                        formData[column.db_column_name] && formData[column.db_column_name] !== "None"
                          ? (() => {
                              try {
                                // Try to parse formData as JSON
                                const parsedData = JSON.parse(formData[column.db_column_name]);
                    
                                // Check if parsedData is an array
                                if (Array.isArray(parsedData)) {
                                  return parsedData.map((item) => ({ label: item, value: item }));
                                } else {
                                  // If parsedData is not an array, assume it's a string value
                                  return { label: parsedData, value: parsedData };
                                }
                              } catch (e) {
                                // If parsing fails, treat it as a simple string
                                return { label: formData[column.db_column_name], value: formData[column.db_column_name] };
                              }
                            })()
                          : null
                      }
                      onChange={(selectedOption) => {
                        if (Array.isArray(selectedOption)) {
                          // Handle multiple selections
                          const values = selectedOption.map((option) => option.value);
                          handleChange(column.db_column_name, values);
                        } else if (selectedOption && 'value' in selectedOption) {
                          // Handle single selection
                          handleChange(column.db_column_name, selectedOption.value);
                        }
                      }}
                      options={
                        column.db_column_name !== null && generalFields && generalFields[column.db_column_name] && Array.isArray(generalFields[column.db_column_name])
                          ? generalFields[column.db_column_name].map((option:any) => ({
                              label: option,
                              value: option
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
                          value={formData[column.db_column_name] && dayjs(formData[column.db_column_name]).isValid() ? dayjs(formData[column.db_column_name]) : null}
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
            </Modal>}

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
