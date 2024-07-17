"use client";
import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid';
import React, { useState } from 'react';
import Select from 'react-select';
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

    return (
        <div className='mt-4'>
               <div className="flex items-center mb-4 mt-2">
    <a href="/partner" className="flex items-center text-lg font-light text-black-300 hover:underline" >
    Partner Users
</a>
<span className="mx-2 text-gray-500">/</span>
<span className="text-lg font-light text-black">Tenant Info</span>

</div>
            <div>
                <h3 className="tabs-sub-headings">Tenant Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-gray-700">Partner</label>
                        <Select
                            
                            value={Partneroptions[0]}
                            onChange={handlePartnerChange}
                            options={Partneroptions}
                            className="input"
                            
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    marginTop: '5px',
                                    height: '2.6rem',
                                    borderRadius: '0.375rem',
                                    borderColor: state.isFocused ? '#1640ff' : '#D1D5DB',
                                    boxShadow: state.isFocused ? '0 0 0 1px #93C5FD' : 'none',
                                }),
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Sub Partner</label>
                        <Select
                        value={subPartnersoptions[0]}
                            isMulti
                            options={subPartners.length > 0 ? subPartnersoptions : subPartnersnoOptions}
                            className="input"
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    marginTop: '5px',
                                    height: '2.6rem',
                                    borderRadius: '0.375rem',
                                    borderColor: state.isFocused ? '#1640ff' : '#D1D5DB',
                                    boxShadow: state.isFocused ? '0 0 0 1px #93C5FD' : 'none',
                                }),
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Carrier <span className="text-red-500">*</span></label>
                        <Select
                            isMulti
                            options={Carrieroptions}
                            className="input"
                            isDisabled={!selectedPartner}
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    marginTop: '5px',
                                    height: '2.6rem',
                                    borderRadius: '0.375rem',
                                    borderColor: state.isFocused ? '#1640ff' : '#D1D5DB',
                                    boxShadow: state.isFocused ? '0 0 0 1px #93C5FD' : 'none',
                                }),
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Service Provider <span className="text-red-500">*</span></label>
                        <Select
                            isMulti
                            options={ServiceProviderOptions}
                            className="input"
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    marginTop: '5px',
                                    height: '2.6rem',
                                    borderRadius: '0.375rem',
                                    borderColor: state.isFocused ? '#1640ff' : '#D1D5DB',
                                    boxShadow: state.isFocused ? '0 0 0 1px #93C5FD' : 'none',
                                }),
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Customer Group</label>
                        <Select

                            className='input'
                            options={Customeroptions}
                            onChange={handleNotificationChange} />
                    </div>
                    <div>
                        <label className="block text-gray-700">Customers</label>
                        <Select
                            isMulti
                            options={CustomerGroup2Options}
                            className="input"
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
                                    <label className="block text-gray-700">Module</label>
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
                                    <label className="block text-gray-700">Features</label>
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
                <button className="save-btn" 
                >
                    <CheckIcon className="h-5 w-5 text-black-500 mr-2"  />
                    <span>Submit</span>
                </button>
            </div>
        </div>
    );
};

export default TenantInfo;
