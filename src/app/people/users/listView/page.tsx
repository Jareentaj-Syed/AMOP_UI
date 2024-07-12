import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { PencilIcon, TrashIcon, InformationCircleIcon, PlusIcon, ArrowDownTrayIcon, MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import Pagination from '@/app/components/pagination';
import router from 'next/router';
import { useRouter } from 'next/navigation';
import { Button, Checkbox, Divider, Popover } from 'antd';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import ChartsPage from '../charts/page';
import TableComponent from '@/app/components/tableComponent';

interface ExcelData {
  [key: string]: any;
}

const ListView: React.FC = () => {
  const [data, setData] = useState<ExcelData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page
  const [filteredData, setFilteredData] = useState<ExcelData[]>([]);
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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

  const handleDelete = (index: number) => {
    setData(prevData => prevData.filter((_, i) => i !== index));
  };
  const totalPages = Math.ceil((searchTerm ? filteredData.length : data.length) / itemsPerPage);

  const handleColumnVisibilityChange = (checkedValues: string[]) => {
    setVisibleColumns(checkedValues);
  };

  const handleCheckAllChange = (e: { target: { checked: any; }; }) => {
    const allColumns = Object.keys(data.length > 0 ? data[0] : {});
    if (e.target.checked) {
      handleColumnVisibilityChange(allColumns);
    } else {
      handleColumnVisibilityChange([]);
    }
  };

  const columnContent = (
    <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '300px', overflowY: 'auto' }}>
      <Checkbox
        onChange={handleCheckAllChange}
        checked={visibleColumns.length === Object.keys(data.length > 0 ? data[0] : {}).length}
        style={{ marginBottom: '4px' }}
      >
      All
      </Checkbox>
      <Divider style={{ margin: "0.5rem 0 0.2rem" }} />
      {Object.keys(data.length > 0 ? data[0] : {}).map((column) => (
        <Checkbox
          key={column}
          value={column}
          checked={visibleColumns.includes(column)}
          onChange={(e) =>
            handleColumnVisibilityChange(
              e.target.checked
                ? [...visibleColumns, column]
                : visibleColumns.filter((col) => col !== column)
            )
          }
          style={{ marginBottom: '4px', whiteSpace: 'nowrap' }}
        >
          {column}
        </Checkbox>
      ))}
    </div>
  );

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
        <div className="flex items-center space-x-2">
          <div className="flex items-center border border-gray-300 rounded-lg p-1" style={{ width: '300px' }}>
            <SearchOutlined className="text-gray-500 ml-2" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
              className="ml-2 h-8 border-none outline-none w-full"
            />
          </div>
        </div>
        <div className="flex space-x-4">
          <button className="flex items-center justify-center p-2 rounded-lg shadow ml-4 button border border-gray-300">
            <ArrowDownTrayIcon className="h-5 w-5 text-black-500 mr-2" />
            <span>Export</span>
          </button>
          <Popover content={columnContent} trigger="click" placement="bottom">
            <button className="flex items-center p-2 rounded-lg shadow button border border-gray-300 bg-white text-black">
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-black-500 mr-2" />
              Filter
            </button>
          </Popover>
        </div>
      </div>

      {filteredData.length > 0 && (
        <div className="overflow-x-auto">
          <TableComponent
            headers={headers}
            rowData={filteredData.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )}
            actions={['edit', 'delete', 'info']}
            onDelete={(row:any) => handleDelete(data.indexOf(row))}
            searchQuery={searchTerm}
            visibleColumns={visibleColumns}
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
