import Select from 'react-select';
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

  const environmentOptions = [
    { value: 'Sandbox', label: 'Sandbox' },
    { value: 'QA', label: 'QA' },
    { value: 'UAT', label: 'UAT' },
    { value: 'Prod', label: 'Prod' }
  ];

  const [environment, setEnvironment] = useState<{ value: string; label: string } | null>(null);
  const [activeElement, setActiveElement] = useState<string | null>(null);

  const handleFocus = (element: string) => {
    setActiveElement(element);
  };

  const handleBlur = () => {
    setActiveElement(null);
  };

  const handleChange = (selectedOption: { value: string; label: string } | null) => {
    setEnvironment(selectedOption);
  };

  useEffect(() => {
    const fetchExcelData = async (url: string) => {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          blankrows: false
        });

        if (jsonData.length === 0) {
          throw new Error('No data found in the Excel sheet.');
        }

        const columnNames = jsonData[0];

        const filledData = jsonData.slice(1).map(row => {
          const filledRow: any = {};
          columnNames.forEach((header: any, index: number) => {
            filledRow[header] = row[index] || '';
          });
          return filledRow;
        });

        return {
          filledData,
          columnNames
        };
      } catch (error) {
        console.error('Error fetching data from Excel:', error);
        throw error;
      }
    };

    const fetchData = async () => {
      const { filledData } = await fetchExcelData('/api_info.xlsx');
      setCarrierData(filledData);
      setOriginalCarrierData([...filledData]); // Save the original data
      const initialApiState: { [key: number]: string } = {};
      filledData.forEach((row, index) => {
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
    <div className='p-1'>
      <div className="mb-6 mt-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <label className="block text-gray-700">
              Environment
            </label>
            <Select
              onFocus={() => handleFocus('environment')}
              onBlur={handleBlur}
              value={environment}
              onChange={handleChange}
              options={environmentOptions}
              styles={{
                control: (base: any, state: { isFocused: any; }) => ({
                  ...base,
                  minWidth: '200px',
                  marginTop: '5px',
                  height: '2.4rem',
                  borderRadius: '0.375rem',
                  borderColor: state.isFocused ? '#1640ff' : '#D1D5DB',
                  boxShadow: state.isFocused ? '0 0 0 1px #93C5FD' : 'none',
                }),
              }}
            />
          </div>
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
              <table className="min-w-full border border-gray-200 table-fixed bg-white">
                <thead className="bg-blue-100">
                  <tr className="table-header-row border-gray-300">
                    <th className="py-3 px-6 border-b border-gray-300 text-left font-semibold table-header">S.no</th>
                    {columnNames.map((key) => (
                      <th
                        key={key}
                        className="py-3 px-6 border-b border-gray-300 text-left font-semibold table-header"
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
                                  className="w-full p-2 focus:outline-none"
                                />
                              ) : (
                                row[key] || '-'
                              )}
                            </td>
                          ) : (
                            <td key={i} className="py-2 px-4 border-b border-gray-300 text-center table-cell">
                              <div className='flex space-x-2 mr-4' >
                                <button
                                  className={`font-bold px-4 rounded-3xl border-4 focus:outline-none focus:shadow-outline ${apiState[index] === 'enable' ? 'bg-blue-100 text-blue-500 border-blue-300' : 'bg-gray-100 text-gray-500 border-gray-200'
                                    }`}
                                  style={{ width: '100%' }}
                                  onClick={() => setApiState(prevState => ({ ...prevState, [index]: 'enable' }))}
                                >
                                  Enable
                                </button>
                                <button
                                  className={`font-bold px-4 rounded-3xl border-4 focus:outline-none focus:shadow-outline ${apiState[index] === 'disable' ? 'bg-blue-100 text-blue-500 border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'
                                    }`}
                                  style={{ width: '100%' }}
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
