"use client"
import React from 'react';
import { Input, Button, Badge } from 'antd';
import { DownloadOutlined } from "@ant-design/icons";
import { SearchOutlined } from '@ant-design/icons';
import AdvancedFilter from './advanced-filter';

const sim_management: React.FC = () => {
   const EXPORT = " Export";
   const searchPlaceholder = "Search"
   return (
    <div>
       <div className="flex justify-between items-center mt-10 ml-6">
      <Input.Search
        placeholder="Search"
        className="w-full lg:w-auto"
        allowClear
        size="large"
      />
      <div className="flex space-x-5" style={{ marginRight: '20px' }}>
        <Button
          type="primary"
          className="ml-2"
          icon={<DownloadOutlined />}
          size="large"
          ghost
        >
          Columns
        </Button>
        <Button
          type="primary"
          className="ml-2"
          icon={<DownloadOutlined />}
          size="large"
          ghost
        >
          {EXPORT}
        </Button>
      </div>
    </div>
       
      <div>
       
        <div>
          <AdvancedFilter />
        </div>
      </div>
    </div>
  );
};

export default sim_management;
