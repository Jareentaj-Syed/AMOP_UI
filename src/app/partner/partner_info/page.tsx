import React, { useState, useEffect, useRef } from 'react';
import { useLogoStore } from '@/app/stores/logoStore';
import EmailModal from '../EmailModal';
import { Modal } from 'antd';
import axios from 'axios';
import { useAuth } from "@/app/components/auth_context";
import { usePartnerStore } from '../partnerStore';


interface PartnerInfo {
  onSubmit: () => void;
}

const PartnerInfo: React.FC<PartnerInfo> = ({ onSubmit }) => {
  const [logoError, setLogoError] = useState<string | null>(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [emailList, setEmailList] = useState<string[]>([]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
  const { username, partner, role } = useAuth();
  const { partnerData } = usePartnerStore.getState();
  const partnerInfo = partnerData?.["Partner info"]?.data?.["Partner info"] || {};
useEffect(()=>{
  setEmailList(partnerInfo.email_id||[])
},[])
  const { setLogoUrl } = useLogoStore();
  const logoFileRef = useRef<HTMLInputElement>(null);

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

  const confirmSubmit = async () => {
    const file = logoFileRef.current?.files?.[0];
      try {
        const url =
          "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management";
        const data = {
          tenant_name: partner || "default_value",
          username: username,
          path: "/update_partner_info",
          role_name: role,
          module_name: "Partner info",
          pages: {
            "Customer groups": { start: 0, end: 10 },
            "Partner users": { start: 0, end: 10 }
          },
          updated_data:{
            email_ids: emailList,
            logo:"Logo-design-illustration-on-transparent-background-PNG"

          }
        };
        const response = await axios.post(url, { data });
        const parsedData = JSON.parse(response.data.body);
        const tableData = parsedData.data.customers;
        console.log(response);
      } catch (err) {
        console.error("Error fetching data:", err);
      }

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
                value={partnerInfo.partner|| "NA"}
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
                value={partnerInfo.sub_partner || "NA"}
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
