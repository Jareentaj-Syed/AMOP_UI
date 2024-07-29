"use client";
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { PlusIcon, ArrowDownTrayIcon, AdjustmentsHorizontalIcon, ArrowUpTrayIcon, WrenchIcon} from '@heroicons/react/24/outline';
import { Button, Popover } from 'antd';
import TableComponent from '@/app/components/TableComponent/page';
import CreateModal from '@/app/components/createPopup';
import SearchInput from '@/app/components/Search-Input';
import ColumnFilter from '@/app/components/columnfilter';

import Select, { MultiValue, SingleValue } from 'react-select';
import { DropdownStyles } from '@/app/components/css/dropdown';
import { createModalData } from './rate_plan_socs_constants';
import UpdateCarrierRatePlan from './optimise_carrier_rate_plan';
import OptimizeCarrierRatePlan from './optimise_carrier_rate_plan';
interface ExcelData {
  [key: string]: any;
}

type OptionType = {
  value: string;
  label: string;
};
const createColumns=createModalData;
const editableDrp = DropdownStyles;
const RatePlanOptions = [
  { value: 'All Rate Plans', label: 'All Rate Plans' },
  { value: 'Active Rate Plans', label: 'Active Rate Plans' },
  { value: 'Retired Rate Plans', label: 'Retired Rate Plans' },
];
const RatePlans_SOCs: React.FC = () => {
  const [data, setData] = useState<ExcelData[]>([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [newRowData, setNewRowData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [rateplan, setRatePlan] = useState<SingleValue<OptionType>>(null);
  const [openUpdateCarrierRatePlan, setUpdateCarrierRatePlan] = useState<boolean>(false);

  const createColumns = createModalData
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/CarrierRatePlan.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          blankrows: false,
        });

        if (jsonData.length === 0) {
          throw new Error('No data found in the Excel sheet.');
        }

        const columnNames = jsonData[0];
        const filledData = jsonData.slice(1).map((row) => {
          const filledRow: any = {};
          columnNames.forEach((header: any, index: number) => {
            filledRow[header] = row[index] !== undefined ? row[index] : '';
          });
          return filledRow;
        });

        setData(filledData);
        setVisibleColumns(columnNames);
      } catch (error) {
        console.error('Error fetching data from Excel:', error);
      }
    };

    fetchData();
  }, []);
  const headers = visibleColumns;

  const handleCreateModalOpen = () => {
    setCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
    setNewRowData({});
  };

  const handleCreateRow = (newRow: any) => {
    const updatedData = [...data, newRow];
    setData(updatedData);
    handleCreateModalClose();
  };

  const handleRatePlanChange = (selectedOption: SingleValue<OptionType>) => {
    console.log('wsdf', selectedOption)
    setRatePlan(selectedOption);
  };
  const handleExport = () => {
    const exportData = [headers, ...data.map(row => headers.map(header => row[header]))];
    const worksheet = XLSX.utils.aoa_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "E911Customers");
    XLSX.writeFile(workbook, "RatePlans_SOCs.xlsx");
  };
  return (
    <div className="container mx-auto">
    <div className="p-4">
  <div className="flex items-center justify-between mb-4">
    <button className="save-btn" onClick={() => setUpdateCarrierRatePlan(true)}>
      <WrenchIcon className="h-5 w-5 text-black-500 mr-2" />
      <span>Optimize</span>
    </button>

    <div className="flex space-x-2">
      <button className="save-btn">
        <ArrowDownTrayIcon className="h-5 w-5 text-black-500 mr-2" />
        <span>Export</span>
      </button>
      <button className="save-btn" onClick={handleExport}>
        <ArrowUpTrayIcon className="h-5 w-5 text-black-500 mr-2" />
        Upload
      </button>
    </div>
  </div>

  <div className="flex items-center justify-between">
    <div className="flex space-x-2">
      <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ColumnFilter
        headers={headers}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
      />
    </div>

    <div className="w-60">
      <Select
        styles={editableDrp}
        value={rateplan}
        placeholder="Select Rate Plan"
        options={RatePlanOptions}
        onChange={handleRatePlanChange}
      />
    </div>
  </div>
</div>


      <TableComponent
        headers={headers}
        initialData={data}
        searchQuery={searchTerm}
        visibleColumns={visibleColumns}
        itemsPerPage={10}
        allowedActions={["edit"]}
        popupHeading='Carrier Rate Plan'
        infoColumns={createColumns}
        editColumns={createColumns}
      />

<OptimizeCarrierRatePlan
       
       visible={openUpdateCarrierRatePlan}
       onCancel={() => setUpdateCarrierRatePlan(false)}
       onUpdate={(newStatus: any) => {
         // Handle update logic here
         console.log('Updating status to:', newStatus);
         // Call API or update state as needed
         setUpdateCarrierRatePlan(false);
       }}
     />
    </div>
  );
};

export default RatePlans_SOCs;
