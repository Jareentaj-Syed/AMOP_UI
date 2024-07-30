"use client";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  PlusIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { Button } from "antd";
import TableComponent from "@/app/components/TableComponent/page";
import CreateModal from "@/app/components/createPopup";
import SearchInput from "@/app/components/Search-Input";
import ColumnFilter from "@/app/components/columnfilter";
import { createModalData, headerMap, headers } from "./e911_customers_constants";
import { useAuth } from "@/app/components/auth_context";
import axios from "axios";
import { useE911CustomersStore } from "./e911_customers_constants";

interface ExcelData {
  [key: string]: any;
}

const E911Customers: React.FC = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [newRowData, setNewRowData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<string[]>(headers);
  const createColumns = createModalData;
  const { username, partner, role } = useAuth();

  const [tableData, setTableData] = useState<any>([]);
  const { customers_table, setTable } = useE911CustomersStore();

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
          module_name: "E911 Customers",
          mod_pages: {
            start: 0,
            end: 500,
          },
        };
        const response = await axios.post(url, {
          data,
        });
        const parsedData = JSON.parse(response.data.body);
        const tableData = parsedData.data.WestE911Customer;
        console.log("response.data-revio", tableData);
        setTable(tableData);
        setTableData(tableData);
      } catch (err) {
        console.error("Error fetching data:", err);
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "E911Customers");
    XLSX.writeFile(workbook, "E911Customers.xlsx");
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

      {tableData.length > 0 ? (
        <TableComponent
          headers={headers}
          headerMap={headerMap}
          initialData={tableData}
          searchQuery={searchTerm}
          visibleColumns={visibleColumns}
          itemsPerPage={10}
          allowedActions={["edit", "delete"]}
          popupHeading="E9 Customer"
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
        columnNames={createModalData}
        heading="E9 Customer"
        header={Object.keys(tableData[0])}
      />
    </div>
  );
};

export default E911Customers;
