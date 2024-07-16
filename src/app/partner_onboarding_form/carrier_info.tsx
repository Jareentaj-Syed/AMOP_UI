import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import * as XLSX from 'xlsx';
import TableComponent from '../components/TableComponent/page';
import { TrashIcon, PencilIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import SearchInput from '../components/Search-Input';

interface ExcelData {
  [key: string]: any;
}

const CarrierInfo: React.FC = () => {
  const [carrierData, setCarrierData] = useState<ExcelData[]>([]);
  const [apiState, setApiState] = useState<{ [key: number]: string }>({});
  const [originalCarrierData, setOriginalCarrierData] = useState<ExcelData[]>([]);
  const [environment, setEnvironment] = useState<{ value: string; label: string } | null>(null);
  const [editRowIndex, setEditRowIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const environmentOptions = [
    { value: 'Sandbox', label: 'Sandbox' },
    { value: 'QA', label: 'QA' },
    { value: 'UAT', label: 'UAT' },
    { value: 'Prod', label: 'Prod' }
  ];

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
      const { filledData } = await fetchExcelData('/carrier_info.xlsx');
      setCarrierData(filledData);
      setOriginalCarrierData([...filledData]);
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

  const handleOpenEditModal = (index: number) => {
    setEditRowIndex(index);
  };

  const handleSaveModal = (updatedRow: any) => {
    const updatedData = [...carrierData];
    updatedData[editRowIndex as number] = updatedRow;
    setCarrierData(updatedData);
    setEditRowIndex(null);
  };

  const columnNames = Object.keys(carrierData[0] || {});

  return (
    <div className=''>
      <div className="">
        <div className="p-4 flex items-center justify-between">
          <div>
            <label className="block text-gray-700">
              Environment
            </label>

            <Select
              value={environment}
              onChange={(selectedOption) => setEnvironment(selectedOption)}
              options={environmentOptions}
              styles={{
                control: (base: any, state: { isFocused: any; }) => ({
                  ...base,
                  minWidth: '200px',
                  marginTop: '4px',
                  height: '2.4rem',
                  borderRadius: '0.375rem',
                  borderColor: state.isFocused ? '#1640ff' : '#D1D5DB',
                  boxShadow: state.isFocused ? '0 0 0 1px #93C5FD' : 'none',
                }),
              }}
            />
          </div>
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        <div className="container mx-auto">
          {carrierData.length > 0 && (
              <TableComponent
                headers={columnNames}
                initialData={carrierData}
                searchQuery={searchTerm}
                visibleColumns={columnNames} 
                itemsPerPage={10}
                allowedActions={["edit"]}        
                popupHeading='Carrier'  
                infoColumns={[]}  
                editColumns={[]}  
                advancedFilters={[]}        
                 />
          )}
        </div>
      </div>
    </div>
  );
};

export default CarrierInfo;
