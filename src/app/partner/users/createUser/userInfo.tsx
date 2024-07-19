import React, { useState, useEffect } from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import Select, { MultiValue, SingleValue } from 'react-select';
import countries from '@/app/constants/locationdetails';
import { Country, State, City } from '@/app/constants/locationdetails';
import { getCities, getCityDetails, getStates } from '@/app/constants/locationdetails';
import { partnerCarrierData, subPartnersData } from '@/app/constants/partnercarrier';
import { NonEditableDropdownStyles, DropdownStyles } from '@/app/components/css/dropdown';
type OptionType = {
  value: string;
  label: string;
};

const partners = [
  "AWX",
  "Altawork-GT",
  "AWX-AWX",
  "AWX Test",
  "CSV RS AG",
  "Go-Tech-AWX-Test",
  "GT"
];

const roles = [
  "Agent",
  "Agent Partner Admin",
  "Notification Only User",
  "Partner Admin",
  "Super Admin",
  "User"
];
const Partneroptions = Object.keys(partnerCarrierData).map(partner => ({ value: partner, label: partner }));
const editableDrp = DropdownStyles;
const nonEditableDrp = NonEditableDropdownStyles;
const Roleoptions = roles.map((role, index) => ({
  value: role.toLowerCase().replace(/\s+/g, '-'),
  label: role,
}));

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
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [selectedZipCode, setSelectedZipCode] = useState<string>('');
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>('');
  const [selectedPartner, setSelectedPartner] = useState<string>('');
  const [selectedSubPartner, setSelectedSubPartner] = useState<string[]>([]);
  const [subPartners, setSubPartners] = useState<string[]>([]);
  const subPartnersoptions = subPartners.map(subPartner => ({ value: subPartner, label: subPartner }));
  const subPartnersnoOptions = [{ value: '', label: 'No sub-partners available' }];


  useEffect(() => {
    if (rowData) {
      setUsername(rowData['User Name'] || '');
      setEmail(rowData['Email Id'] || '');
      setRole({ value: rowData['Role'].toLowerCase().replace(/\s+/g, '-'), label: rowData['Role'] } || null);
      setPartner({ value: rowData['Partner'], label: rowData['Partner'] } || null);
      setSelectedPartner(rowData['Partner'] || '');
      setSubPartners(subPartnersData[rowData['Partner']] || []);
      setSelectedSubPartner(rowData['Sub Partner'] || '');
    }
  }, [rowData]);

  const handlePartnerChange = (selectedOption: SingleValue<OptionType>) => {
    if (selectedOption) {
      const partner = selectedOption.value;
      setSelectedPartner(partner);
      setSubPartners(partner === 'Altaworx' ? subPartnersData[partner] || [] : []);
      setSelectedSubPartner([]); // Reset sub-partner when partner changes
    } else {
      setSelectedPartner('');
      setSubPartners([]);
      setSelectedSubPartner([]); // Reset sub-partner when no partner is selected
    }
  };
  
  const handleSetSubPartner = (selectedOptions: MultiValue<OptionType>) => {
    const selectedSubPartners = selectedOptions.map(option => option.value);
    setSelectedSubPartner(selectedSubPartners);
  };

  const handleSetPartner = (selectedOption: SingleValue<OptionType>) => {
    setPartner(selectedOption);
  };
  const handlesetRole = (selectedOption: SingleValue<OptionType>) => {
    setRole(selectedOption);
    if (selectedOption) {
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

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const countryId = parseInt(event.target.value);
    setSelectedCountry(countryId);
    setSelectedState(null); // Reset selected state when country changes
    setSelectedCity(null); // Reset selected city when country changes
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const stateId = parseInt(event.target.value);
    setSelectedState(stateId);
    setSelectedCity(null); // Reset selected city when state changes
  };

  const handleCityChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = parseInt(event.target.value);
    setSelectedCity(cityId);
    try {
      if (selectedCountry !== null && selectedState !== null && cityId !== null) {
        const cityDetails = await getCityDetails(selectedCountry, selectedState, cityId);
        if (cityDetails) {
          setSelectedZipCode(cityDetails.zipCode);
          setSelectedTimeZone(cityDetails.timeZone);
        }
      }
    } catch (error) {
      console.error('Error fetching city details:', error);
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

  return (
    <div className='bg-gray-50'>
      <h3 className="text-lg font-semibold mb-2 text-blue-500 bg-gray-200 pl-2 py-2">Basic Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="field-label">Partner</label>
          <Select
            value={{ value: selectedPartner, label: selectedPartner }}
            onChange={handlePartnerChange}
            options={Partneroptions}
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
          <input type="text" className="input" />
        </div>
        <div>
          <label className="field-label">Last Name</label>
          <input type="text" className="input" />
        </div>
        <div>
          <label className="field-label">Username<span className="text-red-500">*</span></label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            className="input"
          />
          {errorMessages.includes('Username is required.') && (
            <span className="text-red-600 ml-1">Username is required.</span>
          )}
        </div>
        <div>
          <label className="field-label">Email id<span className="text-red-500">*</span></label>
          <input
            type="email"
            value={email}
            onChange={handleEmailID}
            className="input"
          />
          {errorMessages.includes('Email id is required.') && (
            <span className="text-red-600 ml-1">Email id is required.</span>
          )}
        </div>
        <div>

          <label className="field-label">Mobile no</label>
          <input type="text"
            className="input" />
        </div>
        <div>
          <label className="field-label">Role<span className="text-red-500">*</span></label>
          <Select
            value={role}
            onChange={handlesetRole}
            options={Roleoptions}
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
            className="input" />
        </div>
      </div>

      <div>
        <h3 className="tabs-sub-headings">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="field-label">Notification enable<span className="text-red-500">*</span></label>
            <Select
              styles={editableDrp}
              value={notification}
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
              className="input" />
          </div>
          <div>
            <label className="field-label">Locale</label>
            <input type="text"
              className="input" />
          </div>
          <div>
            <label className="field-label">Apt/Suite</label>
            <input type="text"
              className="input" />
          </div>
          <div>
            <label className="field-label">Address Line-1</label>
            <input type="text"
              className="input" />
          </div>
          <div>
            <label className="field-label">Address Line-2</label>
            <input type="text"
              className="input" />
          </div>
          <div>
            <label className="field-label">Country</label>
            <input type="text"
              className="input" />
          </div>
          <div>
            <label className="field-label">State</label>
            <input type="text"
              className="input" />
          </div>
          <div>
            <label className="field-label">City</label>
            <input type="text"
              className="input" />
          </div>
          <div>
            <label className="field-label">Time Zone</label>
            <input type="text"
              className="input" />
          </div>

          <div>
            <label className="field-label">Zip</label>
            <input type="text"
              className="input" />
          </div>
          {/*   
    <div>
            <label className="field-label">Country</label>
            <select
              value={selectedCountry || ''}
              onChange={handleCountryChange}
              className="input"
              style={{ height: '2.6rem' }}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id.toString()}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">State</label>
            <select
              value={selectedState || ''}
              onChange={handleStateChange}
              className="input"
              style={{ height: '2.6rem' }}
            >
              <option value="">Select State</option>
              {selectedCountry && getStates(selectedCountry)?.map((state) => (
                <option key={state.id} value={state.id.toString()}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">City</label>
            <select
              value={selectedCity || ''}
              onChange={handleCityChange}
              className="input"
              style={{ height: '2.6rem' }}
            >
              <option value="">Select City</option>
              {selectedState && getCities(selectedCountry!, selectedState!)?.map((city) => (
                <option key={city.id} value={city.id.toString()}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Time zone</label>
            <input
              type="text"
              value={selectedTimeZone}
              readOnly
              className="input"
            />
          </div>
          <div>
            <label className="field-label">Zip</label>
            <input
              type="text"
              value={selectedZipCode}
              readOnly
              className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300"
            />
          </div> */}
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
