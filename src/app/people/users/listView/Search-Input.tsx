// src/app/components/SearchInput.tsx

import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placeholder?: string;
  width?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchTerm,
  setSearchTerm,
  placeholder = "Search...",
  width = "300px"
}) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-lg p-1" style={{ width }}>
      <SearchOutlined className="text-gray-500 ml-2" />
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearch}
        className="ml-2 h-8 border-none outline-none w-full"
      />
    </div>
  );
};

export default SearchInput;
