import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { PlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import ChartsPage from '../charts/page';
import TableComponent from '@/app/components/TableComponent/page';
import ColumnFilter from '../../../components/columnfilter';
import SearchInput from '../../../components/Search-Input';
import { useRouter } from 'next/navigation';

interface ExcelDataRow {
  [key: string]: any;
}

const ListView: React.FC = () => {
  const [data, setData] = useState<ExcelDataRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const router = useRouter();
  const handleCreateClick = () => {
    router.push('users/createUser');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/users.xlsx');
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between">
        <ChartsPage />
        <button
          className="save-btn"
          onClick={handleCreateClick} // Placeholder for create button action
        >
          <PlusIcon className="h-5 w-5 text-black-500 mr-1" />
          Create New User
        </button>
      </div>

      <div className="flex items-center justify-between mt-6 mb-4">
        <div className="flex space-x-4">
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <ColumnFilter data={data} visibleColumns={visibleColumns} setVisibleColumns={setVisibleColumns} />
        </div>

        <div className="flex space-x-4">
          <button className="save-btn">
            <ArrowDownTrayIcon className="h-5 w-5 text-black-500 mr-2" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="">
        <TableComponent
          headers={headers}
          initialData={data}
          searchQuery={searchTerm}
          visibleColumns={visibleColumns}
          itemsPerPage={10}
          allowedActions={["edit", "delete", "info"]}
          popupHeading='User'    
          infoColumns={[]}  
          editColumns={[]}          

        />
      </div>
    </div>
  );
};

export default ListView;
