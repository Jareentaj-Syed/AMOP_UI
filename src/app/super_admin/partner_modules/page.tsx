
"use client"
import React, { useState } from 'react';
import ListView from './listView/page';
import { useRouter } from 'next/navigation';
import { partnerCarrierData, subPartnersData } from '@/app/constants/partnercarrier';
import { DropdownStyles, NonEditableDropdownStyles } from '@/app/components/css/dropdown';
import Select, { SingleValue } from 'react-select';
import UserRole from './user_role/page';
const editableDrp = DropdownStyles;
const nonEditableDrp = NonEditableDropdownStyles;
const Partneroptions = Object.keys(partnerCarrierData).map(partner => ({ value: partner, label: partner }));
const Page: React.FC = () => {
  const [selectedPartner, setSelectedPartner] = useState<string>('');
  const [subPartners, setSubPartners] = useState<string[]>([]);
  // const subPartnersoptions = subPartners.map(subPartner => ({ value: subPartner, label: subPartner }));
  const subPartnersoptions =subPartnersData['Altaworx'].map(subPartner => ({ value: subPartner, label: subPartner })) ;
  const subPartnersnoOptions = [{ value: '', label: 'No sub-partners available' }];

  const handlePartnerChange = (selectedOption: { value: string; label: string } | null) => {
    if (selectedOption) {
      const partner = selectedOption.value;
      setSelectedPartner(partner);

     
    } else {
      setSelectedPartner('');

      setSubPartners([]);
    }
  };

  return (
    <div className='bg-gray-50'>
      <div className='p-4 pl-2 pr-2'>
      <h3 className="tabs-sub-headings">Partner Modules</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pt-1">
        <div>
          <label className="field-label">Partner</label>
          <Select
            defaultValue={[Partneroptions[0]]}
          
            value={[Partneroptions[0]]}
            onChange={handlePartnerChange}
            options={Partneroptions}
            styles={nonEditableDrp}
          />
        </div>
        <div>
          <label className="field-label">Sub Partner</label>
          <Select
            defaultValue={[subPartnersoptions[1]]}
            
            value={[subPartnersoptions[1]]}
            options={subPartnersoptions}
            // options={subPartners.length > 0 ? subPartnersoptions : subPartnersnoOptions}
            className="mt-1"
            styles={nonEditableDrp}
          />
        </div>
      </div>
      <UserRole />
    </div>
  );
};

export default Page;
