"use client"
import React, { useState } from 'react';
import { Form, Input, Checkbox, Button, Select } from 'antd';
import { PlusOutlined ,CheckOutlined} from '@ant-design/icons'; // Import the PlusOutlined icon

const { Option } = Select;

const SimOrderForm: React.FC = () => {
    const [count, setCount] = useState(1);
    const handleAddMore = () => {
        setCount(count + 1);
    };

    const handleRemove = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };
    const carrierOptions = [
        'AT&T - Cisco Jasper',
        'AT&T-POD19',
        'POND IoT',
        'Rogers Prod',
        'Rogers Sandbox',
        'Teal',
        'T-Mobile - Advantage',
        'T-Mobile Jasper',
        'Verzon - ThingSpace PN'
    ];

    const onFinish = (values: { [key: string]: any }) => {
        const labels: { [key: string]: string } = {
            company: "Company",
            contactName: "Contact Name",
            email: "Email",
            shippingAddress: "Shipping Address",
            country: "Country",
            expedite: "Expedite",
            SpecialInstructions: "Special Instructions",
            carrier: "Carrier",
            simSize: "SIM Size",
            quantity: "Quantity"
        };

        const formData: { [key: string]: any } = {};
        for (const key in values) {
            if (labels[key]) {
                formData[labels[key]] = values[key];
            }
        }

        console.log(formData);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', textAlign: 'left' }}>
            <Form
                className='ant-form'
                layout="vertical"
                initialValues={{
                    company: "AWX",
                    contactName: "Lohitha V",
                    email: "lohitha.v@algonox.com"
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    label={<span className="bold-label">Company</span>}
                    name="company"
                    rules={[{ required: true, message: 'Please input your company name!' }]}
                >
                    <Input className="rectangular-input custom-disabled-input" placeholder="Company" readOnly />
                </Form.Item>

                <Form.Item
                    label={<span className="bold-label">Contact Name</span>}
                    name="contactName"
                    rules={[{ required: true, message: 'Please input your contact name!' }]}
                >
                    <Input className="rectangular-input custom-disabled-input" placeholder="Contact Name" readOnly />
                </Form.Item>

                <Form.Item
                    label={<span className="bold-label">Email</span>}
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input className="rectangular-input custom-disabled-input" placeholder="Email" readOnly />
                </Form.Item>

                <Form.Item
                    label={<span className="bold-label">Shipping Address</span>}
                    name="shippingAddress"
                    rules={[{ required: true, message: 'Please input your shipping address!' }]}
                >
                    <Input.TextArea className="rectangular-input" placeholder="Shipping Address" rows={4} />
                </Form.Item>

                <Form.Item
                    label={<span className="bold-label">Country</span>}
                    name="country"
                    rules={[{ required: true, message: 'Please input your country!' }]}
                >
                    <Input className="rectangular-input" placeholder="Country" />
                </Form.Item>

                <Form.Item name="expedite" valuePropName="checked" style={{ marginBottom: 0 }}>
                    <Checkbox style={{ width: '30px', height: '30px', fontSize: '20px' }}>Expedite?</Checkbox>
                </Form.Item>

                <Form.Item
                    label={<span className="bold-label">Special Instructions</span>}
                    name="SpecialInstructions"
                >
                    <Input.TextArea className="rectangular-input" placeholder="Special Instructions" rows={4} />
                </Form.Item>

                {/* New Block */}
                <div>
                    {Array.from({ length: count }, (_, index) => (
                        <div className="form-block" key={index}>
                            <Form.Item
                                label={<span className="bold-label">Carrier</span>}
                                name={`carrier${index}`}
                                rules={[{ required: true, message: 'Please select your carrier!' }]}
                            >
                                <Select defaultValue="Select Carrier" style={{ width: '100%' }}
                                >
                                    {carrierOptions.map(carrier => (
                                        <Option key={carrier} value={carrier}>
                                            {carrier}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label={<span className="bold-label">SIM Size</span>}
                                name={`simSize${index}`}
                                rules={[{ required: true, message: 'Please select your SIM size!' }]}
                            >
                                <Select placeholder="SIM Size" style={{ width: '100%' }}>
                                    <Option value="Standard">Standard</Option>
                                    {/* Add more options as needed */}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label={<span className="bold-label">Quantity</span>}
                                name={`quantity${index}`}
                                rules={[{ required: true, message: 'Please input the quantity!' }]}
                            >
                                <Input className="rectangular-input" placeholder="Quantity" type="number" />
                            </Form.Item>
                        </div>
                    ))}

                    <div>
                        <Button
                            type="primary"
                            onClick={handleAddMore}
                            className='buttons'
                            icon={<PlusOutlined style={{ color: '#00C2F3' }} />}
                        >
                            Add Additional SIMs?
                        </Button>
                        <Button type="primary" onClick={handleRemove} danger>
                            Remove
                        </Button>
                    </div>
                </div>
                <Form.Item>
                <Button
              type="primary"
              htmlType="submit"
              className="buttons"
              icon={<CheckOutlined />}
            >
              Save
            </Button>                </Form.Item>
            </Form>
        </div>
    );
};

export default SimOrderForm;
