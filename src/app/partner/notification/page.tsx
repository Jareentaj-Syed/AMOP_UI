import { DropdownStyles } from '@/app/components/css/dropdown';
import React, { useState } from 'react';
import Select from 'react-select';
import { usePartnerStore } from '../partnerStore';

// Define the type for options
type OptionType = { value: string; label: string };

const roles = [
    "Agent",
    "Agent Partner Admin",
    "Notification Only User",
    "Partner Admin",
    "Super Admin",
    "User"
];

const roleData = {
    "Agent": {
        modules: [
            {
                name: "Sim Management",
                emailAlerts: ["User registration", "Content update", "System outage", "Monthly sales summary", "Performance milestone reached"]
            },
            {
                name: "Optimization",
                emailAlerts: ["User registration", "System outage", "Performance milestone reached"]
            },
            {
                name: "Customer Charges",
                emailAlerts: ["User registration", "Content update", "System outage"]
            },
            {
                name: "NetSapiens",
                emailAlerts: ["User registration", "Content update", "Monthly sales summary", "Performance milestone reached"]
            },
            {
                name: "LNP",
                emailAlerts: ["System outage", "Performance milestone reached"]
            },
            {
                name: "Automation",
                emailAlerts: ["Content update", "System outage", "Performance milestone reached"]
            },
            {
                name: "People",
                emailAlerts: ["System outage"]
            },
            {
                name: "Settings",
                emailAlerts: ["User registration", "Content update", "Monthly sales summary"]
            }
        ]
    },
    "Agent Partner Admin": {
        modules: [
            {
                name: "Sim Management",
                emailAlerts: ["Monthly sales summary", "Performance milestone reached"]
            },
            {
                name: "Optimization",
                emailAlerts: ["Performance milestone reached"]
            },
       
            {
                name: "Automation",
                emailAlerts: ["Performance milestone reached"]
            },
       
        ]
    },
    "Notification Only User": {
        modules: [
            {
                name: "Sim Management",
                emailAlerts: ["User registration", "Content update", "System outage", "Performance milestone reached"]
            },
            {
                name: "Optimization",
                emailAlerts: ["System outage", "Performance milestone reached"]
            },
            {
                name: "Customer Charges",
                emailAlerts: ["User registration", "System outage"]
            },
         
            {
                name: "LNP",
                emailAlerts: ["Performance milestone reached"]
            },
            {
                name: "Automation",
                emailAlerts: ["System outage", "Performance milestone reached"]
            },
           
           
        ]
    },
    "Partner Admin": {
        modules: [
            {
                name: "Sim Management",
                emailAlerts: ["User registration", "Content update", "System outage", "Monthly sales summary"]
            },
            
            {
                name: "Customer Charges",
                emailAlerts: ["User registration", "Content update", "System outage"]
            },
          
        ]
    },
    "Super Admin": {
        modules: [
            {
                name: "NetSapiens",
                emailAlerts: ["User registration", "Content update", "System outage", "Monthly sales summary", "Performance milestone reached"]
            },
            {
                name: "LNP",
                emailAlerts: ["Performance milestone reached"]
            },
            {
                name: "Automation",
                emailAlerts: ["Content update", "System outage", "Performance milestone reached"]
            },
         
            {
                name: "Settings",
                emailAlerts: ["Monthly sales summary"]
            }
        ]
    },
    "User": {
        modules: [
            {
                name: "Sim Management",
                emailAlerts: ["User registration", "Content update", "Monthly sales summary", "Performance milestone reached"]
            },
           
            {
                name: "Customer Charges",
                emailAlerts: ["User registration", "Content update", "System outage"]
            },
          
        ]
    }
};


const Notification = () => {
    const { partnerData } = usePartnerStore.getState();
const partnerInfo=partnerData["Customer groups"]
    const [role, setRole] = useState<OptionType | null>(null);

    const handleSetRole = (selectedOption: OptionType | null) => {
        setRole(selectedOption);
    };

    return (
        <div className="relative border border-gray-300 p-6 rounded-md mb-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="field-label">
                        <span className="font-semibold text-lg">Role</span><span className="text-red-500">*</span>
                    </label>
                    <Select
                        value={role}
                        onChange={handleSetRole}
                        options={roles.map(role => ({ value: role, label: role }))}
                        styles={DropdownStyles}
                    />
                    {/* Add your error handling logic here */}
                </div>
            </div>


            {role && (
                <div className="mt-4">
                    {/* <h2 className="text-lg font-normal">Role Details for {role.label}</h2> */}
                    <table className="mt-2 w-full border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 text-left border-b-2 border-gray-200">Module</th>
                                <th className="py-2 px-4 text-left border-b-2 border-gray-200">Email Alerts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roleData[role.value as keyof typeof roleData].modules.map((module, index) => (
                                <tr key={index} className="bg-white border-b border-gray-200">
                                    <td className="py-2 px-4">{module.name}</td>
                                    <td className="py-2 px-4">{module.emailAlerts.join(', ')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
};

export default Notification;
