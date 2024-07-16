
"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useSidebarStore } from '@/app/stores/navBarStore';


const CarrierInfo = dynamic(() => import('./carrier_info'));
const APIInfo = dynamic(() => import('./api_info'));



const PartnerInfoForm: React.FC = () => {
    const [activeTab, setActiveTab] = useState('carrierInfo');
    const isExpanded = useSidebarStore((state:any) => state.isExpanded);
  
  
    return (
      <div className="">
        <div className={`bg-white shadow-md mb-4 gap-4 tabs ${isExpanded ? 'left-[17%]' : 'left-[112px]'}`}>
         
          <button 
            className={`tab-headings ${activeTab === 'carrierInfo' ? 'active-tab-heading' : ''}`}
            onClick={() => setActiveTab('carrierInfo')}
          >
            Carrier info
          </button>
          <button 
            className={`tab-headings ${activeTab === 'apiInfo' ? 'active-tab-heading' : ''}`}
            onClick={() => setActiveTab('apiInfo')}
          >
            Amop API info
          </button>
         
        </div>
        <div className=" mt-[60px] mt-[60px] h-[calc(100vh-150px)] container">
          {activeTab === 'carrierInfo' && <CarrierInfo />}
          {activeTab === 'apiInfo' && <APIInfo />}
        </div>
      </div>
    );
  };
  
  export default PartnerInfoForm;