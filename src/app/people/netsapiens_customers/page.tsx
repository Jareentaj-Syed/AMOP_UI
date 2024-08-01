"use client";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { PlusIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Button, Modal } from "antd";
import TableComponent from "@/app/components/TableComponent/page";
import CreateModal from "@/app/components/createPopup";
import SearchInput from "@/app/components/Search-Input";
import ColumnFilter from "@/app/components/columnfilter";
import { createModalData, headerMap, headers } from "./netsapiens_customers_constants";
import axios from "axios";
import { Spin } from 'antd';
import { useAuth } from "@/app/components/auth_context";
import { useNetSapiensStore } from "./netsapiens_customers_constants";
import { useLogoStore } from "@/app/stores/logoStore";



const NetSapiensCustomers: React.FC = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [newRowData, setNewRowData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // State to manage loading

  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  // const createColumns = createModalData;
  const { username, partner, role } = useAuth();
  const { customers_table, setTable } = useNetSapiensStore();
  const [tableData, setTableData] = useState<any[]>([]);
  const title = useLogoStore((state) => state.title);
  const [pagination,setpagination]=useState<any>({});
  const [headers,setHeaders]=useState<any[]>([]);
  const [headerMap,setHeaderMap]=useState<any>({});
  const [createModalData,setcreateModalData]=useState<any[]>([]);
  const [generalFields,setgeneralFields]=useState<any[]>([])

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
        parent_module_name: "people", // Corrected spelling from 'poeple'
        module_name: "NetSapiens Customers",
        mod_pages: {
          start: 0,
          end: 500,
        },
      };
      
      const response = await axios.post(url, { data });
      const parsedData = JSON.parse(response.data.body);
      console.log(parsedData)
      // Check if the flag is false in the parsed data
      const tableData = parsedData.data.customers;
      console.log("response.data-revio", tableData);
      const headerMap=parsedData.headers_map["NetSapiens Customers"]["header_map"]
      const createModalData=parsedData.headers_map["NetSapiens Customers"]["pop_up"]
      const sortedheaderMap=sortHeaderMap(headerMap)
      const headers=Object.keys(sortedheaderMap)
      const generalFields=parsedData.data
      setgeneralFields(generalFields)
      setHeaders(headers)
      setHeaderMap(sortedheaderMap)
      setcreateModalData(createModalData)
      // setTable(tableData);
      setVisibleColumns(headers)
      setTableData(tableData);
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

  const handleCreateRow = (newRow: any) => {
    const updatedData = [...tableData, newRow];
    setTable(updatedData);
    setTableData(updatedData);
    handleCreateModalClose();
  };

  const handleExport = () => {
    const exportData = [
      headers,
      ...tableData.map((row) => headers.map((header) => row[header])),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "NetSapiensCustomers");
    XLSX.writeFile(workbook, "NetSapiensCustomers.xlsx");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div className="container mx-auto">
      <div className="p-4 flex items-center justify-between mt-1 mb-4">
        <div className="flex space-x-2">
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <ColumnFilter
            headers={headers}
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
            headerMap={headerMap}
          />
        </div>

        <div className="flex space-x-2">
          <button className="save-btn" onClick={handleCreateModalOpen}>
            <PlusIcon className="h-5 w-5 text-black-500 mr-1" />
            Add Customer
          </button>
          <button className="save-btn" onClick={handleExport}>
            <ArrowDownTrayIcon className="h-5 w-5 text-black-500 mr-2" />
            <span>Export</span>
          </button>
        </div>
      </div>

        <TableComponent
          headers={headers}
          headerMap={headerMap}
          initialData={tableData}
          searchQuery={searchTerm}
          visibleColumns={visibleColumns}
          itemsPerPage={10}
          allowedActions={["info","edit"]}
          popupHeading="NetSapien Customer"
          createModalData={createModalData}
          pagination={pagination}
          generalFields={generalFields}
        />
     

      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        onSave={handleCreateRow}
        columnNames={createModalData}
        heading="NetSapien Customer" 
        header={tableData && tableData.length > 0 ? Object.keys(tableData[0]) : []}
        generalFields={generalFields}
  />
    </div>
  );
};

export default NetSapiensCustomers;
