
"use client";
import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid';
import React, { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { DropdownStyles,NonEditableDropdownStyles } from '@/app/components/css/dropdown';
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
                "Update Customer Rate Plan-Inventory",
                "Update Status-Inventory",
                "Update Carrier Rate Plan-Inventory",
                "Export inventory-Inventory",
                "Advanced filter-Inventory"
            ],
            "Bulk Change": [
                "Activate New Service (POD, Jasper and VZN)-Bulk Change",
                "Archive-Bulk Change",
                "Assign Customer-Bulk Change",
                "Change Carrier Rate Plan-Bulk Change",
                "Change Customer Rate Plan-Bulk Change",
                "Change ICCID/IMEI-Bulk Change",
                "Create Rev Service-Bulk Change",
                "Update Device Status-Bulk Change"
            ],
            "SIM Order Form": ["SIM Order Form"],
            "Carrier Rate Plans": [
                "Edit-Carrier Rate Plans",
                "Export-Carrier Rate Plans",
                "Optimize-Carrier Rate Plans"
            ],
            "Customer Rate Plans": [
                "Create-Customer Rate Plans",
                "Edit-Customer Rate Plans",
                "Import-Customer Rate Plans",
                "Export-Customer Rate Plans"
            ],
            "Rev Assurance": [
                "Add Service Line-Rev Assurance",
                "Add Service Product-Rev Assurance",
                "Disconnect Service Product-Rev Assurance"
            ],
            "Reports": [
                "Zero Usage Report-Reports",
                "Newly Activated Report-Reports",
                "Status History Report-Reports",
                "Usage By Line Report-Reports"
            ]
        }
    },
    "Optimization": {
        "Module": [
            "Optimization"
        ],
        "Feature": {
            "Optimization": [
                "Optimize-Optimization",
                "Export-Optimization"]
        }
    },
    "Customer Charges": {
        "Module": [
            "Customer Charges"
        ],
        "Feature": {
            "Customer Charges": [
                "Export-Customer Charges"
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
                "Export-nventory List"
            ],
            "NetSapiens Rev Assurance": [
                "Export-NetSapiens Rev Assurance",
                "Chain and Unchain-NetSapiens Rev Assurance",
                "Ignore-NetSapiens Rev Assurance"
            ],
            "Rev.IO Product Links": [
                "Export-Rev.IO Product Links",
                "Edit-Rev.IO Product Links",
                "Delete-Rev.IO Product Links"
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
                "Export-Automation rule",
                "Edit-Automation rule",
                "Delete-Automation rule"
            ],
            "Notifications": [
                "Add M2M Device Notifications-Notifications",
                "Add Mobility Device Notifications-Notifications"
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
    const [role, setRole] = useState<SingleValue<OptionType>>(null);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const editableDrp = DropdownStyles
    const nonEditableDrp = NonEditableDropdownStyles

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
    const Roleoptions = roles.map((role, index) => ({
        value: role.toLowerCase().replace(/\s+/g, '-'),
        label: role,
    }));
    const handlesetRole = (selectedOption: SingleValue<OptionType>) => {
        setRole(selectedOption);
    };

    const handleSubmit = () => {
        const errors: string[] = [];
        if (!role) errors.push('Role is required.');

        setErrorMessages(errors);

        if (errors.length === 0) {
            console.log('Saving...');
        }
        else {
        }
    };
    return (
        <div className=' p-4'>

            <h3 className="tabs-sub-headings">Module Access</h3>
            <div className="relative border border-gray-300 p-4 rounded-md mb-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="field-label">
                            <span className="font-semibold text-lg">Role</span><span className="text-red-500">*</span>
                        </label>
                        <Select
                            value={role}
                            onChange={handlesetRole}
                            options={Roleoptions}
                            styles={editableDrp}
                        />
                        {errorMessages.includes('Role is required.') && (
                            <span className="text-red-600 ml-1">Role is required.</span>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 mt-4">

                    {Object.keys(data).map((category) => (
                        <div key={category} className="col-span-1">
                            <h4 className="text-md font-medium text-blue-600">{category}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                <div>
                                    <label className="field-label">Module</label>
                                    <Select
                                        isMulti
                                        closeMenuOnSelect={false}
                                        value={selectedModules[category]?.map(module => ({ value: module, label: module })) || []}
                                        onChange={(selected) => handleModuleChange(category, selected)}
                                        options={data[category].Module.map(module => ({ value: module, label: module }))}
                                        styles={editableDrp}

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
                                        className=""
                                        styles={!selectedModules[category] || selectedModules[category].length === 0?nonEditableDrp:editableDrp}
                                        isDisabled={!selectedModules[category] || selectedModules[category].length === 0}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
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