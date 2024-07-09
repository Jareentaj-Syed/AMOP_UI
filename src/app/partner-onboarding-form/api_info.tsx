import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

interface ExcelData {
  [key: string]: any;
}

const CarrierInfo: React.FC = () => {
  const [carrierData, setCarrierData] = useState<ExcelData[]>([]);
  const [apiState, setApiState] = useState<{ [key: number]: string }>({});
  const [editMode, setEditMode] = useState(false);
  const [originalCarrierData, setOriginalCarrierData] = useState<ExcelData[]>([]);

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
      setOriginalCarrierData([...carrierData]); // Save the original data
      const initialApiState: { [key: number]: string } = {};
      carrierData.forEach((row, index) => {
        initialApiState[index] = row.API_state;
      });
      setApiState(initialApiState);
    };

    fetchData();
  }, []);

  const formatColumnName = (name: string) => {
    return name.replace(/_/g, ' ');
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    setCarrierData(carrierData);
    setEditMode(false);
  };

  const handleCancel = () => {
    // Revert to the original carrier data and API state
    setCarrierData(originalCarrierData);
    const initialApiState: { [key: number]: string } = {};
    originalCarrierData.forEach((row, index) => {
      initialApiState[index] = row.API_state;
    });
    setApiState(initialApiState);
    setEditMode(false);
  };

  const handleInputChange = (index: number, key: string, value: string) => {
    const newCarrierData = [...carrierData];
    newCarrierData[index][key] = value;
    setCarrierData(newCarrierData);
  };

  const handleAddRow = (index: number) => {
    const columnNames = Object.keys(carrierData[0] || {});
    const newRow = columnNames.reduce((acc, col) => ({ ...acc, [col]: '' }), {});
    const newCarrierData = [...carrierData];
    newCarrierData.splice(index + 1, 0, newRow);
    setCarrierData(newCarrierData);
  };

  const columnNames = Object.keys(carrierData[0] || {});

  return (
    <div className='p-4'>
      <div className="mb-6 mt-4">
        <div className="mb-4 flex justify-end">
          {editMode ? (
            <div className='flex'>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-500 ml-4 w-[80px]"
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-500 rounded ml-4 w-[80px]"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={handleEdit}
              className="px-4 py-2 rounded button"
            >
              Edit
            </button>
          )}
        </div>

        <div className="container mx-auto">
          {carrierData.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 table-fixed">
                <thead className="bg-blue-100">
                  <tr className="table-header-row border-gray-300">
                    <th className="py-2 px-4 border-b text-center font-semibold w-16 table-header">S.no</th>
                    {columnNames.map((key) => (
                      <th
                        key={key}
                        className="table-header text-center"
                      >
                        {formatColumnName(key)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {carrierData.map((row, index) => (
                    <React.Fragment key={index}>
                      <tr className="table-row relative">
                        <td className="py-2 px-4 border-b border-gray-300 text-center table-cell">{index + 1}</td>
                        {columnNames.map((key, i) => (
                          key !== 'API_state' ? (
                            <td key={i} className="py-2 px-4 border-b border-gray-300 text-center table-cell">
                              {editMode ? (
                                <input
                                  type="text"
                                  value={row[key]}
                                  onChange={(e) => handleInputChange(index, key, e.target.value)}
                                  className="w-full p-2 focus:border-blue-500 focus:ring-blue-500"
                                />
                              ) : (
                                row[key] || '-'
                              )}
                            </td>
                          ) : (
                            <td key={i} className="py-2 px-4 border-b border-gray-300 text-center table-cell">
                              <div className='flex space-x-2'>
                                <button
                                  className={`text-white px-2 py-1 rounded ${apiState[index] === 'enable' ? 'bg-blue-500' : 'bg-gray-500'}`}
                                  onClick={() => setApiState(prevState => ({ ...prevState, [index]: 'enable' }))}
                                >
                                  Enable
                                </button>
                                <button
                                  className={`text-white px-2 py-1 rounded ${apiState[index] === 'disable' ? 'bg-blue-500' : 'bg-gray-500'}`}
                                  onClick={() => setApiState(prevState => ({ ...prevState, [index]: 'disable' }))}
                                >
                                  Disable
                                </button>
                              </div>
                            </td>
                          )
                        ))}
                        {editMode && (
                          <button
                            onClick={() => handleAddRow(index)}
                            className="text-blue-500 text-xl p-1 absolute bottom-[-1rem] left-[50%] transform -translate-x-[-50%]"
                          >
                            +
                          </button>
                        )}
                      </tr>
                    </React.Fragment>
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

export default CarrierInfo;
