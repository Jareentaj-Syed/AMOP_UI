import React, { useState, useEffect } from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import Select, { MultiValue, SingleValue } from 'react-select';
import { NonEditableDropdownStyles, DropdownStyles } from '@/app/components/css/dropdown';
import { useUserStore } from './createUserStore';
import { usePartnerStore } from '../../partnerStore';
import { getCurrentDateTime } from '@/app/components/header_constants';
import axios from 'axios';
import { useAuth } from '@/app/components/auth_context';
import { Modal, notification } from 'antd';
import { isString } from 'antd/es/button';


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
  isPopup?: any;
  editable?: boolean;
}

const UserInfo: React.FC<UserInfoProps> = ({ rowData, isPopup, editable }) => {
  const {
    username: user,
    tenantNames: tenants,
    role: userRole,
    partner: userPartner,
    settabledata: setData
  } = useAuth();
  console.log("editable", editable)
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
  const [Notification, setNotification] = useState<SingleValue<OptionType>>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [selectedSubPartner, setSelectedSubPartner] = useState<string[]>([]);
  const [subPartners, setSubPartners] = useState<string[]>([]);
  const [Partneroptions, setPartneroptions] = useState<string[]>([]);
  const [Roleoptions, setRoleoptions] = useState<string[]>([]);
  const [generalFields, setGeneralFields] = useState<any[]>([]);
  const [subPartnersData, setsubPartnersData] = useState<any>({});
  const [subPartnersoptions, setsubPartnersoptions] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>(rowData || {});
  //Show Modal
  const [showModal, setShowModal] = useState(false);

  const {
    tenant,
    role_name,
    sub_tenant,
    setTenant,
    setRoleName,
    setSubTenant,
    setUser_Name
  } = useUserStore();
  const subPartnersnoOptions = [{ value: '', label: 'No sub-partners available' }];
  const usersData = partnerData["Partner users"]?.data?.["Partner users"] || {};
  const getFieldValue = (label: any) => {
    if (rowData) {
      const general_fields = partnerData["Partner users"]?.headers_map?.["Partner users"]?.general_fields || {}
      const field = general_fields ? general_fields.find((f: any) => f.display_name === label) : null;
      return field ? formData[field.db_column_name] || '' : '';
    }
    else {
      return ""
    }
  };


  useEffect(() => {
    const initializeData = () => {
      const general_fields = partnerData["Partner users"]?.headers_map?.["Partner users"]?.general_fields || {}
      const partner_options: any[] = usersData?.tenant ? Object.keys(usersData.tenant) : []
      const subPartners_Data = usersData?.tenant || {}
      const sub_partners = subPartners_Data[tenant] || []
      const role_options: any[] = usersData?.role_name || []
      const subPartners_options = sub_partners.map((subPartner: any) => ({ value: subPartner, label: subPartner }));
      setsubPartnersData(subPartners_Data)
      setSubPartners(sub_partners);
      setsubPartnersoptions(subPartners_options)
      setRoleoptions(role_options)
      setPartneroptions(partner_options)
      setGeneralFields(general_fields)
      setTenant('')

    };

    initializeData();
  }, [usersData]);

  useEffect(() => {
    if (rowData) {
      setFormData(rowData)
    }
  }, [rowData]);

  useEffect(() => {
    const initializeData = () => {
      if (rowData) {
        setFormData(rowData)
        console.log("tenant", `bbb${tenant}bbb`)

        const tenant_name = tenant !== "" ? tenant : getFieldValue('Partner');
        setPartner(tenant_name);
        setTenant(tenant_name)
        console.log("tenant", `aaa${tenant}aaa`)
        const role_name = getFieldValue('Role') || ""
        setRole(role_name)
        setRoleName(role_name)
        const subPartnerFieldValue = getFieldValue('Sub Partner');
        const subPartners_Data = usersData?.tenant || {}
        let parsedSubPartners: string[] = [];
        try {
          parsedSubPartners = JSON.parse(subPartnerFieldValue);
        } catch (error) {
          if (subPartnerFieldValue && subPartnerFieldValue !== 'None') {
            parsedSubPartners = [subPartnerFieldValue];
          }
        }
        const sub_partners = subPartners_Data[tenant_name] || []
        const subpartner_options = sub_partners.map((subPartner: any) => ({ value: subPartner, label: subPartner }))
        setSelectedSubPartner(parsedSubPartners)
        setSubPartners(sub_partners)
        setSubTenant(sub_partners)
        setsubPartnersoptions(subpartner_options)
        setPartner(getFieldValue('Sub Partner'));
        const fields = [
          { stateSetter: setFirstName, fieldName: 'First Name' },
          { stateSetter: setLastName, fieldName: 'Last Name' },
          { stateSetter: setUsername, fieldName: 'Username' },
          { stateSetter: setUser_Name, fieldName: 'Username' },
          { stateSetter: setEmailId, fieldName: 'Email Id' },
          { stateSetter: setMobileNo, fieldName: 'Mobile No' },
          { stateSetter: setPassword, fieldName: 'Password' },
          { stateSetter: setPhone, fieldName: 'Phone' },
          { stateSetter: setBusinessName, fieldName: 'Business Name' },
          { stateSetter: setLocale, fieldName: 'Locale' },
          { stateSetter: setAptSuite, fieldName: 'Apt/Suite' },
          { stateSetter: setAddressLine1, fieldName: 'Address Line-1' },
          { stateSetter: setAddressLine2, fieldName: 'Address Line-2' },
          { stateSetter: setCountry, fieldName: 'Country' },
          { stateSetter: setState, fieldName: 'State' },
          { stateSetter: setCity, fieldName: 'City' },
          { stateSetter: setTimeZone, fieldName: 'Time Zone' },
          { stateSetter: setZip, fieldName: 'Zip' },
        ];

        // Iterate over the fields array to set each state
        fields.forEach(({ stateSetter, fieldName }) => {
          stateSetter(getFieldValue(fieldName));
        });
      }
    };

    initializeData();
  }, [usersData, rowData]);

  let sub_partners;
  const handlePartnerChange = (selectedOption: SingleValue<OptionType>) => {
    if (selectedOption) {
      const partner = selectedOption.value;
      setTenant(partner);
      const sub_partners = subPartnersData[partner] || []
      const role_options: any[] = usersData?.role_name || []
      const subPartners_options = sub_partners.map((subPartner: any) => ({ value: subPartner, label: subPartner }));
      setSubPartners(sub_partners);
      setPartner(selectedOption)
      setsubPartnersoptions(subPartners_options)
      setSubPartners(sub_partners);
      setSelectedSubPartner([]);
      setSubTenant([])
      if (rowData) {
        // rowData[getFieldKey('Partner')]=partner || ""
        setFormData((prevState: any) => ({ ...prevState, [getFieldKey('Partner')]: partner }));

      }
      setErrorMessages(prevErrors => prevErrors.filter(error => error !== 'Partner is required.'));
    } else {
      setTenant('');
      setSubPartners([]);
      setSelectedSubPartner([]);
    }
  };

  const handleSetSubPartner = (selectedOptions: MultiValue<OptionType>) => {
    const selectedSubPartners = selectedOptions.map(option => option.value);
    setSelectedSubPartner(selectedSubPartners);
    if (rowData) {
      setFormData((prevState: any) => ({ ...prevState, [getFieldKey('Sub Partner')]: selectedSubPartners }));
      // rowData[getFieldKey('Sub Partner')]=selectedSubPartners || []
    }
  };
  const handlesetRole = (selectedOption: SingleValue<OptionType>) => {
    if (selectedOption) {
      const role = selectedOption.value
      setRole(selectedOption);
      setRoleName(role)
      if (rowData) {
        // formData[getFieldKey('Partner')]=partner
        setFormData((prevState: any) => ({ ...prevState, [getFieldKey('Role')]: role }));
      }
      setErrorMessages(prevErrors => prevErrors.filter(error => error !== 'Role is required.'));
    }
  };
  const handleNotification = (selectedOption: SingleValue<OptionType>) => {
    setNotification(selectedOption);
    if (rowData) {
      setFormData((prevState: any) => ({ ...prevState, [getFieldKey('Notification Enable')]: selectedOption?.value }));
      // rowData[getFieldKey('Notification Enable')]=selectedOption?.value || "No"
    }
    if (selectedOption) {
      setErrorMessages(prevErrors => prevErrors.filter(error => error !== 'Notification is required.'));
    }
  };
  const messageStyle = {
    fontSize: '14px',  // Adjust font size
    fontWeight: 'bold', // Make the text bold
    padding: '16px',
    // Add padding
  };

  //Clearing fields after the form submission
  const handleClearFields = () => {
    setFirstName('');
    setLastName('');
    setUsername('');
    setEmailId('');
    setMobileNo('');
    setPassword('');
    setPhone('');
    setBusinessName('');
    setLocale('');
    setAptSuite('');
    setAddressLine1('');
    setAddressLine2('');
    setCountry('');
    setState('');
    setCity('');
    setTimeZone('');
    setZip('');
    setPartner(null);
    setRole(null);
    setNotification(null);
    setSelectedSubPartner([]);
    setSubPartners([]);
    setFormData({});
  };

  const handleSave = async () => {
    const errors: string[] = [];
    if (!partner) errors.push('Partner is required.');
    if (!username) errors.push('Username is required.');
    if (!emailId) errors.push('Email id is required.');
    if (!role) errors.push('Role is required.');
    if (!password) errors.push('Password is required.');
    if (!Notification) errors.push('Notification is required.')
    setErrorMessages(errors);
    if (errors.length === 0) {
      setUser_Name(username)
      try {
        const url =
          "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management";

        let changedData: any = {};
        const tenant_name = selectedSubPartner ? selectedSubPartner : partner || []
        changedData[getFieldKey('Partner')] = tenant;
        changedData[getFieldKey('Sub Partner')] = selectedSubPartner;
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
        changedData["is_active"] = true;
        changedData["is_deleted"] = false;
        changedData["created_by"] = user;
        changedData["modified_date"] = getCurrentDateTime();

        const data = {
          tenant_name: userPartner || "default_value",
          username: user,
          path: "/update_partner_info",
          role_name: userRole,
          module_name: "Partner users",
          action: rowData ? "update" : "create",
          request_received_at: getCurrentDateTime(),
          changed_data: {
            "user_info": changedData
          },
          Partner: userPartner,
        };
        const response = await axios.post(url, { data });
        const parsedData = JSON.parse(response.data.body);
        if (response && response.data.statusCode === 200) {
          // Show success message
          notification.success({
            message: 'Success',
            description: 'Successfully saved the form',
            style: messageStyle,
            placement: 'top', // Apply custom styles here
          });
          handleClearFields();
        }
        else {
          Modal.error({
            title: 'Submit Error',
            content: parsedData.message || 'An error occurred while submitting the form. Please try again.',
            centered: true,
          });
        }
      }
      catch (error) {
        console.log(
          error
        )
      }
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
  return (
    <div className='bg-gray-50'>
      <h3 className="text-lg font-semibold mb-2 text-blue-500 bg-gray-200 pl-2 py-2">Basic Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="field-label">Partner<span className="text-red-500">*</span></label>
          <Select
            isDisabled={!editable}
            value={{ value: tenant, label: tenant }}
            onChange={handlePartnerChange}
            options={Partneroptions.map((option: string) => ({
              label: option,
              value: option,
            }))}
            styles={editable ? editableDrp : nonEditableDrp}
          />
          {errorMessages.includes('Partner is required.') && (
            <span className="text-red-600 ml-1">Partner is required.</span>
          )}
        </div>

        <div>
          <label className="field-label">Sub Partner</label>
          <Select
            isMulti
            isDisabled={!editable}
            value={subPartnersoptions.filter(option => selectedSubPartner.includes(option.value))}
            onChange={handleSetSubPartner}
            options={subPartnersoptions?.length > 0 ? subPartnersoptions : subPartnersnoOptions}
            styles={editable ? editableDrp : nonEditableDrp}
          />

        </div>
        <div>
          <label className="field-label">First Name</label>
          <input
            type="text"
            className={`${editable ? 'input' : 'non-editable-input'}`}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={!editable} />
        </div>
        <div>
          <label className="field-label">Last Name</label>
          <input type="text" className={`${editable ? 'input' : 'non-editable-input'}`} value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={!editable} />
        </div>
        <div>
          <label className="field-label">Username<span className="text-red-500">*</span></label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`${editable ? 'input' : 'non-editable-input'}`}
            disabled={!editable}
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
            className={`${editable ? 'input' : 'non-editable-input'}`}
            disabled={!editable}
          />
          {errorMessages.includes('Email id is required.') && (
            <span className="text-red-600 ml-1">Email id is required.</span>
          )}
        </div>
        <div>

          <label className="field-label">Mobile No</label>
          <input type="text"
            className={`${editable ? 'input' : 'non-editable-input'}`}
            value={mobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
            disabled={!editable} />
          
        </div>
        <div>
          <label className="field-label">Role<span className="text-red-500">*</span></label>
          <Select
            isDisabled={!editable}
            value={{ value: role_name, label: role_name }}
            onChange={handlesetRole}
            options={Roleoptions.map((option: string) => ({
              label: option,
              value: option,
            }))}
            styles={editable ? editableDrp : nonEditableDrp}
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
            className={`${editable ? 'input' : 'non-editable-input'}`}
            disabled={!editable}
          />
          {errorMessages.includes('Password is required.') && (
            <span className="text-red-600 ml-1">Password is required.</span>
          )}
        </div>
        <div>
          <label className="field-label">Phone</label>
          <input type="text"
            className={`${editable ? 'input' : 'non-editable-input'}`}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!editable} />
        
        </div>
      </div>

      <div>
        <h3 className="tabs-sub-headings">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="field-label">Notification Enable<span className="text-red-500">*</span></label>
            <Select
              isDisabled={!editable}
              styles={editable ? editableDrp : nonEditableDrp}
              value={rowData ? { value: getFieldValue('Notification Enable'), label: getFieldValue('Notification Enable') } : Notification}
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
              className={`${editable ? 'input' : 'non-editable-input'}`}
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              disabled={!editable}
            />
          </div>
          <div>
            <label className="field-label">Locale</label>
            <input type="text"
              className={`${editable ? 'input' : 'non-editable-input'}`}
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              disabled={!editable}
            />
          </div>
          <div>
            <label className="field-label">Apt/Suite</label>
            <input type="text"
              className={`${editable ? 'input' : 'non-editable-input'}`}
              value={aptSuite}
              onChange={(e) => setAptSuite(e.target.value)}
              disabled={!editable}
            />
          </div>
          <div>
            <label className="field-label">Address Line-1</label>
            <input type="text"
              className={`${editable ? 'input' : 'non-editable-input'}`}
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              disabled={!editable}
            />
          </div>
          <div>
            <label className="field-label">Address Line-2</label>
            <input type="text"
              className={`${editable ? 'input' : 'non-editable-input'}`}
              value={rowData ? getFieldValue('Address Line-2') : addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              disabled={!editable}
            />
          </div>
          <div>
            <label className="field-label">Country</label>
            <input type="text"
              className={`${editable ? 'input' : 'non-editable-input'}`}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              disabled={!editable}
            />
          </div>
          <div>
            <label className="field-label">State</label>
            <input type="text"
              className={`${editable ? 'input' : 'non-editable-input'}`}
              value={state}
              onChange={(e) => setState(e.target.value)}
              disabled={!editable}
            />
          </div>
          <div>
            <label className="field-label">City</label>
            <input type="text"
              className={`${editable ? 'input' : 'non-editable-input'}`}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!editable}
            />
          </div>
          <div>
            <label className="field-label">Time Zone</label>
            <input type="text"
              className={`${editable ? 'input' : 'non-editable-input'}`}
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              disabled={!editable}
            />
          </div>

          <div>
            <label className="field-label">Zip</label>
            <input type="text"
              className={`${editable ? 'input' : 'non-editable-input'}`}
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              disabled={!editable}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-3">
        {/* <button className="cancel-btn">
          <XMarkIcon className="h-5 w-5 text-black-500 mr-2" />
          <span>Cancel</span>
        </button> */}
        <button
          className="save-btn"
          onClick={() => setShowModal(true)}
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
