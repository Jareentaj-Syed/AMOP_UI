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
    <div className="pt-2">
      <div className={`bg-white shadow-md mb-4 gap-4 tabs ${isExpanded ? 'left-[17%]' : 'left-[112px]'}`}>
        <button 
          className={`p-4 ${activeTab === 'userInfo' ? 'active-tab' : 'inactive-tab'}`}
          onClick={() => setActiveTab('userInfo')}
        >
          User info
        </button>
        <button 
          className={`p-4 ${activeTab === 'userrole' ? 'active-tab' : 'inactive-tab'}`}
          onClick={() => setActiveTab('userrole')}
        >
          User role
        </button>
        <button 
          className={`p-4 ml-4 ${activeTab === 'tenantInfo' ? 'active-tab' : 'inactive-tab'}`}
          onClick={() => setActiveTab('tenantInfo')}
        >
          Tenant info
        </button>
        
      </div>
        <div className="shadow-md p-6 ">
          {activeTab === 'userInfo' && <UserInfo />}
          {activeTab ===  'tenantInfo' && <TenantInfo />}
          {activeTab ===  'userrole' && <UserRole />}
        </div>
    </div>
  );
};

export default CreateUser;
