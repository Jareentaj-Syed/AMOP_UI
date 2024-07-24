"use client";
import { DropdownStyles } from '@/app/components/css/dropdown';
import { ArrowDownTrayIcon } from '@heroicons/react/16/solid';
import { Button, Input, Switch } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { SingleValue } from 'react-select';
import Select from 'react-select';
import { RevenueAssuranceList } from './revenue_assurance_constants';
import * as XLSX from 'xlsx';
import TableComponent from '@/app/components/TableComponent/page';
import { PlusOutlined } from '@ant-design/icons';

type OptionType = {
  value: string;
  label: string;
};

const rev_items = RevenueAssuranceList;
const RevenueAssurance: React.FC = () => {
  const [rateplan, setRatePlan] = useState<SingleValue<OptionType>>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  const { Search } = Input;
  const editableDrp = DropdownStyles;
  const FilterOptions = [
    { value: 'All', label: 'All' },
    { value: 'Assigned', label: 'Assigned' },
    { value: 'UnAssigned', label: 'UnAssigned' },
  ];
  const handleRatePlanChange = (selectedOption: SingleValue<OptionType>) => {
    console.log('wsdf', selectedOption);
    setRatePlan(selectedOption);
  };
  const onSearch = (value: any) => {
    console.log(value);
  };

  const handleSwitchChange = (checked: any) => {
    console.log(checked);
  };

  const handleToggle = (index: number, url: string) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
      fetchData(url);
    }
  };

  const fetchData = async (url: string) => {
    try {
      const response = await fetch(url);
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

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <button className="save-btn flex items-center">
          <ArrowDownTrayIcon className="h-5 w-5 text-black-500 mr-2" />
          <span>Export</span>
        </button>
        <div className="flex items-center space-x-2">
          <Switch onChange={handleSwitchChange} className="custom-switch" />
          <span className="font-bold text-lg">Show Variance Only</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center border border-gray-300 rounded-lg p-1 w-[300px]">
          <SearchOutlined className="text-gray-500 ml-2" />
          <Input
            placeholder="Search..."
            onChange={onSearch}
            className="ml-2 h-8 border-none outline-none w-full"
          />
        </div>
        <div className="w-60">
          <Select
            styles={editableDrp}
            value={rateplan}
            placeholder="Select Filter"
            options={FilterOptions}
            onChange={handleRatePlanChange}
          />
        </div>
      </div>

      {rev_items.map((item, index) => (
        <div key={index} className="mb-5">
          <h3 className="mb-2 font-[600]">{item.title}</h3>
          <div className="mb-5 border rounded border-[#ED5565]">
            <div className="flex items-left bg-[#ED5565] text-white p-2 relative">
              <button
                onClick={() => handleToggle(index, item.url)}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-[#ED5565] text-white border-none cursor-pointer text-lg w-8 h-8 rounded-full font-[24px] font-bold hover:bg-[#E5071F]"
              >
                {activeIndex === index ? '-' : '+'}
              </button>
              <div className="flex-grow text-left ml-14">
                Total Devices ({item.total_devices}) Charged Devices ({item.charged_devices})
              </div>
            </div>
            {activeIndex === index && (
              <div className="mb-5 border rounded border-[#ED5565] mx-10 my-5">
                <div className="flex items-left bg-[#ED5565] text-white p-2 relative">
                  <div className="flex-grow text-left">
                    Service Products ({item.service_products.active} active / {item.service_products.total} total)
                  </div>
                  <div className='flex space-x-2'>
                    <Button type="default" icon={<PlusOutlined />} className="flex items-center border-[#00C1F1] text-[#00C1F1] border-3 rounded-3xl py-4 px-4 font-semi-bold hover:bg-[#00C1F1] font-[400]">
                      Add Service Line
                    </Button>
                    <Button type="default" icon={<PlusOutlined />} className="flex items-center border-[#00C1F1] text-[#00C1F1] border-3 rounded-3xl py-4 px-4 font-semi-bold hover:bg-[#00C1F1] font-[400]">
                      Add Service Product
                    </Button>
                    <Button type="default" icon={<PlusOutlined />} className="flex items-center border-[#00C1F1] text-[#00C1F1] border-3 rounded-3xl py-4 px-4 font-semi-bold hover:bg-[#00C1F1] font-[400]">
                      Disconnect Service Product
                    </Button>
                    <Button type="default" icon={<PlusOutlined/>} className="flex items-center border-[#00C1F1] text-[#00C1F1] border-3 rounded-3xl py-4 px-4  font-semi-bold hover:bg-[#00C1F1] font-[400]">
                      Assign Service
                    </Button>
                  </div>
                </div>
                <TableComponent
                  headers={visibleColumns}
                  initialData={data}
                  searchQuery={""}
                  visibleColumns={visibleColumns}
                  itemsPerPage={10}
                  popupHeading="Customer"
                  infoColumns={[]}
                  editColumns={[]}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
export default RevenueAssurance;
