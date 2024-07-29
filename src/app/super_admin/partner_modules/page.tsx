"use client";
import React, { useEffect, useState } from 'react';
import ListView from './listView/page';
import { useRouter } from 'next/navigation';
import { DropdownStyles, NonEditableDropdownStyles } from '@/app/components/css/dropdown';
import Select, { SingleValue } from 'react-select';
import UserRole from './user_role/page';
import axios from 'axios';
import { useAuth } from '@/app/components/auth_context';

const editableDrp = DropdownStyles;
const nonEditableDrp = NonEditableDropdownStyles;

// const PartnersData: Record<string, string[]> = {
//   Altaworx: [
//     "Atlantech - AWX",
//     "Castle Point - AWX",
//     "CSV - AWX",
//     "Eight Five Orange - AWX",
//     "Frontier US",
//     "GoTech - AWX",
//     "Local IT - AWX",
//     "Peace Communications-AWX",
//     "Titanium - AWX"
//   ],
//   Dynalink: [
//     "AT&T - Telegence",
//     "Verizon - ThingSpace 4G",
//     "Verizon - ThingSpace 5G"
//   ],
//   For2Fi: [
//     "AT&T - Telegence",
//     "Verizon - ThingSpace IoT",
//     "Verizon - ThingSpace PN"
//   ]
// };



const Page: React.FC = () => {
  const [partnersData, setPartnersData] = useState<Record<string, string[]> | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url =  `https://zff5caoge3.execute-api.ap-south-1.amazonaws.com/dev/get_partner_info `;
        const data = {
          tenant_name: partner || "default_value",
          username: username,
          path: "/get_superadmin_info",
          role_name: role,
          sub_module: "Partner Modules",
          flag:"withoutparameters"
        };

        const response = await axios.post(url, { data });
        console.log(response.data);
        const resp = JSON.parse(response.data.body);
        console.log(resp);
        console.log("Environment:", resp.data.partners_and_sub_partners);
        setPartnersData(resp.data.partners_and_sub_partners)
        const PartnersData: Record<string, string[]> = resp.data.partners_and_sub_partners
      

      } catch (err) {
        console.error(err);
        setShowUserRole(false);
      }
    };

    fetchData();
  }, []);
  const PartnersData= partnersData || {}
  const Partneroptions = Object.keys(PartnersData).map(partner => ({ value: partner, label: partner }));
  const [selectedPartner, setSelectedPartner] = useState<string>('');
  const [selectedSubPartner, setSelectedSubPartner] = useState<string>('');
  const [showUserRole, setShowUserRole] = useState<boolean>(false);
  const [subPartners, setSubPartners] = useState<string[]>([]);
  const [rolesData, setRolesData] = useState(null);
  const [moduleData, setModuleData] = useState(null);
  
  const subPartnersoptions = subPartners.map(subPartner => ({ value: subPartner, label: subPartner }));
  const subPartnersnoOptions = [{ value: '', label: 'No sub-partners available' }];
  const fetchData = async (selectedPartner: string, selectedSubPartner: string) => {
    try {
      const url = `https://zff5caoge3.execute-api.ap-south-1.amazonaws.com/dev/get_partner_info`;
      const data = {
        tenant_name: partner || "default_value",
        username: username,
        path: "/get_superadmin_info",
        role_name: role,
        sub_module: "Partner Modules",
        flag:"withparameters",
        partner:selectedPartner,
        sub_partner: selectedSubPartner // Send selected sub-partner
      };

      const response = await axios.post(url, { data });
      console.log(response.data);
      const resp = JSON.parse(response.data.body);
      console.log(resp);
     
      console.log("Environment:", resp.data.partners_and_sub_partners);
      console.log("role data:",resp.data.roles_data)
      console.log("module data:",resp.data.role_module_data)
      setRolesData(resp.data.roles_data);
      setModuleData(resp.data.role_module_data);
      setShowUserRole(true);
    } catch (err) {
      console.error(err);
      setShowUserRole(false);
    }
  };
  const handlePartnerChange = (selectedOption: { value: string; label: string } | null) => {
    if (selectedOption) {
      const partner = selectedOption.value;
      setSelectedPartner(partner);
      setSubPartners(PartnersData[partner] || []);
      
      // Call fetchData with the selected partner
      fetchData(partner, selectedSubPartner);
    } else {
      setSelectedPartner('');
      setSubPartners([]);
    }
  };

  const handleSubpartnerChange = (selectedOption: { value: string; label: string } | null) => {
    if (selectedOption) {
      const subPartner = selectedOption.value;
      setSelectedSubPartner(subPartner);

      // Call fetchData with the selected sub-partner
      fetchData(selectedPartner, subPartner);
    } else {
      setSelectedSubPartner('');
    }
  };

  const { username, partner, role } = useAuth();


  return (
    <div className='bg-gray-50'>
      <div className='p-4 pl-2 pr-2'>
        <h3 className="tabs-sub-headings">Partner Modules</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pt-1">
        <div>
          <label className="field-label">Partner</label>
          <Select
            value={Partneroptions.find(option => option.value === selectedPartner) || null}
            onChange={handlePartnerChange}
            options={Partneroptions}
            styles={editableDrp}
          />
        </div>
        <div>
          <label className="field-label">Sub Partner</label>
          <Select
            onChange={handleSubpartnerChange}
            options={subPartners.length > 0 ? subPartnersoptions : subPartnersnoOptions}
            className="mt-1"
            styles={editableDrp}
          />
        </div>
      </div>
      {showUserRole &&   <UserRole rolesData={rolesData} moduleData={moduleData} />}
    </div>
  );
};

export default Page;
