"use client"

import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { PencilIcon, TrashIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface ExcelData {
  [key: string]: any;
}

const ListView: React.FC = () => {
  const [data, setData] = useState<ExcelData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/users.xlsx');
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: ExcelData[] = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData.slice(0, 10));
    };

    fetchData();
  }, []);

  const handleDelete = (index: number) => {
    setData((prevData) => prevData.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto p-4">
      {data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-blue-100">
              <tr>
                <th className="py-2 px-4 border-b border-gray-300 text-left font-semibold">S.NO</th>
                {Object.keys(data[0]).map((key) => (
                  <th key={key} className="py-2 px-4 border-b border-gray-300 text-left font-semibold">
                    {key}
                  </th>
                ))}
                <th className="py-2 px-4 border-b border-gray-300 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b border-gray-300">{index+1}</td>
                  {Object.values(row).map((value, i) => (
                    <td key={i} className="py-2 px-4 border-b border-gray-300">
                      {value}
                    </td>
                  ))}
                  <td className="py-2 px-4 border-b border-gray-300">
                    <div className="flex space-x-2">
                      <button className="text-blue-500 hover:text-blue-700">
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(index)}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                      <button className="text-green-500 hover:text-green-700">
                        <InformationCircleIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListView;
