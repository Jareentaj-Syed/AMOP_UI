"use client";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  PlusIcon,
  ArrowDownTrayIcon,
  AdjustmentsHorizontalIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { Button, Modal, Popover, Spin } from "antd";
import TableComponent from "@/app/components/TableComponent/page";
import CreateModal from "@/app/components/createPopup";
import SearchInput from "@/app/components/Search-Input";
import ColumnFilter from "@/app/components/columnfilter";
// import { createModalData } from "./bandwidth_customers_constants";
import { useAuth } from "@/app/components/auth_context";
import axios from "axios";
import { useLogoStore } from "@/app/stores/logoStore";

// State to manage loading

import { useBandWidthStore } from "./bandwidth_customers_constants";

const BandWidthCustomers: React.FC = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [newRowData, setNewRowData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); 
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  // const createColumns = createModalData;
  const { username, partner, role } = useAuth();
  const [tableData, setTableData] = useState<any[]>([]);
  const { customers_table, setTable } = useBandWidthStore();
  const title = useLogoStore((state) => state.title);
  const [pagination,setpagination]=useState<any>({});
  const [headers,setHeaders]=useState<any[]>([]);
  const [headerMap,setHeaderMap]=useState<any>({});
  const [createModalData,setcreateModalData]=useState<any[]>([]);

  useEffect(() => {
    if(title!="People"){
        setLoading(true)
    }
},[title])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const url =
          "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management";
        const data = {
          tenant_name: partner || "default_value",
          username: username,
          path: "/get_module_data",
          role_name: role,
          parent_module_name: "poeple",
          module_name: "Bandwidth Customers",
          mod_pages: {
            start: 0,
            end: 500,
          },
        };
        const response = await axios.post(url, { data });
        const parsedData = JSON.parse(response.data.body);
        const tableData = parsedData.data.customers;
        const headerMap=parsedData.headers_map["Bandwidth Customers"]["header_map"]
        const createModalData=parsedData.headers_map["Bandwidth Customers"]["pop_up"]
        const headers=Object.keys(headerMap)
        console.log("response.data-revio", tableData);
        setHeaders(headers)
        setHeaderMap(headerMap)
        setcreateModalData(createModalData)
        setTable(tableData);
        setTableData(tableData);
        setVisibleColumns(headers)
        setLoading(false)
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
  fetchData()
})

  const handleCreateModalOpen = () => {
    setCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
    setNewRowData({});
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

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
    XLSX.utils.book_append_sheet(workbook, worksheet, "BandWidthCustomers");
    XLSX.writeFile(workbook, "BandWidthCustomers.xlsx");
  };

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
          allowedActions={["info"]}
          popupHeading="Bandwidth Customer"
          createModalData={createModalData}
          pagination={pagination}
        
        />
    

      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        onSave={handleCreateRow}
        columnNames={[]}
        heading="Bandwidth Customer"
        header={Object.keys(tableData[0])}
      />
    </div>
  );

}
export default BandWidthCustomers;
