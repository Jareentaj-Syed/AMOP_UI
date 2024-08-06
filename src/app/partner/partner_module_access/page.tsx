"use client";
import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid';
import React, { useEffect, useState } from 'react';
import Select, { SingleValue, StylesConfig } from 'react-select';
import { DropdownStyles } from '@/app/components/css/dropdown';
import { PartnerModuleData } from './partner_module_access_constants';
import { usePartnerStore } from '../partnerStore';
import axios from 'axios';
import { useAuth } from '@/app/components/auth_context';
import { getCurrentDateTime } from '@/app/components/header_constants';
import { Modal, notification, Spin } from 'antd';


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

       const [partnerModuleData, setPartnerModuleData] = useState<any>(PartnerModuleData);

    useEffect(() => {
        
          setPartnerModuleData(PartnerModuleData || {});

    
      }, [PartnerModuleData]);
    const { partnerData } = usePartnerStore.getState();
    const { username, partner, role } = useAuth();


    const [Selectedrole, setRole] = useState<SingleValue<OptionType>>(null);
    const [selectedModules, setSelectedModules] = useState<{ [key: string]: string[] }>({});
    const [selectedFeatures, setSelectedFeatures] = useState<{ [key: string]: string[] }>({});
    const [moduleColors, setModuleColors] = useState<{ [key: string]: string }>({});
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [map, setMap] = useState<ExcelData>({});
    console.log("partner module data:", partnerModuleData)
  

    const editableDrp = DropdownStyles;

    const rawData = partnerModuleData?.data["Partner module access"]["role_module"];

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

            let selectedRoleData;

            if (!mockRoleData[role]) {
                selectedRoleData = generateDefaultRoleData();
            } else {
                selectedRoleData = combineRoleData(generateDefaultRoleData(), mockRoleData[role]);
            }

            setMap(selectedRoleData);

            // Initialize selected modules and features based on the selected role
            const initialSelectedModules: { [key: string]: string[] } = {};
            const initialSelectedFeatures: { [key: string]: string[] } = {};

            Object.keys(selectedRoleData).forEach((category) => {
                initialSelectedModules[category] = selectedRoleData[category].Module
                    .filter((module) => module.includes('-active'))
                    .map((module) => module.replace('-active', '')); // Remove '-active'

                Object.keys(selectedRoleData[category]?.Feature || {}).forEach((module) => {
                    initialSelectedFeatures[category] = initialSelectedFeatures[category] || [];
                    selectedRoleData[category].Feature[module].forEach((feature) => {
                        if (feature.includes('-active')) {
                            initialSelectedFeatures[category].push(feature.replace('-active', '')); // Remove '-active'
                        }
                    });
                });
            });

            setSelectedModules(initialSelectedModules);
            setSelectedFeatures(initialSelectedFeatures);
            console.log("Initial Selected Modules:", initialSelectedModules);
            console.log("Initial Selected Features:", initialSelectedFeatures);
            console.log("Selected Role Data:", selectedRoleData);

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
                    for (const featureKey of Object.keys(moduleValue.Feature)) {
                        if (selectedFeatures[featureKey]) {
                            moduleValue.Feature[featureKey] = moduleValue.Feature[featureKey].map((feature: string) => {
                                const isActiveFeature = selectedFeatures[featureKey].includes(feature.replace('-active', ''));
                                return isActiveFeature ? `${feature.replace('-active', '')}-active` : feature;
                            });
                        }
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





    const toggleModule = (category: string, module: string) => {
        setSelectedModules((prev) => {
            const modules = prev[category] || [];
            const isSelected = modules.includes(module);
            const features = map[category]?.Feature[module] || [];

            // If the module is being selected, also select its features
            if (!isSelected) {
                setSelectedFeatures((prevFeatures) => ({
                    ...prevFeatures,
                    [category]: [
                        ...(prevFeatures[category] || []),
                        ...features.map(feature => feature.replace('-active', '')) // Remove '-active' for display
                    ],
                }));
            } else {
                // If the module is being deselected, deselect its features
                features.forEach((feature) => {
                    toggleFeature(category, feature.replace('-active', '')); // Call toggleFeature to deselect related features
                });
            }

            // Update selected modules
            return {
                ...prev,
                [category]: isSelected
                    ? modules.filter((m) => m !== module) // Deselect module
                    : [...modules, module] // Select module
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
                    ? features.filter((f) => f !== feature) // Deselect feature
                    : [...features, feature] // Select feature
            };
        });
    };


    const messageStyle = {
        fontSize: '14px',  // Adjust font size
        fontWeight: 'bold', // Make the text bold
        padding: '16px',
        // Add padding
    };




    //   console.log(partnerModuleData.data["Partner module access"]["role_name"])

    const Roleoptions = partnerModuleData.data["Partner module access"]["role_name"].map((role: any) => ({
        value: role,
        label: role,
    }));

    // console.log(Roleoptions)
    const handleSubmit = async () => {
        const errors: string[] = [];

        if (!Selectedrole) {
            errors.push('Role is required.');
        }

        setErrorMessages(errors);

        if (errors.length === 0) {
            const formattedData: { [key: string]: any } = {
                [Selectedrole!.value]: {}
            };

            console.log("Selected Modules:", selectedModules);
            console.log("Selected Features:", selectedFeatures);

            // Loop through selectedModules and selectedFeatures
            Object.keys(selectedModules).forEach(category => {
                const selectedModulesForCategory = selectedModules[category];
                const selectedFeaturesForCategory = selectedFeatures[category] || [];

                formattedData[Selectedrole!.value][category] = {
                    Module: selectedModulesForCategory,
                    Feature: {}
                };

                selectedModulesForCategory.forEach(module => {
                    // Retrieve related features from the map
                    const relatedFeatures = map[category]?.Feature[module.replace('-active', '')];
                    console.log(`Related features for ${module} in ${category}:`, relatedFeatures);

                    if (relatedFeatures) {
                        // Normalize the selected features by removing the '-active' suffix
                        const normalizedSelectedFeatures = selectedFeaturesForCategory.map(feature =>
                            feature.replace('-active', '')
                        );

                        console.log("Normalized Selected Features:", normalizedSelectedFeatures);

                        // Filter normalized features against related features
                        const filteredFeatures = normalizedSelectedFeatures.filter(feature => {
                            // Check if the related feature contains the normalized feature
                            return relatedFeatures.includes(feature) || relatedFeatures.includes(feature + '-active');
                        });

                        // Store filtered features in the formatted data
                        formattedData[Selectedrole!.value][category].Feature[module] = filteredFeatures;

                        // Log the filtered features for debugging
                        console.log(`Filtered features for ${module}:`, filteredFeatures);
                    } else {
                        console.log(`No features found for module: ${module} in category: ${category}`);
                    }
                });
            });

            console.log("Formatted Data:", formattedData);

            try {
                const url =
                    "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management";
                const roleValue = Selectedrole?.value; // Get the value from role if it exists

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
                const resp = JSON.parse(response.data.body);
                console.log(resp)
                if (response.data.statusCode === 200 && resp.flag === true) {

                    notification.success({
                        message: 'Success',
                        description: 'Successfully Saved the record!',
                        style: messageStyle,
                        placement: 'top', // Apply custom styles here
                    });

                    // setLoading(true)

                    const data = {
                        tenant_name: partner || "default_value",
                        username: username,
                        path: "/get_partner_info",
                        role_name: role,
                        modules_list: ["Partner module access"],
                        "pages": {
                            "Customer groups": { "start": 0, "end": 500 },
                            "Partner users": { "start": 0, "end": 500 }
                        }

                    };
                    try {
                        const response = await axios.post('https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management', { data });
                        if (response && response.status === 200) {
                            const parseddata = JSON.parse(response.data.body);
                            if (parseddata.flag) {

                                console.log(parseddata)
                                // setPartnerModuleData

                                // console.log(partnerModuleData.data["Partner module access"])
                                setPartnerModuleData(parseddata)
                                // partnerModuleData=partnerModuleData.data["Partner module access"]


                            } else {

                                Modal.error({
                                    title: 'Error',
                                    content: parseddata.message,
                                    centered: true,
                                });
                                setLoading(false)
                            }
                        } else {
                            Modal.error({
                                title: 'Error',
                                content: 'An error occurred during fetching data.',
                                centered: true,
                            });
                        }
                    } catch (error) {
                        console.error('Error fetching');
                    }

                }
                console.log(response);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        }

        else {
            console.log("Errors:", errors);
        }
    };




    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }






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
                            value={Selectedrole}
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
                        <div key={category} className="col-span-1 border border-gray-300 p-4 rounded-lg">
                            <h4 className="text-xl font-medium text-blue-600 ml-2 mb-2">{category}</h4>
                            <div className="mb-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {map[category].Module.map((module) => {
                                        const cleanedModule = module.replace('-active', ''); // Remove '-active' for display
                                        const isSelected = selectedModules[category]?.includes(cleanedModule);
                                        const bgColor = isSelected ? '#BFDBFE' : '#D1D5DB';

                                    
                                        const relatedFeatures = map[category]?.Feature[cleanedModule] || [];

                                        return (
                                            <div key={module} className="border border-gray-300 p-4 rounded-lg mb-4">
                                                <div className="flex items-center">
                                                    <span className="text-blue-600 text-sm font-medium mr-2">Module:</span>
                                                    <button
                                                        className={`px-2 py-1 rounded-lg border`}
                                                        style={{ backgroundColor: bgColor }}
                                                        onClick={() => toggleModule(category, cleanedModule)}
                                                    >
                                                        {cleanedModule}
                                                    </button>
                                                </div>
                                                <div className="mt-2">
                                                    <span className="text-blue-600 text-sm font-medium">Features:</span>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {relatedFeatures.map((feature) => {
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
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>





                <div className="flex justify-end space-x-4 mt-4">
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
        </div>
    );

};

export default UserRole;
