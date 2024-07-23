"use client";
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { PlusIcon, ArrowDownTrayIcon, AdjustmentsHorizontalIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { Button, Popover } from 'antd';
import TableComponent from '@/app/components/TableComponent/page';
import CreateModal from '@/app/components/createPopup';
import SearchInput from '@/app/components/Search-Input';
import ColumnFilter from '@/app/components/columnfilter';
import { createModalData } from '../rate_plans_socs/rate_plan_socs_constants';

interface ExcelData {
  [key: string]: any;
}

const OptimizationGroup: React.FC = () => {
  const [data, setData] = useState<ExcelData[]>([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [newRowData, setNewRowData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const createColumns=createModalData

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/optimization_group.xlsx');
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
  const headers = visibleColumns;
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
    XLSX.writeFile(workbook, "OptimizationGroup.xlsx");
  };

  return (
    <div className="container mx-auto">
      <div className="p-4 flex items-center justify-between mt-1 mb-4">
        <div className="flex space-x-2">
        <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <ColumnFilter
                data={data}
                visibleColumns={visibleColumns}
                setVisibleColumns={setVisibleColumns}
              />
        </div>
       
        <div className="flex space-x-2">
          <button
            className="save-btn"
            onClick={handleCreateModalOpen}
          >
            <PlusIcon className="h-5 w-5 text-black-500 mr-1" />
            Create Optimization Group
          </button>
          {/* <button className="save-btn"  onClick={handleExport}>
            <ArrowDownTrayIcon className="h-5 w-5 text-black-500 mr-2" />
            <span>Export</span>
          </button> */}
          
        </div>
      </div>

      <TableComponent
        headers={headers}
        initialData={data}
        searchQuery={searchTerm}
        visibleColumns={visibleColumns}
        itemsPerPage={10}
        allowedActions={["edit","delete"]}
        popupHeading='Optimization Group'  
        infoColumns={createColumns}  
        editColumns={createColumns}            
      />

      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        onSave={handleCreateRow}
        columnNames={createModalData}
        heading='Optimization Group'
      />
    </div>
  );
};

export default OptimizationGroup;
