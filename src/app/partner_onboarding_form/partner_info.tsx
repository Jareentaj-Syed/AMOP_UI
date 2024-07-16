import React, { useState, useEffect, useRef } from 'react';
import { useLogoStore } from '../stores/logoStore';
import EmailModal from './EmailModal';
import { Modal } from 'antd';

interface PartnerInfo {
  onSubmit: () => void;
}

const PartnerInfo: React.FC<PartnerInfo> = ({ onSubmit }) => {
  const [logoError, setLogoError] = useState<string | null>(null);
  const [activeElement, setActiveElement] = useState<string | null>(null);
  const [formValid, setFormValid] = useState<boolean>(false);
  const [SubmitModalOpen, setSubmitModalOpen] = useState(false);
  const [partnerName, setPartnerName] = useState<string>('');
  const [subPartnerName, setSubPartnerName] = useState<string>('');
  const [emailList, setEmailList] = useState<string[]>([]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);

  const { setLogoUrl } = useLogoStore();
  const logoFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (
      partnerName.trim() !== '' &&
      subPartnerName.trim() !== '' &&
      emailList.length > 0
    ) {
      setFormValid(true);
      
    } else {
      setFormValid(false);
    }
  }, [partnerName, subPartnerName, emailList]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const file = logoFileRef.current?.files?.[0];
    
    if (file) {
      const validTypes = ['image/png', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        setLogoError('Only .png and .jpg files are allowed.');
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          const logoUrl = reader.result as string;
          setLogoUrl(logoUrl);
          setSubmitModalOpen(true); // Open modal after logo is processed
        };
        reader.readAsDataURL(file);
      }
    } else {
      setSubmitModalOpen(true); // Open modal without logo
    }
  };

  const handleFocus = (elementName: string) => {
    setActiveElement(elementName);
  };

  const handleBlur = () => {
    setActiveElement(null);
  };

  const handleAddEmail = (email: string) => {
    setEmailList([...emailList, email]);
  };

  const handleRemoveEmail = (index: number) => {
    const newEmailList = emailList.filter((_, i) => i !== index);
    setEmailList(newEmailList);
  };

  const confirmSubmit = () => {
    // Perform submission logic here
    setSubmitModalOpen(false); 
    onSubmit()// Close modal after submission
  };

  return (
    <div className="p-2">
      <div className="mb-6 ">
        <h3 className="text-lg font-semibold mb-2 text-blue-500 bg-gray-200 pl-4 py-2">Partner Info</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className={`block  ${activeElement === 'partnerName' ? 'text-blue-500' : 'text-gray-700'}`}>
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
              <label className={`block ${activeElement === 'subPartnerName' ? 'text-blue-500' : 'text-gray-700'}`}>
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
              <label className={`block  ${activeElement === 'emailIds' ?'text-blue-500' : 'text-gray-700'}`}>
                Email ids
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder='Click on + to add email'
                  className={`input flex-grow focus:border-sky-500 ${activeElement === 'emailIds' ? 'border-sky-500' : ''}`}
                  onFocus={() => handleFocus('emailIds')}
                  onBlur={handleBlur}
                  value={emailList.join(', ')}
                  readOnly
                />
                <button
                  type="button"
                  className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
                  onClick={() => setIsEmailModalOpen(true)}
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <label className={`block ${activeElement === 'partnerLogo' ? 'text-blue-500' : 'text-gray-700'}`}>
                Partner Logo
              </label>
              <input
                type="file"
                className={`input focus:border-sky-500 ${activeElement === 'partnerLogo' ? 'border-sky-500' : ''}`}
                accept=".png, .jpg"
                ref={logoFileRef}
                onFocus={() => handleFocus('partnerLogo')}
                onBlur={handleBlur}
              />
              {logoError && <p className="text-red-500 text-sm mt-1">{logoError}</p>}
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              className={`${formValid ? 'save-btn' : 'cancel-btn'}`}
              type="submit"
              disabled={!formValid}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <EmailModal
        isOpen={isEmailModalOpen}
        emailList={emailList}
        onClose={() => setIsEmailModalOpen(false)}
        onAddEmail={handleAddEmail}
        onRemoveEmail={handleRemoveEmail}
      />
      <Modal
        title={<span style={{  fontWeight: 'bold' , fontSize:'16px' }}>Confirm Submission</span>}
        open={SubmitModalOpen}
        onOk={confirmSubmit}
        onCancel={() => setSubmitModalOpen(false)}
        centered
      >
        <p>Do you want to submit this Partner Info Form?</p>
      </Modal>
    </div>
  );
};

export default PartnerInfo;
