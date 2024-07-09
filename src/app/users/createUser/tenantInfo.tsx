"use client";
import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid';
import React, { useState } from 'react';
import Select from 'react-select';

interface ExcelData {
    [key: string]: {
        Module: string[];
        Feature: {
            [key: string]: string[];
        };
    };
}

const partners = [
    "Altawork",
    "Go Tech",
    "Go Tech Mobility",
    "Titanium",
    "Live U ",
    "Spectrotcl ",
    "Vast ",
    "Dynalink ",
    "For2Fi",
    "Fuse Cloud"
  ];

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
            "Customer Charges":[
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

    const handleModuleChange = (category: string, modules: any) => {
        const moduleValues = modules ? modules.map((module: any) => module.value) : [];
        setSelectedModules({ ...selectedModules, [category]: moduleValues });
        setSelectedFeatures({ ...selectedFeatures, [category]: [] });
    };

    const handleFeatureChange = (category: string, features: any) => {
        const featureValues = features ? features.map((feature: any) => feature.value) : [];
        setSelectedFeatures({ ...selectedFeatures, [category]: featureValues });
    };

    return (
        <div>
            <div>
    <h3 className="text-lg font-semibold mb-2 text-blue-900 bg-blue-100 pl-4">Tenant Info</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
            <label className="block text-gray-700">Partner</label>
            <select
                className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                style={{ height: '2.6rem' }}>
                {partners.map((partner, index) => (
                    <option key={index} value={partner.toLowerCase().replace(/\s+/g, '-')}>
                        {partner}
                    </option>
                ))}
            </select>
        </div>
        <div>
            <label className="block text-gray-700">Sub-Partner</label>
            <select
                className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                style={{ height: '2.6rem' }}>
                <option value="subpartner1">Sub-Partner 1</option>
                <option value="subpartner2">Sub-Partner 2</option>
                {/* Add more options as needed */}
            </select>
        </div>
        <div>
            <label className="block text-gray-700">Carrier</label>
            <select
                className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                style={{ height: '2.6rem' }}>
                <option value="carrier1">Carrier 1</option>
                <option value="carrier2">Carrier 2</option>
                {/* Add more options as needed */}
            </select>
        </div>
        <div>
            <label className="block text-gray-700">Service Provider</label>
            <select
                className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                style={{ height: '2.6rem' }}>
                <option value="provider1">Service Provider 1</option>
                <option value="provider2">Service Provider 2</option>
                {/* Add more options as needed */}
            </select>
        </div>
        <div>
            <label className="block text-gray-700">Group</label>
            <select
                className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                style={{ height: '2.6rem' }}>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
        <div>
            <label className="block text-gray-700">Customers</label>
            <select
                className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                style={{ height: '2.6rem' }}>
                <option value="customer1">Customer 1</option>
                <option value="customer2">Customer 2</option>
                {/* Add more options as needed */}
            </select>
        </div>
    </div>
</div>

            <div>
                <h3 className="text-lg font-semibold mb-2 text-blue-900 bg-blue-100 pl-4">Module Info</h3>
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
            </div>
            <div className="flex justify-end space-x-4">
            <button className="flex items-center p-2 rounded-lg shadow ml-2 button border border-gray-300">
          <XMarkIcon className="h-5 w-5 text-black-500 mr-2"/>
          <span>Cancel</span>
        </button>
        <button className="flex items-center p-2 rounded-lg shadow ml-2 button border border-gray-300"
        >
          <CheckIcon className="h-5 w-5 text-black-500 mr-2" />
          <span>Submit</span>
        </button>
            </div>
        </div>
    );
};

export default TenantInfo;
