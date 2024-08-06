"use client";
import React, { useEffect, useState } from 'react';
import ListView from './listView/page';
import { useRouter } from 'next/navigation';
import { DropdownStyles, NonEditableDropdownStyles } from '@/app/components/css/dropdown';
import Select, { SingleValue } from 'react-select';
import UserRole from './user_role/page';
import axios from 'axios';
import { useAuth } from '@/app/components/auth_context';
import { Modal, Spin } from 'antd';
import { useLogoStore } from "@/app/stores/logoStore";
import { getCurrentDateTime } from '@/app/components/header_constants';

const editableDrp = DropdownStyles;
const nonEditableDrp = NonEditableDropdownStyles;

const Page: React.FC = () => {
  const [partnersData, setPartnersData] = useState<Record<string, string[]> | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<string>('');
  const [selectedSubPartner, setSelectedSubPartner] = useState<string>('');
  const [showUserRole, setShowUserRole] = useState<boolean>(false);
  const [subPartners, setSubPartners] = useState<string[]>([]);
  const [rolesData, setRolesData] = useState(null);
  const [moduleData, setModuleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [headers,setHeaders]=useState<any[]>([]);
  const [headerMap,setHeaderMap]=useState<any>({});
  const [rolesDataHeaders, setRolesDataHeaders] =useState<any[]>([]);
  const [moduleDataHeaders, setModuleDataHeaders] = useState<any[]>([]);
  const { username, partner, role, setSelectedPartnerModule, setSelectedEnvironment } = useAuth();
  const [rolesDataHeadersMap, setRolesDataHeadersMap] =useState<any>({});
  const [moduleDataHeadersMap, setModuleDataHeadersMap] = useState<any>({});
  const [partnerMenuIsOpen, setPartnerMenuIsOpen] = useState(false);
  const [subPartnerMenuIsOpen, setSubPartnerMenuIsOpen] = useState(false);
  const setTitle = useLogoStore((state) => state.setTitle);
  const title = useLogoStore((state) => state.title);
  useEffect(() => {
    // setTitle("Super Admin")
    if(title!="Super Admin"){
        setLoading(true)
    }
},[title])

  useEffect(() => {

    fetchInitialData();
  }, []);
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const url = `https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management`;
      const data = {
        tenant_name: partner || "default_value",
        username: username,
        path: "/get_superadmin_info",
        role_name: role,
        sub_module: "Partner Modules",
        flag: "withoutparameters",
        request_received_at: getCurrentDateTime(),
        Partner:partner,
      };
  
      const response = await axios.post(url, { data });
      const resp = JSON.parse(response.data.body);
      console.log(resp)
      // Check if the flag is false
      if (resp.flag === false) {
        Modal.error({
          title: 'Data Fetch Error',
          content: resp.message || 'An error occurred while fetching initial data. Please try again.',
          centered: true,
        });
        return; // Exit early if there's an error
      }
  
      console.log("Environment:", resp.data.partners_and_sub_partners);
      setPartnersData(resp.data.partners_and_sub_partners);
      console.log("Roles:", resp.headers_map.Roles);
      console.log("Modules:", resp.headers_map.Modules);
      // setRolesDataHeaders(resp.headers_map.Roles)
      // setModuleDataHeaders(resp.headers_map.Modules)
    } catch (err) {
      console.error("Error fetching initial data:", err);
      Modal.error({
        title: 'Data Fetch Error',
        content: err instanceof Error ? err.message : 'An unexpected error occurred while fetching initial data. Please try again.',
        centered: true,
      });
    } finally {
      setLoading(false);
    }
  };
  
  type HeaderMap = Record<string, [string, number]>;

  const sortHeaderMap = (headerMap: HeaderMap): HeaderMap => {
    // Convert the object to an array of [key, value] pairs
    const entries = Object.entries(headerMap) as [string, [string, number]][];

    // Sort the array based on the second item of each value
    entries.sort((a, b) => a[1][1] - b[1][1]);

    // Convert the sorted array back to an object
    return Object.fromEntries(entries) as HeaderMap;
  }// Add dependencies if necessary

  const PartnersData = partnersData || {};
  const Partneroptions = Object.keys(PartnersData).map(partner => ({ value: partner, label: partner }));
  const subPartnersoptions = subPartners.map(subPartner => ({ value: subPartner, label: subPartner }));
  const subPartnersnoOptions = [{ value: '', label: 'No sub-partners available' }];

  const fetchData = async (selectedPartner: string, selectedSubPartner: string) => {
    setLoading(true);
    try {
      const url = `https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management`;
      const data = {
        tenant_name: partner || "default_value",
        username: username,
        path: "/get_superadmin_info",
        role_name: role,
        sub_module: "Partner Modules",
        flag: "withparameters",
        Selected_Partner: selectedPartner,
        sub_partner: selectedSubPartner,
        modules:["role partner module","partner module"],
        request_received_at: getCurrentDateTime(),
        Partner:partner,
         // Send selected sub-partner
      };
  
      const response = await axios.post(url, { data });
      const resp = JSON.parse(response.data.body);
      console.log(resp)
    
      // Check if the flag is false
      if (resp.flag === false) {
        Modal.error({
          title: 'Data Fetch Error',
          content: resp.message || 'An error occurred while fetching partner modules. Please try again.',
          centered: true,
        });
        setShowUserRole(false);
        return; // Exit early if there's an error
      }
  
      console.log("Environment:", resp.data.partners_and_sub_partners);
      console.log("role data:", resp.data.roles_data);
      console.log("module data:", resp.data.role_module_data);
      
      setRolesData(resp.data.roles_data);
      setModuleData(resp.data.role_module_data);
      console.log(resp.headers_map["partner module"]["header_map"])
      console.log(resp.headers_map["role partner module"]["header_map"])
      const headerMap1=resp.headers_map["role partner module"]["header_map"]
      const headerMap2=resp.headers_map["partner module"]["header_map"]
      const sortedheaderMap1=sortHeaderMap(headerMap1)
      const sortedheaderMap2=sortHeaderMap(headerMap2)
      setRolesDataHeadersMap(sortedheaderMap1)
      setModuleDataHeadersMap(sortedheaderMap2)
      const headers1=Object.keys(sortedheaderMap1)
      const headers2=Object.keys(sortedheaderMap2)
  
      // setHeaders(headers)
      // setHeaderMap(headerMap)
   
    
      setLoading(false)
      setModuleDataHeaders(headers2)

      setRolesDataHeaders(headers1)
      setShowUserRole(true);
    } catch (err) {
      console.error("Error fetching data:", err);
      Modal.error({
        title: 'Data Fetch Error',
        content: err instanceof Error ? err.message : 'An unexpected error occurred while fetching data. Please try again.',
        centered: true,
      });
      setShowUserRole(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const handleScroll = () => {
     setPartnerMenuIsOpen(false)
     setSubPartnerMenuIsOpen(false)
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  

  const handlePartnerChange = (selectedOption: { value: string; label: string } | null) => {
    if (selectedOption) {
      const partner = selectedOption.value;
      setSelectedPartner(partner);
      setSelectedPartnerModule(partner)
      setPartnerMenuIsOpen(false)
      setSubPartners(PartnersData[partner] || []);
    } else {
      setSelectedPartner('');
      setSubPartners([]);
    }
  };
  
  const handleSubpartnerChange = (selectedOption: { value: string; label: string } | null) => {
    if (selectedOption) {
      const subPartner = selectedOption.value;
      setSelectedSubPartner(subPartner);
      setSelectedEnvironment(subPartner)
      setSubPartnerMenuIsOpen(false)
    } else {
      setSelectedSubPartner('');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }


  const handlePartnerBlur = () => {
    setPartnerMenuIsOpen(false);
  };

  const handlePartnerFocus = () => {
    setPartnerMenuIsOpen(true);
  };

  const handleSubPartnerBlur = () => {
    setSubPartnerMenuIsOpen(false);
  };

  const handleSubPartnerFocus = () => {
    setSubPartnerMenuIsOpen(true);
  };
  return (
    <div className='bg-gray-50'>
      <div className='p-3 pl-2 pr-2'>
        <h3 className="tabs-sub-headings">Partner Modules</h3>
      </div>
      <div className="gap-4 p-4 pt-1">
  <div className="flex items-center gap-4">
    <div className="w-[320px]">
      <label className="field-label">Partner</label>
      <Select
            value={Partneroptions.find(option => option.value === selectedPartner) || null}
            onChange={handlePartnerChange}
            options={Partneroptions}
            menuIsOpen={partnerMenuIsOpen}
            onFocus={handlePartnerFocus}
            onBlur={handlePartnerBlur}
            blurInputOnSelect
            styles={editableDrp}
          />
    </div>
    <div className="w-[320px]">
      <label className="field-label">Sub Partner</label>
      <Select
            value={subPartnersoptions.find(option => option.value === selectedSubPartner) || null}
            onChange={handleSubpartnerChange}
            options={subPartners.length > 0 ? subPartnersoptions : subPartnersnoOptions}
            menuIsOpen={subPartnerMenuIsOpen}
            onFocus={handleSubPartnerFocus}
            onBlur={handleSubPartnerBlur}
            blurInputOnSelect
            className="mt-1"
            styles={editableDrp}
          />
    </div>
    <button
      className='save-btn mt-7'
      type="button" // Change to "button" to prevent default form submission
      onClick={() => fetchData(selectedPartner, selectedSubPartner)}
    >
      Submit
    </button>
  </div>
</div>

      {showUserRole && <UserRole rolesData={rolesData} moduleData={moduleData} rolesHeaders={rolesDataHeaders} moduleHeaders={moduleDataHeaders} rolesHeadersMap={rolesDataHeadersMap} moduleHeadersMap={moduleDataHeadersMap}/>}
    </div>
  );
};

export default Page;
