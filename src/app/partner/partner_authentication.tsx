// app/partner-onboarding-form/partner-info.tsx

"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useLogoStore } from '../stores/logoStore';

interface PartnerAuthentication {
  onSubmit: () => void;
}

const PartnerAuthentication: React.FC<PartnerAuthentication> = ({ onSubmit }) => {
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

  const { setLogoUrl } = useLogoStore();
  const logoFileRef = useRef<HTMLInputElement>(null);

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
    const file = logoFileRef.current?.files?.[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        setLogoError('Only .png and .jpg files are allowed.');
        return;
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          const logoUrl = reader.result as string;
          setLogoUrl(logoUrl);
          console.log('Form submitted');
          onSubmit();
        };
        reader.readAsDataURL(file);
      }
    } else {
      console.log('Form submitted without logo');
      onSubmit();
    }
  };

  const handleFocus = (elementName: string) => {
    setActiveElement(elementName);
  };

  const handleBlur = () => {
    setActiveElement(null)
  };

  return (
    <div className='p-2'>
      <div className="mb-6">
      <div className="flex items-center mb-4 mt-2">
    <a href="/partner" className="flex items-center text-lg font-light text-black-300 hover:underline">
    Partner
</a>
<span className="mx-2 text-gray-500">/</span>
<span className="text-lg font-light text-black">Partner Authentication</span>

</div>
        <form onSubmit={handleSubmit}>
        
          <h3 className="tabs-sub-headings">Partner Authentication</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* <div>
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
            </div> */}
            <div>
              <label className={`field-label  ${activeElement === 'clientId' ? 'text-blue-500' : 'text-gray-700'}`}>
                Client ID
              </label>
              <input
                type="text"
                className={`non-editable-input ${activeElement === 'clientId' ? 'border-sky-500' : ''}`}
                onFocus={() => handleFocus('clientId')}
                onBlur={handleBlur}
                value={'135791113151719'}
                onChange={(e) => setClientId(e.target.value)}
                readOnly
              />
              {/* value={clientId } */}
            </div>
            <div>
              <label className={`field-label  ${activeElement === 'clientSecret' ? 'text-blue-500' : 'text-gray-700'}`}>
                Client Secret
              </label>
              <input
                type="text"
                className={`non-editable-input ${activeElement === 'clientSecret' ? 'border-sky-500' : ''}`}
                onFocus={() => handleFocus('clientSecret')}
                onBlur={handleBlur}
                value={'zyxwvutsrqponmlkjihgfedcba987654'}
                onChange={(e) => setClientSecret(e.target.value)}
                readOnly
              />
                {/* value={clientSecret} */}
            </div>
          </div>
          {/* <div className='flex justify-end space-x-4'>
            <button
              className={`flex w-24 items-center justify-center p-2 rounded-lg shadow border border-gray-300 ${formValid ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
              type="submit"
              disabled={!formValid}
            >
              Submit
            </button>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default PartnerAuthentication;
