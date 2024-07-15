import React, { useState } from 'react';
import { Modal, Divider, Select, Button, DatePicker, Checkbox } from 'antd';

const { Option } = Select;

interface UpdateStatusModalProps {
  visible: boolean;
  onCancel: () => void;
  onUpdate: (newCarrierRatePlan: string, newCommPlan: string, effectiveDate: string | null) => void;
}

const CustomerRatePlanCodeOptions = [
  "No Change",
  "PODAMOPINTRS001 500 KB - Sim Pooling Enabled",
  "POD LTE TEST 5M - Sim Pooling Enabled",
  "POD LTE TEST 500M - Sim Pooling Enabled",
  "PODAMOPRR001 0 kB - Sim Pooling Enabled",
  "HDCustomerRatePlan - Sim Pooling Disabled",
  "RS test 1 - Sim Pooling Enabled",
  "POD19 without Auto Change 1MB - Sim Pooling Disabled"
];

const commPlans = [
  "No Change",
  "DJ_Test",
  "Example M2M Customer Pool",
  "HDTEST",
  "NT-QA-472",
  "NTTestPOD19"
];
const UpdateCustomerRatePlan: React.FC<UpdateStatusModalProps> = ({ visible, onCancel, onUpdate }) => {
  const [customerRatePlan, setcustomerRatePlan] = useState<string>('');
  const [commPlan, setCommPlan] = useState<string>('');
  const [effectiveDate, setEffectiveDate] = useState<string | null>(null);
  const [isEffectiveDateChecked, setIsEffectiveDateChecked] = useState<boolean>(false);
  const [selectedRatePlan, setSelectedRatePlan] = useState('');

  const handleCustomerRatePlanChange = (value: string) => {
    setcustomerRatePlan(value);
    setSelectedRatePlan(value);
  };
  const showDataAllocationCheckbox = CustomerRatePlanCodeOptions.some(option => customerRatePlan.includes('Sim Pooling Enabled'));  const handleCommPlanChange = (value: string) => {
    setCommPlan(value);
  };

  const handleDateChange = (date: any, dateString: string | string[]) => {
    if (typeof dateString === 'string') {
      setEffectiveDate(dateString);
    }
    // Handle other cases if needed (e.g., when dateString is an array)
  };

  const handleEffectiveDateCheck = (e: any) => {
    setIsEffectiveDateChecked(e.target.checked);
    if (!e.target.checked) {
      setEffectiveDate(null);
    }
  };

  const handleUpdate = () => {
    onUpdate(customerRatePlan, commPlan, effectiveDate);
  };

  return (
    <Modal
      title={
        <div>
          <span className="font-semibold text-xl">Update Customer Rate Plan</span>
          <Divider className="border-gray-300 mt-2 mb-8" />
        </div>
      }
      visible={visible}
      centered
      onCancel={onCancel}
      footer={[
        <div className="flex justify-center space-x-2 mt-12" key="buttons">
          <Button key="cancel" onClick={onCancel} className="cancel-btn h-[30px] font-semibold text-base">
            Cancel
          </Button>
          <Button key="update" onClick={handleUpdate} className="save-btn font-semibold text-base">
            Update
          </Button>
        </div>,
      ]}
      width={600}
      style={{ height: '500px' }}
    >
      <div className="flex flex-col space-y-4">
        <div>
          <span className="font-normal text-lg">Customer Rate Plan: </span>
          <Select
            placeholder="Select a Customer Rate Plan"
            onChange={handleCustomerRatePlanChange}
            className="w-full mt-2"
          >
            {CustomerRatePlanCodeOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </div>
        <div>
          <span className="font-normal text-lg">Comm Plan:</span>
          <Select
            placeholder="Select a Comm Plan"
            onChange={handleCommPlanChange}
            className="w-full mt-2"
          >
            {commPlans.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
        <span className="text-lg">Effective Date?</span>
          <Checkbox  className="ml-7  custom-checkbox" onChange={handleEffectiveDateCheck}></Checkbox>
          {isEffectiveDateChecked && (
            <div className="mt-3">
              <span className="font-normal text-lg">Effective Date: </span>
              <DatePicker onChange={handleDateChange} className="w-full h-10 mt-2" />
            </div>
          )}
        </div>
     
        {showDataAllocationCheckbox && (
        <div style={{ marginTop: '1.5rem' }}>
          <span className="text-lg">Show Customer Data Allocation?</span>
          <Checkbox className="ml-7 custom-checkbox" />
        </div>
      )}
   
      </div>
    </Modal>
  );
};

export default UpdateCustomerRatePlan;
