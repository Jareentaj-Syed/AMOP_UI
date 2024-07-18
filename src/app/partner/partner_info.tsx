import React, { useState, useEffect, useRef } from 'react';
import { useLogoStore } from '../stores/logoStore';
import EmailModal from './EmailModal';
import { Modal } from 'antd';

interface PartnerInfo {
  onSubmit: () => void;
}

const PartnerInfo: React.FC<PartnerInfo> = ({ onSubmit }) => {
  const [logoError, setLogoError] = useState<string | null>(null);
  const [formValid, setFormValid] = useState<boolean>(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
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
    setSubmitModalOpen(true);
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

  return (
    <div className="p-2">
      <div className="">
        <h3 className="tabs-sub-headings">Partner Info</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="field-label">
                Partner Name
              </label>
              <input
                type="text"
                className="non-editable-input"
                value={'Altaworx'}
                onChange={(e) => setPartnerName(e.target.value)}
                readOnly
              />
               {/* value={partnerName} */}
            </div>
            <div>
              <label className="field-label">
                Sub Partner Name
              </label>
              <input
                type="text"
                className="non-editable-input"
                value={'Altantech-AWX'}
                onChange={(e) => setSubPartnerName(e.target.value)}
                readOnly
              />
              {/* value={subPartnerName} */}
            </div>
            <div>
              <label className="field-label">
                Email ids<span className="text-red-500">*</span>
              </label> 
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Click on + to add email"
                  className="input"
                  value={emailList.join(', ')}
                  readOnly
                  required 
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
            <div>
              <label className="field-label">
                Partner Logo
              </label>
              <input
                type="file"
                className="input"
                accept=".png, .jpg"
                ref={logoFileRef}
              />
              {logoError && <p className="text-red-500 text-sm">{logoError}</p>}
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              className='save-btn'
              type="submit"
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
