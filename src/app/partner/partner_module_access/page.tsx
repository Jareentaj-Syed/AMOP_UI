"use client";
import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid';
import React, { useState } from 'react';
import Select, { SingleValue, StylesConfig } from 'react-select';
import { DropdownStyles } from '@/app/components/css/dropdown';
import { partnerModuleData } from './partner_module_access_constants';
import { usePartnerStore } from '../partnerStore';
import axios from 'axios';
import { useAuth } from '@/app/components/auth_context';


interface FormattedData {
    role: string;
    module: string;
    sub_module: string;
    module_features: Array<{
        module: string;
        features: string[];
    }>;
}

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
    const { partnerData } = usePartnerStore.getState();
    const { username, partner } = useAuth();
    const partnermoduleaccess=partnerData["Partner module access"]
    // console.log("Partner module access",partnermoduleaccess)
    const [role, setRole] = useState<SingleValue<OptionType>>(null);
    const [selectedModules, setSelectedModules] = useState<{ [key: string]: string[] }>({});
    const [selectedFeatures, setSelectedFeatures] = useState<{ [key: string]: string[] }>({});
    const [moduleColors, setModuleColors] = useState<{ [key: string]: string }>({});
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [map, setMap] = useState<ExcelData>({});
    // console.log("partner module data:", partnerModuleData)
    // console.log("partner data:", partnerModuleData.data["Partner module access"])
    // console.log("roledata",partnerModuleData.data["Partner module access"]["role_module"])
    // console.log("modules",partnerModuleData.data["Partner module access"]["module"])
    const subModules = partnerModuleData.data["Partner module access"]["module"];
    const parentModules = partnerModuleData.data["Partner module access"]["tenant_module"];
 
    const module_features=partnerModuleData.data["Partner module access"]["module_features"]

    // console.log("parent modules",partnerModuleData.data["Partner module access"]["tenant_module"])
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
            // Assign a color to the module if it doesn't have one
            if (!newColors[module]) {
                newColors[module] = getColor(index);
            }
    
            // Get features associated with the module
            const features = map[category]?.Feature[module] || [];
            
            // Assign the module's color to features only if they have not been assigned a color yet
            features.forEach((feature: string) => {
                if (!newColors[feature]) {
                    newColors[feature] = newColors[module]; // Use the module's color for its features
                }
            });
        });
    
        // Create a list of features with their colors
        const defaultFeatures = moduleValues.flatMap((module: any) => {
            const features = map[category]?.Feature[module] || [];
            return features.map((feature: string) => ({
                feature,
                color: newColors[feature], // Use the feature's color
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
    
    
    const rawData = partnerModuleData.data["Partner module access"]["role_module"];


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

    const handleSetRole = (selectedOption: SingleValue<OptionType>) => {
        if (selectedOption) {
            const role = selectedOption.value;
            setRole(selectedOption);
    
            let selectedRoleData = mockRoleData[role];
            if (!selectedRoleData) {
                selectedRoleData = generateDefaultRoleData();
                mockRoleData[role] = selectedRoleData; // Save the generated default data
            }
    
            console.log(selectedRoleData);
            setMap(selectedRoleData);
            setSelectedModules({});
            setSelectedFeatures({});
            setModuleColors({}); // Reset colors when role changes
        }
    };
    

    const generateDefaultRoleData = (): CategoryData => {
        const subModules = partnerModuleData.data["Partner module access"]["module"];
        const parentModules = partnerModuleData.data["Partner module access"]["tenant_module"];
        const moduleFeatures = partnerModuleData.data["Partner module access"]["module_features"];
        
        const defaultRoleData: CategoryData = {};
    
        // Iterate through each parent module
        parentModules.forEach((parentModule: string) => {
            defaultRoleData[parentModule] = {
                Module: [], // Initialize Module as an empty array
                Feature: {}
            };
    
            // Find children modules for the parent module
            const childrenModules = subModules[parentModule] || [];
            defaultRoleData[parentModule].Module = childrenModules; // Assign children modules
    
            // Populate features for each child module
            childrenModules.forEach((childModule: string) => {
                const features = moduleFeatures.find((modFeat: { module: string }) => modFeat.module === childModule);
                defaultRoleData[parentModule].Feature[childModule] = features ? JSON.parse(features.features) : []; // Parse features if available
            });
        });
    
        return defaultRoleData;
    };
    
    
    
    

//   console.log(partnerModuleData.data["Partner module access"]["role_name"])

    const Roleoptions =  partnerModuleData.data["Partner module access"]["role_name"].map((role: any) => ({
        value: role,
        label: role,
    }));

    // console.log(Roleoptions)

    const handleSubmit =async ()=> {
        const errors: string[] = [];
        // Check if role is null and push an error if it is
        if (!role) {
            errors.push('Role is required.');
        }
    
        setErrorMessages(errors);
    
        if (errors.length === 0) {
            // Check that role is defined before accessing its value
            const formattedData: { [key: string]: any } = {
                [role!.value]: {} // Use non-null assertion if you are sure it won't be null
            };
    
            Object.keys(selectedModules).forEach(category => {
                const selectedModulesForCategory = selectedModules[category];
                const selectedFeaturesForCategory = selectedFeatures[category] || [];
    
                formattedData[role!.value][category] = {
                    Module: selectedModulesForCategory,
                    Feature: {}
                };
    
                selectedModulesForCategory.forEach(module => {
                    formattedData[role!.value][category].Feature[module] = selectedFeaturesForCategory.filter(feature =>
                        map[category]?.Feature[module]?.includes(feature)
                    );
                });
            });
    
            console.log("Formatted Data:", formattedData);
            try {
                const url =
                  "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management";
                  const roleValue = role?.value; // Get the value from role if it exists

                  const action = roleValue && mockRoleData[roleValue] ? "update" : "create"; // Check if roleValue is defined and valid
                  
                  const data = {
                    tenant_name: partner || "default_value",
                    username: username,
                    path: "/update_partner_info",
                    parent_module: "Partner",
                    module_name: "Partner Module Access",
                    action: action,
                    changed_data: formattedData,
                  };
                  
                const response = await axios.post(url, { data });
            
                console.log(response);
              } catch (err) {
                console.error("Error fetching data:", err);
              }
        } else {
            console.log("Errors:", errors);
        }
        // setSelectedModules({});
        // setSelectedFeatures({});
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
                            onChange={handleSetRole}
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
                                        // defaultValue={ map[category].Module.map(module => ({ value: module, label: module }))}
                                        closeMenuOnSelect={false}
                                        value={selectedModules[category]?.map(module => ({ value: module, label: module })) || []}
                                        onChange={(selected) => handleModuleChange(category, selected)}
                                        options={map[category].Module.map(module => ({ value: module, label: module }))}
                                        styles={customStyles(category)}
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
                                        // defaultValue={(selectedModules[category] || []).flatMap((module: any) =>
                                        //     map[category].Feature[module]?.map((feature: any) => ({ value: feature, label: feature })) || []
                                        // )}
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
