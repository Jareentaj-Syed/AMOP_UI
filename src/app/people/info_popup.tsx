// info_popup.tsx

import React, { useEffect, useState } from 'react';
import { Select, Typography, Space } from 'antd';
import { useRouter } from 'next/navigation';
import { useLogoStore } from '../stores/logoStore';

const { Title } = Typography;
const { Option } = Select;
interface InfoModalProps {
    rate_plan: any[];
  }
  
const InfoPopup: React.FC <InfoModalProps>= ({rate_plan=[]}) => {
  const router = useRouter();
  const setTitle = useLogoStore((state) => state.setTitle);
  const[selectedOption,setSelectedOption]=useState("")
  useEffect(() => {
    setSelectedOption("")

},[])

  const navigateToSimManagement = () => {
    setTitle("Sim Management");
    router.push('/sim_management/inventory');
  };
  const onSelection = (option:string) => {
    setSelectedOption(option)
  };

  const navigateToUsers = () => {
    setTitle("Users");
    router.push('/partner/users/createUser');
  };
  return (
    <div className='p-4'>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        {/* Top Left Section */}
        <div style={{ flex: 1 }}>
          <Title level={5}>Device Count: 0</Title>
          <button className='save-btn w-[150px]' onClick={navigateToSimManagement}>
            SIM Management
          </button>
        </div>

        {/* Top Right Section */}
        <div style={{ flex: 1 }}>
          <Title level={5}>Default Rate Plan</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Select
              style={{ width: '100%' }}
              dropdownStyle={buttonStyle.dropdown}
              onChange={(value) => onSelection(value)}
              value={selectedOption}
            >
              {rate_plan.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </Space>
        </div>
      </div>

      {/* Bottom Section */}
      <button className='save-btn w-[150px]'>Add New Customer</button>
    </div>
  );
};

// Define button styles
const buttonStyle = {
  dropdown: {
    border: '1px solid #d9d9d9',
    borderRadius: 4,
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default InfoPopup;
