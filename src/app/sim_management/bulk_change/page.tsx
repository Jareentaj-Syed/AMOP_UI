"use client"
import React, { useEffect, useState } from 'react';
import { Input, Button, Modal, Steps } from 'antd';
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import * as XLSX from 'xlsx';
import TableComponent from '@/app/components/TableComponent/page';
import SearchInput from '@/app/components/Search-Input';
// import AdvancedFilter from './Table-feautures/advanced-filter';
import ColumnFilter from '@/app/components/columnfilter';
import AdvancedFilter from '../inventory/Table-feautures/advanced-filter';
import { PlusIcon } from '@heroicons/react/16/solid';

import { useBulkChangeModalStore } from './bulk-changes-store/bulk-change-modal.store';
import { BulkChangeModal } from './bulk-changes/bulk-change-modal';
interface ExcelDataRow {
    [key: string]: any;
}

const BulkChange: React.FC = () => {
    const [data, setData] = useState<ExcelDataRow[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
    const { setVisible: setBulkChangeModalVisible } = useBulkChangeModalStore();


    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('/Bulk-change-sim-management.xlsx');
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

      const [visible, setVisible] = useState(false);

      const handleOpen = () => {
        setVisible(true);
      };
    
      const handleClose = () => {
        setVisible(false);
      };
    
      // const steps = BulkChangeSteps.get(requestType) || [];
   
    return (
        <div className="p-5">
              <button
                className="save-btn"
                onClick={() => setBulkChangeModalVisible(true)}
             
              >
                <PlusIcon className="h-5 w-5 text-black-500 mr-1" />
                New Change
              </button>
              <BulkChangeModal />
        <div className="flex justify-between items-center mt-5">
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <ColumnFilter data={data} visibleColumns={visibleColumns} setVisibleColumns={setVisibleColumns} />
        </div>
       <div className='mt-6'>
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

          popupHeading={''} 
        />
       </div>
     
      </div>
      
    );
};

export default BulkChange;
