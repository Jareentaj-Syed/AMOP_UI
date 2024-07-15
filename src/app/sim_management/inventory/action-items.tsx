import { Dropdown, Menu, Space } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { MenuProps } from 'antd/lib/menu';

// Define types if necessary
type SIMManagementInventoryDataType = {
  // Define your record type here
};

// Function to generate menu items for SIM management actions
export const simManagementInventoryActionItem = (
    record?: SIMManagementInventoryDataType // Update type to accept undefined
  ): MenuProps["items"] => {
    const results = [];
 
    results.push({
      key: 'update-status',
      label: 'Update Status',
    });
    results.push({
      key: 'update-carrier-rate-plan',
      label: 'Update Carrier Rate Plan',
    });
    results.push({
      key: 'update-customer-rate-plan',
      label: 'Update Customer Rate Plan',
    });
  
    return results;
  };

const ActionItems= ({ record }: { record: SIMManagementInventoryDataType | undefined }) => {
  const menuItems = simManagementInventoryActionItem(record) || [];

  const handleMenuClick = (e: any) => {

    console.log('Clicked on item:', e.key);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {menuItems.map((item) => {
   
        if (!item) return null;

        if ('label' in item) {
          return <Menu.Item key={item.key}>{item.label}</Menu.Item>;
        }
        return null; 
      })}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']} placement="bottom">
      <Space>
        <MoreOutlined rotate={90} />
      </Space>
    </Dropdown>
  );
};

export default ActionItems;


