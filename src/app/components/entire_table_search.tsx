import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useAuth } from './auth_context';
import axios from 'axios';
import { DropdownStyles } from './css/dropdown';
import Select, { MultiValue } from 'react-select';

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placeholder?: string;
  width?: string;
  tableName: string;
  headerMap: Record<string, any>;
}

interface HeaderOption {
  value: string;
  label: string;
}

const TableSearch: React.FC<SearchInputProps> = ({
  searchTerm,
  setSearchTerm,
  placeholder = 'Search...',
  headerMap = {},
  tableName,
}) => {
  const headers = Object.keys(headerMap); // Get the keys of the headerMap
  const [selectedHeaders, setSelectedHeaders] = useState<HeaderOption[]>([]);
  const [colsList, setColsList] = useState<string[]>([]);
  const { username, partner, role ,settabledata} = useAuth();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleHeaderChange = (selectedOptions: MultiValue<HeaderOption>) => {
    const selectedValues = selectedOptions.map(option => option.value);
    setSelectedHeaders(selectedOptions as HeaderOption[]);
    setColsList(selectedValues); // Update colsList with selected values
  };

  const handleButtonClick = async () => {
    try {
      const url = "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/opensearch";
      const data = {
        data: {
          path: "/perform_search",
          search_word: searchTerm,
          search_all_columns:colsList.length===headers.length||colsList.length===0?"True":"False",
          index_name:tableName,
          cols:colsList
        }
      };
      const response = await axios.post(url, data);
      const parsedData=JSON.parse(response.data.body)
      console.log("parsed",parsedData)
      if(parsedData?.flag){
        const tableData=parsedData?.data?.table
        settabledata(tableData)
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }

    // Log selected header keys instead of values
    console.log('Search term:', searchTerm);
    console.log('Selected header keys:', selectedHeaders.map(option => option.value));
    console.log('Columns List:', colsList); // Log colsList
  };

  return (
    <div className="flex items-center space-x-2 w-[320px]">
      <div className="flex items-center border border-gray-300 rounded-lg p-1">
      <SearchOutlined className="text-gray-500 ml-2" />
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearch}
        className="ml-2 h-8 border-none outline-none w-full"
      />
    </div>
      <Button onClick={handleButtonClick} className=' h-8 save-btn'>
        Search
      </Button>
    </div>
  );
};

export default TableSearch;
