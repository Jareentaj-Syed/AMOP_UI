import React, { useState } from 'react';
import { Dropdown, Menu, Space } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { MenuProps } from 'antd/lib/menu';
import UpdateStatusModal from './update-status'; // Adjust path as per your application structure
import UpdateCarrierRatePlan from './update-carrier-rate-plan';
import UpdateCustomerRatePlan from './update-customer-rate-plan';

interface ActionItemsProps {
  initialData: { [key: string]: any }[]; // Define your data type here
  currentPage: number;
  itemsPerPage: number;
  index:number
  handleActionClick: (action: string, index: number, simstatus: string) => void; // Adjust as per your handleActionClick function type
}

// Define your item type for the menu
interface ItemType {
  key: string;
  label: string;
}

// Function to generate menu items for SIM management actions
const simManagementInventoryActionItem = (
  record?: { [key: string]: any } // Update type to accept undefined
): ItemType[] => {
  const results: ItemType[] = [];

  if (record) {
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
  }

  return results;
};

const ActionItems: React.FC<ActionItemsProps> = ({ initialData, currentPage, itemsPerPage, handleActionClick , index}) => {
  const [openUpdateStatusModal, setOpenUpdateStatusModal] = useState<boolean>(false);
  const [currentStatus, setCurrentStatus] = useState<string>(''); // State to hold current status
  const [openUpdateCarrierRatePlan, setUpdateCarrierRatePlan] = useState<boolean>(false);
  const [openUpdateCustomerRatePlan, setUpdateCustomerRatePlan] = useState<boolean>(false);
  const handleMenuClick = (e: any) => {
  
    if (e.key === 'update-status') {
 
      const indexPosition =  (currentPage - 1) * itemsPerPage + index
    
      const currentStatus =initialData[indexPosition]?.SimStatus;
  
      setCurrentStatus(currentStatus); 
      setOpenUpdateStatusModal(true); 
    }
    if (e.key === 'update-carrier-rate-plan') {
 
      const indexPosition =  (currentPage - 1) * itemsPerPage + index
    
      // const currentStatus =initialData[indexPosition]?.SimStatus;
  
      // setCurrentStatus(currentStatus); 
      setUpdateCarrierRatePlan(true); 
    }
    if (e.key === 'update-customer-rate-plan') {
 
      const indexPosition =  (currentPage - 1) * itemsPerPage + index
    
      // const currentStatus =initialData[indexPosition]?.SimStatus;
  
      // setCurrentStatus(currentStatus); 
      setUpdateCustomerRatePlan(true); 
    }
 
  };

  const menuItems = simManagementInventoryActionItem(initialData[0]); 

  const menu = (
    <Menu onClick={handleMenuClick}>
      {menuItems?.map((item) => {
        if (!item) return null;

        return <Menu.Item key={item.key}>{item.label}</Menu.Item>;
      })}
    </Menu>
  );

  return (
    <>
      <Dropdown overlay={menu} trigger={['click']} placement="bottom">
        <Space>
          <MoreOutlined rotate={90} />
        </Space>
      </Dropdown>
      {/* Render UpdateStatusModal */}
      <UpdateStatusModal
        currentStatus={currentStatus}
        visible={openUpdateStatusModal}
        onCancel={() => setOpenUpdateStatusModal(false)}
        onUpdate={(newStatus: any) => {
          // Handle update logic here
          console.log('Updating status to:', newStatus);
          // Call API or update state as needed
          setOpenUpdateStatusModal(false);
        }}
      />
       <UpdateCarrierRatePlan
       
        visible={openUpdateCarrierRatePlan}
        onCancel={() => setUpdateCarrierRatePlan(false)}
        onUpdate={(newStatus: any) => {
          // Handle update logic here
          console.log('Updating status to:', newStatus);
          // Call API or update state as needed
          setUpdateCarrierRatePlan(false);
        }}
      />
       <UpdateCustomerRatePlan
       
       visible={openUpdateCustomerRatePlan}
       onCancel={() => setUpdateCustomerRatePlan(false)}
       onUpdate={(newStatus: any) => {
         // Handle update logic here
         console.log('Updating status to:', newStatus);
         // Call API or update state as needed
         setUpdateCustomerRatePlan(false);
       }}
     />
    </>
  );
};

export default ActionItems;
