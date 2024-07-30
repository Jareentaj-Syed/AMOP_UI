import React from 'react';
import { UserIcon, CheckCircleIcon, ReceiptPercentIcon } from '@heroicons/react/24/outline'; // Importing icons from Heroicons
import { total_users,active_users,migrated_users } from '../users_constants';
const ChartsPage: React.FC = () => {
  const totalUsers = total_users;
  const activeUsers = active_users;
  const migratedUsers = migrated_users;

  return (
    <div className="p-2">
    <div className="flex flex-wrap gap-4">
 
      <div className="bg-white p-1 rounded-lg shadow-md flex items-center" style={{ width: '160px', height: '60px' }}>
  <UserIcon className="h-5 w-5 text-gray-600 mr-2" />
  <div className="chart">
    <div className='chart-heading'>
      <h2 className="text-xxs md:text-xs font-semibold text-gray-800 truncate" style={{ maxWidth: '100px' }}>Total Users</h2>
    </div>
    <p className="text-xxs md:text-xs font-bold text-gray-900 mt-1 truncate" style={{ maxWidth: '100px' }}>{totalUsers}</p>
  </div>
</div>
  


<div className="bg-white p-1 rounded-lg shadow-md flex items-center" style={{ width: '160px', height: '60px' }}>
  <CheckCircleIcon className="h-5 w-5 text-gray-600 mr-2" />
  <div className="chart">
    <div className='chart-heading'>
      <h2 className="text-xxs md:text-xs font-semibold text-gray-800 truncate" style={{ maxWidth: '100px' }}>Active Users</h2>
    </div>
    <p className="text-xxs md:text-xs font-bold text-gray-900 mt-1 truncate" style={{ maxWidth: '100px' }}>{activeUsers}</p>
  </div>
</div>

<div className="bg-white p-1 rounded-lg shadow-md flex items-center" style={{ width: '160px', height: '60px' }}>
  <ReceiptPercentIcon className="h-5 w-5 text-gray-600 mr-2" />
  <div className="chart">
    <div className='chart-heading'>
      <h2 className="text-xxs md:text-xs font-semibold text-gray-800 truncate" style={{ maxWidth: '100px' }}>Migrated Users</h2>
    </div>
    <p className="text-xxs md:text-xs font-bold text-gray-900 mt-1 truncate" style={{ maxWidth: '100px' }}>{migratedUsers}</p>
  </div>
</div>

  
    </div>
  </div>
  
  
  );
};

export default ChartsPage;
