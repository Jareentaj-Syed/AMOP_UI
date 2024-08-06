"use client"
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { PencilIcon, TrashIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import EditModal from '../../components/editPopup';
import Pagination from '@/app/components/pagination';
import DateTimeCellRenderer from './data-grid-cell-renderers/date-time-cell-renderer';
import EditUsernameCellRenderer from './data-grid-cell-renderers/edit-username-cell-renderer';
import { StatusCellRenderer } from './data-grid-cell-renderers/status-cell-renderer';
import { StatusHistoryCellRenderer } from './data-grid-cell-renderers/status-history-cell-renderer';
import ServiceProviderCellRenderer from './data-grid-cell-renderers/service-provider-cell-renderer';
import { Modal, Checkbox, notification } from 'antd';

import ActionItems from '@/app/sim_management/inventory/Table-feautures/action-items';
import AdvancedFilter from '@/app/sim_management/inventory/Table-feautures/advanced-filter';
import { ArrowUpOutlined, ArrowDownOutlined, EnvironmentFilled } from '@ant-design/icons';
import StatusIndicator from './data-grid-cell-renderers/status-indicator';
import QuantityCell, { STATUS_TYPE } from './data-grid-cell-renderers/quantity-cell-renderer';
import { changeDetailCellRenderer } from './data-grid-cell-renderers/change-details-cell';
import { useAuth } from '../auth_context';
import axios from 'axios';
import { getCurrentDateTime } from '../header_constants';
import { table } from 'console';



interface TableComponentProps {
  headers: string[];
  initialData: { [key: string]: any }[];
  searchQuery: string;
  visibleColumns: string[];
  itemsPerPage: number;
  allowedActions?: ('edit' | 'delete' | 'info' | 'Actions' | 'SingleClick' | 'tabsEdit' | 'tabsInfo')[];
  popupHeading: string;
  advancedFilters?: any
  createModalData?: any[]
  generalFields?: any
  isSelectRowVisible?: boolean
  headerMap?: any
  pagination: any
}

const TableComponent: React.FC<TableComponentProps> = ({ headers, initialData, searchQuery, visibleColumns, itemsPerPage, allowedActions, popupHeading, createModalData, generalFields, advancedFilters, isSelectRowVisible = true, headerMap, pagination }) => {
  const router = useRouter();

  const [rowData, setRowData] = useState<{ [key: string]: any }[]>(initialData);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editRowIndex, setEditRowIndex] = useState<number | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [state, setState] = useState<string>("");
  const [rowIndex, setRowIndex] = useState<number>(0);
  const [columnName, setColumnName] = useState<string>("");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [EnableModalOpen, setEnableModalOpen] = useState(false); // State for Enable Modal
  const [DisableModalOpen, setDisableModalOpen] = useState(false);
  const [currentRowData, setCurrentRowData] = useState<any>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteRowIndex, setDeleteRowIndex] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'ascending' | 'descending' } | null>(null);
  const [tabsEdit, setTabsEdit] = useState(false)
  const { username, tenantNames, role, partner, selectedPartnerModule, Environment, tabledata, storedpagination } = useAuth()
  const [totalPages, setTotalPages] = useState(1);
  const [lastPageWithData, setLastPageWithData] = useState(1);
  const hasMounted = useRef(false);
  // const [paginatedData, setPaginatedData] = useState<{ [key: string]: any }[]>(initialData)
  useEffect(() => {
    if (!router) {
      console.error('NextRouter is not available.');
    }
  }, [router]);

  useEffect(() => {
    const newRowData = tabledata? tabledata : initialData;
    setRowData(newRowData);

    console.log("updated data:", newRowData)
  }, [tabledata, initialData]);
  
  useEffect(() => {
    const start = pagination?.start || 1;
    const total = pagination?.total || 1;
    const end = pagination?.end || 1;
    const lastPageWithData_ = Math.floor(end / itemsPerPage);
    const totalPages_ = Math.ceil(total / itemsPerPage);
    const currentPage_ = Math.floor(start / itemsPerPage) + 1;
    setTotalPages(totalPages_);
    setCurrentPage(currentPage_);
    setLastPageWithData(lastPageWithData_)

  }, [tabledata, initialData, pagination]);
  useEffect(() => {
    let pagination_: any
    const updatePaginator = async () => {
      let end = Math.floor(lastPageWithData * itemsPerPage)
      if (lastPageWithData < currentPage) {
        try {
          if (popupHeading === "Carrier") {
            try {
              const url = `https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management`;
              const data = {
                tenant_name: partner || "default_value",
                username: username,
                path: "/get_superadmin_info",
                role_name: role,
                sub_module: "Partner API",
                sub_tab: "Carrier APIs",
                request_received_at: getCurrentDateTime(),
              };
              const response = await axios.post(url, { data: data });
              const resp = JSON.parse(response.data.body);
              const carrierApis = resp.data.Carrier_apis_data.carrier_apis;
              const tableData_ = [...rowData, carrierApis]
              setRowData(tableData_)
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
          if (popupHeading === "API") {

            try {
              const url = `https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management`;
              const data = {
                tenant_name: partner || "default_value",
                username: username,
                path: "/get_superadmin_info",
                role_name: role,
                sub_module: "Partner API",
                sub_tab: "Amop APIs",
                request_received_at: getCurrentDateTime(),
              };

              const response = await axios.post(url, { data: data });
              const resp = JSON.parse(response.data.body);
              const carrierApis = resp.data.amop_apis_data.amop_apis;
              const tableData_ = [...rowData, carrierApis];
              setRowData(carrierApis)

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
          if (popupHeading === "E911 Customer") {
            const url = `https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management`;
            const data = {
              tenant_name: partner || "default_value",
              username: username,
              path: "/get_module_data",
              role_name: role,
              parent_module_name: "people",
              module_name: "E911 Customers",
              mod_pages: {
                start: end,
                end: end + end,
              },
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
              const tableData_ = [...rowData, customertableData]
              setRowData(tableData_);
            }
          }
          if (popupHeading === "NetSapien Customer") {
            const url = `https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management`;
            const data = {
              tenant_name: partner || "default_value",
              username: username,
              path: "/get_module_data",
              role_name: role,
              parent_module_name: "people", // Corrected spelling from 'poeple'
              module_name: "NetSapiens Customers",
              mod_pages: {
                start: end,
                end: end + end,
              },
              Partner: partner,
              request_received_at: getCurrentDateTime()
            };

            const response = await axios.post(url, { data });
            const parsedData = JSON.parse(response.data.body);
            // Check if the flag is false in the parsed data
            const tableData = parsedData.data.customers;
            const headerMap = parsedData.headers_map["NetSapiens Customers"]["header_map"]
            const createModalData = parsedData.headers_map["NetSapiens Customers"]["pop_up"]
            const generalFields = parsedData.data
            const tableData_ = [...rowData, tableData]
            setRowData(tableData_);
          }
          if (popupHeading === "Bandwidth Customer") {
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
              Partner: partner,
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
              const tableData_ = [...rowData, tableData]
              setRowData(tableData_);
            }
          }
          if (popupHeading === "Customer Group") {
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
              Partner: partner,
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
              const tableData = parsedData?.data?.["Customer groups"]?.customergroups || [];
              const tableData_ = [...rowData, tableData]
              setRowData(tableData_);
            }
          }
          if (popupHeading === "User") {
            const url =
              "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management";
            const data = {
              tenant_name: partner || "default_value",
              username: username,
              path: "/get_partner_info",
              role_name: role,
              modules_list: ["Partner users"],
              pages: {
                "Customer groups": { start: end, end: end + end },
                "Partner users": { start: end, end: end + end }
              },
              Partner: partner,
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
              const tableData = parsedData?.data?.["Partner users"]?.users || [];
              const userPagination = parsedData?.data?.pages?.["Partner users"] || {}
              pagination_ = userPagination
              const updatedRowData = [...rowData, ...tableData];
              setRowData(updatedRowData);
            }
          }
          const end_ = pagination_?.end || 0;
          const lastPageWithData_ = Math.floor(end_ / itemsPerPage);
          console.log("lastPageWithData_", lastPageWithData_)
          setLastPageWithData(lastPageWithData_)
          paginatedData = rowData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

        } catch (err) {
          console.error("Error fetching data:", err);
        }
      }
    };
    updatePaginator()
  }, [currentPage])

  const handleActionSingleClick = () => {
    if (router) {
      router.push('/super_admin/partner_modules/user_role');
    } else {
      console.error('NextRouter is not available.');
    }
  };
  const handleSelectAllChange = (e: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
    setSelectAll(e.target.checked);
    if (e.target.checked) {
      const allRowIndices = paginatedData.map((_, index) => index);
      setSelectedRows(allRowIndices);
    } else {
      setSelectedRows([]);
    }
  };


  const messageStyle = {
    fontSize: '14px',  // Adjust font size
    fontWeight: 'bold', // Make the text bold
    padding: '16px',
    // Add padding
  };

  const handleRowCheckboxChange = (index: number) => {
    const currentIndex = selectedRows.indexOf(index);
    const newSelectedRows = [...selectedRows];

    if (currentIndex === -1) {
      newSelectedRows.push(index);
    } else {
      newSelectedRows.splice(currentIndex, 1);
    }

    setSelectedRows(newSelectedRows);
  };


  let paginatedData = rowData?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    const filteredData = initialData?.filter(row => {
      const matchesSearchQuery = Object.values(row).some(value =>
        String(value).toLowerCase().includes(String(searchQuery).toLowerCase())
      );

      const matchesAdvancedFilters = Object.entries(advancedFilters || {}).every(
        ([key, values]) => {
          const valuesArray = values as string[];
          if (valuesArray.length === 0) return true;
          if (valuesArray[0] && row[key]) {
            return String(row[key]).toLowerCase().includes(valuesArray[0].toLowerCase());
          }
          return true;
        }
      );

      return matchesAdvancedFilters;
    });

    setRowData(filteredData);
    setCurrentPage(1);
  }, [searchQuery, initialData, advancedFilters]);




  const formatColumnName = (name: string) => {
    return name
      .replace(/_/g, ' ')          // Replace underscores with spaces
      .split(' ')                  // Split the string into words
      .map(word =>                 // Capitalize each word
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(' ');                  // Join the words back into a single string
  };


  const handleActionClick = (action: string, rowIndex: number) => {
    switch (action) {
      case 'edit':
        setEditRowIndex(rowIndex);
        setIsEditable(true);
        setEditModalOpen(true);
        console.log(editModalOpen)
        break;
      case 'tabsEdit':
        setTabsEdit(true)
        setEditRowIndex(rowIndex);
        setIsEditable(true);
        setEditModalOpen(true);
        break;
      case 'tabsInfo':
        setTabsEdit(true)
        setEditRowIndex(rowIndex);
        setIsEditable(true);
        setEditModalOpen(true);
        break;
      case 'delete':
        setDeleteRowIndex(rowIndex);
        setDeleteModalOpen(true);
        break;
      case 'info':
        setEditRowIndex(rowIndex);
        setIsEditable(false);
        setEditModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleSaveModal = (updatedRow: { [key: string]: any }, tableData: any) => {
    if (editRowIndex !== null) {
      // const updatedData = [...rowData];
      // updatedData[editRowIndex] = updatedRow;
      // setRowData(updatedData);
      handleCloseModal();
      // setRowData(tableData)
    }
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setIsEditable(false);
    setTabsEdit(false)
    setEditRowIndex(null);
  };

  const confirmDelete = () => {

    if (deleteRowIndex !== null) {
      handleDelete(deleteRowIndex);
    }
    setDeleteModalOpen(false);
    setDeleteRowIndex(null);
  };

  const handleDelete = async (rowIndex: number) => {
    if (rowIndex >= 0 && rowIndex < rowData.length) {
      const updatedData: any = [...rowData];
      const row = rowData[rowIndex]
      console.log(row)
      row["deleted_by"] = username
      row["is_deleted"] = true
      row["is_active"] = false
      try {
        const url =
          "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management";

        let data;
        if (popupHeading === "Customer Group") {
          if (row) {
            row["modified_by"] = username;
            row["modified_date"] = getCurrentDateTime()
          }

          data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/update_partner_info",
            role_name: role,
            module_name: "Customer groups",
            action: "delete",
            changed_data: row,
            Partner: partner,
            request_received_at: getCurrentDateTime(),
          };
        }
        if (popupHeading === "User") {
          if (row) {
            row["modified_by"] = username;
            row["modified_date"] = getCurrentDateTime()
          }
          data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/update_partner_info",
            role_name: role,
            module_name: "Partner users",
            action: "delete",
            changed_data: row,
            Partner: partner,
            request_received_at: getCurrentDateTime(),
          };
        }

        if (popupHeading === "E911 Customer") {

          if (row) {
            row["modified_by"] = username;
            row["modified_date"] = getCurrentDateTime()
          }
          data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/update_people_data",
            role_name: role,
            "parent_module": "People",
            "module": "E911 Customers",
            "table_name": "customers",
            "changed_data": row,
            action: "delete",
            Partner: partner,
            request_received_at: getCurrentDateTime(),

          };
        }
        if (popupHeading === "NetSapien Customer") {
          if (row) {
            row["modified_by"] = username;
            row["modified_date"] = getCurrentDateTime()
          }
          data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/update_people_data",
            role_name: role,
            "parent_module": "People",
            "module": "NetSapien Customers",
            "table_name": " customers",
            "changed_data": row,
            action: "delete",
            Partner: partner,
            request_received_at: getCurrentDateTime(),
          };

        }
        const response = await axios.post(url, { data });
        if (response && response.status === 200) {
          // Show success message
          notification.success({
            message: 'Success',
            description: 'Successfully Deleted the record!',
            style: messageStyle,
            placement: 'top', // Apply custom styles here
          });
          if (popupHeading === "Customer Group") {
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
              Partner: partner,
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
              const tableData = parsedData?.data?.["Customer groups"]?.customergroups || [];
              setRowData(tableData);
            }
          }

          if (popupHeading === "E911 Customer") {
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
              Partner: partner,
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
              setRowData(customertableData);
            }
          }
          if (popupHeading === "NetSapien Customer") {
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
              Partner: partner,
              request_received_at: getCurrentDateTime(),
            };

            const response = await axios.post(url, { data });
            const parsedData = JSON.parse(response.data.body);
            // Check if the flag is false in the parsed data
            const tableData = parsedData.data.customers;
            const headerMap = parsedData.headers_map["NetSapiens Customers"]["header_map"]
            const createModalData = parsedData.headers_map["NetSapiens Customers"]["pop_up"]
            const generalFields = parsedData.data
            setRowData(tableData);
          }
          if (popupHeading === "User") {
            const url =
              "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management";
            const data = {
              tenant_name: partner || "default_value",
              username: username,
              path: "/get_partner_info",
              role_name: role,
              modules_list: ["Partner users"],
              pages: {
                "Customer groups": { start: 0, end: 500 },
                "Partner users": { start: 0, end: 500 }
              },
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
              const tableData = parsedData?.data?.["Partner users"]?.users || [];
              setRowData(tableData);
            }
          }
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
        // console.error("Error fetching data:", err);
        notification.error({
          message: 'Error',
          description: 'Failed to Deleted the record. Please try again.',
          style: messageStyle,
          placement: 'top',// Apply custom styles here
        });  //// place it after you make the call to load the table data
      }
      // setRowData(updatedData);

    }
  };

  const handleToggle = (rowIndex: number, col: string, apiState: boolean) => {
    const updatedData = [...rowData];
    const row = updatedData[rowIndex];
    let state;
    setRowIndex(rowIndex)
    setColumnName(col)
    if (apiState) {
      if (col === "Module State" || col === "API state") {
        state = "Disable";
        setDisableModalOpen(true);
      } else {
        state = "Inactive";
        setDisableModalOpen(true);
      }
    } else {
      if (col === "Module State" || col === "API state") {
        state = "Enable";
        setEnableModalOpen(true);
      } else {
        state = "Active";
        setEnableModalOpen(true);
      }
    }

    // Set the state for the modal prompt
    setState(state); // Make sure to define this state variable in your component
  };


  const confirmSubmit = async (rowIndex: number, col: string, apiState: boolean) => {
    const updatedData = [...rowData];
    const row = updatedData[rowIndex];
    if (apiState) {
      if (col === "Module State" || col === "Role Status") {
        // Set to true for enable
        row.is_active = true;  // Set to true for active
      } else {
        row.api_state = true; // Set to true for active
      }
    } else {
      if (col === "Module State" || col === "Role Status") {
        // Set to false for disable
        row.is_active = false;  // Set to false for inactive
      } else {
        row.api_state = false;   // Set to false for inactive
      }
    }

    updatedData[rowIndex] = row;
    // setCurrentRowData(row)
    // setRowData(updatedData);
    setEnableModalOpen(false);
    setDisableModalOpen(false);

    if (row) {
      try {
        const url =
          "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management";

        let data;
        if (popupHeading === "Carrier") {
          if (row) {
            row["last_modified_by"] = username
            row["last_modified_date_time"] = getCurrentDateTime()

          }
          data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/update_superadmin_data",
            role_name: role,
            "sub_module": "Partner API",
            "sub_tab": "Carrier APIs",
            "table_name": "carrier_apis",
            "changed_data": row,
            Partner: partner,
            request_received_at: getCurrentDateTime(),
          };
        }

        if (popupHeading === "API") {
          if (row) {
            row["last_modified_by"] = username
            row["last_modified_date_time"] = getCurrentDateTime()
          }
          data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/update_superadmin_data",
            role_name: role,
            "sub_module": "Partner API",
            "sub_tab": "Amop APIs",
            "table_name": "amop_apis",
            "changed_data": row,
            Partner: partner,
            request_received_at: getCurrentDateTime(),
          };
        }
        if (popupHeading === "User") {
          if (row) {
            row["modified_by"] = username
            row["modified_date"] = getCurrentDateTime()

          }
          data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/update_superadmin_data",
            role_name: role,
            sub_module: "Partner Modules",
            "table_name": "roles",
            Partner: partner,
            "changed_data": row,
            request_received_at: getCurrentDateTime(),
          };
        }
        if (popupHeading === "UserModule") {
          if (row) {
            row["modified_by"] = username
            row["modified_date"] = getCurrentDateTime()
          }
          data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/update_superadmin_data",
            role_name: role,
            sub_module: "Partner Modules",
            "table_name": "tenant_module",
            "changed_data": row,
            Partner: partner,
            request_received_at: getCurrentDateTime(),
          };
        }
        const response = await axios.post(url, { data });
        const resp = JSON.parse(response.data.body);
     
        if (response.data.statusCode === 200 && resp.flag === true) {

          notification.success({
            message: 'Success',
            description: 'Successfully Edit the record!',
            style: messageStyle,
            placement: 'top', // Apply custom styles here
          });
          if (response.data.statusCode === 400 && resp.flag === false){
            Modal.error({
              title: 'Saving Error',
              content: resp.message,
              centered: true,
            });
          }
          if (popupHeading === "Carrier") {

            try {
              const url = `https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management`;
              const data = {
                tenant_name: partner || "default_value",
                username: username,
                path: "/get_superadmin_info",
                role_name: role,
                sub_module: "Partner API",
                sub_tab: "Carrier APIs",
                Partner: partner,
                request_received_at: getCurrentDateTime(),
              };
              const response = await axios.post(url, { data: data });
              const resp = JSON.parse(response.data.body);
              const carrierApis = resp.data.Carrier_apis_data.carrier_apis;
              setRowData(carrierApis)
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
          if (popupHeading === "API") {

            try {
              const url = `https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management`;
              const data = {
                tenant_name: partner || "default_value",
                username: username,
                path: "/get_superadmin_info",
                role_name: role,
                sub_module: "Partner API",
                sub_tab: "Amop APIs",
                Partner: partner,
                request_received_at: getCurrentDateTime(),
              };

              const response = await axios.post(url, { data: data });
              const resp = JSON.parse(response.data.body);
              const carrierApis = resp.data.amop_apis_data.amop_apis;
              setRowData(carrierApis)
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
          if (popupHeading === "UserModule") {

            try {
              const url = `https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management`;
              const data = {
                tenant_name: partner || "default_value",
                username: username,
                path: "/get_superadmin_info",
                role_name: role,
                sub_module: "Partner Modules",
                flag: "withparameters",
                Partner: selectedPartnerModule,
                sub_partner: Environment,
                modules: ["role partner module", "partner module"],
                request_received_at: getCurrentDateTime()
                // Send selected sub-partner
              };

              const response = await axios.post(url, { data: data });
              const resp = JSON.parse(response.data.body);
              // setRowData(resp.data.roles_data)
              setRowData(resp.data.role_module_data)
            }
            catch (err) {
              console.error("Error fetching data:", err);
              Modal.error({
                title: 'Data Fetch Error',
                content: err instanceof Error ? err.message : 'An unexpected error occurred while fetching data. Please try again.',
                centered: true,
              });
            } finally {
              // setLoading(false); // Set loading to false after the request is done
            }
          }
          if (popupHeading === "User") {

            try {
              const url = `https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management`;
              const data = {
                tenant_name: partner || "default_value",
                username: username,
                path: "/get_superadmin_info",
                role_name: role,
                sub_module: "Partner Modules",
                flag: "withparameters",
                Partner: selectedPartnerModule,
                sub_partner: Environment,
                modules: ["role partner module", "partner module"],
                request_received_at: getCurrentDateTime()

                // Send selected sub-partner
              };

              const response = await axios.post(url, { data: data });
              const resp = JSON.parse(response.data.body);
              setRowData(resp.data.roles_data)
              // setRowData(resp.data.role_module_data)
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




        }


      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

  };
  const renderApiState = (apiState: any, index: number, col: any) => {
    return (
      <div className="flex items-center space-x-2">
        <button
          className={`${apiState === true ? 'active-btn' : 'inactive-btn'
            }`}
          style={{ width: '100%' }}
          onClick={() => handleToggle(index, col, false)}
        >
          {col === "Module State" || col === "API state" ? (
            <span>Enable</span>
          ) :
            <span>Active</span>}

        </button>
        <button
          className={`${apiState === false ? 'active-btn' : 'inactive-btn'
            }`}
          style={{ width: '100%' }}
          onClick={() => handleToggle(index, col, true)}
        >
          {col === "Module State" || col === "API state" ? (
            <span>Disable</span>
          ) :
            <span>Inactive</span>}

        </button>
      </div>
    );
  };

  const renderUserStatus = (status: string) => {
    let textColorClass = '';
    if (status === 'True' || status === 'PROCESSED') {
      textColorClass = 'text-blue-500';
    } else if (status === 'False' || status === 'ERROR') {
      textColorClass = 'text-red-500';
    }
    if (status === 'True') {
      return <span className={`${textColorClass}`}>Active</span>;
    }
    else if (status === 'False') {
      return <span className={`${textColorClass}`}>Inactive</span>;
    }
    else {
      return <span className={`${textColorClass}`}>{status}</span>;
    }
  };

  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    const sortedData = [...rowData].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setSortConfig({ key, direction });
    setRowData(sortedData);
  };

  // Calculate pagination
  const colorMap = {
    Activated: '#19AF91', // Light Green
    Deactivated: '#E95463', // Light Red
    // Add more statuses and colors as needed
  };


  return (
    <div className="relative">
      <div className="overflow-auto max-h-[527px]">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-200  sticky top-0 z-10">
            <tr>
              {/* Render actions column if allowedActions is true */}
              {visibleColumns.length > 0 && (
                <th className="px-6 border-b border-gray-300 text-left font-semibold">S.No</th>
              )}
              {headers.map((header, index) => (
                visibleColumns.includes(header) ? (

                  <th
                    key={index}
                    className="px-6 border-b border-gray-300 text-left font-semibold table-header"
                    onClick={() => handleSort(header)}
                    style={{ cursor: 'pointer' }}
                  >
                    {headerMap && headerMap[header] ? headerMap[header][0] : formatColumnName(header)}
                    {sortConfig && sortConfig.key === header ? (
                      sortConfig.direction === 'ascending' ? (
                        <ArrowUpOutlined style={{ marginLeft: 8 }} />
                      ) : (
                        <ArrowDownOutlined style={{ marginLeft: 8 }} />
                      )
                    ) : (
                      <ArrowUpOutlined style={{ marginLeft: 8, opacity: 0.5 }} />
                    )}

                    {/* Check if the header is 'Select', render the Checkbox */}
                    {header === 'Select' && (
                      <Checkbox
                        onChange={handleSelectAllChange}
                        checked={selectAll}
                        indeterminate={selectedRows.length > 0 && selectedRows.length < paginatedData.length}
                        style={{ fontSize: '1rem', marginLeft: 8 }}
                      />
                    )}
                  </th>
                ) : null // Ensure non-visible columns return null
              ))}

              {/* Render actions column if allowedActions is true */}
              {allowedActions && visibleColumns.length > 0 && (
                <th className="px-6 border-b border-gray-300 text-left font-semibold">Actions</th>
              )}
            </tr>

          </thead>
          <tbody>
            {paginatedData?.map((row, index) => (

              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-50" : ""}
              >
                {/* Render actions column if allowedActions is true */}
                {visibleColumns.length > 0 && (
                  <td className="px-6 border-b border-gray-300 table-cell">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                )}
                {headers.map((header, columnIndex) => (
                  visibleColumns.includes(header) ? (
                    <td
                      key={columnIndex}
                      className="px-6 border-b border-gray-300 table-cell"
                    >
                      {/* Check if the header is the selection column */}
                      {header === "S.no" ? (
                        (currentPage - 1) * itemsPerPage + index + 1
                      ) :
                        header === "Select" ? (
                          <Checkbox
                            onChange={() => handleRowCheckboxChange(index)}
                            checked={selectedRows.map(String).includes(String(index))}
                            style={{ fontSize: '2rem' }}
                          />
                        ) : (headerMap && headerMap[header][0] === "Module State") || (headerMap && headerMap[header][0] === "Role Status") || (headerMap && headerMap[header][0] === "API state") ? (
                          renderApiState(row[header], index, headerMap[header][0])
                        ) : (headerMap && headerMap[header][0] === "User status") || header === "User status" ? (
                          renderUserStatus(row[header])
                        ) : header === "DateAdded" || header === "DateActivated" || header === "Processed_Date" ? (
                          <DateTimeCellRenderer value={row[header]} />
                        ) : header === "Username" ? (
                          <EditUsernameCellRenderer value={row[header]} />
                        ) : header === "SimStatus" ? (
                          <StatusCellRenderer
                            record={row}
                            value={row[header]}
                            index={index}
                            colorMap={colorMap}
                          />
                        ) : header === "ActionHistory" ? (
                          <StatusHistoryCellRenderer value={row[header]} />
                        ) : ["Provider", "Service Provider"].includes(header) ? (
                          <ServiceProviderCellRenderer value={row[header]} />
                        ) : header === "Status" ? (
                          <StatusIndicator status={row[header]} />
                        ) : header === "Uploaded" ? (
                          <QuantityCell value={row[header]} type={STATUS_TYPE.UPLOAD} />
                        ) : header === "Successful" ? (
                          <QuantityCell value={row[header]} type={STATUS_TYPE.SUCCESSFUL} />
                        ) : header === "Errors" ? (
                          <QuantityCell value={row[header]} type={STATUS_TYPE.ERRORS} />
                        ) : header === "Change Details" ? (
                          changeDetailCellRenderer()
                        ) : (
                          row[header] != "None" ? row[header] : ""
                        )}
                    </td>
                  ) : null // Ensure non-visible columns return null
                ))}

                {allowedActions && visibleColumns.length > 0 && (
                  <td className="px-6 border-b border-gray-300 table-cell">
                    <div className="flex items-center space-x-2">
                      {allowedActions.includes("edit") && (
                        <PencilIcon
                          className="h-5 w-5 text-blue-500 cursor-pointer"
                          onClick={() =>
                            handleActionClick(
                              "edit",
                              (currentPage - 1) * itemsPerPage + index
                            )
                          }
                        />
                      )}
                      {allowedActions.includes("delete") && (
                        <TrashIcon
                          className="h-5 w-5 text-red-500 cursor-pointer"
                          onClick={() =>
                            handleActionClick(
                              "delete",
                              (currentPage - 1) * itemsPerPage + index
                            )
                          }
                        />
                      )}
                      {allowedActions.includes("info") && (
                        <InformationCircleIcon
                          className="h-5 w-5 text-green-500 cursor-pointer"
                          onClick={() =>
                            handleActionClick(
                              "info",
                              (currentPage - 1) * itemsPerPage + index
                            )
                          }
                        />
                      )}
                      {allowedActions.includes("Actions") && (
                        <ActionItems
                          initialData={initialData}
                          currentPage={currentPage}
                          itemsPerPage={itemsPerPage}
                          index={index}
                          handleActionClick={handleActionClick}
                        />
                      )}
                      {allowedActions.includes("SingleClick") && (
                        <PencilIcon
                          className="h-5 w-5 text-blue-500 cursor-pointer"
                          onClick={() =>
                            handleActionSingleClick()
                          }
                        />
                      )}
                      {allowedActions.includes("tabsEdit") && (
                        <PencilIcon
                          className="h-5 w-5 text-blue-500 cursor-pointer"
                          onClick={() =>
                            handleActionClick(
                              "tabsEdit",
                              (currentPage - 1) * itemsPerPage + index
                            )
                          }
                        />
                      )}
                      {allowedActions.includes("tabsInfo") && (
                        <InformationCircleIcon
                          className="h-5 w-5 text-green-500 cursor-pointer"
                          onClick={() =>
                            handleActionClick(
                              "tabsInfo",
                              (currentPage - 1) * itemsPerPage + index
                            )
                          }
                        />
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>

        </table>
      </div>
      {visibleColumns.length > 0 && (
        <div className="flex justify-center mt-5">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

{editModalOpen && (
        <EditModal
          createModalData={createModalData || []}
          isOpen={editModalOpen}
          isEditable={isEditable}
          rowData={editRowIndex !== null ? rowData[editRowIndex] : null}
          onSave={handleSaveModal}
          onClose={handleCloseModal}
          heading={popupHeading}
          isTabEdit={tabsEdit}
          generalFields={generalFields}
          tableData={rowData}
        />
      )}
      <Modal
        title="Confirm Deletion"
        open={deleteModalOpen}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
        centered
      >
        <p>Do you want to delete this row?</p>
      </Modal>
      <Modal
        title={<span style={{ fontWeight: 'bold', fontSize: '16px' }}>Confirm Enable</span>}
        open={EnableModalOpen}
        onOk={() => confirmSubmit(rowIndex, columnName, true)} // Pass true for enabling
        onCancel={() => setEnableModalOpen(false)}
        centered
      >
        <p>Do you want to <strong>{state}</strong> this State?</p>
      </Modal>
      <Modal
        title={<span style={{ fontWeight: 'bold', fontSize: '16px' }}>Confirm Disable</span>}
        open={DisableModalOpen}
        onOk={() => confirmSubmit(rowIndex, columnName, false)} // Pass false for disabling
        onCancel={() => setDisableModalOpen(false)}
        centered
      >
        <p>Do you want to <strong>{state}</strong> this State?</p>
      </Modal>
    </div>
  );

};

export default TableComponent;
