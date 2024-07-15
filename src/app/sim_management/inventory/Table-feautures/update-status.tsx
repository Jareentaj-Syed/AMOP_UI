import React, { useState, useEffect } from 'react';
import { Modal, Divider, Select, Button, Input } from 'antd';

const { Option } = Select;

interface UpdateStatusModalProps {
  currentStatus: string;
  visible: boolean;
  onCancel: () => void;
  onUpdate: (newStatus: string) => void;
}

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({ currentStatus, visible, onCancel, onUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus); // State to hold selected status

  // Reset selectedStatus when currentStatus changes
  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  const handleChange = (value: string) => {
    setSelectedStatus(value); // Update selected status when dropdown value changes
  };

  const handleUpdate = () => {
    onUpdate(selectedStatus); // Call onUpdate with selected status
  };

  const handleCancel = () => {
    onCancel(); // Call onCancel function passed from parent
  };

  return (
    <Modal
      title={<div>
      <span className="font-semibold  text-xl">Update Status</span>
      <hr className="border-gray-300 mt-2 mb-8" />
    </div>}
      visible={visible}
      centered
      onCancel={handleCancel}
      footer={[
        // <hr className="border-gray-300 mb-4 mt-12" />
        <div className="flex justify-center space-x-2 mt-12" key="buttons">
          <Button key="cancel" onClick={onCancel} className="cancel-btn h-[30px] font-semibold  text-base">
            Cancel
          </Button>
          <Button key="update" onClick={handleUpdate} className="save-btn font-semibold  text-base">
            Update
          </Button>
        </div>,
      ]}
      width={600}
      style={{ height: '500px'}}
      >

<div className="flex flex-col space-y-4">
        <div>
          <span className="text-lg">Current Status:</span>
          <Input className="mt-1 h-10 " value={currentStatus} readOnly />
        </div>
       
        <div>
          <span className="text-lg">New Status:</span>
          <Select value={selectedStatus} style={{ width: '100%', marginTop: '8px' }} onChange={handleChange}>
            <Option value="activated">Activated</Option>
            <Option value="activation ready">Activation Ready</Option>
            <Option value="deactivated">Deactivated</Option>
            <Option value="retired">Retired</Option>
          </Select>
        </div>
      </div>
     
     
  
      
    </Modal>
  );
};

export default UpdateStatusModal;
