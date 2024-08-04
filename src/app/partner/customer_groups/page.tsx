"use client";
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { PlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import TableComponent from '@/app/components/TableComponent/page';
import CreateModal from '@/app/components/createPopup';
import SearchInput from '@/app/components/Search-Input';
import ColumnFilter from '@/app/components/columnfilter';
import { usePartnerStore } from '../partnerStore';
import { Button, DatePicker, Modal } from 'antd';

import dayjs, { Dayjs } from "dayjs";
import { getCurrentDateTime } from '@/app/components/header_constants';
import { useAuth } from '@/app/components/auth_context';
import axios from 'axios';
import TableSearch from '@/app/components/entire_table_search';
import AdvancedMultiFilter from '@/app/components/advanced_search';
const { RangePicker } = DatePicker;

interface ExcelData {
  [key: string]: any;
}

type HeaderMap = Record<string, [string, number]>;

const CustomerGroups: React.FC = () => {
  const [data, setData] = useState<ExcelData[]>([]);
  const [isExportModalOpen, setExportModalOpen] = useState(false);

  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [newRowData, setNewRowData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const { username, partner, role } = useAuth();
  const [headers, setHeaders] = useState<string[]>([]);
  const [headerMap, setHeadersMap] = useState<HeaderMap>({});
  const [createModalData, setCreateModalData] = useState<any[]>([]);
  const [generalFields, setGeneralFields] = useState<any>({});
  const { partnerData } = usePartnerStore.getState();
  const customerGroupsData = partnerData["Customer groups"] || {};
  const [filteredData, setFilteredData] = useState([]);


  const sortHeaderMap = (headerMap: HeaderMap): HeaderMap => {
    const entries = Object.entries(headerMap) as [string, [string, number]][];
    entries.sort((a, b) => a[1][1] - b[1][1]);
    return Object.fromEntries(entries) as HeaderMap;
  };
  const handleFilter = (advancedFilters: any) => {
    console.log(advancedFilters)
    setFilteredData(advancedFilters);
  };
  const handleReset = (EmptyFilters: any) => {
    console.log(EmptyFilters)
    setFilteredData(EmptyFilters);
  };
  useEffect(() => {
    const initializeData = () => {
      const data = customerGroupsData?.data?.["Customer groups"]?.customergroups || [];
      setData(data);

      const header_Map = sortHeaderMap(customerGroupsData?.headers_map?.["Customer groups"]?.header_map || {});
      const headers_ = Object.keys(header_Map);
      const createModalData_ = customerGroupsData?.headers_map?.["Customer groups"]?.pop_up || [];
      const generalFields_ = customerGroupsData?.data?.["Customer groups"] || {}
      setHeaders(headers_);
      setHeadersMap(header_Map);
      setVisibleColumns(headers_);
      setGeneralFields(generalFields_);
      setCreateModalData(createModalData_)
    };

    initializeData();
  }, [customerGroupsData]);

  const handleCreateModalOpen = () => {
    setCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
    setNewRowData({});
  };

  const handleCreateRow = (newRow: any) => {
    const updatedData = [...data, newRow];
    setData(updatedData);
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
      module_name: "Customer Groups",
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
      console.log(resp)
      // Close the modal after exporting

      if (resp.flag === false) {
        console.log(resp.message)
        Modal.error({
          title: 'Export Error',
          content: resp.message,
          centered: true,
        });
      }

      handleExportModalClose();
      downloadBlob(blob)

    } catch (error) {
      // console.error("Error downloading the file:", error);
      // Modal.error({ title: 'Export Error', content: 'An error occurred while exporting the file. Please try again.' });
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
    link.download = 'Customer Groups.xlsx'; // Set the file name to .xlsx
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const disableFutureDates = (current: any) => {
    console.log("future dates:", current && current > dayjs().endOf('day'));
    return current && current > dayjs().endOf('day'); // Disable future dates
  };
  // if(headers.length<1){
  //   console.log(customerGroupsData)
  //   Modal.error({
  //     title: 'Error',
  //     content:JSON.stringify(customerGroupsData)||'Unable to fetch table.',
  //     centered: true,
  // });
  // }
  return (
    <div className="container">
      <div className='p-4'>
        <div className="p-4 flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            {/* <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> */}
            <TableSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              tableName={"customer_groups"}
              headerMap={headerMap}
            />

          </div>

          <div className="flex space-x-2">
            <button
              className="save-btn"
              onClick={handleCreateModalOpen}
            >
              <PlusIcon className="h-5 w-5 text-black-500 mr-1" />
              Add Customer Group
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
            <AdvancedMultiFilter onFilter={handleFilter} onReset={handleReset} headers={headers} headerMap={headerMap}/>

        </div>
        <TableComponent
          headers={headers}
          headerMap={headerMap}
          initialData={data}
          searchQuery={searchTerm}
          visibleColumns={visibleColumns}
          itemsPerPage={100}
          allowedActions={["edit", "delete"]}
          popupHeading='Customer Group'
          createModalData={createModalData}
          generalFields={generalFields}
          pagination={{}}
          advancedFilters={filteredData}

        />

        <CreateModal
          isOpen={isCreateModalOpen}
          onClose={handleCreateModalClose}
          onSave={handleCreateRow}
          columnNames={createModalData}
          heading='Customer Group'
          header={data.length > 0 ? Object.keys(data[0]) : []}
          generalFields={generalFields}
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
    </div>
  );
};

export default CustomerGroups;
