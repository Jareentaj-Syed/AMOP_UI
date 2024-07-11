"use client";
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { PencilIcon, InformationCircleIcon, PlusIcon, ArrowDownTrayIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import Pagination from '@/app/components/pagination';
import router from 'next/router';
import { Button, Checkbox, Divider, Popover, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import EditModal from '@/app/components/editPopup';
import CreateModal from '@/app/components/createPopup';

interface ExcelData {
  [key: string]: any;
}

const ListView: React.FC = () => {
  const [data, setData] = useState<ExcelData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filteredData, setFilteredData] = useState<ExcelData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRowData, setCurrentRowData] = useState<ExcelData | null>(null);
  const [currentRowIndex, setCurrentRowIndex] = useState<number | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false); // State for create modal
  const [newRowData, setNewRowData] = useState<any>({});
  const [isEditable, setIsEditable] = useState(false);


  const columnNames = Object.keys(data[0] || {});
  const editCloumnNames:string[]=[]
  const createCloumnNames=[...columnNames,"Description","Address Line 1","Address Line 2","Apt or Suite","City","State","Zip Code","Bill Period End Day(1-28)","Bill Period End Hour(0-23)"]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/bandwidth_customers.xlsx');
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
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreateModalOpen = () => {
    setCreateModalOpen(true);
  };

  // Function to close create modal
  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
    setNewRowData({}); // Reset new row data when modal is closed
  };

  // Function to save new row data from create modal
  const handleCreateRow = (newRow: any) => {
    const updatedData = [...data, newRow]; // Add new row to existing data
    setData(updatedData);
    setFilteredData(updatedData); // Update filtered data
    handleCreateModalClose(); // Close create modal
  };

  const handleEditClick = (row: ExcelData, index: number) => {
    setCurrentRowData(row);
    setCurrentRowIndex(index);
    setIsEditModalOpen(true);
    setIsEditable(true)
  };

  const handleInfoClick = (row: ExcelData, index: number) => {
    setCurrentRowData(row);
    setCurrentRowIndex(index);
    setIsEditModalOpen(true);
    setIsEditable(false)
  };

  const handleSave = (updatedRow: ExcelData) => {
    if (currentRowIndex !== null) {
      const updatedData = [...data];
      const updatedFilteredData = [...filteredData];
      updatedData[currentRowIndex] = updatedRow;
      const filteredIndex = filteredData.findIndex(item => item === currentRowData);
      if (filteredIndex !== -1) {
        updatedFilteredData[filteredIndex] = updatedRow;
      }
      setData(updatedData);
      setFilteredData(updatedFilteredData);
    }
    setIsEditModalOpen(false);
  };

  const renderData = () => {
    const renderDataset = searchTerm ? filteredData : data;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, renderDataset.length);

    return renderDataset.slice(startIndex, endIndex).map((row, index) => (
      <tr key={startIndex + index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
        <td className="py-3 px-6 border-b border-gray-300 table-cell">{startIndex + index + 1}</td>
        {columnNames.map((key, i) => (
          visibleColumns.includes(key) && (
            <td key={i} className="py-3 px-6 border-b border-gray-300 table-cell">
              {key === 'Status' ? (
                <button
                  className={`font-bold px-4 rounded-3xl border-4 focus:outline-none focus:shadow-outline ${row[key] === 'Active' ? 'bg-blue-100 text-blue-500 border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}
                  style={{ width: '100%' }}
                >
                  {row[key] || '-'}
                </button>
              ) : (
                row[key] || '-'
              )}
            </td>
          )
        ))}
        <td className="py-3 px-6 border-b border-gray-300 table-cell">
          <div className="flex space-x-2">
            {/* <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditClick(row, startIndex + index)}>
              <PencilIcon className="w-5 h-5" />
            </button> */}
            <button className="text-green-500 hover:text-green-700" onClick={() => handleInfoClick(row, startIndex + index)}>
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
      <div className="flex items-center justify-between mt-1 mb-8">
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
          <button
            className="flex items-center p-2 rounded-lg shadow ml-2 button border border-gray-300"
            onClick={handleCreateModalOpen}
          >
            <PlusIcon className="h-5 w-5 text-black-500 mr-1" />
            Add Customer
          </button>
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
          <table className="min-w-full bg-white border border-gray-200 rounded-lg listview-table">
            <thead className="bg-[#E5E7EB]">
              <tr>
                <th className="py-3 border-b border-gray-300 font-semibold table-header">S.no</th>
                {columnNames.map((key) => (
                  visibleColumns.includes(key) && (
                    <th key={key} className="py-3 border-b border-gray-300 font-semibold table-header">
                      {key}
                    </th>
                  )
                ))}
                <th className="py-3 border-b border-gray-300 font-semibold table-header">Actions</th>
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

      <EditModal
        isEditable={isEditable}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        rowData={currentRowData}
        columnNames={isEditable?editCloumnNames:createCloumnNames}
      />
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        onSave={handleCreateRow}
        columnNames={createCloumnNames}
      />
    </div>
  );
};

export default ListView;
