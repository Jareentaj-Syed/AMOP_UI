import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { PencilIcon, TrashIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import Pagination from '@/app/components/pagination';

interface ExcelData {
  [key: string]: any;
}

const ListView: React.FC = () => {
  const [data, setData] = useState<ExcelData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page
  const totalPages = Math.ceil(data.length / itemsPerPage);

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
    };

    fetchData();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex).map((row, index) => (
      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
        <td className="py-3 px-6 border-b border-gray-300">{startIndex + index + 1}</td>
        {Object.entries(row).map(([key, value], i) => (
          <td key={i} className="py-3 px-6 border-b border-gray-300">
            {key === 'Status' ? (
              <span className={value === 'Active' ? 'text-blue-500 font-semibold' : 'text-red-300 font-semibold'}>
                {value}
              </span>
            ) : (
              value
            )}
          </td>
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

  const handleDelete = (index: number) => {
    setData((prevData) => prevData.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto p-4">
      {data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-blue-100">
              <tr>
                <th className="py-3 px-6 border-b border-gray-300 text-left font-semibold">S.no</th>
                {Object.keys(data[0]).map((key) => (
                  <th key={key} className="py-3 px-6 border-b border-gray-300 text-left font-semibold">
                    {key}
                  </th>
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
