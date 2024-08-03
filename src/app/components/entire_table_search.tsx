import React, { useState } from 'react';
import { Input, Select, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useAuth } from './auth_context';
interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placeholder?: string;
  width?: string;
  tableName: string;
  headers: any[];
}

const TableSearch: React.FC<SearchInputProps> = ({
  searchTerm,
  setSearchTerm,
  placeholder = 'Search...',
  width = '500px',
  headers=[],
  tableName
}) => {
  const [selectedHeader, setSelectedHeader] = useState<string | undefined>(undefined);
  const { username, partner, role } = useAuth();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleHeaderChange = (value: string) => {
    setSelectedHeader(value);
  };

  const handleButtonClick = () => {
    // Implement the functionality for the button click
    console.log('Search term:', searchTerm);
    console.log('Selected header:', selectedHeader);
  };

  return (
    <div className="flex items-center space-x-2 border border-gray-300 rounded-lg p-1" style={{ width }}>
      <SearchOutlined className="text-gray-500 ml-2" />
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearch}
        className="h-8 border-none outline-none w-full"
      />
      <Select
        placeholder="Select header"
        style={{ width: 150 }} // Set the width of the dropdown
        onChange={handleHeaderChange}
        options={headers.map(header => ({ value: header, label: header }))}
      />
      <Button type="primary" onClick={handleButtonClick}>
        Search
      </Button>
    </div>
  );
};

export default TableSearch;
