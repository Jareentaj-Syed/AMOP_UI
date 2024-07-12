import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { PlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Pagination from '@/app/components/pagination';
import { useRouter } from 'next/navigation';
import ChartsPage from '../charts/page';
import TableComponent from '@/app/components/tableComponent';
import ColumnFilter from './columnfilter';
import SearchInput from './Search-Input';

interface ExcelDataRow {
  [key: string]: any;
}

const ListView: React.FC = () => {
  const [data, setData] = useState<ExcelDataRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page
  const [filteredData, setFilteredData] = useState<ExcelDataRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

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
        setFilteredData(filledData);
        setVisibleColumns(columnNames);
      } catch (error) {
        console.error('Error fetching data from Excel:', error);
        // Handle error state or display a message to the user
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter data whenever searchTerm changes
    filterData(searchTerm);
  }, [searchTerm]);

  const filterData = (searchTerm: string) => {
    const filtered = data.filter(item =>
      Object.values(item).some(value =>
        typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset pagination to first page when search changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const router = useRouter();
  const handleCreateClick = () => {
    router.push('users/createUser');
  };

  const handleDelete = (rowIndex: number) => {
    if (rowIndex >= 0 && rowIndex < filteredData.length) {
      const updatedData = [...filteredData];
      updatedData.splice((currentPage - 1) * itemsPerPage + rowIndex, 1);
      setFilteredData(updatedData);
    }
  };

  const totalPages = Math.ceil((searchTerm ? filteredData.length : data.length) / itemsPerPage);

  const headers = visibleColumns;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between">
        <ChartsPage />
        <button
          className="flex items-center p-2 rounded-lg shadow ml-2 button border border-gray-300"
          onClick={handleCreateClick}
        >
          <PlusIcon className="h-5 w-5 text-black-500 mr-1" />
          Create New User
        </button>
      </div>

      <div className="flex items-center justify-between mt-6 mb-4">
        <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex space-x-4">
          <button className="flex items-center justify-center p-2 rounded-lg shadow ml-4 button border border-gray-300">
            <ArrowDownTrayIcon className="h-5 w-5 text-black-500 mr-2" />
            <span>Export</span>
          </button>
          <ColumnFilter data={data} visibleColumns={visibleColumns} setVisibleColumns={setVisibleColumns} />
        </div>
      </div>

      {filteredData.length > 0 && (
        <div className="overflow-x-auto">
          <TableComponent
            headers={headers}
            initialData={filteredData.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )}
          />
          <div className="mb-4"></div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ListView;
