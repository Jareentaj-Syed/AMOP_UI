import React, { useState } from 'react';

const PartnerInfo: React.FC = () => {
  const environment_options = ['Sandbox', 'QA', 'UAT', 'Prod'];
  const [logoError, setLogoError] = useState<string | null>(null);
  const [activeElement, setActiveElement] = useState<string | null>(null);

  const handleFocus = (elementName: string) => {
    setActiveElement(elementName);
  };

  const handleBlur = () => {
    setActiveElement(null);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        setLogoError('Only .png and .jpg files are allowed.');
      } else {
        setLogoError(null);
        // handle the valid file upload here
      }
    }
  };

  return (
    <div className='p-2'>
      <div className="mb-6 mt-4">
        <h3 className="text-lg font-semibold mb-2 text-blue-900 bg-blue-100 pl-4 mb-4">Partner Info</h3>
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div>
            <label className={`block text-gray-700 ${activeElement === 'partnerName' ? 'text-sky-500' : ''}`}>
              Partner Name
            </label>
            <input
              type="text"
              className={`w-full p-2 border border-gray-300 rounded mt-1 focus:border-sky-500 ${activeElement === 'partnerName' ? 'border-sky-500' : ''}`}
              onFocus={() => handleFocus('partnerName')}
              onBlur={handleBlur}
            />
          </div>
          <div>
            <label className={`block text-gray-700 ${activeElement === 'subPartnerName' ? 'text-sky-500' : ''}`}>
              Sub Partner Name
            </label>
            <input
              type="text"
              className={`w-full p-2 border border-gray-300 rounded mt-1 focus:border-sky-500 ${activeElement === 'subPartnerName' ? 'border-sky-500' : ''}`}
              onFocus={() => handleFocus('subPartnerName')}
              onBlur={handleBlur}
            />
          </div>
          <div>
            <label className={`block text-gray-700 ${activeElement === 'emailIds' ? 'text-sky-500' : ''}`}>
              Email ids
            </label>
            <input
              type="text"
              className={`w-full p-2 border border-gray-300 rounded mt-1 focus:border-sky-500 ${activeElement === 'emailIds' ? 'border-sky-500' : ''}`}
              onFocus={() => handleFocus('emailIds')}
              onBlur={handleBlur}
            />
          </div>
          <div>
            <label className={`block text-gray-700 ${activeElement === 'environment' ? 'text-sky-500' : ''}`}>
              Environment
            </label>
            <select
              className={`w-full p-2 border border-gray-300 rounded mt-1 focus:border-sky-500 ${activeElement === 'environment' ? 'border-sky-500' : ''}`}
              onFocus={() => handleFocus('environment')}
              onBlur={handleBlur}
            >
              {environment_options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={`block text-gray-700 ${activeElement === 'partnerLogo' ? 'text-sky-500' : ''}`}>
              Partner Logo
            </label>
            <input
              type="file"
              className={`w-full p-2 border border-gray-300 rounded mt-1 focus:border-sky-500 ${activeElement === 'partnerLogo' ? 'border-sky-500' : ''}`}
              accept=".png, .jpg"
              onChange={handleLogoUpload}
              onFocus={() => handleFocus('partnerLogo')}
              onBlur={handleBlur}
            />
            {logoError && <p className="text-red-500 text-sm mt-1">{logoError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerInfo;
