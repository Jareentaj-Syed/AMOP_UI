"use client";
import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid';
import React, { useState } from 'react';
import Select, { SingleValue, StylesConfig } from 'react-select';
import { DropdownStyles } from '@/app/components/css/dropdown';
import { partnerModuleData } from './partner_module_access_constants';

type OptionType = {
    value: string;
    label: string;
};

type Role = {
    rolename: string;
};

type Feature = {
    [module: string]: string[];
};

type ModuleData = {
    Module: string[];
    Feature: Feature;
};

type CategoryData = {
    [category: string]: ModuleData;
};

type Data = {
    [role: string]: CategoryData;
};

interface ExcelData {
    [key: string]: {
        Module: string[];
        Feature: {
            [key: string]: string[];
        };
    };
}

const UserRole: React.FC = () => {
    const [role, setRole] = useState<SingleValue<OptionType>>(null);
    const [selectedModules, setSelectedModules] = useState<{ [key: string]: string[] }>({});
    const [selectedFeatures, setSelectedFeatures] = useState<{ [key: string]: string[] }>({});
    const [moduleColors, setModuleColors] = useState<{ [key: string]: string }>({});
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [map, setMap] = useState<ExcelData>({});
    console.log("partner module data:", partnerModuleData)
    const editableDrp = DropdownStyles;
    const colorPalette = [
        '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', '#E6B333',
        '#3366E6', '#999966', '#99FF99', '#B34D4D', '#FF4D4D', '#C2C2F0',
        '#FFCC99', '#C2F0C2', '#FF99E6', '#FFB3E6', '#80BFFF', '#FFCC00',
        '#FF6666', '#C2C2F0', '#6699FF'
    ];

    const getColor = (index: number) => colorPalette[index % colorPalette.length];

    const handleModuleChange = (category: string, modules: any) => {
        const moduleValues = modules ? modules.map((module: any) => module.value) : [];
        const newColors = { ...moduleColors };
    
        moduleValues.forEach((module: string | number, index: number) => {
            if (!newColors[module]) {
                newColors[module] = getColor(index);
            }
    
            // Assign the same color to the features of the module
            const features = map[category]?.Feature[module] || [];
            features.forEach((feature: string) => {
                newColors[feature] = newColors[module]; // Assign module color to features
            });
        });
    
        const defaultFeatures = moduleValues.flatMap((module: any) => {
            const features = map[category]?.Feature[module] || [];
            return features.map((feature: string) => ({
                feature,
                color: newColors[module], // Keep the same color for features
            }));
        });
    
        setModuleColors(newColors);
        setSelectedModules(prevState => ({
            ...prevState,
            [category]: moduleValues
        }));
    
        setSelectedFeatures(prevState => {
            const updatedFeatures = {
                ...prevState,
                [category]: defaultFeatures.map((item: { feature: any; }) => item.feature)
            };
            return updatedFeatures;
        });
    };
    
    const customStyles = (category: string): StylesConfig<OptionType, true> => ({
        option: (provided, { data }) => ({
            ...provided,
            color: 'black', // Keep options in default black color
        }),
        multiValue: (provided, { data }) => {
            const moduleColor = moduleColors[data.value] || 'black'; // Get color for selected module or feature
    
            return {
                ...provided,
                backgroundColor: moduleColor,
                color: 'white',
            };
        },
        multiValueLabel: (provided) => ({
            ...provided,
            color: 'white',
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: 'white',
            ':hover': {
                backgroundColor: 'red',
                color: 'white',
            },
        }),
    });
    
    
    const rawData = partnerModuleData.role_module;

    const transformData = (data: typeof rawData): Data => {
        const transformedData: Data = {};

        data.forEach((item: { role: any; module: string; sub_module: string; module_features: string; }) => {
            const role = item.role;
            const modules = item.module !== "None" ? JSON.parse(item.module) : [];
            const subModules = item.sub_module !== "None" ? JSON.parse(item.sub_module) : {};
            const moduleFeatures = item.module_features !== "None" ? JSON.parse(item.module_features) : {};

            if (!transformedData[role]) {
                transformedData[role] = {};
            }

            modules.forEach((module: string) => {
                transformedData[role][module] = {
                    Module: subModules[module] || [],
                    Feature: moduleFeatures[module] || {}
                };
            });
        });

        return transformedData;
    };

    const mockRoleData: Data = transformData(rawData);



    const handleFeatureChange = (category: string, features: any) => {
        const featureValues = features ? features.map((feature: any) => feature.value) : [];
        setSelectedFeatures(prevState => ({
            ...prevState,
            [category]: featureValues,
        }));
    };

    const handlesetRole = (selectedOption: SingleValue<OptionType>) => {
        if (selectedOption) {
            const role = selectedOption.value;
            setRole(selectedOption);
            const selectedRoleData = mockRoleData[role] || {};
            setMap(selectedRoleData);
            setSelectedModules({});
            setSelectedFeatures({});
            setModuleColors({}); // Reset colors when role changes
        }
    };



    const Roleoptions = partnerModuleData.Roles.map((role: Role) => ({
        value: role.rolename,
        label: role.rolename,
    }));

    const handleSubmit = () => {
        const errors: string[] = [];
        // Check if role is null and push an error if it is
        if (!role) {
            errors.push('Role is required.');
        }
    
        setErrorMessages(errors);
    
        // if (errors.length === 0) {
        //     // Check that role is defined before accessing its value
        //     const formattedData: { [key: string]: any } = {
        //         [role!.value]: {} // Use non-null assertion if you are sure it won't be null
        //     };
    
        //     Object.keys(selectedModules).forEach(category => {
        //         const selectedModulesForCategory = selectedModules[category];
        //         const selectedFeaturesForCategory = selectedFeatures[category] || [];
    
        //         formattedData[role!.value][category] = {
        //             Module: selectedModulesForCategory,
        //             Feature: {}
        //         };
    
        //         selectedModulesForCategory.forEach(module => {
        //             formattedData[role!.value][category].Feature[module] = selectedFeaturesForCategory.filter(feature =>
        //                 map[category]?.Feature[module]?.includes(feature)
        //             );
        //         });
        //     });
    
        //     console.log("Formatted Data:", formattedData);
        // } else {
        //     console.log("Errors:", errors);
        // }
    };
    

    return (
        <div className='p-4'>
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
                    {Object.keys(map).map((category) => (
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
                                        options={map[category].Module.map(module => ({ value: module, label: module }))}
                                        styles={customStyles(category)} // Use customStyles for module colors
                                    />

                                </div>
                                <div>
                                    <label className="field-label">Features</label>
                                    <Select
                                        isMulti
                                        closeMenuOnSelect={false}
                                        value={selectedFeatures[category]?.map((feature: any) => ({ value: feature, label: feature })) || []}
                                        options={(selectedModules[category] || []).flatMap((module: any) =>
                                            map[category].Feature[module]?.map((feature: any) => ({ value: feature, label: feature })) || []
                                        )}
                                        onChange={(selected) => handleFeatureChange(category, selected)}
                                        styles={customStyles(category)}
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
                    <span>Save</span>
                </button>
            </div>
        </div>
    );
};

export default UserRole;
