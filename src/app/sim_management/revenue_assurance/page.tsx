"use client";
import { DropdownStyles } from '@/app/components/css/dropdown';
import { ArrowDownTrayIcon } from '@heroicons/react/16/solid';
import { Input, Switch } from 'antd';

import { SearchOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { SingleValue } from 'react-select';
import Select from 'react-select';

type OptionType = {
  value: string;
  label: string;
};
const RevenueAssurance: React.FC = () => {
  const [rateplan, setRatePlan] = useState<SingleValue<OptionType>>(null);

  const { Search } = Input;
  const editableDrp = DropdownStyles;
  const FilterOptions = [
    { value: 'All', label: 'All' },
    { value: 'Assigned', label: 'Assigned' },
    { value: 'UnAssigned', label: 'UnAssigned' },
  ];
  const handleRatePlanChange = (selectedOption: SingleValue<OptionType>) => {
    console.log('wsdf', selectedOption)
    setRatePlan(selectedOption);
  };
  const onSearch = (value:any) => {
    console.log(value);
  };

  const handleSwitchChange = (checked:any) => {
    console.log(checked);
  };
  return (
    <div className="p-4 space-y-4">
    <div className="flex items-center justify-between">
      <button className="save-btn flex items-center">
        <ArrowDownTrayIcon className="h-5 w-5 text-black-500 mr-2" />
        <span>Export</span>
      </button>
      <div className="flex items-center space-x-2">
        <Switch  onChange={handleSwitchChange} className="custom-switch" />
        <span className="font-bold text-lg">Show Variance Only</span>
      </div>
    </div>
  
    <div className="flex items-center justify-between">
    <div  className="flex items-center border border-gray-300 rounded-lg p-1" style={{ width:300 }}>
      <SearchOutlined className="text-gray-500 ml-2" />
      <Input
        placeholder="Search..."
        onChange={onSearch }
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
  </div>
  
  
  );
}
export default RevenueAssurance;