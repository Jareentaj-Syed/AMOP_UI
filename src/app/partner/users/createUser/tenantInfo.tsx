"use client";
import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid';
import React, { useState, useEffect } from 'react';
import Select, { ActionMeta, MultiValue, SingleValue } from 'react-select';
import { NonEditableDropdownStyles, DropdownStyles } from '@/app/components/css/dropdown';
import { useUserStore } from './createUserStore';
import { usePartnerStore } from '../../partnerStore';
import { useAuth } from '@/app/components/auth_context';
import { getCurrentDateTime } from '@/app/components/header_constants';
import axios from 'axios';
import { Modal, notification } from 'antd';
type OptionType = {
    value: string;
    label: string;
};
const editableDrp = DropdownStyles;
const nonEditableDrp = NonEditableDropdownStyles;
interface TenantInfoProps {
    rowData?: any;
}

const TenantInfo: React.FC<TenantInfoProps> = ({ rowData }) => {
  const { username, tenantNames, role, partner:userPartner, settabledata} = useAuth();
    const [carriers, setCarriers] = useState<string[]>([]);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [CarrierNotification, setCarrierNotification] = useState<MultiValue<OptionType>>([]);
    const [ServiceProvider, setServiceProvider] = useState<MultiValue<OptionType>>([]);
    const [customerGroup, setCustomerGroup] = useState<SingleValue<OptionType>>(null);
    const [customer, setCustomer] = useState<MultiValue<OptionType>>([]);

    const [CustomerGroupOptions, setCustomerGroupOptions] = useState<any[]>([])
    const [ServiceProviderOptions, setServiceProviderOptions] = useState<any[]>([])
    const [customerOptions, setcustomerOptions] = useState<any[]>([])
    const [generalFields, setGeneralFields] = useState<any[]>([]);

    const Carrieroptions = carriers.map(carrier => ({ value: carrier, label: carrier }));
    const { partnerData } = usePartnerStore.getState();
    const usersData = partnerData["Partner users"]?.data?.["Partner users"] || {};
    //Show Modal
  const [showModal, setShowModal] = useState(false);

    const {
        tenant,
        role_name,
        sub_tenant,
        user_name,
        setTenant,
        setRoleName,
        setSubTenant
    } = useUserStore();

    useEffect(() => {
        const initializeData = () => {
            const general_fields = partnerData["Partner users"]?.headers_map?.["Partner users"]?.general_fields || {}
            const CustomerGroupOptions: any[] = usersData?.name || []
            const CustomerGroupOptions_ = CustomerGroupOptions.map((group: any) => ({ value: group, label: group }))
            const ServiceProviderOptions: any[] = usersData?.rate_plan_name || []
            const ServiceProviderOptions_ = ServiceProviderOptions.map((service: any) => ({ value: service, label: service }))
            const customerOptions: any[] = usersData?.customer_name || []
            const customerOptions_ = customerOptions.map((customer: any) => ({ value: customer, label: customer }))
            console.log("general_fields", general_fields)
            setcustomerOptions(customerOptions_)
            setCustomerGroupOptions(CustomerGroupOptions_)
            setServiceProviderOptions(ServiceProviderOptions_)
            setGeneralFields(general_fields)


        };

        initializeData();
    }, [usersData]);
    // useEffect(() => {
    //     if (rowData) {
    //         setTenant(rowData['tenant_name'] || '');
    //         setSubTenant(rowData['subtenant_name'] || '');
    //     }
    // }, [rowData]);
    const messageStyle = {
        fontSize: '14px',  // Adjust font size
        fontWeight: 'bold', // Make the text bold
        padding: '16px',
      };

    //Clearing all the fields after successful submition
    const handleClearFields = () => {
        setCarrierNotification([]);
        setServiceProvider([]);
        setCustomerGroup(null);
        setCustomer([]);
        setErrorMessages([]);
        setTenant('');
        // setSubTenant('');
      };
    const handleSubmit = async() => {
        try{
        const url =
          "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management";
    
        let changedData: any = {}; // Initialize changedData as an object
    
        // Ensure getFieldValue returns a valid field name or provide a default value
        const serviceProviderFieldName = getFieldValue("Service Provider") || "Service Provider";
        const customerGroupFieldName = getFieldValue("Customer Group") || "Customer Group";
        const customersFieldName = getFieldValue("Customers") || "Customers";
    
        changedData[serviceProviderFieldName] = ServiceProvider.map(option => option.value);
        changedData[customerGroupFieldName] = customerGroup ? customerGroup.value : '';
        changedData[customersFieldName] = customer.map(option => option.value);
        changedData["username"] = user_name

    
        const data = {
            tenant_name: userPartner || "default_value",
            username: username,
            path: "/update_partner_info",
            role_name: role,
            module_name: "Partner users",
            action: "update",
            request_received_at: getCurrentDateTime(),
            changed_data: {
                "customer_info":changedData
            },
          
            Partner:userPartner,
        };
        const response = await axios.post(url, { data });
        const parsedData = JSON.parse(response.data.body);
          if (response && response.data.statusCode===200) {
            // Show success message
            notification.success({
              message: 'Success',
              description: 'Successfully saved the form',
              style: messageStyle,
              placement: 'top', // Apply custom styles here
            });
            handleClearFields(); // Clear all fields
          }
          else{
            Modal.error({
              title: 'Submit Error',
              content: parsedData.message || 'An error occurred while submitting the form. Please try again.',
              centered: true,
            });
          }
    }
    catch(error){
        console.log(
            error
        )
    }
    
        // const errors: string[] = [];
        // if (CarrierNotification.length === 0) errors.push('Carrier is required.');
        // if (ServiceProvider.length === 0) errors.push('Service Provider is required.');
    
        // setErrorMessages(errors);
    
        // if (errors.length === 0) {
        //     console.log('Saving...');
        //     // You can add the code to make an API request here
        // } else {
        //     scrollToTop();
        // }
    };
      //Handling modal save
  const handleConfirmSave = () => {
    handleSubmit();
    setShowModal(false);
  };
//Handling modal cancel
  const handleCancelSave = () => {
    setShowModal(false);
  };
    
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'auto'  // Optional: Smooth scroll animation
        });
    };
    const handleCarrier = (newValue: MultiValue<OptionType>, actionMeta: ActionMeta<OptionType>) => {
        setCarrierNotification(newValue);
        if (newValue.length > 0) {
            setErrorMessages(prevErrors => prevErrors.filter(error => error !== 'Carrier is required.'));
        }
    };
    const serviceProviderChange = (newValue: MultiValue<OptionType>, actionMeta: ActionMeta<OptionType>) => {

        setServiceProvider(newValue);
        if (newValue.length > 0) {
            setErrorMessages(prevErrors => prevErrors.filter(error => error !== 'Service Provider is required.'));
        }
    };
    const customerGroupChange = (selectedOption: SingleValue<OptionType>) => {
        if (selectedOption) {
            setCustomerGroup(selectedOption);
        }
    }
    const customerChange = (newValue: MultiValue<OptionType>, actionMeta: ActionMeta<OptionType>) => {
        setCustomer(newValue);
    };
    const getFieldValue = (label: any) => {
        if (rowData) {
            console.log("label", label)
            const field = generalFields ? generalFields.find((f: any) => f.display_name === label) : null;
            return field ? rowData[field.db_column_name] || '' : '';
        }
        else {
            return ""
        }
    };
    return (
        <div className=''>
            <div>
                <h3 className="tabs-sub-headings">Customer Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="field-label">Partner</label>
                        <input
                            type="text"
                            value={tenant}
                            className="non-editable-input"
                        />
                    </div>

                    <div>
                        <label className="field-label">Sub Partner</label>
                        <input
                            type="text"
                            value={sub_tenant}
                            className="non-editable-input"
                        />
                    </div>
                    <div>
                        <label className="field-label">Carrier <span className="text-red-500">*</span></label>
                        <Select
                            isMulti
                            value={CarrierNotification}
                            options={Carrieroptions}
                            styles={tenant ? editableDrp : nonEditableDrp}
                            onChange={handleCarrier}
                            isDisabled={!tenant}

                        />
                        {errorMessages.includes('Carrier is required.') && (
                            <span className="text-red-600 ml-1">Carrier is required.</span>
                        )}
                    </div>
                    <div>
                        <label className="field-label">Service Provider <span className="text-red-500">*</span></label>
                        <Select
                            isMulti
                            options={ServiceProviderOptions}
                            styles={editableDrp}
                            value={rowData && ServiceProviderOptions.some(option => option.value === getFieldValue('Service Provider'))
                            ? { value: getFieldValue('Service Provider'), label: getFieldValue('Service Provider') }
                            : ServiceProvider
                        }
                            onChange={serviceProviderChange}

                        />
                        {errorMessages.includes('Service Provider is required.') && (
                            <span className="text-red-600 ml-1">Service Provider is required.</span>
                        )}
                    </div>
                    <div>
                        <label className="field-label">Customer Group</label>
                        <Select
                            value={rowData && ServiceProviderOptions.some(option => option.value === getFieldValue('Customer Group'))
                                ? { value: getFieldValue('Customer Group'), label: getFieldValue('Customer Group') }
                                : customerGroup
                            }
                            styles={editableDrp}
                            options={CustomerGroupOptions}
                            onChange={customerGroupChange}
                        />
                    </div>
                    <div>
                        <label className="field-label">Customers</label>
                        <Select
                            isMulti
                            options={customerOptions}
                            styles={editableDrp}
                            value={rowData && ServiceProviderOptions.some(option => option.value === getFieldValue('Customers'))
                                ? { value: getFieldValue('Customers'), label: getFieldValue('Customers') }
                                : customer
                            }
                            onChange={customerChange}
                        />
                    </div>
                </div>
            </div>
            <div className="flex justify-end space-x-4">
                <button className="cancel-btn">
                    <XMarkIcon className="h-5 w-5 text-black-500 mr-2" />
                    <span>Cancel</span>
                </button>
                <button className="save-btn" onClick={()=>setShowModal(true)}
                >
                    <CheckIcon className="h-5 w-5 text-black-500 mr-2" />
                    <span>Submit</span>
                </button>
            </div>
            {showModal && (
        <Modal
          title="Confirmation"
          open={showModal}
          onOk={handleConfirmSave}
          onCancel={handleCancelSave}
          centered
        >
          <p>Are you sure you want to submit the data?</p>
        </Modal>
      )}
        </div>
    );
};

export default TenantInfo;
