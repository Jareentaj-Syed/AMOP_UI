"use client";
import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid';
import React, { useState, useEffect } from 'react';
import Select, { ActionMeta, MultiValue, SingleValue } from 'react-select';
import { NonEditableDropdownStyles, DropdownStyles } from '@/app/components/css/dropdown';
import { useUserStore } from './createUserStore';
import { usePartnerStore } from '../../partnerStore';

type OptionType = {
    value: string;
    label: string;
};
const editableDrp = DropdownStyles;
const nonEditableDrp = NonEditableDropdownStyles;
const CustomerGroupOptions:any[]=[]
const ServiceProviderOptions:any[] = []
const customerOptions:any[]=[]

interface TenantInfoProps {
    rowData?: any;
}

const TenantInfo: React.FC<TenantInfoProps> = ({ rowData }) => {
    const [carriers, setCarriers] = useState<string[]>([]);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [CarrierNotification, setCarrierNotification] = useState<MultiValue<OptionType>>([]);
    const [ServiceProvider, setServiceProvider] = useState<MultiValue<OptionType>>([]);
    const Carrieroptions = carriers.map(carrier => ({ value: carrier, label: carrier }));
    const { partnerData } = usePartnerStore.getState();
    const usersData = partnerData["Partner users"] || {};
    const {
        tenant,
        role_name,
        sub_tenant,
        setTenant,
        setRoleName,
        setSubTenant
      } = useUserStore();

    useEffect(() => {
        if (rowData) {
            setTenant(rowData['tenant_name'] || '');
            setSubTenant(rowData['subtenant_name'] || '');
        }
    }, [rowData]);
    const handleSubmit = () => {
        const errors: string[] = [];
        if (CarrierNotification.length === 0) errors.push('Carrier is required.');
        if (ServiceProvider.length === 0) errors.push('Service Provider is required.');

        setErrorMessages(errors);

        if (errors.length === 0) {
            console.log('Saving...');
        }
        else {
            scrollToTop()
        }
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
    const serviceProviderCarrier = (newValue: MultiValue<OptionType>, actionMeta: ActionMeta<OptionType>) => {

        setServiceProvider(newValue);
        if (newValue.length > 0) {
            setErrorMessages(prevErrors => prevErrors.filter(error => error !== 'Service Provider is required.'));
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
                            value={ServiceProvider}
                            onChange={serviceProviderCarrier}

                        />
                        {errorMessages.includes('Service Provider is required.') && (
                            <span className="text-red-600 ml-1">Service Provider is required.</span>
                        )}
                    </div>
                    <div>
                        <label className="field-label">Customer Group</label>
                        <Select

                            styles={editableDrp}
                            options={CustomerGroupOptions}
                        />
                    </div>
                    <div>
                        <label className="field-label">Customers</label>
                        <Select
                            isMulti
                            options={customerOptions}
                            styles={editableDrp}
                        />
                    </div>
                </div>
            </div>
            <div className="flex justify-end space-x-4">
                <button className="cancel-btn">
                    <XMarkIcon className="h-5 w-5 text-black-500 mr-2" />
                    <span>Cancel</span>
                </button>
                <button className="save-btn" onClick={handleSubmit}
                >
                    <CheckIcon className="h-5 w-5 text-black-500 mr-2" />
                    <span>Submit</span>
                </button>
            </div>
        </div>
    );
};

export default TenantInfo;
