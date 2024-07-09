
"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useSidebarStore } from '../stores/navBarStore';


// Dynamically import the PartnerInfo, CarrierInfo, and APIInfo components
const PartnerInfo = dynamic(() => import('./partner_info'));
const CarrierInfo = dynamic(() => import('./carrier_info'));
const APIInfo = dynamic(() => import('./api_info'));

const CreateUser: React.FC = () => {
  const [activeTab, setActiveTab] = useState('partnerInfo');
  const isExpanded = useSidebarStore((state:any) => state.isExpanded);


  const switchToCarrierInfoTab = () => {
    setActiveTab('carrierInfo');
  };

  return (
    <div className="">
      <div className={`bg-white shadow-md mb-4 z-99 gap-4 tabs ${isExpanded ? 'left-[17.2%]' : 'left-[112px]'}`}>
        <button 
          className={`p-4 ${activeTab === 'partnerInfo' ? 'active-tab' : 'inactive-tab'}`}
          onClick={() => setActiveTab('partnerInfo')}
        >
          Partner Info
        </button>
        <button 
          className={`p-4 ${activeTab === 'carrierInfo' ? 'active-tab' : 'inactive-tab'}`}
          onClick={() => setActiveTab('carrierInfo')}
        >
          Carrier Info
        </button>
        <button 
          className={`p-4 ${activeTab === 'apiInfo' ? 'active-tab' : 'inactive-tab'}`}
          onClick={() => setActiveTab('apiInfo')}
        >
          Amop API Info
        </button>
      </div>
      <div className="bg-white p-4">
        {activeTab === 'partnerInfo' && <PartnerInfo onSubmit={switchToCarrierInfoTab} />}
        {activeTab === 'carrierInfo' && <CarrierInfo />}
        {activeTab === 'apiInfo' && <APIInfo />}
      </div>
    </div>
  );
};

export default CreateUser;
