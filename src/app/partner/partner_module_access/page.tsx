"use client";
import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid';
import React, { useEffect, useState } from 'react';
import Select, { SingleValue, StylesConfig } from 'react-select';
import { DropdownStyles } from '@/app/components/css/dropdown';
import { partnerModuleData } from './partner_module_access_constants';
import { usePartnerStore } from '../partnerStore';
import axios from 'axios';
import { useAuth } from '@/app/components/auth_context';
import { getCurrentDateTime } from '@/app/components/header_constants';


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
    Feature: Feature; // This allows dynamic module names as keys
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
 

    const [role, setRole] = useState<SingleValue<OptionType>>(null);
    const [selectedModules, setSelectedModules] = useState<{ [key: string]: string[] }>({});
    const [selectedFeatures, setSelectedFeatures] = useState<{ [key: string]: string[] }>({});
    const [moduleColors, setModuleColors] = useState<{ [key: string]: string }>({});
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [map, setMap] = useState<ExcelData>({});
    console.log("partner module data:", partnerModuleData)

    const subModules = partnerModuleData.data["Partner module access"]["module"];
    const parentModules = partnerModuleData.data["Partner module access"]["tenant_module"];

    const module_features = partnerModuleData.data["Partner module access"]["module_features"]

    const editableDrp = DropdownStyles;

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



    const handleSetRole = (selectedOption: SingleValue<OptionType>) => {
        if (selectedOption) {
            const role = selectedOption.value;
            setRole(selectedOption);
            console.log("mockdata for role:", mockRoleData[role])

            let selectedRoleData;

            if (!mockRoleData[role]) {
                selectedRoleData = generateDefaultRoleData();
            } else {
                selectedRoleData = combineRoleData(generateDefaultRoleData(), mockRoleData[role]);
            }

            setMap(selectedRoleData);

            setSelectedModules({});
            setSelectedFeatures({});

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

        console.log(defaultRoleData)
        return defaultRoleData;
    };

  const combineRoleData = (
    defaultData: CategoryData,
    selectedRoleData: CategoryData
): CategoryData => {
    for (const [moduleKey, moduleValue] of Object.entries(defaultData)) {
        console.log(`Processing module: ${moduleKey}`);

        // Check if the module exists in the selected role data
        if (selectedRoleData[moduleKey]) {
            console.log(`Module ${moduleKey} found in selectedRoleData`);

            // Mark the module as active if it exists in selectedRoleData
            moduleValue.Module = moduleValue.Module.map((module: string) => {
                const isActive = selectedRoleData[moduleKey].Module.includes(module.replace('-active', ''));
                const newModuleName = isActive ? `${module.replace('-active', '')}-active` : module.replace('-active', '');
                console.log(`Module: ${module} => New Module: ${newModuleName}`);
                return newModuleName;
            });

            // Get the selected features for the current module
            const selectedFeatures = selectedRoleData[moduleKey].Feature || {};
            console.log(`Selected features for ${moduleKey}:`, selectedFeatures);

            // Process features for the current module
            for (const featureKey of Object.keys(moduleValue.Feature)) {
                console.log(`Processing feature: ${featureKey} in module: ${moduleKey}`);

                // Check if features exist in selected role data
                if (selectedFeatures[featureKey]) {
                    moduleValue.Feature[featureKey] = moduleValue.Feature[featureKey].map((feature: string) => {
                        const isActiveFeature = selectedFeatures[featureKey].includes(feature.replace('-active', ''));
                        const newFeatureName = isActiveFeature ? `${feature.replace('-active', '')}-active` : feature;
                        console.log(`Feature: ${feature} => New Feature: ${newFeatureName}`);
                        return newFeatureName;
                    });
                }
            }
        } else {
            console.log(`Module ${moduleKey} not found in selectedRoleData, retaining original state`);

            // If the module doesn't exist in selectedRoleData, retain its original state
            moduleValue.Module = moduleValue.Module.map(module => module.replace('-active', ''));

            // Retain original features state as well
            for (const featureKey of Object.keys(moduleValue.Feature)) {
                moduleValue.Feature[featureKey] = moduleValue.Feature[featureKey].filter(
                    feature => !feature.endsWith('-active')
                );
            }
        }
    }

    console.log("Combined data:", defaultData);
    return defaultData; // Returns modified defaultData
};

    

    useEffect(() => {
        const initialSelectedModules: { [key: string]: string[] } = {};
        const initialSelectedFeatures: { [key: string]: string[] } = {};

        Object.keys(map).forEach((category) => {
            initialSelectedModules[category] = map[category].Module
                .filter((module) => module.includes('-active'))
                .map((module) => module.replace('-active', '')); // Remove '-active'

            Object.keys(map[category]?.Feature || {}).forEach((module) => {
                initialSelectedFeatures[category] = initialSelectedFeatures[category] || [];
                map[category].Feature[module].forEach((feature) => {
                    if (feature.includes('-active')) {
                        initialSelectedFeatures[category].push(feature.replace('-active', '')); // Remove '-active'
                    }
                });
            });
        });

        setSelectedModules(initialSelectedModules);
        setSelectedFeatures(initialSelectedFeatures);
    }, [map]);

    const toggleModule = (category: string, module: string) => {
        setSelectedModules((prev) => {
            const modules = prev[category] || [];
            const isSelected = modules.includes(module);
            return {
                ...prev,
                [category]: isSelected
                    ? modules.filter((m) => m !== module)
                    : [...modules, module]
            };
        });
    };

    const toggleFeature = (category: string, feature: string) => {
        setSelectedFeatures((prev) => {
            const features = prev[category] || [];
            const isSelected = features.includes(feature);
            return {
                ...prev,
                [category]: isSelected
                    ? features.filter((f) => f !== feature)
                    : [...features, feature]
            };
        });
    };





    //   console.log(partnerModuleData.data["Partner module access"]["role_name"])

    const Roleoptions = partnerModuleData.data["Partner module access"]["role_name"].map((role: any) => ({
        value: role,
        label: role,
    }));

    // console.log(Roleoptions)

    const handleSubmit = async () => {
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
            // try {
            //     const url =
            //         "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management";
            //     const roleValue = role?.value; // Get the value from role if it exists

            //     const action = roleValue && mockRoleData[roleValue] ? "update" : "create"; // Check if roleValue is defined and valid

            //     const data = {
            //         tenant_name: partner || "default_value",
            //         username: username,
            //         path: "/update_partner_info",
            //         parent_module: "Partner",
            //         module_name: "Partner Module Access",
            //         action: action,
            //         changed_data: formattedData,
            //         request_received_at: getCurrentDateTime(),
            //         Partner: partner,
            //     };

            //     const response = await axios.post(url, { data });

            //     console.log(response);
            // } catch (err) {
            //     console.error("Error fetching data:", err);
            // }
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
                            <div className="flex flex-wrap gap-2 border border-gray-300 p-2 rounded-lg">
                                {map[category].Module.map((module) => {
                                    const cleanedModule = module.replace('-active', ''); // Remove '-active' for display
                                    const isSelected = selectedModules[category]?.includes(cleanedModule);
                                    const bgColor = isSelected ? '#BFDBFE' : '#D1D5DB';

                                    return (
                                        <button
                                            key={module}
                                            className={`px-2 py-1 rounded-lg border`}
                                            style={{ backgroundColor: bgColor }}
                                            onClick={() => toggleModule(category, cleanedModule)}
                                        >
                                            {cleanedModule}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label className="field-label">Features</label>
                            <div className="flex flex-wrap gap-2 border border-gray-300 p-2 rounded-lg">
                                {Object.keys(map[category]?.Feature || {}).flatMap((module) =>
                                    map[category].Feature[module]?.map((feature) => {
                                        const cleanedFeature = feature.replace('-active', ''); // Remove '-active' for display
                                        const isSelected = selectedFeatures[category]?.includes(cleanedFeature);
                                        const bgColor = isSelected ? '#BFDBFE' : '#D1D5DB';

                                        return (
                                            <button
                                                key={feature}
                                                className={`px-2 py-1 rounded-lg border`}
                                                style={{ backgroundColor: bgColor }}
                                                onClick={() => toggleFeature(category, cleanedFeature)}
                                            >
                                                {cleanedFeature}
                                            </button>
                                        );
                                    }) || []
                                )}
                            </div>
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
