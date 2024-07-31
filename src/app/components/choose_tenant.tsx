// pages/choose_tenant.tsx
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from 'antd';
import { Footer } from './footer-nested';
import axios from 'axios';
import { BASE_URL, useAuth } from './auth_context';
import { useRouter } from 'next/navigation';

import { AUTHENTICATION_ROUTES } from './routes/route_constants';


const ChooseTenant: React.FC = () => {
 
  const { setSelectedPartner, setPartner,setModules } = useAuth(); // Extract both setters from context
  const [selectedPartnerName, setSelectedPartnerName] = useState<string | null>(null);
  const router = useRouter();
  const {username, tenantNames, role}=useAuth()
  const partners=tenantNames
  const handleSelectedPartner = async (partnerName: string) => {
    setSelectedPartnerName(partnerName)
    const data = {
      path:"/get_modules",
      role_name: role,
      username: username,
      tenant_name: partnerName
    };
   
    try {
   
      const url = "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management";
     
   
      const response = await axios.post(url, { data: data }, {
        headers: {
          'Content-Type': 'application/json'
        }}
      );
      if (response.status === 200) {
      
        setSelectedPartner(true)
        const parsedData = JSON.parse(response.data.body); // Parse the response body
        setModules(parsedData.Modules); // Set the modules state
        setPartner(partnerName);
        
      } else {
        console.log('Login failed:', response.data);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
    router.push('/partner');
    
    
  };
  

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="w-[300px] h-[55px] mb-1">
        <Image
          src="/amop_logo_header.png"
          alt="AMOP Core Logo"
          width={300}
          height={55}
        />
      </div>
      <h1 className="text-[28px] text-[#00C1F1] font-medium mb-2">Choose Partner</h1>
      <div className="space-y-[1px] flex flex-col mb-2">
        {partners.map((partner) => (
          <Button
            key={partner}
            onClick={() => handleSelectedPartner(partner)}
            className="rounded-full"
            style={{
              width: '200px',
              height: '35px',
              borderColor: selectedPartnerName === partner ? 'black' : '#00C1F1',
              borderWidth: selectedPartnerName === partner ? '2px' : '1px',
              color: '#00C1F1',
            }}
          >
            {partner}
          </Button>
        ))}
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default ChooseTenant;
