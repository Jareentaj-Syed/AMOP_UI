"use client";
import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid';
import React, { useState } from 'react';
import Select, { ActionMeta, MultiValue, SingleValue } from 'react-select';
import { NonEditableDropdownStyles,DropdownStyles } from '@/app/components/css/dropdown';
import { partnerCarrierData, subPartnersData, serviceProviders, Customeroptions, CustomerGroup2Options } from '@/app/constants/partnercarrier';
interface ExcelData {
    [key: string]: {
        Module: string[];
        Feature: {
            [key: string]: string[];
        };
    };
}
interface Option {
    value: string;
    label: string;
}
type OptionType = {
    value: string;
    label: string;
};
const editableDrp=DropdownStyles;
const nonEditableDrp=NonEditableDropdownStyles;
const Partneroptions = Object.keys(partnerCarrierData).map(partner => ({ value: partner, label: partner }));
const ServiceProviderOptions = serviceProviders.map(provider => ({ value: provider, label: provider }));
// const Notificationoptions = [
//     { value: 'yes', label: 'Yes' },
//     { value: 'no', label: 'No' }
// ];

const data: ExcelData = {
    "M2M": {
        "Module": [
            "Inventory",
            "Bulk Change",
            "SIM Order Form",
            "Carrier Rate Plans",
            "Customer Rate Plans",
            "Rev Assurance",
            "Reports"
        ],
        "Feature": {
            "Inventory": [
                "Update Customer Rate Plan",
                "Update Status",
                "Update Carrier Rate Plan",
                "Export inventory",
                "Advanced filter"
            ],
            "Bulk Change": [
                "Activate New Service (POD, Jasper and VZN)",
                "Archive",
                "Assign Customer",
                "Change Carrier Rate Plan",
                "Change Customer Rate Plan",
                "Change ICCID/IMEI",
                "Create Rev Service",
                "Update Device Status"
            ],
            "SIM Order Form": ["SIM Order Form"],
            "Carrier Rate Plans": [
                "Edit",
                "Export",
                "Optimize"
            ],
            "Customer Rate Plans": [
                "Create",
                "Edit",
                "Import",
                "Export"
            ],
            "Rev Assurance": [
                "Add Service Line",
                "Add Service Product",
                "Disconnect Service Product"
            ],
            "Reports": [
                "Zero Usage Report",
                "Newly Activated Report",
                "Status History Report",
                "Usage By Line Report"
            ]
        }
    },
    "Optimization": {
        "Module": [
            "Optimization"
        ],
        "Feature": {
            "Optimization": [
                "Optimize",
                "Export"]
        }
    },
    "Customer Charges": {
        "Module": [
            "Customer Charges"
        ],
        "Feature": {
            "Customer Charges": [
                "Export"
            ]
        }
    },
    "NetSapiens": {
        "Module": [
            "Inventory List",
            "Rev.IO Product Links",
            "NetSapiens Rev Assurance"
        ],
        "Feature": {
            "Inventory List": [
                "Export"
            ],
            "NetSapiens Rev Assurance": [
                "Export",
                "Chain and Unchain",
                "Ignore"
            ],
            "Rev.IO Product Links": [
                "Export",
                "Edit",
                "Delete"
            ]
        }
    },
    "LNP": {
        "Module": [
            "Phone Numbers",
            "Bulk Change",
            "Number Port In",
            "Number Orders",
            "Locations",
            "Revenue Assurance",
            "Rev.IO Product Links"
        ],
        "Feature": {
            "Phone Numbers": [
                "Export",
                "Add E911",
                "Move Phone Number",
                "Create DL/DA Order",
                "Update LIDB Order",
                "Update Line Options",
                "Update SMS Settings"
            ],
            "Bulk Change": [
                "Archive"
            ],
            "Number Port In": [
                "Check Eligibility",
                "Edit",
                "View Subscriber"
            ],
            "Number Orders": [
                "Order Phone Number",
                "Edit",
                "Check Status",
                "Add E911"
            ],
            "Locations": [
                "Update CNAM"
            ],
            "Revenue Assurance": [
                "Export"
            ],
            "Rev.IO Product Links": [
                "Export",
                "Edit",
                "Delete"
            ]
        }
    },
    "Automation": {
        "Module": [
            "Automation rule",
            "Notifications"
        ],
        "Feature": {
            "Automation rule": [
                "Export",
                "Edit",
                "Delete"
            ],
            "Notifications": [
                "Add M2M Device Notifications",
                "Add Mobility Device Notifications"
            ]
        }
    },
    "People": {
        "Module": [
            "Rev.IO Customers",
            "BandwithCustomers",
            "NetSapiens Customers",
            "E911 Customers",
            "Customer Groups",
            "Users"
        ],
        "Feature": {
            "Rev.IO Customers": [
                "Export",
                "Add Customers"
            ],
            "BandwithCustomers": [
                "Export",
                "Add Customers"
            ],
            "NetSapiens Customers": [
                "Export",
                "Add Customers"
            ],
            "E911 Customers": [
                "Create E911 Customer",
                "Edit",
                "Delete"
            ],
            "Customer Groups": [
                "Add Customer Groups",
                "Edit",
                "Delete"
            ],
            "Users": [
                "CreateNew User",
                "Edit",
                "Delete",
                "Impersonate"
            ]
        }
    },
    "Settings": {
        "Module": [
            "Provider Charge Mapping",
            "Application Settings",
            "Partners",
            "Roles",
            "Modules"
        ],
        "Feature": {
            "Provider Charge Mapping": [
                "Charge Mapping"
            ],
            "Application Settings": [
                "Edit"
            ],
            "Partners": [
                "Add Partner",
                "Edit",
                "Details",
                "Delete"
            ],
            "Roles": [
                "Add roles",
                "Edit",
                "Delete"
            ],
            "Modules": [
                "Edit",
                "Delete"
            ]
        }
    }
}

