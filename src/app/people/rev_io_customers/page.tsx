"use client";
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { PlusIcon, ArrowDownTrayIcon, AdjustmentsHorizontalIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { Button, Popover } from 'antd';
import TableComponent from '@/app/components/TableComponent/page';
import CreateModal from '@/app/components/createPopup';
import SearchInput from '@/app/components/Search-Input';
import ColumnFilter from '@/app/components/columnfilter';

interface ExcelData {
  [key: string]: any;
}

const RevIOCustomers: React.FC = () => {
  const [data, setData] = useState<ExcelData[]>([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [newRowData, setNewRowData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/rev_io_customers.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          blankrows: false,
        });

        if (jsonData.length === 0) {
          throw new Error('No data found in the Excel sheet.');
        }

        const columnNames = jsonData[0];
        const filledData = jsonData.slice(1).map((row) => {
          const filledRow: any = {};
          columnNames.forEach((header: any, index: number) => {
            filledRow[header] = row[index] || '';
          });
          return filledRow;
        });

        setData(filledData);
        setVisibleColumns(columnNames);
      } catch (error) {
        console.error('Error fetching data from Excel:', error);
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
    const updatedData = [...data, newRow];
    setData(updatedData);
    handleCreateModalClose();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mt-1 mb-8">
        <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex space-x-2">
          <button
            className="flex items-center p-2 rounded-lg shadow ml-1 button border border-gray-300"
            onClick={handleCreateModalOpen}
          >
            <PlusIcon className="h-5 w-5 text-black-500 mr-1" />
            Add Customer
          </button>
          <button className="flex items-center justify-center p-2 rounded-lg shadow ml-1 button border border-gray-300">
            <ArrowDownTrayIcon className="h-5 w-5 text-black-500 mr-2" />
            <span>Export</span>
          </button>
          <Popover
            content={
              <ColumnFilter
                data={data}
                visibleColumns={visibleColumns}
                setVisibleColumns={setVisibleColumns}
              />
            }
            trigger="click"
            placement="bottom"
          >
            <button className="flex items-center justify-center p-2 rounded-lg shadow ml-1 button border border-gray-300">
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-black-500 mr-2" />
              Filter
            </button>
          </Popover>
          <button className="flex items-center justify-center p-2 rounded-lg shadow ml-1 button border border-gray-300">
            <ArrowUpTrayIcon className="h-5 w-5 text-black-500 mr-2" />
            Upload
          </button>
        </div>
      </div>

      <TableComponent
        headers={Object.keys(data.length > 0 ? data[0] : {})}
        initialData={data}
        searchQuery={searchTerm}
        visibleColumns={visibleColumns}
        itemsPerPage={10}
        allowedActions={["edit", "info"]}
      />

      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        onSave={handleCreateRow}
        columnNames={Object.keys(data.length > 0 ? data[0] : {})}
      />
    </div>
  );
};

export default RevIOCustomers;
