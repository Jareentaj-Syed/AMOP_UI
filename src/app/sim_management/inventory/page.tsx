"use client"
import React, { useEffect, useState } from 'react';
import { Input, Button, Badge, Spin } from 'antd';
import { DownloadOutlined } from "@ant-design/icons";
import { SearchOutlined } from '@ant-design/icons';
import AdvancedFilter from './Table-feautures/advanced-filter';
import * as XLSX from 'xlsx';
import TableComponent from '@/app/components/TableComponent/page';
import SearchInput from '@/app/components/Search-Input';
import ColumnFilter from '@/app/components/columnfilter';
import { useLogoStore } from "@/app/stores/logoStore";

interface ExcelDataRow {
  [key: string]: any;
}

const sim_management: React.FC = () => {
  const [data, setData] = useState<ExcelDataRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false); // State to manage loading
  const title = useLogoStore((state) => state.title);
  useEffect(() => {
    if(title!="Sim Management"){
        setLoading(true)
    }
},[title])

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
  const [filteredData, setFilteredData] = useState([]);

  const handleFilter = (advancedFilters: any) => {
    console.log(advancedFilters)
    setFilteredData(advancedFilters);
  };
  const handleReset = (EmptyFilters: any) => {
    console.log(EmptyFilters)
    setFilteredData(EmptyFilters);
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div>
      <div className="flex justify-end items-center mt-5 mr-6">
        <div className="flex-1 ml-3">
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        <div className="flex items-center space-x-5">
          <ColumnFilter headers={headers} visibleColumns={visibleColumns} setVisibleColumns={setVisibleColumns} />

          <button className="flex items-center p-2 save-btn">
            <DownloadOutlined className="h-5 w-5 text-black-500 mr-2" />
            {EXPORT}
          </button>
          {/* <Button
      type="primary"
      className="ml-2"
      icon={<DownloadOutlined />}
      size="large"
      ghost
    >
      {EXPORT}
    </Button> */}
        </div>
      </div>




      <div>

        <div className="">
          <AdvancedFilter onFilter={handleFilter} onReset={handleReset} />
        </div>

      </div>
      <TableComponent
        infoColumns={[]}
        editColumns={[]}
        isSelectRowVisible={false}
        headers={headers}
        initialData={data}
        searchQuery={searchTerm}
        visibleColumns={visibleColumns}
        itemsPerPage={10}
        advancedFilters={filteredData}

        allowedActions={["Actions"]} 
        popupHeading={''} />
    </div>
  );
};

export default sim_management;
