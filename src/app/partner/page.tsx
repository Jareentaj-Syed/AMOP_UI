
"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useSidebarStore } from '../stores/navBarStore';


// Dynamically import the PartnerInfo, CarrierInfo, and APIInfo components
const PartnerInfo = dynamic(() => import('./partner_info'));
const PartnerAuthentication = dynamic(() => import('./partner_authentication'));
const PartnerModuleAccess = dynamic(() => import('./partner_module_access'));
const CustomerGroups = dynamic(() => import('./customer_groups/page'));
const PartnerUsers = dynamic(() => import('./users/page'));
// const Notification = dynamic(() => import('./notification/page'));
// const PartnerRegestration = dynamic(() => import('./partner_registration'));

const PartnerOnboardingForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState('partnerInfo');
  const isExpanded = useSidebarStore((state:any) => state.isExpanded);


  const switchToCarrierInfoTab = () => {
    setActiveTab('carrierInfo');
  };

  return (
    <div className="">
      <div className={`bg-white shadow-md mb-4 tabs ${isExpanded ? 'left-[17%]' : 'left-[112px]'}`}>
        <button 
          className={`tab-headings ${activeTab === 'partnerInfo' ? 'active-tab-heading' : ''}`}
          onClick={() => setActiveTab('partnerInfo')}
        >
          Partner info
        </button>
        {/* <button 
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
        </button> */}
        <button 
          className={`tab-headings ${activeTab === 'partnerRegistration' ? 'active-tab-heading' : ''}`}
          onClick={() => setActiveTab('partnerRegistration')}
        >
            Partner authentication
        </button>
        <button 
          className={`tab-headings ${activeTab === 'partnermoduleaccess' ? 'active-tab-heading' : ''}`}
          onClick={() => setActiveTab('partnermoduleaccess')}
        >
            Partner module access
        </button>
        <button 
          className={`tab-headings ${activeTab === 'customergroups' ? 'active-tab-heading' : ''}`}
          onClick={() => setActiveTab('customergroups')}
        >
           Customer groups
        </button>
        <button 
          className={`tab-headings ${activeTab === 'partnerusers' ? 'active-tab-heading' : ''}`}
          onClick={() => setActiveTab('partnerusers')}
        >
           Partner users
        </button>
        <button 
          className={`tab-headings ${activeTab === 'notification' ? 'active-tab-heading' : ''}`}
          onClick={() => setActiveTab('notification')}
        >
           Notifications
        </button>
      </div>
      <div className=" mt-[60px] h-[calc(100vh-150px)] container">
        {activeTab === 'partnerInfo' && <PartnerInfo onSubmit={switchToCarrierInfoTab} />}
        {/* {activeTab === 'carrierInfo' && <CarrierInfo />}
        {activeTab === 'apiInfo' && <APIInfo />} */}
        {activeTab === 'partnerRegistration' && <PartnerAuthentication onSubmit={switchToCarrierInfoTab} />}
        {activeTab === 'partnermoduleaccess' && <PartnerModuleAccess/>}
        {activeTab === 'customergroups' && <CustomerGroups/>}
        {activeTab === 'partnerusers' && <PartnerUsers/>}
        {/* {activeTab === 'notification' && <Notification/>} */}

      </div>
    </div>
  );
};

export default PartnerOnboardingForm;
