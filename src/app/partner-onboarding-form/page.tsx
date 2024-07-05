// "use client"
// import React, { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';
// import { PencilIcon, TrashIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

// interface ExcelData {
//   // Define the structure of your Excel data here
// }

// const PartnerOnboardingForm: React.FC = () => {
//   const environment_options = ['Sandbox', 'QA', 'UAT', 'Prod'];
//   const [logoError, setLogoError] = useState<string | null>(null);
//   const [carrierData, setCarrierData] = useState<ExcelData[]>([]);
//   const [apiData, setApiData] = useState<ExcelData[]>([]);

//   useEffect(() => {
//     const fetchExcelData = async (url: string) => {
//       const response = await fetch(url);
//       const arrayBuffer = await response.arrayBuffer();
//       const data = new Uint8Array(arrayBuffer);
//       const workbook = XLSX.read(data, { type: 'array' });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];
//       return XLSX.utils.sheet_to_json<ExcelData>(worksheet);
//     };

//     const fetchData = async () => {
//       const [carrierData, apiData] = await Promise.all([
//         fetchExcelData('/carrier_info.xlsx'),
//         fetchExcelData('/carrier_info.xlsx')
//       ]);

//       setCarrierData(carrierData);
//       setApiData(apiData);
//     };

//     fetchData();
//   }, []);

//   const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const validTypes = ['image/png', 'image/jpeg'];
//       if (!validTypes.includes(file.type)) {
//         setLogoError('Only .png and .jpg files are allowed.');
//       } else {
//         setLogoError(null);
//         // handle the valid file upload here
//       }
//     }
//   };

//   return (
//     <div className='p-6'>
//       <div className="mb-6  mt-4">
//         <h3 className="text-lg font-semibold mb-2 text-blue-900 bg-gray-300 pl-4 mb-4">Partner Info</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           <div>
//             <label className="block text-gray-700">Partner Name</label>
//             <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" />
//           </div>
//           <div>
//             <label className="block text-gray-700">Sub Partner Name</label>
//             <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" />
//           </div>
//           <div>
//             <label className="block text-gray-700">Email ids</label>
//             <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" />
//           </div>
//           <div>
//             <label className="block text-gray-700">Environment</label>
//             <select className="w-full p-2 border border-gray-300 rounded mt-1">
//               {environment_options.map((option, index) => (
//                 <option key={index} value={option}>{option}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-gray-700">Partner Logo</label>
//             <input
//               type="file"
//               className="w-full p-2 border border-gray-300 rounded mt-1"
//               accept=".png, .jpg"
//               onChange={handleLogoUpload}
//             />
//             {logoError && <p className="text-red-500 text-sm mt-1">{logoError}</p>}
//           </div>
//         </div>
//       </div>
//       <div  className="mb-6  mt-4">
//         <h3 className="text-lg font-semibold mb-2 text-blue-900 bg-gray-300 pl-4 mb-4">Carrier Info</h3>
//         <div className="container mx-auto">
//           {carrierData.length > 0 && (
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white border border-gray-200">
//                 <thead className="bg-gray-300">
//                   <tr>
//                     <th className="py-2 px-4 border-b border-gray-300 text-left font-semibold">S.NO</th>
//                     {Object.keys(carrierData[0]).map((key) => (
//                       <th key={key} className="py-2 px-4 border-b border-gray-300 text-left font-semibold">
//                         {key}
//                       </th>
//                     ))}
//                     <th className="py-2 px-4 border-b border-gray-300 text-left font-semibold">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {carrierData.map((row, index) => (
//                     <tr key={index}>
//                       <td className="py-2 px-4 border-b border-gray-300">{index + 1}</td>
//                       {Object.values(row).map((value, i) => (
//                         <td key={i} className="py-2 px-4 border-b border-gray-300">
//                           {value}
//                         </td>
//                       ))}
//                       <td className="py-2 px-4 border-b border-gray-300">
//                         <div className="flex space-x-2">
//                           <button className="text-blue-500 hover:text-blue-700">
//                             <PencilIcon className="w-5 h-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//       <div className="mb-6  mt-4">
//         <h3 className="text-lg font-semibold mb-2 text-blue-900 bg-gray-300 pl-4 mb-4">Internal API Info</h3>
//         <div className="container mx-auto">
//           {carrierData.length > 0 && (
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white border border-gray-200">
//                 <thead className="bg-gray-300">
//                   <tr>
//                     <th className="py-2 px-4 border-b border-gray-300 text-left font-semibold">S.NO</th>
//                     {Object.keys(carrierData[0]).map((key) => (
//                       <th key={key} className="py-2 px-4 border-b border-gray-300 text-left font-semibold">
//                         {key}
//                       </th>
//                     ))}
//                     <th className="py-2 px-4 border-b border-gray-300 text-left font-semibold">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {carrierData.map((row, index) => (
//                     <tr key={index}>
//                       <td className="py-2 px-4 border-b border-gray-300">{index + 1}</td>
//                       {Object.values(row).map((value, i) => (
//                         <td key={i} className="py-2 px-4 border-b border-gray-300">
//                           {value}
//                         </td>
//                       ))}
//                       <td className="py-2 px-4 border-b border-gray-300">
//                         <div className="flex space-x-2">
//                           <button className="text-blue-500 hover:text-blue-700">
//                             <PencilIcon className="w-5 h-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PartnerOnboardingForm;




"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the PartnerInfo, CarrierInfo, and APIInfo components
const PartnerInfo = dynamic(() => import('./partner_info'));
const CarrierInfo = dynamic(() => import('./carrier_info'));
const APIInfo = dynamic(() => import('./api_info'));

const CreateUser: React.FC = () => {
  const [activeTab, setActiveTab] = useState('partnerInfo');

  return (
    <div className="">
      <div className="bg-white shadow-md mb-4 z-99 grid grid-cols-1 md:grid-cols-3 gap-4 tabs">
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
          API Info
        </button>
      </div>
      <div className="bg-white p-4 mt-16">
        {activeTab === 'partnerInfo' && <PartnerInfo />}
        {activeTab === 'carrierInfo' && <CarrierInfo />}
        {activeTab === 'apiInfo' && <APIInfo />}
      </div>
    </div>
  );
};

export default CreateUser;
