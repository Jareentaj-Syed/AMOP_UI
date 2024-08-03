import React, { useState, useEffect } from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import Select, { MultiValue, SingleValue } from 'react-select';
import { NonEditableDropdownStyles, DropdownStyles } from '@/app/components/css/dropdown';
import { useUserStore } from './createUserStore';
import { subPartnersData } from '@/app/constants/partnercarrier';
import { usePartnerStore } from '../../partnerStore';

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
}

const UserInfo: React.FC<UserInfoProps> = ({ rowData }) => {


  const [partner, setPartner] = useState<SingleValue<OptionType>>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<SingleValue<OptionType>>(null);
  const [notification, setNotification] = useState<SingleValue<OptionType>>(null);
  const [password, setPassword] = useState('');
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [selectedSubPartner, setSelectedSubPartner] = useState<string[]>([]);
  const [subPartners, setSubPartners] = useState<string[]>([]);
  const [Partneroptions, setPartneroptions] = useState<string[]>([]);
  const [Roleoptions, setRoleoptions] = useState<string[]>([]);
  const [generalFields, setGeneralFields] = useState<any[]>([]);

  const subPartnersoptions = subPartners.map(subPartner => ({ value: subPartner, label: subPartner }));
  const subPartnersnoOptions = [{ value: '', label: 'No sub-partners available' }];
  const usersData = partnerData["Partner users"]?.data?.["Partner users"] || {};



  console.log("userData", usersData)
  useEffect(() => {
    const initializeData = () => {
      const general_fields = partnerData["Partner users"]?.headers_map?.["Partner users"]?.general_fields || {}
      const partneroptions: any[] = usersData?.tenant ? Object.keys(usersData.tenant) : []
      const roleoptions: any[] = usersData?.role_name || []
      setRoleoptions(roleoptions)
      setPartneroptions(partneroptions)
      setGeneralFields(general_fields)
      console.log("general_fields", general_fields)


    };

    initializeData();
  }, [usersData]);


  const {
    tenant,
    role_name,
    sub_tenant,
    setTenant,
    setRoleName,
    setSubTenant
  } = useUserStore();

  // useEffect(() => {
  //   if (rowData) {
  //     setUsername(rowData['username'] || '');
  //     setEmail(rowData['email'] || '');
  //     setRole(rowData['role'] ? { value: rowData['role'], label: rowData['role'] } : null);
  //     setPartner(rowData['tenant_name'] ? { value: rowData['tenant_name'], label: rowData['tenant_name'] } : null);
  //     setSubPartners(subPartnersData[rowData['tenant_name']] || []);
  //     setSelectedSubPartner(rowData['subtenant_name'] || '');
  //     setSubTenant(rowData['subtenant_name'] || '');
  //   }
  // }, [rowData]);

  const handlePartnerChange = (selectedOption: SingleValue<OptionType>) => {
    if (selectedOption) {
      const partner = selectedOption.value;
      setTenant(partner);
      setSubPartners(subPartnersData[partner] || []);
      setSelectedSubPartner([]); // Reset sub-partner when partner changes
      setSubTenant([])
    } else {
      setTenant('');
      setSubPartners([]);
      setSelectedSubPartner([]); // Reset sub-partner when no partner is selected
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

  const handleSave = () => {
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'auto'  // Optional: Smooth scroll animation
    });
  };
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setUsername(newValue);

    // Remove 'Username is required.' from error messages if the input is not empty
    if (newValue) {
      setErrorMessages(prevErrors => prevErrors.filter(error => error !== 'Username is required.'));
    }
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPassword(newValue);

    // Remove 'Username is required.' from error messages if the input is not empty
    if (newValue) {
      setErrorMessages(prevErrors => prevErrors.filter(error => error !== 'Password is required.'));
    }
  };
  const handleEmailID = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setEmail(newValue);

    // Remove 'Username is required.' from error messages if the input is not empty
    if (newValue) {
      setErrorMessages(prevErrors => prevErrors.filter(error => error !== 'Email id is required.'));
    }
  };
  const handleChange = () => {
    console.log("changed")
  };
  const getFieldValue = (label: any) => {
    if(rowData){
      console.log("label",label)
      const field = generalFields?generalFields.find((f: any) => f.display_name === label) :null;
      return field ? rowData[field.db_column_name] || '' : '';
    }
   else{
    return ""
   }
  };
  return (
    <div className='bg-gray-50'>
      <h3 className="text-lg font-semibold mb-2 text-blue-500 bg-gray-200 pl-2 py-2">Basic Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="field-label">Partner</label>
          <Select
            value={{ value: tenant, label: tenant }}
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
            value={subPartnersoptions.filter(option => selectedSubPartner.includes(option.value))}
            onChange={handleSetSubPartner}
            options={subPartners.length > 0 ? subPartnersoptions : subPartnersnoOptions}
            styles={editableDrp}
          />

        </div>
        <div>
          <label className="field-label">First Name</label>
          <input type="text" className="input" value={getFieldValue('First Name')} onChange={handleChange}/>
        </div>
        <div>
          <label className="field-label">Last Name</label>
          <input type="text" className="input" value={getFieldValue('Last Name')} onChange={handleChange} />
        </div>
        <div>
          <label className="field-label">Username<span className="text-red-500">*</span></label>
          <input
            type="text"
            value={getFieldValue('Username')}
            onChange={handleUsernameChange}
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
            value={getFieldValue('Email Id')}
            onChange={handleEmailID}
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
            value={getFieldValue('Mobile No')}
            onChange={handleChange}
            />
        </div>
        <div>
          <label className="field-label">Role<span className="text-red-500">*</span></label>
          <Select
            value={rowData?{value:getFieldValue('Role'),label:getFieldValue('Role')}:{ value: role_name, label: role_name }}
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
            value={getFieldValue('Password')}
            onChange={handlePassword}
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
            value={getFieldValue('Phone')}
            onChange={handleChange}
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
              value={rowData?{value:getFieldValue('Notification Enable'),label:getFieldValue('Notification Enable')}:{value:'',label:''}}
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
            value={getFieldValue('Business Name')}
            onChange={handleChange}
            />
          </div>
          <div>
            <label className="field-label">Locale</label>
            <input type="text"
              className="input"
            value={getFieldValue('Locale')}
            onChange={handleChange}
            />
          </div>
          <div>
            <label className="field-label">Apt/Suite</label>
            <input type="text"
              className="input"
            value={getFieldValue('Apt/Suite')}
            onChange={handleChange}
            />
          </div>
          <div>
            <label className="field-label">Address Line-1</label>
            <input type="text"
              className="input"
            value={getFieldValue('Address Line-1')}
            onChange={handleChange}
            />
          </div>
          <div>
            <label className="field-label">Address Line-2</label>
            <input type="text"
              className="input"
            value={getFieldValue('Address Line-2')}
            onChange={handleChange}
            />
          </div>
          <div>
            <label className="field-label">Country</label>
            <input type="text"
              className="input"
            value={getFieldValue('Country')}
            onChange={handleChange}
            />
          </div>
          <div>
            <label className="field-label">State</label>
            <input type="text"
              className="input" 
            value={getFieldValue('State')}
            onChange={handleChange}
            />
          </div>
          <div>
            <label className="field-label">City</label>
            <input type="text"
              className="input"
            value={getFieldValue('City')}
            onChange={handleChange}
            />
          </div>
          <div>
            <label className="field-label">Time Zone</label>
            <input type="text"
              className="input" 
            value={getFieldValue('Time Zone')}
            onChange={handleChange}
            />
          </div>

          <div>
            <label className="field-label">Zip</label>
            <input type="text"
              className="input"
            value={getFieldValue('Zip')}
            onChange={handleChange}
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
          onClick={handleSave}
        >
          <CheckIcon className="h-5 w-5 text-black-500 mr-2" />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};

export default UserInfo;
