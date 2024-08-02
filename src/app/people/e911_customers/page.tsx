"use client";
import React, { useEffect, useState } from "react";
import {
  PlusIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { Button, Modal, Spin, DatePicker } from "antd";
import TableComponent from "@/app/components/TableComponent/page";
import CreateModal from "@/app/components/createPopup";
import SearchInput from "@/app/components/Search-Input";
import ColumnFilter from "@/app/components/columnfilter";
import { createModalData, headerMap, headers } from "./e911_customers_constants";
import { useAuth } from "@/app/components/auth_context";
import axios from "axios";
import { useE911CustomersStore } from "./e911_customers_constants";
import { useLogoStore } from "@/app/stores/logoStore";
import { getCurrentDateTime } from "@/app/components/header_constants";
import FileSaver from "file-saver";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

const E911Customers: React.FC = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isExportModalOpen, setExportModalOpen] = useState(false);
  const [newRowData, setNewRowData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const { username, partner, role } = useAuth();
  const [loading, setLoading] = useState(true);
  const title = useLogoStore((state) => state.title);
  const [tableData, setTableData] = useState<any>([]);
  const { setTable } = useE911CustomersStore();
  const [headers, setHeaders] = useState<any[]>([]);
  const [headerMap, setHeaderMap] = useState<any>({});
  const [createModalData, setCreateModalData] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);


  useEffect(() => {
    if (title !== "People") {
      setLoading(true);
    }
  }, [title]);

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
          parent_module_name: "people",
          module_name: "E911 Customers",
          mod_pages: {
            start: 0,
            end: 500,
          },
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
          setTableData(customertableData);
          const headers = Object.keys(headerMap);
          setHeaders(headers);
          setHeaderMap(headerMap);
          setCreateModalData(createModalData);
          setVisibleColumns(headers);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Modal.error({
          title: 'Data Fetch Error',
          content: error instanceof Error ? error.message : 'An unexpected error occurred while fetching data. Please try again.',
          centered: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username, partner, role]);

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

  const handleExportModalOpen = () => {
    setExportModalOpen(true);
  };

  const handleExportModalClose = () => {
    setExportModalOpen(false);
    setDateRange([null, null]); // Reset date range
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
      module_name:"E911 Customers",
      request_received_at: getCurrentDateTime(),
      start_date: startDate.format("YYYY-MM-DD 00:00:00"), // Start of the day
        end_date: endDate.format("YYYY-MM-DD 23:59:59"), 
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

      downloadBlob(blob)
      
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
    link.download = 'E911 Customers.xlsx'; // Set the file name to .xlsx
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
          <button className="save-btn" onClick={handleExportModalOpen}>
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
        itemsPerPage={100}
        allowedActions={["edit", "delete"]}
        popupHeading="E911 Customer"
        createModalData={createModalData} pagination={undefined}      />

      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        onSave={handleCreateRow}
        columnNames={createModalData}
        heading="E911 Customer"
        header={Array.isArray(tableData) && tableData.length > 0 ? Object.keys(tableData[0]) : []}
      />

      {/* Export Modal */}
      <Modal
        title="Export Output"
        visible={isExportModalOpen}
        onCancel={handleExportModalClose}
        footer={null}
        centered
      >
        <div className="flex flex-col space-y-4">
          <span>Select Date Range:</span>
          <RangePicker 
  onChange={(dates) => {
    if (dates && dates.length === 2) {
      setDateRange([dates[0], dates[1]] as [Dayjs, Dayjs]); // Cast to the expected type
    } else {
      setDateRange([null, null]); // Reset to null if dates are not both available
    }
  }} 
  format="YYYY-MM-DD"
/>
          <div className="flex justify-end space-x-2">
            <Button onClick={handleExportModalClose}>Cancel</Button>
            <Button type="primary" onClick={handleExport}>Export</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default E911Customers;