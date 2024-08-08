import React, { useState, useEffect, useRef } from 'react';
import { useLogoStore } from '@/app/stores/logoStore';
import EmailModal from '../EmailModal';
import { Modal, notification } from 'antd';
import axios from 'axios';
import { useAuth } from "@/app/components/auth_context";
import { usePartnerStore } from '../partnerStore';
import { getCurrentDateTime } from '@/app/components/header_constants';
import { useUserStore } from '../users/createUser/createUserStore';

interface PartnerInfo {
  onSubmit: () => void;
}

const PartnerInfo: React.FC<PartnerInfo> = ({ onSubmit }) => {
  const [logoError, setLogoError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [emailList, setEmailList] = useState<string[]>([]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
  const { username, partner, role } = useAuth();
  const { partnerData,setPartnerInfo } = usePartnerStore.getState();
  const [emails, setEmails] = useState<string | null>("");
  const partnerInfo = partnerData?.["Partner info"]?.data?.["Partner info"] || {};
  const {
    tenant,
    role_name,
    sub_tenant,
    user_name,
    setTenant,
    setRoleName,
    setSubTenant,
    emailsList,
    setEmailsList
  } = useUserStore();
  useEffect(() => {
    let email_list = Array.isArray(partnerInfo?.email_id) ? partnerInfo.email_id : [];
    // setEmailList(email_list); 
    // setEmailsList(email_list);
    if (JSON.stringify(emailList) !== JSON.stringify(email_list)) {
      setEmailList(email_list); 
      setEmailsList(email_list);
    }
  }, [partnerInfo])
  const { setLogoUrl ,logoUrl} = useLogoStore();
  const logoFileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(emailsList.length<1){
      setEmailError("Emails are required")
    }
    else{
     setSubmitModalOpen(true);

    }
  };
  const messageStyle = {
    fontSize: '14px',  // Adjust font size
    fontWeight: 'bold', // Make the text bold
    padding: '16px',
    // Add padding
  };

  const handleAddEmail = (email: string) => {
    setEmailList([...emailList, email]);
    setEmailsList([...emailList, email])
  };

  const handleRemoveEmail = (index: number) => {
    const newEmailList = emailList.filter((_, i) => i !== index);
    setEmailList(newEmailList);
    setEmailsList(newEmailList)
  };

 const handleFormSubmit = () => {
  const file = logoFileRef.current?.files?.[0];
  if(file){
    const validTypes = ['image/png', 'image/jpeg'];
    if (!validTypes.includes(file.type)) {
      setLogoError('Only .png and .jpg files are allowed.');
      return;
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        const logoUrl_ = reader.result as string;
        console.log("logoUrl_",logoUrl_)
        setLogoUrl(logoUrl_);
        // resetForm();
        setSubmitModalOpen(false);
      };
      reader.readAsDataURL(file);
    }
    console.log("first")
    console.log("logo",logoUrl)

  }
    confirmSubmit()
    console.log("second")
    console.log("logo",logoUrl)

 }

  const confirmSubmit = async () => {
    try {
      const url =
        "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management";
      const data = {
        tenant_name: partner || "default_value",
        username: username,
        path: "/update_partner_info",
        role_name: role,
        "parent_module": "Partner",
        "module_name": "Partner info",
        action: "update",
        changed_data: {
          email_ids: emailList,
          logo: logoUrl|| ""

        },
        request_received_at: getCurrentDateTime(),
        Partner: partner,


      };
      const response = await axios.post(url, { data });
      const parsedData = JSON.parse(response.data.body);
      if (response && response.data.statusCode === 200) {
        try{
          const updatedUrl =
        "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management";
      const data = {
        tenant_name: partner || "default_value",
        username: username,
        path: "/get_partner_info",
        role_name: role,
        parent_module: "Partner",
        modules_list: ["Partner info"],
        pages: {
            "Customer groups": { start: 0, end: 500 },
            "Partner users": { start: 0, end: 500 }
        }
      };
      const updatedResponse = await axios.post(updatedUrl, { data });
      const updatedPparsedData = JSON.parse(updatedResponse.data.body);
      if(updatedResponse&&updatedResponse.data.statusCode===200){
      setPartnerInfo(updatedPparsedData)
      notification.success({
        message: 'Success',
        description: 'Successfully saved the form',
        style: messageStyle,
        placement: 'top', // Apply custom styles here
      });
      }
      else{
        Modal.error({
          title: 'Submit Error',
          content: updatedPparsedData.message || 'An error occurred while submitting the form. Please try again.',
          centered: true,
        });
      }
        }
        catch(error){
          console.log(error)
        }
        // Show success message
        
      }
      else {
        Modal.error({
          title: 'Submit Error',
          content: parsedData.message || 'An error occurred while submitting the form. Please try again.',
          centered: true,
        });
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }


  };

  const resetForm = () => {
    setEmailList([]);
    setLogoError(null);
    setEmailError(null)
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
                value={partnerInfo.partner || "NA"}
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
                  value={emailsList.join(', ')}
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
        onOk={handleFormSubmit}
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
