"use client";
import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid';
import React, { useState, useEffect } from 'react';
import Select, { SingleValue, StylesConfig } from 'react-select';
import { NonEditableDropdownStyles, DropdownStyles } from '@/app/components/css/dropdown';
import { useUserStore } from './createUserStore';
import { usePartnerStore } from '../../partnerStore';
import axios from 'axios';
import { useAuth } from '@/app/components/auth_context';
import { getCurrentDateTime } from '@/app/components/header_constants';
import { Modal, notification } from 'antd';
// import { OptionType } from 'dayjs';

interface ExcelData {
    [key: string]: {
        Module: string[];
        Feature: {
            [key: string]: string[];
        };
    };
}



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

type OptionType = {
    value: string;
    label: string;
};

type Role = {
    rolename: string;
};

const editableDrp = DropdownStyles;
const nonEditableDrp = NonEditableDropdownStyles;


interface UserRoleProps {
    rowData?: any;
}

const UserRole: React.FC<UserRoleProps> = ({ rowData }) => {
    const [Selectedpartner, setPartner] = useState<string>('');
    const [map, setMap] = useState<ExcelData>({});
    const { username, partner:userPartner } = useAuth();

    const [role, setRole] = useState<SingleValue<OptionType>>(null);
    const [selectedModules, setSelectedModules] = useState<{ [key: string]: string[] }>({});
    const [selectedFeatures, setSelectedFeatures] = useState<{ [key: string]: string[] }>({});
    const [moduleColors, setModuleColors] = useState<{ [key: string]: string }>({});
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    //Show Modal
  const [showModal, setShowModal] = useState(false);

  const { partnerData } = usePartnerStore.getState();  
  const partnerModuleData=partnerData["Partner module access"]
  console.log("Partner module access",partnerModuleData)
    const {
        tenant,
        role_name,
        sub_tenant,
        setTenant,
        setRoleName,
        setSubTenant,
        user_name
    } = useUserStore();

    useEffect(() => {
        if (rowData) {
            setPartner(rowData['tenant_name'] ? rowData['tenant_name'] : null);
            setRole(rowData['role'] ? rowData['role'] : null);
        }
    }, [rowData]);


    console.log("username", user_name)


   //Clearing the data afer the successful message
   const handleClearFields = () => {
    setPartner('');
    setRole(null);
    setSelectedModules({});
    setSelectedFeatures({});
    setMap({});
    setErrorMessages([]);
  };
    
    
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
            // If the module is being deselected, also deselect its features
            setSelectedFeatures((prevFeatures) => ({
                ...prevFeatures,
                [category]: (prevFeatures[category] || []).filter(
                    (feature) => !features.includes(feature.replace('-active', '')) // Remove related features
                ),
            }));
        }

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
                    ? features.filter((f) => f !== feature)
                    : [...features, feature]
            };
        });
    };


    
  const messageStyle = {
    fontSize: '14px',  // Adjust font size
    fontWeight: 'bold', // Make the text bold
    padding: '16px',
    // Add padding
  };

    
    useEffect(() => {
        if (role_name) {
            // Create your selectedOption to match the expected structure
            const selectedOption: OptionType = {
                value: role_name,
                label: role_name // Assuming label is the same as value; adjust as needed
            };
            handleSetRole(selectedOption);
        }
    }, [role_name]);


 
    const handleSubmit =async ()=> {
        

        scrollToTop()
        const errors: string[] = [];
    
        if (!role) {
            errors.push('Role is required.');
        }
    
        setErrorMessages(errors);
    
        if (errors.length === 0) {
            const formattedData: { [key: string]: any } = {
                [role!.value]: {}
            };
    
            console.log("Selected Modules:", selectedModules);
            console.log("Selected Features:", selectedFeatures);
    
            // Loop through selectedModules and selectedFeatures
            Object.keys(selectedModules).forEach(category => {
                const selectedModulesForCategory = selectedModules[category];
                const selectedFeaturesForCategory = selectedFeatures[category] || [];
    
                formattedData[role!.value][category] = {
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
                        formattedData[role!.value][category].Feature[module] = filteredFeatures;
    
                        // Log the filtered features for debugging
                        console.log(`Filtered features for ${module}:`, filteredFeatures);
                    } else {
                        console.log(`No features found for module: ${module} in category: ${category}`);
                    }
                });
            });
    
            console.log("Formatted Data:", formattedData);

            const Changed_data ={
                "Selected role": role_name,
                "Selected Partner": tenant,
                "data": formattedData,
                "Username": user_name,
                "is_active":true,
                "is_deleted": false
            }

            try {
                const url =
                  "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management";
                const data = {
                  tenant_name: userPartner || "default_value",
                  username: username,
                  path: "/update_partner_info",
                  "parent_module": "Partner",
                  "module_name": "Partner Users",
                  
                  action: "update",
                  changed_data: Changed_data,
                  request_received_at: getCurrentDateTime(),
                  Partner:userPartner
                };
                const response = await axios.post(url, { data });
                const parsedData = JSON.parse(response.data.body);
          if (response && response.data.statusCode===200) {
            // Show success message
            notification.success({
              message: 'Success',
              description: 'Successfully saved the form',
              style: messageStyle,
              placement: 'top', // Apply custom styles here
            });
            handleClearFields(); // Clear all fields
          }
          else{
            Modal.error({
              title: 'Submit Error',
              content: parsedData.message || 'An error occurred while submitting the form. Please try again.',
              centered: true,
            });
          }
              } catch (err) {
                console.error("Error fetching data:", err);
              }
        } else {
            console.log("Errors:", errors);
        }
        // setSelectedModules({});
        // setSelectedFeatures({});
    };
    //Handling modal save
  const handleConfirmSave = () => {
    handleSubmit();
    setShowModal(false);
  };
//Handling modal cancel
  const handleCancelSave = () => {
    setShowModal(false);
  };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'auto' // Optional: Smooth scroll animation
        });
    };

    return (
        <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className='field-label'>Partner</label>
                    <input
                        type="text"
                        value={tenant}
                        className="non-editable-input"
                        onChange={(e) => setRoleName(e.target.value)} // Update role_name state
                    />
                </div>
                <div>
                    <label className="field-label">Role</label>
                    <input
                        type="text"
                        value={role_name}
                        className="non-editable-input"
                    />
                </div>
            </div>
            {role_name && (
    <>
        <h3 className="tabs-sub-headings">Module Info</h3>
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
    </>
)}

            <div className="flex justify-end space-x-4">
                {/* <button className="cancel-btn">
                    <XMarkIcon className="h-5 w-5 text-black-500 mr-2" />
                    <span>Cancel</span>
                </button> */}
                <button
                    className="save-btn"
                    onClick={()=>setShowModal(true)}
                >
                    <CheckIcon className="h-5 w-5 text-black-500 mr-2" />
                    <span>Submit</span>
                </button>
            </div>
            {showModal && (
        <Modal
          title="Confirmation"
          open={showModal}
          onOk={handleConfirmSave}
          onCancel={handleCancelSave}
          centered
        >
          <p>Are you sure you want to submit the data?</p>
        </Modal>
      )}
        </div>
    );
};

export default UserRole;