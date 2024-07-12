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
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft:'20px',  marginTop:'20px' }}>
      <AdvancedFilter/>
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
  );
};

export default sim_management;
