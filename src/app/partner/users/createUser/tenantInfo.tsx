"use client";
import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid';
import React, { useState, useEffect } from 'react';
import Select, { ActionMeta, MultiValue, SingleValue } from 'react-select';
import { NonEditableDropdownStyles, DropdownStyles } from '@/app/components/css/dropdown';
import { partnerCarrierData, subPartnersData, serviceProviders, Customeroptions, CustomerGroup2Options } from '@/app/constants/partnercarrier';
interface Option {
    value: string;
    label: string;
}
type OptionType = {
    value: string;
    label: string;
};
const editableDrp = DropdownStyles;
const nonEditableDrp = NonEditableDropdownStyles;
const Partneroptions = Object.keys(partnerCarrierData).map(partner => ({ value: partner, label: partner }));
const ServiceProviderOptions = serviceProviders.map(provider => ({ value: provider, label: provider }));

interface TenantInfoProps {
    rowData?: any;
}

const TenantInfo: React.FC<TenantInfoProps> = ({ rowData }) => {
    const [selectedPartner, setSelectedPartner] = useState<string>('');
    const [selectedSubPartner, setSelectedSubPartner] = useState<string[]>([]);
    const [carriers, setCarriers] = useState<string[]>([]);
    const [subPartners, setSubPartners] = useState<string[]>([]);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [CarrierNotification, setCarrierNotification] = useState<MultiValue<OptionType>>([]);
    const [ServiceProvider, setServiceProvider] = useState<MultiValue<OptionType>>([]);
    const subPartnersoptions = subPartners.map(subPartner => ({ value: subPartner, label: subPartner }));
    const subPartnersnoOptions = [{ value: '', label: 'No sub-partners available' }];
    const Carrieroptions = carriers.map(carrier => ({ value: carrier, label: carrier }));


    useEffect(() => {
        if (rowData) {
            setSelectedPartner(rowData['Partner'] || '');
            setSubPartners(subPartnersData[rowData['Partner']] || []);
            setSelectedSubPartner(rowData['Sub Partner'] || '');
        }
    }, [rowData]);
    const handlePartnerChange = (selectedOption: { value: string; label: string } | null) => {
        if (selectedOption) {
            const partner = selectedOption.value;
            setSelectedPartner(partner);
            setCarriers(partnerCarrierData[partner] || []);
            setSubPartners(partner === 'Altaworx' ? subPartnersData[partner] || [] : []);
            setSelectedSubPartner([]); // Reset sub-partner when partner changes

        } else {
            setSelectedPartner('');
            setCarriers([]);
            setSubPartners([]);
            setSelectedSubPartner([]); // Reset sub-partner when no partner is selected
        }
    };
    const handleSetSubPartner = (selectedOptions: MultiValue<OptionType>) => {
        const selectedSubPartners = selectedOptions.map(option => option.value);
        setSelectedSubPartner(selectedSubPartners);
    };
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
                        <Select

                            value={{ value: selectedPartner, label: selectedPartner }}
                            onChange={handlePartnerChange}
                            options={Partneroptions}
                            styles={nonEditableDrp}

                        />
                    </div>

                    <div>
                        <label className="field-label">Sub Partner</label>
                        <Select
                            value={subPartnersoptions.filter(option => selectedSubPartner.includes(option.value))}
                            isMulti
                            options={subPartners.length > 0 ? subPartnersoptions : subPartnersnoOptions}
                            styles={nonEditableDrp}
                        />
                    </div>
                    <div>
                        <label className="field-label">Carrier <span className="text-red-500">*</span></label>
                        <Select
                            isMulti
                            value={CarrierNotification}
                            options={Carrieroptions}
                            styles={selectedPartner ? editableDrp : nonEditableDrp}
                            onChange={handleCarrier}
                            isDisabled={!selectedPartner}

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
                            options={Customeroptions}
                        />
                    </div>
                    <div>
                        <label className="field-label">Customers</label>
                        <Select
                            isMulti
                            options={CustomerGroup2Options}
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
