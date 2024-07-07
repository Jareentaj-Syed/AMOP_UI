import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { PencilIcon } from '@heroicons/react/24/outline';
import EditModal from '../components/editPopup';
import CreateModal from '../components/createPopup';
import { title } from 'process';

interface ExcelData {
  [key: string]: any;
}

const CarrierInfo: React.FC = () => {
  const [carrierData, setCarrierData] = useState<ExcelData[]>([]);
  const [apiState, setApiState] = useState<{ [key: number]: string }>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<ExcelData | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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
      const initialApiState: { [key: number]: string } = {};
      carrierData.forEach((row, index) => {
        initialApiState[index] = row.api_state;
      });
      setApiState(initialApiState);
    };

    fetchData();
  }, []);

  const formatColumnName = (name: string) => {
    return name
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleApiStateChange = (index: number, newState: string) => {
    setApiState((prevState) => ({
      ...prevState,
      [index]: newState,
    }));
  };

  const handleEdit = (index: number, row: ExcelData) => {
    setEditingIndex(index);
    setEditingRow(row);
    setModalOpen(true);
  };

  const handleSave = (updatedRow: any) => {
    setCarrierData((prevData) =>
      prevData.map((row, index) =>
        index === editingIndex ? updatedRow : row
      )
    );
    setEditingRow(null);
    setEditingIndex(null);
  };

  const handleCreate = (newRow: any) => {
    setCarrierData((prevData) => [...prevData, newRow]);
    setCreateModalOpen(false);
  };

  const columnNames = Object.keys(carrierData[0] || {});

  return (
    <div className='p-4'>
      <div className="mb-6 mt-4">        
        <div className="mb-4">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 rounded button"
          >
            Add New Carrier
          </button>
        </div>

        <div className="container mx-auto">
          {carrierData.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 table-fixed">
                <thead className="bg-blue-100">
                  <tr className="table-header-row">
                    <th className="py-2 px-4 border-b border-gray-300 text-center font-semibold w-16 table-header">S.NO</th>
                    {columnNames.map((key) => (
                      <th
                        key={key}
                        className="table-header text-center"
                      >
                        {formatColumnName(key)}
                      </th>
                    ))}
                    <th className="py-2 px-4 border-b border-gray-300 text-center font-semibold table-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {carrierData.map((row, index) => (
                    <tr key={index} className="table-row">
                      <td className="py-2 px-4 border-b border-gray-300 text-center table-cell">{index + 1}</td>
                      {columnNames.map((key, i) => (
                        key !== 'api_state' ? (
                          <td key={i} title={row[key]} className="py-2 px-4 border-b border-gray-300 text-center table-cell">
                            {row[key] || '-'} 
                          </td>
                        ) : (
                          <td key={i} className="py-2 px-4 border-b border-gray-300 text-center table-cell">
                            <div className='flex space-x-2'>
                              <button
                                className={`${apiState[index] === 'enable' ? 'bg-blue-500' : 'bg-gray-500'
                                  } text-white px-2 py-1 rounded`}
                                onClick={() => handleApiStateChange(index, 'enable')}
                              >
                                Enable
                              </button>
                              <button
                                className={`${apiState[index] === 'disable' ? 'bg-blue-500' : 'bg-gray-500'
                                  } text-white px-2 py-1 rounded`}
                                onClick={() => handleApiStateChange(index, 'disable')}
                              >
                                Disable
                              </button>
                            </div>
                          </td>
                        )
                      ))}
                      <td className="py-2 px-4 border-b border-gray-300 text-center">
                        <div className="flex space-x-2">
                          <button onClick={() => handleEdit(index, row)} className="text-blue-500 hover:text-blue-700">
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
      {editingRow && (
        <EditModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          rowData={editingRow}
          columnNames={columnNames} 
        />
      )}
      {createModalOpen && (
        <CreateModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSave={handleCreate}
          columnNames={columnNames} 
        />
      )}
    </div>
  );
};

export default CarrierInfo;
