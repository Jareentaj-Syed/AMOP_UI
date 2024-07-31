"use client";
import { DropdownStyles } from '@/app/components/css/dropdown';
import { ArrowDownTrayIcon } from '@heroicons/react/16/solid';
import { Button, Input, Spin, Switch } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { SingleValue } from 'react-select';
import Select from 'react-select';
import { RevenueAssuranceList } from './revenue_assurance_constants';
import * as XLSX from 'xlsx';
import TableComponent from '@/app/components/TableComponent/page';
import MyModal from './assign_revio/assign_revio_modal';
import AssignService from './assign_revio/assign_revio_modal';
import { useLogoStore } from "@/app/stores/logoStore";

type OptionType = {
  value: string;
  label: string;
};

const rev_items = RevenueAssuranceList;
const RevenueAssurance: React.FC = () => {
  const [filterState, setFilterState] = useState<SingleValue<OptionType>>(null);
  const [openStates, setOpenStates] = useState<boolean[]>(Array(rev_items.length).fill(false));
  const [data, setData] = useState<any[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [filteredItems, setFilteredItems] = useState(rev_items);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false); // State to manage loading
  const { Search } = Input;
  const editableDrp = DropdownStyles;
  const showModal = () => setIsModalVisible(true);
  const handleOk = () => setIsModalVisible(false);
  const handleCancel = () => setIsModalVisible(false);
  const title = useLogoStore((state) => state.title);
  useEffect(() => {
    if(title!="Sim Management"){
        setLoading(true)
    }
},[title])
  const FilterOptions = [
    { value: 'All', label: 'All' },
    { value: 'Assigned', label: 'Assigned' },
    { value: 'UnAssigned', label: 'UnAssigned' },
  ];

  const handleFilterState = (selectedOption: SingleValue<OptionType>) => {
    setFilterState(selectedOption);
  };

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setSearchValue(searchValue);

    const filtered = rev_items.filter(item =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const handleSwitchChange = (checked: any) => {
    console.log(checked);
  };

  const handleToggle = (index: number, url: string) => {
    const newOpenStates = [...openStates];
    newOpenStates[index] = !newOpenStates[index];
    setOpenStates(newOpenStates);

    if (newOpenStates[index]) {
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

  useEffect(() => {
    const filterItems = () => {
      if (!filterState || filterState.value === 'All') {
        setFilteredItems(rev_items);
      } else {
        const filtered = rev_items.filter((item) =>
          filterState.value === 'UnAssigned'
            ? item.title.toLowerCase().includes('unassigned')
            : !item.title.toLowerCase().includes('unassigned')
        );
        setFilteredItems(filtered);
      }
    };

    filterItems();
  }, [filterState]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

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
            value={filterState}
            placeholder="Select Filter"
            options={FilterOptions}
            onChange={handleFilterState}
          />
        </div>
      </div>

      {filteredItems.map((item, index) => (
        <div key={index} className="mb-5">
          <h3 className="mb-2 font-semibold hover:bg-gray-200">{item.title}</h3>
          <div className="mb-5 border rounded border-[#ED5565] hover:bg-gray-100">
            <div className="flex items-left bg-[#ED5565] text-white p-2 relative">
              <button
                onClick={() => handleToggle(index, item.url)}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-[#ED5565] text-white border-none cursor-pointer text-lg w-8 h-8 rounded-full font-bold hover:bg-[#E5071F]"
              >
                {openStates[index] ? '-' : '+'}
              </button>
              <div className="flex-grow text-left ml-14">
                Total Devices ({item.total_devices}) Charged Devices ({item.charged_devices})
              </div>
            </div>
            {openStates[index] && (
              <div className="mb-5 border rounded border-[#ED5565] mx-10 my-5">
                <div className="flex items-left bg-[#ED5565] text-white p-2 relative">
                  <div className="flex-grow text-left">
                    Service Products ({item.service_products.active} active / {item.service_products.total} total)
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="default"
                      icon={<PlusOutlined />}
                      className="flex items-center border-[#00C1F1] text-[#00C1F1] border-3 rounded-3xl py-4 px-4 font-semibold hover:bg-[#00C1F1] font-normal"
                    >
                      Add Service Line
                    </Button>
                    <Button
                      type="default"
                      icon={<PlusOutlined />}
                      className="flex items-center border-[#00C1F1] text-[#00C1F1] border-3 rounded-3xl py-4 px-4 font-semibold hover:bg-[#00C1F1] font-normal"
                    >
                      Add Service Product
                    </Button>
                    <Button
                      type="default"
                      icon={<PlusOutlined />}
                      className="flex items-center border-[#00C1F1] text-[#00C1F1] border-3 rounded-3xl py-4 px-4 font-semibold hover:bg-[#00C1F1] font-normal"
                    >
                      Disconnect Service Product
                    </Button>
                    {!item.title.toLowerCase().includes('unassigned') && (
                      <Button
                        type="default"
                        onClick={showModal}
                        icon={<PlusOutlined />}
                        className="flex items-center border-[#00C1F1] text-[#00C1F1] border-3 rounded-3xl py-4 px-4 font-semibold hover:bg-[#00C1F1] font-normal"
                      >
                        Assign Service
                      </Button>
                    )}
                  </div>
                </div>
                <TableComponent
                  headers={visibleColumns}
                  initialData={data}
                  searchQuery={''}
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
       <AssignService
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      />
    </div>
    
  );
};

export default RevenueAssurance;
