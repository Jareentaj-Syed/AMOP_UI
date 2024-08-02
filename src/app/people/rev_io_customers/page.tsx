"use client";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  PlusIcon,
  ArrowDownTrayIcon,
  AdjustmentsHorizontalIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { Button, Modal, Popover } from "antd";
import { Spin } from 'antd';
import TableComponent from "@/app/components/TableComponent/page";
import CreateModal from "@/app/components/createPopup";
import SearchInput from "@/app/components/Search-Input";
import ColumnFilter from "@/app/components/columnfilter";
import { createModalData, headers ,headerMap} from "./rev_io_customers_constants";
import axios from "axios";
import { useAuth } from "@/app/components/auth_context";
import { useRevIOStore } from "./rev_io_customers_constants";
import { useLogoStore } from "@/app/stores/logoStore";
const [pagination,setpagination]=useState<any>({});
const [generalFields,setgeneralFields]=useState<any[]>([])


interface ExcelData {
  [key: string]: any;
}

const RevIOCustomers: React.FC = () => {
  const { username, partner, role } = useAuth();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [newRowData, setNewRowData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // State to manage loading
  const [visibleColumns, setVisibleColumns] = useState<string[]>(headers); // Initialize with all headers
  const [createColumns,setcreateColumns ]= useState<any>([]);
  const [tableData, setTableData] = useState<any>([]);
  const { customers_table, setTable ,setBillProfile} = useRevIOStore();
  const title = useLogoStore((state) => state.title);

  useEffect(() => {
    if(title!="People"){
        setLoading(true)
    }
},[title])
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const url = `https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management`;
      const data = {
        tenant_name: partner || "default_value",
        username: username,
        path: "/get_module_data",
        role_name: role,
        parent_module_name: "people", // Corrected spelling from 'poeple'
        module_name: "REV.Io Customers",
        mod_pages: {
          start: 0,
          end: 500,
        },
      };
      const response = await axios.post(url, { data });
      const parsedData = JSON.parse(response.data.body);

      // Check if the flag is false
      // if (parsedData.flag === false) {
      //   Modal.error({
      //     title: 'Data Fetch Error',
      //     content: parsedData.message || 'An error occurred while fetching REV.Io Customers data. Please try again.',
      //     centered: true,
      //   });
      //   return; // Exit early if there's an error
      // }

      const tableData = parsedData.data.customers;
      const bill_profile = parsedData.data.revbillprofile;
      const bill_profile_options = bill_profile.map((bill: any) => bill.description);
      const createColumns = createModalData(bill_profile_options);
      
      setcreateColumns(createColumns);
      setTable(tableData);
      setTableData(tableData);
      setBillProfile(bill_profile_options);
    } catch (err) {
      console.error("Error fetching data:", err);
      // Modal.error({
      //   title: 'Data Fetch Error',
      //   content: err instanceof Error ? err.message : 'An unexpected error occurred while fetching data. Please try again.',
      //   centered: true,
      // });
    } finally {
      setLoading(false); // Set loading to false after the request is done
    }
  };

  fetchData();
}, [username, partner, role, setTable]);


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
      ...tableData.map((row: any) => headers.map((header) => row[header])),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "RevIOCustomers");
    XLSX.writeFile(workbook, "RevIOCustomers.xlsx");
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
            headers={headers} // Pass headers directly
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns} // Ensure setVisibleColumns is passed down
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
          <button className="save-btn">
            <ArrowUpTrayIcon className="h-5 w-5 text-black-500 mr-2" />
            Upload
          </button>
        </div>
      </div>

     
        <TableComponent
          headers={headers}
          headerMap={headerMap}
          initialData={tableData}
          searchQuery={searchTerm}
          visibleColumns={visibleColumns} // Ensure visibleColumns are used in TableComponent
          itemsPerPage={100}
          allowedActions={["edit", "info"]}
          popupHeading="RevIO Customer"
          createModalData={createColumns}
          pagination={pagination}
        />
      
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        onSave={handleCreateRow}
        columnNames={createColumns}
        heading="RevIO Customer"
        header={Object.keys(tableData[0])}
      />
    </div>
  );
};

export default RevIOCustomers;
