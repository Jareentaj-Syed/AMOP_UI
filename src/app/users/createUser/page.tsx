// app/createUser/page.tsx

"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '../components/header';
import SideNav from '../components/sideNav';

// Dynamically import the UserInfo and TenantInfo components
const UserInfo = dynamic(() => import('./userInfo'));
const TenantInfo = dynamic(() => import('./tenantInfo'));

const CreateUser: React.FC = () => {
  const [activeTab, setActiveTab] = useState('userInfo');

  return (
    <div className="pt-6 min-h-screen">
      <div className="bg-white shadow-md mb-4 z-99 grid grid-cols-1 md:grid-cols-2 gap-4 tabs">
        <button 
          className={`p-4 ${activeTab === 'userInfo' ? 'active-tab' : 'inactive-tab'}`}
          onClick={() => setActiveTab('userInfo')}
        >
          User Info
        </button>
        <button 
          className={`p-4 ml-4 ${activeTab === 'tenantInfo' ? 'active-tab' : 'inactive-tab'}`}
          onClick={() => setActiveTab('tenantInfo')}
        >
          Tenant Info
        </button>
      </div>
        <div className="bg-white shadow-md p-6 mt-16">
          {activeTab === 'userInfo' ? <UserInfo /> : <TenantInfo />}
        </div>
    </div>
  );
};

export default CreateUser;
