"use client";
import React, { useState } from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import countries from '@/app/constants/locationdetails';
import Select , { SingleValue }  from 'react-select';
import { Country, State, City } from '@/app/constants/locationdetails';

import { getCities, getCityDetails, getStates} from '@/app/constants/locationdetails';
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

const Roleoptions = roles.map((role, index) => ({
  value: role.toLowerCase().replace(/\s+/g, '-'),
  label: role,
}));

const Notificationoptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

const UserInfo: React.FC = () => {
  const [partner, setPartner] = useState<SingleValue<OptionType>>(null);

  const options = partners.map(partner => ({
    value: partner.toLowerCase().replace(/\s+/g, '-'),
    label: partner
  }));

  const handleChange = (selectedOption: SingleValue<OptionType>) => {
    setPartner(selectedOption);
  };
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<SingleValue<OptionType>>(null);
  const [password, setPassword] = useState('');
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [selectedZipCode, setSelectedZipCode] = useState<string>('');
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>('');
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

  const handleSave = () => {
    const errors: string[] = [];
    if (!partner) errors.push('Partner is required.');
    if (!username) errors.push('Username is required.');
    if (!email) errors.push('Email id is required.');
    if (!role) errors.push('Role is required.');
    if (!password) errors.push('Password is required.');

    setErrorMessages(errors);

    if (errors.length === 0) {
      console.log('Saving...');
    }
  };
  
  

  const getStates = (countryId: number): State[] | undefined => {
    const country = countries.find((country) => country.id === countryId);
    return country?.states;
  };


  const getCities = (countryId: number, stateId: number): City[] | undefined => {
    const states = getStates(countryId);
    const state = states?.find((state) => state.id === stateId);
    return state?.cities;
  };
  
  return (
    <div className='bg-gray-50'>
      <div>
      <h3 className="text-lg font-semibold mb-2 text-blue-500 bg-gray-200 pl-4 py-2">
  Basic Information
</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
      <label className="block text-gray-700">Partner</label>
      <Select
        value={partner}
        onChange={handleChange}
        options={options}
       
        styles={{
          control: (base,state) => ({
            ...base,
            marginTop:'5px',
            height: '2.6rem',
            borderRadius: '0.375rem',
            borderColor: state.isFocused ? '#1640ff' : '#D1D5DB',
            boxShadow: state.isFocused ? '0 0 0 1px #93C5FD' : 'none',
          }),
        }}
      />
    </div>
          <div>
            <label className="block text-gray-700">First Name</label>
            <input type="text" className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 " />
          </div>
          <div>
            <label className="block text-gray-700">Last Name</label>
            <input type="text" className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 " />
          </div>
          <div>
            <label className="block text-gray-700">Username</label>
            <input type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 " />
          </div>
          <div>
            <label className="block text-gray-700">Email id</label>
            <input type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 "/>     
               </div>
          <div>
            <label className="block text-gray-700">Mobile no</label>
            <input type="text" 
          className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 "/>     
          </div>
          <div>
      <label className="block text-gray-700">Role</label>
      <Select
        value={role}
        onChange={handleChange}
        options={Roleoptions}
       
        styles={{
          control: (base,state) => ({
            ...base,
            marginTop:'5px',
            height: '2.6rem',
            borderRadius: '0.375rem',
            borderColor: state.isFocused ? '#1640ff' : '#D1D5DB',
            boxShadow: state.isFocused ? '0 0 0 1px #93C5FD' : 'none',
          }),
        }}
      />
    </div>
 
          <div>
            <label className="block text-gray-700">Password</label>
            <input type="password" 
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 "/>     
          </div>
          <div>
            <label className="block text-gray-700">Phone</label>
            <input type="text" 
          className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 "/>     
          </div>
        </div>
      </div>

      <div>
  <h3 className="text-lg font-semibold mb-2 text-blue-500 bg-gray-200 pl-4 py-2">Additional Information</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
  <div>
      <label className="block text-gray-700">Notification enable</label>
      <Select
      
        styles={{
          control: (base,state) => ({
            ...base,
            marginTop:'5px',
            height: '2.6rem',
            borderRadius: '0.375rem',
            borderColor: state.isFocused ? '#1640ff' : '#D1D5DB',
            boxShadow: state.isFocused ? '0 0 0 1px #93C5FD' : 'none',
          }),
        }}
        options={Notificationoptions}
      />
    </div>
    <div>
      <label className="block text-gray-700">Business Name</label>
      <input type="text" 
          className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 "/>     
    </div>
    <div>
      <label className="block text-gray-700">Locale</label>
      <input type="text"
          className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 "/>     
    </div>
    <div>
      <label className="block text-gray-700">Apt/Suite</label>
      <input type="text" 
          className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 "/>     
    </div>
    <div>
      <label className="block text-gray-700">Address Line-1</label>
      <input type="text" 
          className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 "/>     
    </div>
    <div>
      <label className="block text-gray-700">Address Line-2</label>
      <input type="text" 
          className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 "/>     
    </div>
    <div>
      <label className="block text-gray-700">Country</label>
      <input type="text" 
          className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 "/>     
    </div>
    <div>
      <label className="block text-gray-700">State</label>
      <input type="text" 
          className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 "/>     
    </div>
    <div>
      <label className="block text-gray-700">City</label>
      <input type="text" 
          className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 "/>     
    </div>
    <div>
      <label className="block text-gray-700">Time Zone</label>
      <input type="text" 
          className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 "/>     
    </div>

    <div>
      <label className="block text-gray-700">Zip</label>
      <input type="text" 
          className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 "/>     
    </div>
{/*   
    <div>
            <label className="block text-gray-700">Country</label>
            <select
              value={selectedCountry || ''}
              onChange={handleCountryChange}
              className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 "
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
            <label className="block text-gray-700">State</label>
            <select
              value={selectedState || ''}
              onChange={handleStateChange}
              className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 "
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
            <label className="block text-gray-700">City</label>
            <select
              value={selectedCity || ''}
              onChange={handleCityChange}
              className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 "
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
            <label className="block text-gray-700">Time zone</label>
            <input
              type="text"
              value={selectedTimeZone}
              readOnly
              className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 "
            />
          </div>
          <div>
            <label className="block text-gray-700">Zip</label>
            <input
              type="text"
              value={selectedZipCode}
              readOnly
              className="input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300"
            />
          </div> */}
  </div>
</div>

{errorMessages.length > 0 && (
        <div className="mt-4 p-2 bg-red-100 text-red-600 border border-red-400 rounded-md">
          {errorMessages.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      <div className="flex justify-end space-x-4 mt-3">
        <button className="flex items-center p-2 rounded-lg shadow ml-2 button border border-gray-300">
          <XMarkIcon className="h-5 w-5 text-black-500 mr-2"/>
          <span>Cancel</span>
        </button>
        <button className="flex items-center p-2 rounded-lg shadow ml-2 button border border-gray-300"
        onClick={handleSave} >
          <CheckIcon className="h-5 w-5 text-black-500 mr-2" />
          <span>Save</span>
        </button>
      </div>
      
    </div>
  );
};

export default UserInfo;
