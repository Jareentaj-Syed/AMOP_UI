import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import Select from 'react-select';

// Options for React Select
const customerOptions = [
  { value: 'customer1', label: 'Customer 1' },
  { value: 'customer2', label: 'Customer 2' },
  // Add more options as needed
];

const productOptions = [
  { value: 'product1', label: 'Product 1' },
  { value: 'product2', label: 'Product 2' },
  // Add more options as needed
];

const packageOptions = [
  { value: 'package1', label: 'Package 1' },
  { value: 'package2', label: 'Package 2' },
  // Add more options as needed
];

// Define types for the options
interface OptionType {
  value: string;
  label: string;
}

// Define the props interface for MyModal
interface MyModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
}

const AssignService: React.FC<MyModalProps> = ({ visible, onCancel, onOk }) => {
  return (
    <Modal
      title="Rev.IO Details"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={onOk}>
          OK
        </Button>,
      ]}
    >


      <Form layout="vertical">

             
<Form.Item label="Rev.IO Customer">
          <Input placeholder="Enter Service" />
        </Form.Item>
        <Form.Item label=" Rev.IO Service*">
          <Select<OptionType>
            options={customerOptions}
            placeholder="Select Customer"
            isClearable
          />
        </Form.Item>

        

        <Form.Item label="Rev.IO Product*">
          <Select<OptionType>
            options={productOptions}
            placeholder="Select Product"
            isClearable
          />
        </Form.Item>

        <Form.Item label="Rev.IO Package*">
          <Select<OptionType>
            options={packageOptions}
            placeholder="Select Package"
            isClearable
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AssignService;
