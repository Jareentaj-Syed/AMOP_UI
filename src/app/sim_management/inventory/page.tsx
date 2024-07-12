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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px' }}>
      <Input.Search
        placeholder={searchPlaceholder}
        className="w-full lg:w-auto"
        allowClear
        size="large"
      />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
        <div style={{ marginTop: '10px' }}>
          <AdvancedFilter />
        </div>
      </div>
    </div>
  );
};

export default sim_management;
