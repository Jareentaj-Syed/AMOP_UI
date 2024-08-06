"use client";
import React, { useEffect, useState, lazy, Suspense } from "react";
import * as XLSX from "xlsx";
import { PlusIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Button, Modal ,Spin ,DatePicker, notification} from "antd";
// import TableComponent from "@/app/components/TableComponent/page";
// import CreateModal from "@/app/components/createPopup";
// import SearchInput from "@/app/components/Search-Input";
// import ColumnFilter from "@/app/components/columnfilter";
import { createModalData, headerMap, headers } from "./netsapiens_customers_constants";
import axios from "axios";
import { useAuth } from "@/app/components/auth_context";
import { useNetSapiensStore } from "./netsapiens_customers_constants";
import { useLogoStore } from "@/app/stores/logoStore";
import { getCurrentDateTime } from "@/app/components/header_constants";
import dayjs, { Dayjs } from "dayjs";
// import TableSearch from "@/app/components/entire_table_search";
// import AdvancedMultiFilter from "@/app/components/advanced_search";
const { RangePicker } = DatePicker;

//Lazy Loading Components
const TableComponent = lazy(()=>import("@/app/components/TableComponent/page"));
const CreateModal = lazy(()=>import("@/app/components/createPopup"));
const ColumnFilter = lazy(()=>import("@/app/components/columnfilter"));
const TableSearch = lazy(()=>import("@/app/components/entire_table_search"));
const AdvancedMultiFilter = lazy(()=>import("@/app/components/advanced_search"));


