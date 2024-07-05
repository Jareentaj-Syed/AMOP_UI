"use client";
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { PencilIcon } from '@heroicons/react/24/outline';

interface ExcelData {
  // Define the structure of your Excel data here
}

const APIInfo: React.FC = () => {
  const [carrierData, setCarrierData] = useState<ExcelData[]>([]);

  useEffect(() => {
    const fetchExcelData = async (url: string) => {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      return XLSX.utils.sheet_to_json<ExcelData>(worksheet);
    };

    const fetchData = async () => {
      const carrierData = await fetchExcelData('/carrier_info.xlsx');
      setCarrierData(carrierData);
    };

    fetchData();
  }, []);

  return (
    <div className='p-6'>
      <div className="mb-6 mt-4">
        <h3 className="text-lg font-semibold mb-2 text-blue-900 bg-blue-100 pl-4 mb-4">Internal API Info</h3>
        <div className="container mx-auto">
          {carrierData.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-300 text-left font-semibold">S.NO</th>
                    {Object.keys(carrierData[0]).map((key) => (
                      <th key={key} className="py-2 px-4 border-b border-gray-300 text-left font-semibold">
                        {key}
                      </th>
                    ))}
                    <th className="py-2 px-4 border-b border-gray-300 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {carrierData.map((row, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b border-gray-300">{index + 1}</td>
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default APIInfo;