const TenantInfo: React.FC = () => {
    const [selectedModules, setSelectedModules] = useState<{ [key: string]: string[] }>({});
    const [selectedFeatures, setSelectedFeatures] = useState<{ [key: string]: string[] }>({});
    const [selectedPartner, setSelectedPartner] = useState<string>('');
    const [carriers, setCarriers] = useState<string[]>([]);
    const [subPartners, setSubPartners] = useState<string[]>([]);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [CarrierNotification, setCarrierNotification] = useState<MultiValue<OptionType>>([]);
    const [ServiceProvider,setServiceProvider]  = useState<MultiValue<OptionType>>([]);
    const [notificationValue, setNotificationValue] = useState<Option | null>(null);
    const subPartnersoptions = subPartners.map(subPartner => ({ value: subPartner, label: subPartner }));
    const subPartnersnoOptions = [{ value: '', label: 'No sub-partners available' }];

    const handlePartnerChange = (selectedOption: { value: string; label: string } | null) => {
        if (selectedOption) {
            const partner = selectedOption.value;
            setSelectedPartner(partner);
            setCarriers(partnerCarrierData[partner] || []);
            setSubPartners(partner === 'Altaworx' ? subPartnersData[partner] || [] : []);
        } else {
            setSelectedPartner('');
            setCarriers([]);
            setSubPartners([]);
        }
    };
    const Carrieroptions = carriers.map(carrier => ({ value: carrier, label: carrier }));
    const handleModuleChange = (category: string, modules: any) => {
        const moduleValues = modules ? modules.map((module: any) => module.value) : [];
        setSelectedModules({ ...selectedModules, [category]: moduleValues });
        setSelectedFeatures({ ...selectedFeatures, [category]: [] });
    };

    const handleFeatureChange = (category: string, features: any) => {
        const featureValues = features ? features.map((feature: any) => feature.value) : [];
        setSelectedFeatures({ ...selectedFeatures, [category]: featureValues });
    };
    const handleNotificationChange = (selectedOption: Option | null) => {
        setNotificationValue(selectedOption);
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
                <h3 className="tabs-sub-headings">Tenant Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="field-label">Partner</label>
                        <Select
                            
                            value={Partneroptions[0]}
                            onChange={handlePartnerChange}
                            options={Partneroptions}
                            styles={nonEditableDrp}
                            
                        />
                    </div>

                    <div>
                        <label className="field-label">Sub Partner</label>
                        <Select
                        value={subPartnersoptions[0]}
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
                            styles={selectedPartner?editableDrp:nonEditableDrp}                            
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
                            onChange={handleNotificationChange} />
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

            {/* <div>
                <h3 className="text-lg font-semibold mb-2 text-blue-500 bg-gray-200 pl-4 py-2">Module Info</h3>
                <div className="grid grid-cols-1 gap-4 mb-6">
                    {Object.keys(data).map((category) => (
                        <div key={category} className="col-span-1">
                            <h4 className="text-md font-medium mb-2 text-blue-600">{category}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="field-label">Module</label>
                                    <Select
                                        isMulti
                                        closeMenuOnSelect={false}
                                        value={selectedModules[category]?.map(module => ({ value: module, label: module })) || []}
                                        onChange={(selected) => handleModuleChange(category, selected)}
                                        options={data[category].Module.map(module => ({ value: module, label: module }))}
                                        className="w-full mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="field-label">Features</label>
                                    <Select
                                        isMulti
                                        closeMenuOnSelect={false}
                                        value={selectedFeatures[category]?.map(feature => ({ value: feature, label: feature })) || []}
                                        onChange={(selected) => handleFeatureChange(category, selected)}
                                        options={(selectedModules[category] || []).flatMap(module => data[category].Feature[module]?.map(feature => ({ value: feature, label: feature })) || [])}
                                        className="w-full mt-1"
                                        isDisabled={!selectedModules[category] || selectedModules[category].length === 0}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div> */}
            <div className="flex justify-end space-x-4">
                <button className="cancel-btn">
                    <XMarkIcon className="h-5 w-5 text-black-500 mr-2" />
                    <span>Cancel</span>
                </button>
                <button className="save-btn" onClick={handleSubmit}
                >
                    <CheckIcon className="h-5 w-5 text-black-500 mr-2"  />
                    <span>Submit</span>
                </button>
            </div>
        </div>
    );
};

export default TenantInfo;
