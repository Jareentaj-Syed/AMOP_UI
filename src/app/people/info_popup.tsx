// info_popup.tsx

import React, { useEffect, useState } from 'react';
import Select from 'react-select'; // Import react-select
import { Typography, Space } from 'antd';
import { useRouter } from 'next/navigation';
import { useLogoStore } from '../stores/logoStore';
import { DropdownStyles } from '../components/css/dropdown';

const { Title } = Typography;

interface InfoModalProps {
  rate_plan: any[];
}

const InfoPopup: React.FC<InfoModalProps> = ({ rate_plan = [] }) => {
  const router = useRouter();
  const setTitle = useLogoStore((state) => state.setTitle);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    setSelectedOption(null);
  }, []);

  const navigateToSimManagement = () => {
    setTitle("Sim Management");
    router.push('/sim_management/inventory');
  };

  const onSelection = (option: any) => {
    setSelectedOption(option);
  };

  const navigateToUsers = () => {
    setTitle("Users");
    router.push('/partner/users/createUser');
  };

  // Convert rate_plan options for react-select
  const options = rate_plan.map(option => ({
    value: option,
    label: option,
  }));

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
              styles={DropdownStyles} // Apply your custom styles
              options={options}
              onChange={onSelection}
              value={selectedOption}
              placeholder="Select a rate plan"
            />
          </Space>
        </div>
      </div>

      {/* Bottom Section */}
      <button className='save-btn w-[150px]'>Add New Customer</button>
    </div>
  );
};

export default InfoPopup;
