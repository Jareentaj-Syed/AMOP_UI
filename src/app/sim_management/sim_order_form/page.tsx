"use client"
import React, { useState } from 'react';
import { Form, Input, Checkbox, Button, Select, Col, Row } from 'antd';
import { PlusOutlined, CheckOutlined ,StopOutlined  } from '@ant-design/icons'; // Import the PlusOutlined icon

const { Option } = Select;

const SimOrderForm: React.FC = () => {
    const [form] = Form.useForm(); 
    const [count, setCount] = useState(1);
    const handleAddMore = () => {
        setCount(count + 1);
    };

    const handleRemove = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };
    function handleCancel() {
        // Clear form fields and reset validation messages
        form.resetFields();
    }
    const carrierOptions = [
        'AT&T - Cisco Jasper',
        'AT&T-POD19',
        'POND IoT',
        'Rogers Prod',
        'Rogers Sandbox',
        'Teal',
        'T-Mobile - Advantage',
        'T-Mobile Jasper',
        'Verzon - ThingSpace PN',
        'Verzon - ThingSpace IoT'
    ];
    const [carrier, setCarrier] = useState<string>(''); // Explicitly define carrier as string

    function getSimSizeOptions(carrier: string): string[] {
        switch (carrier) {
            case 'AT&T - Cisco Jasper':
            case 'T-Mobile - Advantage':
            case 'T-Mobile Jasper':
            case 'Verzon - ThingSpace PN':
            case 'Verzon - ThingSpace IoT':
                return ['Tri-cut']; // Tri-cut SIM size options
            case 'AT&T-POD19':
                return ['Standard', 'Macro', 'Nano']; // Standard, Macro, Nano SIM size options
            default:
                return []; // Default no options
        }
    }

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
        <div style={{ padding: '20px', textAlign: 'left' }}>
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
                {/* first block */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={<span className="bold-label">Company</span>}
                            name="company"
                            rules={[{ required: true, message: 'Please input your company name!' }]}
                        >
                            <Input className="rectangular-input custom-disabled-input" placeholder="Company" readOnly />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<span className="bold-label">Contact Name</span>}
                            name="contactName"
                            rules={[{ required: true, message: 'Please input your contact name!' }]}
                        >
                            <Input className="rectangular-input custom-disabled-input" placeholder="Contact Name" readOnly />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<span className="bold-label">Email</span>}
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <Input className="rectangular-input custom-disabled-input" placeholder="Email" readOnly />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<span className="bold-label">Country</span>}
                            name="country"
                            rules={[{ required: true, message: 'Please input your country!' }]}
                        >
                            <Input className="rectangular-input" placeholder="Country" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<span className="bold-label">Shipping Address</span>}
                            name="shippingAddress"
                            rules={[{ required: true, message: 'Please input your shipping address!' }]}
                        >
                            <Input.TextArea className="rectangular-input" placeholder="Shipping Address" rows={4} />
                        </Form.Item>
                    </Col>
                    
                    <Col span={12}>
                    <Form.Item
                            label={<span className="bold-label">Special Instructions</span>}
                            name="SpecialInstructions"
                        >
                            <Input.TextArea className="rectangular-input" placeholder="Special Instructions" rows={4} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                    <Form.Item name="expedite" valuePropName="checked">
                            <Checkbox style={{ width: '50px', height: '50px', fontSize: '20px', lineHeight: '50px' }}>Expedite?</Checkbox>
                        </Form.Item>
                       
                    </Col>
                </Row>
                {/* second Block */}
                <div>
                    {Array.from({ length: count }, (_, index) => (
                        <div className="form-block" key={index}>
                            <Form.Item
                                label={<span className="bold-label">Carrier</span>}
                                name={`carrier${index}`}
                                rules={[{ required: true, message: 'Please select your carrier!' }]}

                            >
                                <Select defaultValue="Select Carrier" style={{ width: '100%' }}
                                    onChange={(value: string) => setCarrier(value)} // Set selected carrier
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
                                    {getSimSizeOptions(carrier).map(size => (
                                        <Option key={size} value={size}>
                                            {size}
                                        </Option>
                                    ))}
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
                        className="save-button"
                        icon={<CheckOutlined />}
                    >
                        Save
                    </Button>     
                    <Button
                    onClick={handleCancel}
                    className="cancel-button"
                    icon={<StopOutlined  />}
                >
                    Cancel
                </Button>           
                </Form.Item>
            </Form>
        </div>
    );
};

export default SimOrderForm;
