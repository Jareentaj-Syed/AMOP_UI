import React from 'react';
import { Input, Button, Badge } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const sim_management: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Input
        placeholder="Search"
        prefix={<SearchOutlined />}
        style={{ width: 200 }}
      />
      <Button>Columns</Button>
      <Button>Export</Button>
      <Button type="primary">Show Advanced</Button>
      <Badge count={0} offset={[10, 0]}>
        <Button>Filter</Button>
      </Badge>
      <Button>Clear</Button>
    </div>
  );
};

export default sim_management;
