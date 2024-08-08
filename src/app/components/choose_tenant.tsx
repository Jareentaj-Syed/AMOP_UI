// pages/choose_tenant.tsx
import React, { useEffect, useState,Suspense } from 'react';
import Image from 'next/image';
import { Button, Modal, Spin } from 'antd';
import { Footer } from './footer-nested';
import axios from 'axios';
import { BASE_URL, useAuth } from './auth_context';
import { useRouter } from 'next/navigation';

import { AUTHENTICATION_ROUTES } from './routes/route_constants';
import { getCurrentDateTime } from './header_constants';
import { useLogoStore } from '../stores/logoStore';


const ChooseTenant: React.FC = () => {
 
  const { setSelectedPartner, setPartner,setModules } = useAuth(); // Extract both setters from context
  const [selectedPartnerName, setSelectedPartnerName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // State to manage loading
  const { setLogoUrl,logoUrl } = useLogoStore();
  const router = useRouter();
  const {username, tenantNames, role, setShowPassword, setShowPasswordUpdate, showPasswordUpdate}=useAuth()
  const partners=tenantNames
  const setTitle = useLogoStore((state) => state.setTitle);

  // useEffect(() => {

  // // const pathname = window.location.pathname;
  // // const url = `components/choose_tenant`;
  // // window.location.href = url;
   
  // }, []);
  const handleSelectedPartner = async (partnerName: string) => {
    setSelectedPartnerName(partnerName);
    const data = {
      path: "/get_modules",
      role_name: role,
      username: username,
      tenant_name: partnerName,
      Partner:partnerName,
      request_received_at: getCurrentDateTime()
    };
    setLoading(false)
    try {
      const url = "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management";
      const response = await axios.post(url, { data: data }, {
        headers: {
          'Content-Type': 'application/json'
        }}
      );
  
      if (response.status === 200) {
        setShowPasswordUpdate(false)
        if (!showPasswordUpdate){
           setTitle("Home")
        }
        const parsedData = JSON.parse(response.data.body); // Parse the response body
  
        if (parsedData.error) {
          // Show error popup if there's an error in the response
          Modal.error({
            title: 'Module Fetch Error',
            content: parsedData.error || 'An error occurred while fetching modules. Please try again.',
          });
        } else if (parsedData.flag === false) {
          // Show error popup if the flag is false
          Modal.error({
            title: 'Module Fetch Error',
            content: parsedData.message || 'An error occurred while fetching modules. Please try again.',
          });
        } else {
          const logoUrl_=logoUrl
          setLogoUrl(parsedData?.logo || logoUrl_)
          setSelectedPartner(true);
          setModules(parsedData?.Modules || []); // Set the modules state
          setPartner(partnerName);
          router.push('/dashboard');
        }
      } else {
        console.log('Fetching modules failed:', response.data);
        Modal.error({
          title: 'Module Fetch Error',
          content: response.data.message || 'Fetching modules failed. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error during module fetch:', error);
  
      // Type guard to check if error is an instance of Error
      if (error instanceof Error) {
        Modal.error({
          title: 'Module Fetch Error',
          content: error.message || 'An unexpected error occurred while fetching modules. Please try again.',
         
        });
      } else {
        Modal.error({
          title: 'Module Fetch Error',
          content: 'An unexpected error occurred while fetching modules. Please try again.',
        });
      }
      setLoading(false)
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


  <Suspense fallback={<div className="flex justify-center items-center h-screen"><Spin size="large" /></div>}>
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
    <div className={`grid mb-2 ${partners.length > 10 ? 'grid-cols-2' : 'grid-cols-1'}`}>
      {partners.map((partner) => (
    <Button
    key={partner}
    onClick={() => handleSelectedPartner(partner)}
    className={`flex items-center rounded-l-lg text-md border ${selectedPartnerName === partner ? 'bg-[#E6F7FF] text-[#00C1F1]' : 'bg-transparent text-[#00C1F1]'}`}
    style={{
      width: '160px',
      height: '40px',
      margin: '2px',
      marginRight:'25px',
      marginBottom:'10px',
      transition: 'background-color 0.3s, border-color 0.3s, color 0.3s', // Add color transition
      borderColor: '#00C1F1', // Always #00C1F1
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = '#e1eafc';
      e.currentTarget.style.borderColor = '#00C1F1'; // Set border color to #00C1F1 on hover
      e.currentTarget.style.color = '#00C1F1'; // Set text color to #00C1F1 on hover
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = selectedPartnerName === partner ? '#E6F7FF' : 'transparent';
      e.currentTarget.style.borderColor = '#00C1F1'; // Keep border color as #00C1F1
      e.currentTarget.style.color = selectedPartnerName === partner ? '#00C1F1' : '#00C1F1'; // Keep text color as #00C1F1
    }}
  >
    <div className="flex items-center">
      {partner}
    </div>
  </Button>
  
   
   

      ))}
    </div>
  </div>
</Suspense>



// {/* <Suspense fallback={<div className="flex justify-center items-center h-screen"><Spin size="large" /></div>}>
//   <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
//     <div className="w-[300px] h-[55px] mb-1">
//       <Image
//         src="/amop_logo_header.png"
//         alt="AMOP Core Logo"
//         width={300}
//         height={55}
//       />
//     </div>
//     <h1 className="text-[28px] text-[#00C1F1] font-medium mb-2">Choose Partner</h1>
//     <div className="flex flex-wrap justify-center space-y-4 mb-2">
//       {partners.map((partner) => (
//         <Button
//           key={partner}
//           onClick={() => handleSelectedPartner(partner)}
//           className={`flex items-center rounded-l-lg  mb-1 text-md  ${selectedPartnerName === partner ? 'bg-[#E6F7FF] border-l-4 border-[#00C1F1] text-[#00C1F1]' : 'bg-transparent border-l-4 border-transparent text-[#00C1F1]'}`}
//           style={{
//             width: '150px',
//             height: '45px',
           
//           }}
//         >
//           <div className="flex items-center">
          
//             {partner}
//           </div>
//         </Button>
//       ))}
//     </div>
//   </div>
// </Suspense>  */}





  );
};

export default ChooseTenant;
