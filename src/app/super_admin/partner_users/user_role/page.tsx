
"use client";
import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid';
import React, { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { partnerCarrierData, subPartnersData } from '@/app/constants/partnercarrier'
type OptionType = {
    value: string;
    label: string;
};

const Partneroptions = Object.keys(partnerCarrierData).map(partner => ({ value: partner, label: partner }));

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
    const [selectedPartner, setSelectedPartner] = useState<string>('');
    const [subPartners, setSubPartners] = useState<string[]>([]);
    const subPartnersoptions = subPartners.map(subPartner => ({ value: subPartner, label: subPartner }));
    const subPartnersnoOptions = [{ value: '', label: 'No sub-partners available' }];

    const [selectedModules, setSelectedModules] = useState<{ [key: string]: string[] }>({});
    const [selectedFeatures, setSelectedFeatures] = useState<{ [key: string]: string[] }>({});
    const [count, setCount] = useState(1); // State to track the number of sections

    const handleAddSection = () => {
        setCount(prevCount => prevCount + 1); // Increment count on button click
    };
    const handlePartnerChange = (selectedOption: { value: string; label: string } | null) => {
        if (selectedOption) {
            const partner = selectedOption.value;
            setSelectedPartner(partner);
           
            setSubPartners(partner === 'Altaworx' ? subPartnersData[partner] || [] : []);
        } else {
            setSelectedPartner('');
           
            setSubPartners([]);
        }
    };
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
        }
    };
    const handleDelete = (indexToDelete:any) => {
        setCount((prevCount) => prevCount - 1);
        // Optionally, you may remove associated state for the deleted item
        // Example: Clear selectedModules and selectedFeatures for the deleted index
        setSelectedModules((prevSelectedModules) => {
            const updatedModules = { ...prevSelectedModules };
            delete updatedModules[indexToDelete];
            return updatedModules;
        });
        setSelectedFeatures((prevSelectedFeatures) => {
            const updatedFeatures = { ...prevSelectedFeatures };
            delete updatedFeatures[indexToDelete];
            return updatedFeatures;
        });
    };
    return (
        <div className=' p-4'>
    <div className="flex items-center">
    <a href="/super_admin/partner_users" className="flex items-center text-lg font-light text-black-300 hover:underline">
    People Users
</a>
<span className="mx-2 text-gray-500">/</span>
<span className="text-lg font-light text-black">User Role</span>

</div>





            <div className="grid grid-cols-2 gap-4 mb-4 mt-2">
                <div>
                    <label className="block text-gray-700">Partner</label>
                    <Select
                            
                            value={{ value: selectedPartner, label: selectedPartner }}
                            onChange={handlePartnerChange}
                            options={Partneroptions}
                            className="mt-1"
                            
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
                <label className="block text-gray-700">Sub Partner</label>
                        <Select
                            isMulti
                            options={subPartners.length > 0 ? subPartnersoptions : subPartnersnoOptions}
                            className="mt-1"
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
                        <span className="text-red-600 ml-1">Sub partner is required.</span>
                    )}
                </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-blue-500 bg-gray-200 pl-4 pr-4 py-2 flex justify-between items-center">
    Module Info
    <button onClick={handleAddSection} className="text-blue-600 border border-blue-600 rounded-md px-2 py-1">
        ADD
    </button>
</h3>



            {Array.from({ length: count }, (_, index) => (
               <div key={index} className="relative border border-gray-300 p-4 rounded-md mb-4">
               {/* Cross mark for deletion */}
               <button
                   onClick={() => handleDelete(index)}
                   className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                   style={{ zIndex: 10 }} // Ensure the button is above other elements
               >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                   </svg>
               </button>
                    <div>
                          
                    <label className="block text-gray-700">
    <span className="font-semibold text-lg">Role</span><span className="text-red-500">*</span>
</label>
                        <Select
                value={role}
                onChange={handlesetRole}
                options={Roleoptions}
                styles={{
                    control: (base, state) => ({
                        ...base,
                        marginTop: '5px',
                        height: '2.6rem',
                        width:'570px',
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
                    <div className="grid grid-cols-1 gap-4 mt-4">
                        {/* Mapping over your data object */}
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
            ))}
 

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