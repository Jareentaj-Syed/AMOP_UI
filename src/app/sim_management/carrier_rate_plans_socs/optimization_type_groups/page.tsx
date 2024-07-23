
"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useSidebarStore } from '@/app/stores/navBarStore';


const OptimizationGroup = dynamic(() => import('./optimization_group'));
const RatePlanType = dynamic(() => import('./rate_plan_type'));
const CustomerFeatureCodes = dynamic(() => import('./customer_feature_codes'));




const OptimizationTypeGroups: React.FC = () => {
    const [activeTab, setActiveTab] = useState('optimizationGroup');
    const isExpanded = useSidebarStore((state:any) => state.isExpanded);
  
  
    return (
      <div className="">
        <div className={`bg-white shadow-md mb-4 tabs ${isExpanded ? 'left-[17%]' : 'left-[112px]'}`}>
         
          <button 
            className={`tab-headings ${activeTab === 'optimizationGroup' ? 'active-tab-heading' : ''}`}
            onClick={() => setActiveTab('optimizationGroup')}
          >
            Optimization Group
          </button>
          <button 
            className={`tab-headings ${activeTab === 'ratePlanType' ? 'active-tab-heading' : ''}`}
            onClick={() => setActiveTab('ratePlanType')}
          >
            RatePlan Type
          </button>
          <button 
            className={`tab-headings ${activeTab === 'customerFeatureCodes' ? 'active-tab-heading' : ''}`}
            onClick={() => setActiveTab('customerFeatureCodes')}
          >
            Customer Feature Codes
          </button>
         
        </div>
        <div className="h-[calc(100vh-150px)] pt-[70px] container">
          {activeTab === 'optimizationGroup' && <OptimizationGroup />}
          {activeTab === 'ratePlanType' && <RatePlanType />}
          {activeTab === 'customerFeatureCodes' && <CustomerFeatureCodes />}
        </div>
      </div>
    );
  };
  
  export default OptimizationTypeGroups;