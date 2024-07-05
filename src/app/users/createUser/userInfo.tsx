// app/createUser/userInfo.tsx

"use client";
import React from 'react';

const UserInfo: React.FC = () => {
  return (
    <div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-blue-900 bg-blue-100 pl-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700">Partner</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" />
          </div>
          <div>
            <label className="block text-gray-700">First Name</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" />
          </div>
          <div>
            <label className="block text-gray-700">Last Name</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" />
          </div>
          <div>
            <label className="block text-gray-700">Username</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" />
          </div>
          <div>
            <label className="block text-gray-700">Email ID</label>
            <input type="email" className="w-full p-2 border border-gray-300 rounded mt-1" />
          </div>
          <div>
            <label className="block text-gray-700">Mobile No</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" />
          </div>
          <div>
            <label className="block text-gray-700">Role</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input type="password" className="w-full p-2 border border-gray-300 rounded mt-1" />
          </div>
          <div>
            <label className="block text-gray-700">Phone</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2 text-blue-900 bg-blue-100 pl-4">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700">Notifications Enable</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" />
          </div>
          <div>
            <label className="block text-gray-700">Business Name</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" />
          </div>
          <div>
            <label className="block text-gray-700">Locale</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" />
          </div>
          <div>
            <label className="block text-gray-700">Time Zone</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" />
          </div>
          <div>
            <label className="block text-gray-700">Address Line 1</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" />
          </div>
          <div>
            <label className="block text-gray-700">Apt/Suite</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" />
          </div>
          <div>
            <label className="block text-gray-700">City</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" />
          </div>
          <div>
            <label className="block text-gray-700">Address Line 2</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" />
          </div>
          <div>
            <label className="block text-gray-700">Zip</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" />
          </div>
          <div>
            <label className="block text-gray-700">State</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" />
          </div>
          <div>
            <label className="block text-gray-700">Country</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button className="p-2 rounded shadow button">
          Cancel
        </button>
        <button className="p-2 rounded shadow button">
          Save
        </button>
      </div>
    </div>
  );
};

export default UserInfo;
