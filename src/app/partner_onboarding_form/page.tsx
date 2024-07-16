
"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useSidebarStore } from '../stores/navBarStore';


// Dynamically import the PartnerInfo, CarrierInfo, and APIInfo components
const PartnerInfo = dynamic(() => import('./partner_info'));
const CarrierInfo = dynamic(() => import('./carrier_info'));
const APIInfo = dynamic(() => import('./api_info'));
const PartnerRegestration = dynamic(() => import('./partner_registration'));

// const PartnerRegestration = dynamic(() => import('./partner_registration'));

const PartnerOnboardingForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState('partnerInfo');
  const isExpanded = useSidebarStore((state:any) => state.isExpanded);


  const switchToCarrierInfoTab = () => {
    setActiveTab('carrierInfo');
  };

  return (
    <div className="">
      <div className={`bg-white shadow-md mb-4 gap-4 tabs ${isExpanded ? 'left-[17%]' : 'left-[112px]'}`}>
        <button 
          className={`p-4 ${activeTab === 'partnerInfo' ? 'active-tab' : 'inactive-tab'}`}
          onClick={() => setActiveTab('partnerInfo')}
        >
          Partner info
        </button>
        <button 
          className={`p-4 ${activeTab === 'carrierInfo' ? 'active-tab' : 'inactive-tab'}`}
          onClick={() => setActiveTab('carrierInfo')}
        >
          Carrier info
        </button>
        <button 
          className={`p-4 ${activeTab === 'apiInfo' ? 'active-tab' : 'inactive-tab'}`}
          onClick={() => setActiveTab('apiInfo')}
        >
          Amop API info
        </button>
        <button 
          className={`p-4 ${activeTab === 'partnerRegistration' ? 'active-tab' : 'inactive-tab'}`}
          onClick={() => setActiveTab('partnerRegistration')}
        >
            Partner Registration
        </button>
      </div>
      <div className=" mt-[60px] mt-[60px] h-[calc(100vh-150px)] container">
        {activeTab === 'partnerInfo' && <PartnerInfo onSubmit={switchToCarrierInfoTab} />}
        {activeTab === 'carrierInfo' && <CarrierInfo />}
        {activeTab === 'apiInfo' && <APIInfo />}
        {activeTab === 'partnerRegistration' && <PartnerRegestration onSubmit={switchToCarrierInfoTab} />}
      </div>
    </div>
  );
};

export default PartnerOnboardingForm;
