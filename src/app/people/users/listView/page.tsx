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
      const response = await fetch('/users.xlsx');
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: ExcelData[] = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData);
      setFilteredData(jsonData); 
      
      // Initialize visible columns to all columns initially
      setVisibleColumns(Object.keys(jsonData.length > 0 ? jsonData[0] : {}));
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

  const renderData = () => {
    // Check if there is a search term applied
    const renderDataset = searchTerm ? filteredData : data;
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, renderDataset.length);
  
    return renderDataset.slice(startIndex, endIndex).map((row, index) => (
      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
        <td className="py-3 px-6 border-b border-gray-300">{startIndex + index + 1}</td>
        {Object.entries(row).map(([key, value], i) => (
          visibleColumns.includes(key) && (
            <td key={i} className="py-3 px-6 border-b border-gray-300">
              {key === 'Status' ? (
                <button
                  className={`font-bold px-4 rounded-3xl border-4 focus:outline-none focus:shadow-outline ${
                    value === 'Active' ? 'bg-blue-100 text-blue-500 border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}
                  style={{ width: '100%' }}
                >
                  {value}
                </button>
              ) : (
                value
              )}
            </td>
          )
        ))}
        <td className="py-3 px-6 border-b border-gray-300">
          <div className="flex space-x-2">
            <button className="text-blue-500 hover:text-blue-700">
              <PencilIcon className="w-5 h-5" />
            </button>
            <button 
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(startIndex + index)}
            >
              <TrashIcon className="w-5 h-5" />
            </button>
            <button className="text-green-500 hover:text-green-700">
              <InformationCircleIcon className="w-5 h-5" />
            </button>
          </div>
        </td>
      </tr>
    ));
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
  
  
  
  

  return (

    <div className="container mx-auto p-4">
     <div className="flex items-center justify-between">
  {/* Left side: ChartsPage */}
  <ChartsPage />

  {/* Right side: Create New User button */}
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
      className="ml-2 h-8 border-none outline-none w-full" // Adding w-full to make input full width within its container
    />
  </div>
</div>
        <div className="flex space-x-4"> {/* Added space-x-4 for horizontal spacing */}
  <button
    className="flex items-center justify-center p-2 rounded-lg shadow ml-4 button border border-gray-300"
  >
    <ArrowDownTrayIcon className="h-5 w-5 text-black-500 mr-2" />
    <span>Export</span>
  </button>
  <Popover content={columnContent} trigger="click" placement="bottom">
    <button
      className="flex items-center p-2 rounded-lg shadow button border border-gray-300 bg-white text-black"
    >
      <AdjustmentsHorizontalIcon className="h-5 w-5 text-black-500 mr-2" />
      Filter
    </button>
  </Popover>
</div>

        </div>
      
      {renderData().length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-6 border-b border-gray-300 text-left font-semibold">S.no</th>
                {Object.keys(data.length > 0 ? data[0] : {}).map((key) => (
                  visibleColumns.includes(key) && (
                    <th key={key} className="py-3 px-6 border-b border-gray-300 text-left font-semibold">
                      {key}
                    </th>
                  )
                ))}
                <th className="py-3 px-6 border-b border-gray-300 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {renderData()}
            </tbody>
          </table>
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
