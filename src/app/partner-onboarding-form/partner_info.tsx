"use client"
import React, { useState, useEffect } from 'react';

interface PartnerInfo {
  onSubmit: () => void;
}

const PartnerInfo: React.FC<PartnerInfo> = ({ onSubmit }) => {
  const environment_options = ['Sandbox', 'QA', 'UAT', 'Prod'];
  const [logoError, setLogoError] = useState<string | null>(null);
  const [activeElement, setActiveElement] = useState<string | null>(null);
  const [formValid, setFormValid] = useState<boolean>(false);

  const [partnerName, setPartnerName] = useState<string>('');
  const [subPartnerName, setSubPartnerName] = useState<string>('');
  const [emailIds, setEmailIds] = useState<string>('');
  const [environment, setEnvironment] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userPassword, setUserPassword] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');

  useEffect(() => {
    if (
      userName.trim() !== '' &&
      userPassword.trim() !== '' &&
      clientId.trim() !== '' &&
      clientSecret.trim() !== ''
    ) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [userName, userPassword, clientId, clientSecret]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Perform form submission here
    console.log('Form submitted');
    // Call parent component function to switch tabs
    onSubmit();
  };

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
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div>
              <label className={`block text-gray-700 ${activeElement === 'partnerName' ? 'text-indigo-500' : ''}`}>
                Partner Name
              </label>
              <input
                type="text"
                className={`input focus:border-sky-500 ${activeElement === 'partnerName' ? 'border-sky-500' : ''}`}
                onFocus={() => handleFocus('partnerName')}
                onBlur={handleBlur}
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
              />
            </div>
            <div>
              <label className={`block text-gray-700 ${activeElement === 'subPartnerName' ? 'text-indigo-500' : ''}`}>
                Sub Partner Name
              </label>
              <input
                type="text"
                className={`input focus:border-sky-500 ${activeElement === 'subPartnerName' ? 'border-sky-500' : ''}`}
                onFocus={() => handleFocus('subPartnerName')}
                onBlur={handleBlur}
                value={subPartnerName}
                onChange={(e) => setSubPartnerName(e.target.value)}
              />
            </div>
            <div>
              <label className={`block text-gray-700 ${activeElement === 'emailIds' ? 'text-indigo-500' : ''}`}>
                Email ids
              </label>
              <input
                type="text"
                className={`input focus:border-sky-500 ${activeElement === 'emailIds' ? 'border-sky-500' : ''}`}
                onFocus={() => handleFocus('emailIds')}
                onBlur={handleBlur}
                value={emailIds}
                onChange={(e) => setEmailIds(e.target.value)}
              />
            </div>
            <div>
              <label className={`block text-gray-700 ${activeElement === 'environment' ? 'text-indigo-500' : ''}`}>
                Environment
              </label>
              <select
                className={`input focus:border-sky-500 ${activeElement === 'environment' ? 'border-sky-500' : ''}`}
                onFocus={() => handleFocus('environment')}
                onBlur={handleBlur}
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
              >
                {environment_options.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-gray-700 ${activeElement === 'partnerLogo' ? 'text-indigo-500' : ''}`}>
                Partner Logo
              </label>
              <input
                type="file"
                className={`input focus:border-sky-500 ${activeElement === 'partnerLogo' ? 'border-sky-500' : ''}`}
                accept=".png, .jpg"
                onChange={handleLogoUpload}
                onFocus={() => handleFocus('partnerLogo')}
                onBlur={handleBlur}
              />
              {logoError && <p className="text-red-500 text-sm mt-1">{logoError}</p>}
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-blue-900 bg-blue-100 pl-4 mb-4">Partner Registration</h3>
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div>
              <label className={`block text-gray-700 ${activeElement === 'userName' ? 'text-indigo-500' : ''}`}>
                User Name
              </label>
              <input
                type="text"
                className={`input focus:border-sky-500 ${activeElement === 'userName' ? 'border-sky-500' : ''}`}
                onFocus={() => handleFocus('userName')}
                onBlur={handleBlur}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div>
              <label className={`block text-gray-700 ${activeElement === 'userPassword' ? 'text-indigo-500' : ''}`}>
                User Password
              </label>
              <input
                type="password"
                className={`input focus:border-sky-500 ${activeElement === 'userPassword' ? 'border-sky-500' : ''}`}
                onFocus={() => handleFocus('userPassword')}
                onBlur={handleBlur}
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
              />
            </div>
            <div>
              <label className={`block text-gray-700 ${activeElement === 'clientId' ? 'text-indigo-500' : ''}`}>
                Client ID
              </label>
              <input
                type="text"
                className={`input focus:border-sky-500 ${activeElement === 'clientId' ? 'border-sky-500' : ''}`}
                onFocus={() => handleFocus('clientId')}
                onBlur={handleBlur}
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              />
            </div>
            <div>
              <label className={`block text-gray-700 ${activeElement === 'clientSecret' ? 'text-indigo-500' : ''}`}>
                Client Secret
              </label>
              <input
                type="text"
                className={`input focus:border-sky-500 ${activeElement === 'clientSecret' ? 'border-sky-500' : ''}`}
                onFocus={() => handleFocus('clientSecret')}
                onBlur={handleBlur}
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
              />
            </div>
          </div>
          <div className='flex justify-end space-x-4'>
            <button
              className={`flex w-24 items-center justify-center p-2 rounded-lg shadow border border-gray-300 ${formValid ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
              type="submit"
              disabled={!formValid}
            >
              Submit
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PartnerInfo;
