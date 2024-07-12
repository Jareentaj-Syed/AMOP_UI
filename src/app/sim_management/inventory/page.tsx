"use client"
import React, { useEffect, useState } from 'react';
import { Input, Button, Badge } from 'antd';
import { DownloadOutlined } from "@ant-design/icons";
import { SearchOutlined } from '@ant-design/icons';
import AdvancedFilter from './advanced-filter';
import * as XLSX from 'xlsx';
import TableComponent from '@/app/components/TableComponent/page';
interface ExcelDataRow {
  [key: string]: any;
}

const sim_management: React.FC = () => {
  const [data, setData] = useState<ExcelDataRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/Inventory-sim-management.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Adjusting sheet_to_json options to include empty cells
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1, // Use first row as header
          blankrows: false // Include cells with blank values
        });

        if (jsonData.length === 0) {
          throw new Error('No data found in the Excel sheet.');
        }

        // Extracting column names from the first row
        const columnNames = jsonData[0];

        // Processing rows excluding the first row (header)
        const filledData = jsonData.slice(1).map(row => {
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
        // Handle error state or display a message to the user
      }
    };

    fetchData();
  }, []);

  const headers = visibleColumns;
   const EXPORT = " Export";
   const searchPlaceholder = "Search"
   return (
    <div>
       <div className="flex justify-between items-center mt-10 ml-6">
      <Input.Search
        placeholder="Search"
        className="w-full lg:w-auto"
        allowClear
        size="large"
      />
      <div className="flex space-x-5" style={{ marginRight: '20px' }}>
        <Button
          type="primary"
          className="ml-2"
          icon={<DownloadOutlined />}
          size="large"
          ghost
        >
          Columns
        </Button>
        <Button
          type="primary"
          className="ml-2"
          icon={<DownloadOutlined />}
          size="large"
          ghost
        >
          {EXPORT}
        </Button>
      </div>
    </div>
       
      <div>
       
        <div>
          <AdvancedFilter />
        </div>
      </div>
      {/* <TableComponent
          headers={headers}
          initialData={data}
          searchQuery={searchTerm}
          visibleColumns={visibleColumns} 
          itemsPerPage={10}
          allowedActions={["edit","delete","info"]}
           /> */}
    </div>
  );
};

export default sim_management;
