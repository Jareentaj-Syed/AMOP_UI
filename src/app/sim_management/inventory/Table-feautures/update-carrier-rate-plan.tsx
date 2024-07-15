import React, { useState, useEffect } from 'react';
import { Modal, Divider, Select, Button, DatePicker } from 'antd';

const { Option } = Select;

interface UpdateStatusModalProps {
  visible: boolean;
  onCancel: () => void;
  onUpdate: (newStatus: string, effectiveDate: string | null) => void;
}

const carrierRatePlanOptions = [
  "Altawork-0KB Plan",
  "Altawork-0KB Plan USCANMEX",
  "Altawork-100MB Plan Intl",
  "Altawork-100MB Plan USCANMEX",
  "Altawork-10GB Plan",
  "Altawork-10GB Plan USCANMEX",
  "Altawork-10GB Plan Intl",
  "Altawork-10MB Plan USCANMEX",
  "Altawork-10MB Plan Intl",
  "Altawork-1GB Plan",
  "Altaworx - 1GB Plan USCANMEX",
  "Altaworx - 1MB Plan Intl",
  "Altaworx - 1MB Plan USCANMEX",
  "Altaworx - 20GB Plan USCANMEX",
  "Altaworx - 250MB Plan"
];

const commPlans = [
  "Altaworx - ENT-LTE/SMS MO/MT - NA - 31853",
  "Altaworx - ENT-LTE/SMS MO/MT - US - 31853",
  "Altaworx-ENT LTE/SMS AT&T-INTL",
  "Altaworx-ENT LTE/SMS_AT&T-NA",
  "Altaworx-ENT LTE/SMS_AT&T-US",
  "Altaworx-ENT LTE/SMS-MT_AT&T-INTL",
  "Altaworx-ENT LTE/SMS-MT_AT&T-NA"
];

const UpdateCarrierRatePlan: React.FC<UpdateStatusModalProps> = ({ visible, onCancel, onUpdate }) => {
  const [selectedCarrierRatePlan, setSelectedCarrierRatePlan] = useState<string | undefined>(undefined);
  const [selectedCommPlan, setSelectedCommPlan] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

 
  const handleCarrierRatePlanChange = (value: string) => {
    setSelectedCarrierRatePlan(value); // Update selected carrier rate plan
  };

  const handleCommPlanChange = (value: string) => {
    setSelectedCommPlan(value); // Update selected comm plan
  };

  const handleDateChange = (date: any, dateString: string | string[]) => {
    if (typeof dateString === 'string') {
      setSelectedDate(dateString); // Update selected date
    } else {
      setSelectedDate(dateString[0]); // Handle case if dateString is an array
    }
  };

  const handleUpdate = () => {
    // onUpdate(selectedStatus, selectedDate); // Call onUpdate with selected status and date
  };

  return (
    <Modal
      title={
        <div>
          <span className="font-semibold text-xl">Update Carrier Rate Plan</span>
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
          <span className="font-normal  text-lg">Carrier Rate Plan: </span>
         
          <Select
            placeholder="Select a Carrier Rate Plan"
            onChange={handleCarrierRatePlanChange}
            className="w-full mt-2 "
          >
            {carrierRatePlanOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </div>
        <div>
        <span className=" font-normal  text-lg">Comm Plan:</span>
         
          <Select
            placeholder="Select a Comm Plan"
            onChange={handleCommPlanChange}
            className="w-full mt-2 "
          >
            {commPlans.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </div>
        <div>
         
          <span className="font-normal  text-lg">Effective Date: </span>
          <DatePicker onChange={handleDateChange} className="w-full h-10 mt-2" />
        </div>
      </div>
    </Modal>
  );
};

export default UpdateCarrierRatePlan;
