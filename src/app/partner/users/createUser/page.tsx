// app/createUser/page.tsx

"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useSidebarStore } from '@/app/stores/navBarStore';



// Dynamically import the UserInfo and TenantInfo components
const UserInfo = dynamic(() => import('./userInfo'));
const TenantInfo = dynamic(() => import('./tenantInfo'));
const UserRole   = dynamic(() => import('./userrole'));

const CreateUser: React.FC = () => {
  const [activeTab, setActiveTab] = useState('userInfo');
  const isExpanded = useSidebarStore((state:any) => state.isExpanded);


  return (
    <div className="">
      <div className={`bg-white shadow-md mb-4 gap-4 tabs ${isExpanded ? 'left-[17%]' : 'left-[112px]'}`}>
        <button 
          className={`tab-headings ${activeTab === 'userInfo' ? 'active-tab-heading' : ''}`}
          onClick={() => setActiveTab('userInfo')}
        >
          User info
        </button>
        <button 
          className={`tab-headings ${activeTab === 'userrole' ? 'active-tab-heading' : ''}`}
          onClick={() => setActiveTab('userrole')}
        >
          Edit User role
        </button>
        <button 
          className={`tab-headings ${activeTab === 'tenantInfo' ? 'active-tab-heading' : ''}`}
          onClick={() => setActiveTab('tenantInfo')}
        >
          Customer info
        </button>
        
      </div>
        <div className="shadow-md p-6 mt-8">
          {activeTab === 'userInfo' && <UserInfo />}
          {activeTab ===  'tenantInfo' && <TenantInfo />}
          {activeTab ===  'userrole' && <UserRole />}
        </div>
    </div>
  );
};

export default CreateUser;
