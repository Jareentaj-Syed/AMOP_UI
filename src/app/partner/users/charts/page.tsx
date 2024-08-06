import React from 'react';
import { UserIcon, CheckCircleIcon, ReceiptPercentIcon } from '@heroicons/react/24/outline';
import { usePartnerStore } from '../../partnerStore';
const ChartsPage: React.FC = () => {
  const { partnerData } = usePartnerStore.getState();
  const usersData = partnerData["Partner users"] || {};

  const totalUsers = usersData?.data?.["Partner users"]?.total_count || 0;
  const activeUsers = usersData?.data?.["Partner users"]?.active_user_count || 0;
  const migratedUsers = usersData?.data?.["Partner users"]?.migrated_count || 0;

  return (
    <div className="py-2 px-6 w-full">
      <div className="grid grid-cols-3 gap-4 md:grid-cols-3 flex flex-wrap">

        <div className="chart">
          <div className="">
            <div className='flex'>
              <UserIcon className="h-6 w-6 text-gray-600 mr-2" />
              <h2 className="chart-heading">Total Users</h2>
            </div>
            <p className="chart-count">{totalUsers}</p>
          </div>
        </div>


        <div className="chart">
          <div>
            <div className='flex'>
              <CheckCircleIcon className="h-6 w-6 text-gray-600 mr-2" />
              <h2 className="chart-heading">Active Users</h2>
            </div>
            <p className="chart-count">{activeUsers}</p>
          </div>
        </div>

        <div className="chart">
          <div className="">
            <div className='flex'>
              <ReceiptPercentIcon className="h-6 w-6 text-gray-600 mr-2" />
              <h2 className="chart-heading">Migrated Users</h2>
            </div>
            <p className="chart-count">{migratedUsers}</p>
          </div>
        </div>


      </div>
    </div>


  );
};

export default ChartsPage;
