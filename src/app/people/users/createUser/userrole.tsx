"use client";
import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid';
import React, { useState } from 'react';
import Select, { SingleValue } from 'react-select';

type OptionType = {
    value: string;
    label: string;
};


interface ExcelData {
    [key: string]: {
        Module: string[];
        Feature: {
            [key: string]: string[];
        };
    };
}

const data: ExcelData = {
    "Sim Management": {
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
const partners = [
    "AWX",
    "Altawork-GT",
    "AWX-AWX",
    "AWX Test",
    "CSV RS AG",
    "Go-Tech-AWX-Test",
    "GT"
];

const roles = [
    "Agent",
    "Agent Partner Admin",
    "Notification Only User",
    "Partner Admin",
    "Super Admin",
    "User"
];

const UserRole: React.FC = () => {
    const [partner, setPartner] = useState<SingleValue<OptionType>>(null);
    const [role, setRole] = useState<SingleValue<OptionType>>(null);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [selectedModules, setSelectedModules] = useState<{ [key: string]: string[] }>({});
    const [selectedFeatures, setSelectedFeatures] = useState<{ [key: string]: string[] }>({});

    const handleModuleChange = (category: string, modules: any) => {
        const moduleValues = modules ? modules.map((module: any) => module.value) : [];
        setSelectedModules({ ...selectedModules, [category]: moduleValues });
        setSelectedFeatures({ ...selectedFeatures, [category]: [] });
    };
    const handleFeatureChange = (category: string, features: any) => {
        const featureValues = features ? features.map((feature: any) => feature.value) : [];
        setSelectedFeatures({ ...selectedFeatures, [category]: featureValues });
    };

    const options = partners.map(partner => ({
        value: partner.toLowerCase().replace(/\s+/g, '-'),
        label: partner
    }));
    const Roleoptions = roles.map((role, index) => ({
        value: role.toLowerCase().replace(/\s+/g, '-'),
        label: role,
    }));
    const handleSetPartner = (selectedOption: SingleValue<OptionType>) => {
        setPartner(selectedOption);
    };

    const handlesetRole = (selectedOption: SingleValue<OptionType>) => {
        setRole(selectedOption);
    };

    const handleSubmit = () => {
        const errors: string[] = [];
        if (!partner) errors.push('Partner is required.');
        if (!role) errors.push('Role is required.');

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
    return (
        <div className='mt-2'>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-gray-700">Partner<span className="text-red-500">*</span></label>
                    <Select
                    defaultValue={[options[1]]}
                        value={options[1]}
                        onChange={handleSetPartner}
                        options={options}
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
                    {errorMessages.includes('Partner is required.') && (
                        <span className="text-red-600 ml-1">Partner is required.</span>
                    )}
                </div>
                <div>
                    <label className="block text-gray-700">Role<span className="text-red-500">*</span></label>
                    <Select
                        value={role}
                        onChange={handlesetRole}
                        options={Roleoptions}
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
                    {errorMessages.includes('Role is required.') && (
                        <span className="text-red-600 ml-1">Role is required.</span>
                    )}
                </div>
            </div>
            <h3 className="tabs-sub-headings">Module Info</h3>
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
            <div className="flex justify-end space-x-4">
                <button className="cancel-btn">
                    <XMarkIcon className="h-5 w-5 text-black-500 mr-2" />
                    <span>Cancel</span>
                </button>
                <button
                    className="save-btn"
                    onClick={handleSubmit}
                >
                    <CheckIcon className="h-5 w-5 text-black-500 mr-2" />
                    <span>Submit</span>
                </button>
            </div>
        </div>

    );
};
export default UserRole;