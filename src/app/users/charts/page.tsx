// pages/charts.tsx

"use client";
import React from 'react';

const ChartsPage: React.FC = () => {
  const totalUsers = 1500;
  const activeUsers = 750;
  const migratedUsers = 340;

  return (
    <div className="p-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Users Card */}
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <div className="ml-4  chart">
            <div className='chart-heading'>
              <h2 className="text-lg font-semibold text-gray-800">Total Users</h2>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{totalUsers}</p>
          </div>
        </div>

        {/* Active Users Card */}
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <div className="ml-4 chart">
            <div className='chart-heading'>
              <h2 className="text-lg font-semibold text-gray-800">Active Users</h2>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{activeUsers}</p>
          </div>
        </div>

        {/* Migrated Users Card */}
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <div className="ml-4 chart">
            <div className='chart-heading'>
              <h2 className="text-lg font-semibold text-gray-800">Migrated Users</h2>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{migratedUsers}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsPage;
