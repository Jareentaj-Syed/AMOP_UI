"use client"
import React, { useState, useEffect, useRef } from 'react';
import { useLogoStore } from '@/app/stores/logoStore';
import EmailModal from '@/app/partner/EmailModal';
import { Modal, Spin } from 'antd';

interface PartnerInfo {
  onSubmit: () => void;
}

const PartnerInfo: React.FC<PartnerInfo> = ({ onSubmit }) => {
  const [logoError, setLogoError] = useState<string | null>(null);
  const [activeElement, setActiveElement] = useState<string | null>(null);
  const [formValid, setFormValid] = useState<boolean>(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [partnerName, setPartnerName] = useState<string>('');
  const [subPartnerName, setSubPartnerName] = useState<string>('');
  const [emailList, setEmailList] = useState<string[]>([]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
  const title = useLogoStore((state) => state.title);
  const [loading, setLoading] = useState(false);
  const setTitle = useLogoStore((state) => state.setTitle);
  const { setLogoUrl } = useLogoStore();
  const logoFileRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setTitle("Super Admin")
    if(title!="Super Admin"){
        setLoading(true)
    }
},[title])

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
    setSubmitModalOpen(true);
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
    const file = logoFileRef.current?.files?.[0];

    if (file) {
      const validTypes = ['image/png', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        setLogoError('Only .png and .jpg files are allowed.');
        setSubmitModalOpen(false);
        return;
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          const logoUrl = reader.result as string;
          setLogoUrl(logoUrl);
          resetForm();
          setSubmitModalOpen(false);
        };
        reader.readAsDataURL(file);
      }
    } else {
      resetForm();
      setSubmitModalOpen(false);
    }
  };

  const resetForm = () => {
    setPartnerName('');
    setSubPartnerName('');
    setEmailList([]);
    setLogoError(null);
    if (logoFileRef.current) {
      logoFileRef.current.value = '';
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="mb-6">
  
        <h3 className="tabs-sub-headings">Partner Info</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className={`field-label ${activeElement === 'partnerName' ? 'text-blue-500' : 'text-gray-700'}`}>
                Partner Name
              </label>
              <input
                type="text"
                className={`input ${activeElement === 'partnerName' ? 'border-sky-500' : ''}`}
                onFocus={() => handleFocus('partnerName')}
                onBlur={handleBlur}
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
              />
            </div>
            <div>
              <label className={`field-label ${activeElement === 'subPartnerName' ? 'text-blue-500' : 'text-gray-700'}`}>
                Sub Partner Name
              </label>
              <input
                type="text"
                className={`input ${activeElement === 'subPartnerName' ? 'border-sky-500' : ''}`}
                onFocus={() => handleFocus('subPartnerName')}
                onBlur={handleBlur}
                value={subPartnerName}
                onChange={(e) => setSubPartnerName(e.target.value)}
              />
            </div>
            <div>
              <label className={`field-label ${activeElement === 'emailIds' ? 'text-blue-500' : 'text-gray-700'}`}>
                Email ids
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Click on + to add email"
                  className={`input ${activeElement === 'emailIds' ? 'border-sky-500' : ''}`}
                  onFocus={() => handleFocus('emailIds')}
                  onBlur={handleBlur}
                  value={emailList.join(', ')}
                  readOnly
                />
                <button
                  type="button"
                  className="save-btn email-plus"
                  onClick={() => setIsEmailModalOpen(true)}
                >
                  +
                </button>
              </div>
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
        title={<span style={{ fontWeight: 'bold', fontSize: '16px' }}>Confirm Submission</span>}
        open={submitModalOpen}
        onOk={confirmSubmit}
        onCancel={() => {
          resetForm();
          setSubmitModalOpen(false);
        }}
        centered
      >
        <p>Do you want to submit this Partner Info Form?</p>
      </Modal>
    </div>
  );
};

export default PartnerInfo;
