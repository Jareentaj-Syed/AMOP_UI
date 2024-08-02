"use client";
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import TableComponent from '@/app/components/TableComponent/page';
import SearchInput from '@/app/components/Search-Input';
import ColumnFilter from '@/app/components/columnfilter';

interface ExcelData {
  [key: string]: any;
}

const IMEIMasterTable: React.FC = () => {
  const [data, setData] = useState<ExcelData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/imei_master_table.xlsx');
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
            filledRow[header] = row[index] !== undefined ? row[index] : '';
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

  return (
    <div className="container mx-auto">
      <div className="p-4 flex items-center justify-between mt-1 mb-4">
        <div className="flex space-x-2">
        <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <ColumnFilter
                headers={headers}
                visibleColumns={visibleColumns}
                setVisibleColumns={setVisibleColumns}
              />
        </div>
        
        <div className="flex space-x-2">
          <button className="save-btn">
            <ArrowUpTrayIcon className="h-5 w-5 text-black-500 mr-2" />
            Upload
          </button>
        </div>
      </div>

      <TableComponent
        headers={headers}
        initialData={data}
        searchQuery={searchTerm}
        visibleColumns={visibleColumns}
        itemsPerPage={100}
        popupHeading='Customer'    
        pagination={{}}

      />
    </div>
  );
};

export default IMEIMasterTable;