const NetSapiensCustomers: React.FC = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [newRowData, setNewRowData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // State to manage loading

  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  // const createColumns = createModalData;
  const { username, partner, role ,settabledata} = useAuth();
  const { customers_table, setTable } = useNetSapiensStore();
  const [tableData, setTableData] = useState<any[]>([]);
  const title = useLogoStore((state) => state.title);
  const [pagination,setpagination]=useState<any>({});
  const [headers,setHeaders]=useState<any[]>([]);
  const [headerMap,setHeaderMap]=useState<any>({});
  const [createModalData,setcreateModalData]=useState<any[]>([]);
  const [generalFields,setgeneralFields]=useState<any[]>([])
  const [isExportModalOpen, setExportModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [filteredData, setFilteredData] = useState([]);

  const handleFilter = (advancedFilters: any) => {
    console.log(advancedFilters)
    // setFilteredData(advancedFilters);
  };
  const handleReset = (EmptyFilters: any) => {
    console.log(EmptyFilters)
    setFilteredData(EmptyFilters);
  };
  useEffect(() => {
    if(title!="People"){
        setLoading(true)
    }
},[title])


type HeaderMap = Record<string, [string, number]>;

const sortHeaderMap = (headerMap: HeaderMap): HeaderMap => {
  // Convert the object to an array of [key, value] pairs
  const entries = Object.entries(headerMap) as [string, [string, number]][];

  // Sort the array based on the second item of each value
  entries.sort((a, b) => a[1][1] - b[1][1]);

  // Convert the sorted array back to an object
  return Object.fromEntries(entries) as HeaderMap;
}


const disableFutureDates = (current:any) => {
  console.log("future dates:",current && current > dayjs().endOf('day'));
  return current && current > dayjs().endOf('day'); // Disable future dates
};

const sortPopup = (fields: any[]): any[] => {
  return fields.sort((a:any, b:any) => a?.id - b?.id);
};
useEffect(() => {
  const fetchData = async () => {
    setLoading(true); // Set loading to true at the start
    try {
      const url = `https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management`;
      const data = {
        tenant_name: partner || "default_value",
        username: username,
        path: "/get_module_data",
        role_name: role,
        parent_module:"People", // Corrected spelling from 'poeple'
        module_name:"NetSapiens Customers",
        mod_pages: {
          start: 0,
          end: 500,
        },
        request_received_at: getCurrentDateTime(),
        Partner:partner,
      };
      
      const response = await axios.post(url, { data });
      const parsedData = JSON.parse(response.data.body);
      console.log(parsedData)
      // Check if the flag is false in the parsed data
      const tableData = parsedData.data.customers;
      const headerMap=parsedData.headers_map["NetSapiens Customers"]["header_map"]
      const createModalData=parsedData.headers_map["NetSapiens Customers"]["pop_up"]
      const sortedheaderMap=sortHeaderMap(headerMap)
      const headers=Object.keys(sortedheaderMap)
      const generalFields=parsedData.data
      setgeneralFields(generalFields)
      setHeaders(headers)
      setHeaderMap(sortedheaderMap)
      setcreateModalData(sortPopup(createModalData))
      // setTable(tableData);
      setVisibleColumns(headers)
      setTableData(tableData);
      settabledata(tableData)
      setLoading(false)
      if (parsedData.flag === false) {
        Modal.error({
          title: 'Data Fetch Error',
          content: parsedData.message || 'An error occurred while fetching NetSapiens Customers data. Please try again.',
          centered: true,
        });
      } else {
       
      }
      
    } catch (error) {
      console.error("Error fetching data:", error);
      Modal.error({
        title: 'Data Fetch Error',
        content: error instanceof Error ? error.message : 'An unexpected error occurred while fetching data. Please try again.',
        centered: true,
      });
    } finally {
      setLoading(false); // Ensure loading is set to false in the finally block
    }
  };

  fetchData();
}, []);

  const handleCreateModalOpen = () => {
    setCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
    setNewRowData({});
  };

  const handleCreateRow = (newRow: any,tableData:any) => {
    const updatedData = [...tableData, newRow];
    setTable(tableData);
    setTableData(tableData);
    handleCreateModalClose();
  };

  const handleExportModalOpen = () => {
    setExportModalOpen(true);
  };

  const handleExportModalClose = () => {
    setExportModalOpen(false);
    setDateRange([null, null]); 
    console.log("daterange:",dateRange)
  };

  const messageStyle = {
    fontSize: '14px',  // Adjust font size
    fontWeight: 'bold', // Make the text bold
    padding: '16px',
    // Add padding
  };

  const handleExport = async () => {
    if (!dateRange || dateRange[0] === null || dateRange[1] === null) {
      Modal.error({ title: 'Error', content: 'Please select a date range.' });
      return;
    }

    const [startDate, endDate] = dateRange;

    const data = {
      path: "/export",
      username: username,
      table: "customers",
      module_name:"NetSapiens Customers",
      request_received_at: getCurrentDateTime(),
      start_date: startDate.format("YYYY-MM-DD 00:00:00"), // Start of the day
        end_date: endDate.format("YYYY-MM-DD 23:59:59"), 
        Partner:partner
    };

    try {
      const url = "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management";
      const response = await axios.post(url, { data: data }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const resp = JSON.parse(response.data.body);
      const blob = resp.blob;

        // Close the modal after exporting
        if (response.data.statusCode === 200) {
          if (resp.flag === true) {
            notification.success({
              message: 'Success',
              description: 'Successfully exported the record!',
              style: messageStyle,
              placement: 'top',
            });
    
            // Trigger the download after a successful export
            downloadBlob(blob);
          } else {
            // Log and show error message
            console.log('Error message:', resp.message);
            Modal.error({
              title: 'Export Error',
              content: resp.message,
              centered: true,
            });
        
          }
        } else {
          // Handle unexpected status codes
          console.log('Unexpected status code:', response.data.statusCode);
          Modal.error({
            title: 'Export Error',
            content: resp.message,
            centered: true,
          });
        }
      
      // Close the modal after exporting
      handleExportModalClose();
    } catch (error) {
      console.error("Error downloading the file:", error);
      Modal.error({ title: 'Export Error', content: 'An error occurred while exporting the file. Please try again.' });
    }
  };

  const downloadBlob = (base64Blob: string) => {
    // Decode the Base64 string
    const byteCharacters = atob(base64Blob);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blobObject = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blobObject);
    link.download = 'NetSapiens Customers.xlsx'; // Set the file name to .xlsx
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><Spin size="large" /></div>}>
    <div className="container mx-auto">
      <div className="p-4 flex items-center justify-between mt-1 mb-4">
        <div className="flex space-x-2">
          {/* <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> */}
          <TableSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          tableName={"netsapiens_customers"}
          headerMap={headerMap}
        />
          
        </div>

        <div className="flex space-x-2">
          <button className="save-btn" onClick={handleCreateModalOpen}>
            <PlusIcon className="h-5 w-5 text-black-500 mr-1" />
            Add Customer
          </button>
          <button className="save-btn" onClick={handleExportModalOpen}>
            <ArrowDownTrayIcon className="h-5 w-5 text-black-500 mr-2" />
            <span>Export</span>
          </button>
          <ColumnFilter
            headers={headers}
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
            headerMap={headerMap}
          />
        </div>
      </div>
      <div className=' mb-4 space-x-2'>
            <AdvancedMultiFilter 
            onFilter={handleFilter} 
            onReset={handleReset} 
            headers={headers} 
            headerMap={headerMap}
            tableName={"netsapiens_customers"}
            />
        </div>

        <TableComponent
          headers={headers}
          headerMap={headerMap}
          initialData={tableData}
          searchQuery={searchTerm}
          visibleColumns={visibleColumns}
          itemsPerPage={100}
          allowedActions={["info","edit"]}
          popupHeading="NetSapien Customer"
          createModalData={createModalData}
          pagination={pagination}
          generalFields={generalFields}
          advancedFilters={filteredData}
        />
     

      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        onSave={handleCreateRow}
        columnNames={createModalData}
        heading="NetSapien Customer" 
        header={tableData && tableData.length > 0 ? Object.keys(tableData[0]) : []}
        generalFields={generalFields}
        tableData={tableData}
  />
    <Modal
        title="Export Output"
        visible={isExportModalOpen}
        onCancel={() => {
          handleExportModalClose();
          setDateRange([null, null]); // Reset date range here for good measure
        }}
        footer={null}
        centered
        afterClose={() => setDateRange([null, null])}
      >
        <div className="flex flex-col space-y-4">
          <span>Select Date Range:</span>
          <RangePicker 
         value={dateRange[0] && dateRange[1] ? [dateRange[0], dateRange[1]] : null} // Bind the date range
            onChange={(dates) => {
              console.log("Selected dates:", dates); // Debug log
              if (dates && dates.length === 2) {
                setDateRange([dates[0], dates[1]] as [Dayjs, Dayjs]);
              } else {
                setDateRange([null, null]); // Reset to null if dates are not both available
              }
            }} 
            format="YYYY-MM-DD"
            disabledDate={disableFutureDates}
          />
          <div className="flex justify-end space-x-2">
            <Button onClick={handleExportModalClose}>Cancel</Button>
            <Button type="primary" onClick={handleExport}>Export</Button>
          </div>
        </div>
      </Modal>
    </div>
    </Suspense>
  );
};

export default NetSapiensCustomers;
