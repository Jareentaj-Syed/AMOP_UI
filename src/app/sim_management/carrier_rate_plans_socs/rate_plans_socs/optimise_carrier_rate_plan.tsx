import React, { useState } from 'react';
import { Modal, Divider, Button, DatePicker } from 'antd';
import Select, { SingleValue } from 'react-select';
import { DropdownStyles } from '@/app/components/css/dropdown';

type OptionType = {
  value: string;
  label: string;
};

interface UpdateStatusModalProps {
  visible: boolean;
  onCancel: () => void;
  onUpdate: (newStatus: string, effectiveDate: string | null) => void;
}

const OptimizationTypeOption = [
  "Customer",
  "Carrier"
];

const OptimizationTypeOptions = OptimizationTypeOption.map(option => ({
  value: option,
  label: option
}));

const ServiceProvider = [
  "All Service Providers",
  "AT&T - Telegence - UAT ONLY",
  "AT&T - Telegence - SANDBOX",
];

const ServiceProviders = ServiceProvider.map(provider => ({
  value: provider,
  label: provider
}));

const editableDrp = DropdownStyles;

const OptimizeCarrierRatePlan: React.FC<UpdateStatusModalProps> = ({ visible, onCancel, onUpdate }) => {
  const [selectedCarrierRatePlan, setSelectedCarrierRatePlan] = useState<SingleValue<OptionType>>(null);
  const [selectedCommPlan, setSelectedCommPlan] = useState<SingleValue<OptionType>>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleCarrierRatePlanChange = (selectedOption: SingleValue<OptionType>) => {
    setSelectedCarrierRatePlan(selectedOption);
  };

  const handleCommPlanChange = (selectedOption: SingleValue<OptionType>) => {
    setSelectedCommPlan(selectedOption);
  };

  const handleDateChange = (date: any, dateString: string | string[]) => {
    if (typeof dateString === 'string') {
      setSelectedDate(dateString);
    } else {
      setSelectedDate(dateString[0]);
    }
  };

  const handleUpdate = () => {
    if (selectedCarrierRatePlan && selectedCommPlan && selectedDate) {
      onUpdate(selectedCarrierRatePlan.value, selectedDate);
    }
  };

  return (
    <Modal
      title={
        <div>
          <span className="font-semibold text-xl">Start Optimization</span>
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
            Next
          </Button>
        </div>,
      ]}
      width={600}
      style={{ height: '500px' }}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <span className="font-normal text-lg" style={{ minWidth: '150px' }}>Optimization Type:</span>
          <Select
            styles={editableDrp}
            value={selectedCarrierRatePlan}
            placeholder="Select Optimization Type"
            options={OptimizationTypeOptions}
            onChange={handleCarrierRatePlanChange}
            className="flex-grow"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-normal text-lg" style={{ minWidth: '150px' }}>Service Provider:</span>
          <Select
            styles={editableDrp}
            value={selectedCommPlan}
            placeholder="Select Service Provider"
            options={ServiceProviders}
            onChange={handleCommPlanChange}
            className="flex-grow"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-normal text-lg" style={{ minWidth: '150px' }}>Bill Period End Date:</span>
          <DatePicker onChange={handleDateChange} className="flex-grow h-10 mt-2" />
        </div>
      </div>
    </Modal>
  );
};

export default OptimizeCarrierRatePlan;
