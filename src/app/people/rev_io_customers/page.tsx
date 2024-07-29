"use client";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  PlusIcon,
  ArrowDownTrayIcon,
  AdjustmentsHorizontalIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { Button, Popover } from "antd";
import TableComponent from "@/app/components/TableComponent/page";
import CreateModal from "@/app/components/createPopup";
import SearchInput from "@/app/components/Search-Input";
import ColumnFilter from "@/app/components/columnfilter";
import { createModalData, headers ,headerMap} from "./rev_io_customers_constants";
import axios from "axios";
import { useAuth } from "@/app/components/auth_context";
import { useRevIOStore } from "./rev_io_customers_constants";

interface ExcelData {
  [key: string]: any;
}

const RevIOCustomers: React.FC = () => {
  const { username, partner, role } = useAuth();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [newRowData, setNewRowData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<string[]>(headers); // Initialize with all headers
  const createColumns = createModalData;
  const [tableData, setTableData] = useState<any>([]);
  const { customers_table, setTable } = useRevIOStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `https://zff5caoge3.execute-api.ap-south-1.amazonaws.com/dev/get_partner_info`;
        const data = {
          tenant_name: partner || "default_value",
          username: username,
          path: "/get_module_data",
          role_name: role,
          parent_module_name: "poeple",
          module_name: "REV.Io Customers",
          mod_pages: {
            start: 0,
            end: 500,
          },
        };
        const response = await axios.post(url, {
          data,
        });
        const parsedData = JSON.parse(response.data.body);
        const tableData = parsedData.data.customers;
        // console.log("response.data-revio", tableData);
        setTable(tableData);
        setTableData(tableData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleCreateModalOpen = () => {
    setCreateModalOpen(true);
  };
console.log('visibleColumns',visibleColumns)
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

  return (
    <div className="container mx-auto">
      <div className="p-4 flex items-center justify-between mt-1 mb-4">
        <div className="flex space-x-2">
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <ColumnFilter
            headers={headers} // Pass headers directly
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns} // Ensure setVisibleColumns is passed down
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

      {tableData.length > 0 ? (
        <TableComponent
          headers={headers}
          headerMap={headerMap}
          initialData={tableData}
          searchQuery={searchTerm}
          visibleColumns={visibleColumns} // Ensure visibleColumns are used in TableComponent
          itemsPerPage={10}
          allowedActions={["edit", "info"]}
          popupHeading="Customer"
          infoColumns={createColumns}
          editColumns={createColumns}
        />
      ) : (
        <div>Loading data, please wait...</div>
      )}

      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        onSave={handleCreateRow}
        columnNames={createColumns}
        heading="Customer"
      />
    </div>
  );
};

export default RevIOCustomers;
