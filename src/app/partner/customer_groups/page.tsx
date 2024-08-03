"use client";
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { PlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import TableComponent from '@/app/components/TableComponent/page';
import CreateModal from '@/app/components/createPopup';
import SearchInput from '@/app/components/Search-Input';
import ColumnFilter from '@/app/components/columnfilter';
import { createModalData, headerMap } from './customer_groups_constants';
import { customer_table } from './customer_groups_constants';
import { headers,pagination,generalFields } from './customer_groups_constants';
import { usePartnerStore } from '../partnerStore';

interface ExcelData {
  [key: string]: any;
}

const CustomerGroups: React.FC = () => {
  const [data, setData] = useState<ExcelData[]>(customer_table);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [newRowData, setNewRowData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<string[]>(headers);
  const createColumns = createModalData;
  const { partnerData } = usePartnerStore.getState();
  const partnerInfo=partnerData["Customer groups"]
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
          createModalData={createColumns}
          generalFields={generalFields}
          pagination={pagination}
        />

        <CreateModal
          isOpen={isCreateModalOpen}
          onClose={handleCreateModalClose}
          onSave={handleCreateRow}
          columnNames={createColumns}
          heading='Customer Group'
          header={Object.keys(data[0])}
        />
      </div>
    </div>
  );
};

export default CustomerGroups;
