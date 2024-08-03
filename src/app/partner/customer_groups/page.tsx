"use client";
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { PlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import TableComponent from '@/app/components/TableComponent/page';
import CreateModal from '@/app/components/createPopup';
import SearchInput from '@/app/components/Search-Input';
import ColumnFilter from '@/app/components/columnfilter';
import { usePartnerStore } from '../partnerStore';

interface ExcelData {
  [key: string]: any;
}

type HeaderMap = Record<string, [string, number]>;

const CustomerGroups: React.FC = () => {
  const [data, setData] = useState<ExcelData[]>([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [newRowData, setNewRowData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [headerMap, setHeadersMap] = useState<HeaderMap>({});
  const [createModalData, setCreateModalData] = useState<any[]>([]);
  const [generalFields, setGeneralFields] = useState<any>({});
  const { partnerData } = usePartnerStore.getState();
  const customerGroupsData = partnerData["Customer groups"] || {};


  const sortHeaderMap = (headerMap: HeaderMap): HeaderMap => {
    const entries = Object.entries(headerMap) as [string, [string, number]][];
    entries.sort((a, b) => a[1][1] - b[1][1]);
    return Object.fromEntries(entries) as HeaderMap;
  };

  useEffect(() => {
    const initializeData = () => {
      const data = customerGroupsData?.data?.["Customer groups"]?.customergroups || [];
      setData(data);

      const header_Map = sortHeaderMap(customerGroupsData?.headers_map?.["Customer groups"]?.header_map || {});
      const headers_ = Object.keys(header_Map);
      const createModalData_=customerGroupsData?.headers_map?.["Customer groups"]?.pop_up|| [];
      const generalFields_=customerGroupsData?.data?.["Customer groups"] || {}
      setHeaders(headers_);
      setHeadersMap(header_Map);
      setVisibleColumns(headers_);
      setGeneralFields(generalFields_);
      setCreateModalData(createModalData_ )
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

  const handleExport = () => {
    const exportData = [headers, ...data.map(row => headers.map(header => row[header]))];
    const worksheet = XLSX.utils.aoa_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "E911Customers");
    XLSX.writeFile(workbook, "CustomerGroups.xlsx");
  };

  return (
    <div className="container">
      <div className='p-4'>
        <div className="p-4 flex items-center justify-between mb-4">
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
            <button
              className="save-btn"
              onClick={handleCreateModalOpen}
            >
              <PlusIcon className="h-5 w-5 text-black-500 mr-1" />
              Add Customer Group
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
          initialData={data}
          searchQuery={searchTerm}
          visibleColumns={visibleColumns}
          itemsPerPage={10}
          allowedActions={["edit", "delete"]}
          popupHeading='Customer Group'
          createModalData={createModalData}
          generalFields={generalFields}
          pagination={{}}
        />

        <CreateModal
          isOpen={isCreateModalOpen}
          onClose={handleCreateModalClose}
          onSave={handleCreateRow}
          columnNames={createModalData}
          heading='Customer Group'
          header={data.length>0?Object.keys(data[0]):[]}
          generalFields={generalFields}
        />
      </div>
    </div>
  );
};

export default CustomerGroups;
