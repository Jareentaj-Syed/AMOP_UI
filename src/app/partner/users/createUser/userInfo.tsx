import React, { useState, useEffect } from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import Select, { MultiValue, SingleValue } from 'react-select';
import { NonEditableDropdownStyles, DropdownStyles } from '@/app/components/css/dropdown';
import { useUserStore } from './createUserStore';
import { usePartnerStore } from '../../partnerStore';
import { getCurrentDateTime } from '@/app/components/header_constants';
import axios from 'axios';
import { useAuth } from '@/app/components/auth_context';
import { Modal } from 'antd';


type OptionType = {
  value: string;
  label: string;
};
const { partnerData } = usePartnerStore.getState();
const editableDrp = DropdownStyles;
const nonEditableDrp = NonEditableDropdownStyles;
const Notificationoptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

interface UserInfoProps {
  rowData?: any;
  isPopup?:any
}

const UserInfo: React.FC<UserInfoProps> = ({ rowData,isPopup }) => {
  const {
    username: user,
    tenantNames: tenants,
    role: userRole,
    partner: userPartner,
    settabledata: setData
  } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [emailId, setEmailId] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [locale, setLocale] = useState('');
  const [aptSuite, setAptSuite] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [timeZone, setTimeZone] = useState('');
  const [zip, setZip] = useState('');
  const [partner, setPartner] = useState<SingleValue<OptionType>>(null);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<SingleValue<OptionType>>(null);
  const [notification, setNotification] = useState<SingleValue<OptionType>>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [selectedSubPartner, setSelectedSubPartner] = useState<string[]>([]);
  const [subPartners, setSubPartners] = useState<string[]>([]);
  const [Partneroptions, setPartneroptions] = useState<string[]>([]);
  const [Roleoptions, setRoleoptions] = useState<string[]>([]);
  const [generalFields, setGeneralFields] = useState<any[]>([]);
  const [subPartnersData, setsubPartnersData] = useState<any>({});
  const [subPartnersoptions, setsubPartnersoptions] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({});
  //Show Modal
  const [showModal, setShowModal] = useState(false);

  const subPartnersnoOptions = [{ value: '', label: 'No sub-partners available' }];
  const usersData = partnerData["Partner users"]?.data?.["Partner users"] || {};



  console.log("userData", usersData)
  useEffect(() => {
    const initializeData = () => {
      const general_fields = partnerData["Partner users"]?.headers_map?.["Partner users"]?.general_fields || {}
      const partneroptions: any[] = usersData?.tenant ? Object.keys(usersData.tenant) : []
      const subPartnersData = usersData?.tenant || {}
      const subPartners = subPartnersData[tenant] || []
      const roleoptions: any[] = usersData?.role_name || []
      const subPartnersoptions = subPartners.map((subPartner: any) => ({ value: subPartner, label: subPartner }));
      setsubPartnersData(subPartnersData)
      setsubPartnersoptions(subPartnersoptions)
      setRoleoptions(roleoptions)
      setPartneroptions(partneroptions)
      setGeneralFields(general_fields)
      setSubPartners(subPartners);
      setSubPartners(subPartnersData[tenant] || []);

      console.log("general_fields", general_fields)


    };

    initializeData();
  }, [usersData]);

  useEffect(() => {
    const initializeData = () => {
      if (rowData) {
        setPartner(getFieldValue('Partner'));
        setTenant(getFieldValue('Partner'))
        setFirstName(getFieldValue('First Name'));
        setLastName(getFieldValue('Last Name'));
        setUsername(getFieldValue('Username'));
        setUser_Name(getFieldValue('Username'))
        setEmailId(getFieldValue('Email Id'));
        setMobileNo(getFieldValue('Mobile No'));
        setRole(getFieldValue('Role'));
        setPassword(getFieldValue('Password'));
        setPhone(getFieldValue('Phone'));
        setBusinessName(getFieldValue('Business Name'));
        setLocale(getFieldValue('Locale'));
        setAptSuite(getFieldValue('Apt/Suite'));
        setAddressLine1(getFieldValue('Address Line-1'));
        setAddressLine2(getFieldValue('Address Line-2'));
        setCountry(getFieldValue('Country'));
        setState(getFieldValue('State'));
        setCity(getFieldValue('City'));
        setTimeZone(getFieldValue('Time Zone'));
        setZip(getFieldValue('Zip'));
        setFormData(rowData)
      }
    };

    initializeData();
  }, [rowData,isPopup,usersData]);


  const {
    tenant,
    role_name,
    sub_tenant,
    setTenant,
    setRoleName,
    setSubTenant,
    setUser_Name
  } = useUserStore();


  const handlePartnerChange = (selectedOption: SingleValue<OptionType>) => {
    if (selectedOption) {
      const partner = selectedOption.value;
      setTenant(partner);
      setSubPartners(subPartnersData[partner] || []);
      setSelectedSubPartner([]);
      setSubTenant([])
      if (rowData) {
        // formData[getFieldKey('Partner')]=partner
        setFormData((prevState: any) => ({ ...prevState, [getFieldKey('Partner')]: partner }));

      }
    } else {
      setTenant('');
      setSubPartners([]);
      setSelectedSubPartner([]);
    }
  };

  const handleSetSubPartner = (selectedOptions: MultiValue<OptionType>) => {
    const selectedSubPartners = selectedOptions.map(option => option.value);
    setSelectedSubPartner(selectedSubPartners);
  };
  const handlesetRole = (selectedOption: SingleValue<OptionType>) => {
    if (selectedOption) {
      const role = selectedOption.value
      setRole(selectedOption);
      setRoleName(role)
      setErrorMessages(prevErrors => prevErrors.filter(error => error !== 'Role is required.'));
    }
  };
  const handleNotification = (selectedOption: SingleValue<OptionType>) => {
    console.log('wsdf', selectedOption)
    setNotification(selectedOption);
    if (selectedOption) {
      setErrorMessages(prevErrors => prevErrors.filter(error => error !== 'Notification is required.'));
    }
  };

  const handleSave = async() => {
    setUser_Name(username)
    try{
      const url =
        "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management";
  
      let changedData: any = {};
      changedData[getFieldKey('Partner')] = partner;
    changedData[getFieldKey('Sub Partner')] = subPartners;
    changedData[getFieldKey('First Name')] = firstName;
    changedData[getFieldKey('Last Name')] = lastName;
    changedData[getFieldKey('Username')] = username;
    changedData[getFieldKey('Email Id')] = emailId;
    changedData[getFieldKey('Mobile No')] = mobileNo;
    changedData[getFieldKey('Role')] = role?.value;
    changedData[getFieldKey('Password')] = password;
    changedData[getFieldKey('Phone')] = phone;
    changedData[getFieldKey('Business Name')] = businessName;
    changedData[getFieldKey('Locale')] = locale;
    changedData[getFieldKey('Apt/Suite')] = aptSuite;
    changedData[getFieldKey('Address Line-1')] = addressLine1;
    changedData[getFieldKey('Address Line-2')] = addressLine2;
    changedData[getFieldKey('Country')] = country;
    changedData[getFieldKey('State')] = state;
    changedData[getFieldKey('City')] = city;
    changedData[getFieldKey('Time Zone')] = timeZone;
    changedData[getFieldKey('Zip')] = zip;
  
      const data = {
          tenant_name: partner || "default_value",
          username: user,
          path: "/update_partner_info",
          role_name: userRole,
          module_name: "Partner users",
          action:rowData?"update":"create",
          request_received_at: getCurrentDateTime(),
          changed_data: {
              "user_info":changedData
          },
         
          Partner:partner,
      };
      const response = await axios.post(url, { data });
  }
  catch(error){
      console.log(
          error
      )
  }
    const errors: string[] = [];
    if (!partner) errors.push('Partner is required.');
    if (!username) errors.push('Username is required.');
    if (!email) errors.push('Email id is required.');
    if (!role) errors.push('Role is required.');
    if (!password) errors.push('Password is required.');
    if (!notification) errors.push('Notification is required.')

    setErrorMessages(errors);

    if (errors.length === 0) {
      console.log('Saving...');
    }
    else {
      scrollToTop()
    }
  };

  //Handling modal save
  const handleConfirmSave = () => {
    handleSave();
    setShowModal(false);
  };
//Handling modal cancel
  const handleCancelSave = () => {
    setShowModal(false);
  };


  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'auto'  // Optional: Smooth scroll animation
    });
  };
  const getFieldKey = (label: any) => {
    if (formData) {
      const field = generalFields ? generalFields.find((f: any) => f.display_name === label) : null;
      return field ? field.db_column_name : ''
    }
    else {
      return ""
    }
  };
  const getFieldValue = (label: any) => {
    if (rowData) {
      console.log("label", label)
      const field = generalFields ? generalFields.find((f: any) => f.display_name === label) : null;
      return field ? rowData[field.db_column_name] || '' : '';
    }
    else {
      return "jareen"
    }
  };
  return (
    <div className='bg-gray-50'>
      <h3 className="text-lg font-semibold mb-2 text-blue-500 bg-gray-200 pl-2 py-2">Basic Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="field-label">Partner</label>
          <Select
            value={rowData ? { value: getFieldValue('Partner'), label: getFieldValue('Partner') } : { value: tenant, label: tenant }}
            onChange={handlePartnerChange}
            options={Partneroptions.map((option: string) => ({
              label: option,
              value: option,
            }))}
            styles={editableDrp}
          />
        </div>

        <div>
          <label className="field-label">Sub Partner</label>
          <Select
            isMulti
            value={rowData ? { value: getFieldValue('Sub Partner'), label: getFieldValue('Sub Partner') } : subPartnersoptions.filter(option => selectedSubPartner.includes(option.value))}
            onChange={handleSetSubPartner}
            options={subPartners.length > 0 ? subPartnersoptions : subPartnersnoOptions}
            styles={editableDrp}
          />

        </div>
        <div>
          <label className="field-label">First Name</label>
          <input type="text" className="input" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
        </div>
        <div>
          <label className="field-label">Last Name</label>
          <input type="text" className="input" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
        </div>
        <div>
          <label className="field-label">Username<span className="text-red-500">*</span></label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
          />
          {errorMessages.includes('Username is required.') && (
            <span className="text-red-600 ml-1">Username is required.</span>
          )}
        </div>
        <div>
          <label className="field-label">Email Id<span className="text-red-500">*</span></label>
          <input
            type="email"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            className="input"
          />
          {errorMessages.includes('Email id is required.') && (
            <span className="text-red-600 ml-1">Email id is required.</span>
          )}
        </div>
        <div>

          <label className="field-label">Mobile No</label>
          <input type="text"
            className="input"
            value={mobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">Role<span className="text-red-500">*</span></label>
          <Select
            value={rowData ? { value: getFieldValue('Role'), label: getFieldValue('Role') } : { value: role_name, label: role_name }}
            onChange={handlesetRole}
            options={Roleoptions.map((option: string) => ({
              label: option,
              value: option,
            }))}
            styles={editableDrp}
          />
          {errorMessages.includes('Role is required.') && (
            <span className="text-red-600 ml-1">Role is required.</span>
          )}
        </div>
        <div>
          <label className="field-label">Password<span className="text-red-500">*</span></label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          {errorMessages.includes('Password is required.') && (
            <span className="text-red-600 ml-1">Password is required.</span>
          )}
        </div>
        <div>
          <label className="field-label">Phone</label>
          <input type="text"
            className="input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      <div>
        <h3 className="tabs-sub-headings">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="field-label">Notification Enable<span className="text-red-500">*</span></label>
            <Select
              styles={editableDrp}
              value={rowData ? { value: getFieldValue('Notification Enable'), label: getFieldValue('Notification Enable') } : { value: '', label: '' }}
              options={Notificationoptions}
              onChange={handleNotification}
            />
            {errorMessages.includes('Notification is required.') && (
              <span className="text-red-600 ml-1">Notification is required.</span>
            )}
          </div>
          <div>
            <label className="field-label">Business Name</label>
            <input type="text"
              className="input"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Locale</label>
            <input type="text"
              className="input"
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Apt/Suite</label>
            <input type="text"
              className="input"
              value={aptSuite}
              onChange={(e) => setAptSuite(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Address Line-1</label>
            <input type="text"
              className="input"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Address Line-2</label>
            <input type="text"
              className="input"
              value={rowData?getFieldValue('Address Line-2'):addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Country</label>
            <input type="text"
              className="input"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">State</label>
            <input type="text"
              className="input"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">City</label>
            <input type="text"
              className="input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Time Zone</label>
            <input type="text"
              className="input"
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
            />
          </div>

          <div>
            <label className="field-label">Zip</label>
            <input type="text"
              className="input"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-3">
        <button className="cancel-btn">
          <XMarkIcon className="h-5 w-5 text-black-500 mr-2" />
          <span>Cancel</span>
        </button>
        <button
          className="save-btn"
          onClick={()=>setShowModal(true)}
        >
          <CheckIcon className="h-5 w-5 text-black-500 mr-2" />
          <span>Save</span>

        </button>
      </div>
      {showModal && (
        <Modal
          title="Confirmation"
          open={showModal}
          onOk={handleConfirmSave}
          onCancel={handleCancelSave}
          centered
        >
          <p>Are you sure you want to save this page?</p>
        </Modal>
      )}
    </div>
  );
};

export default UserInfo;
