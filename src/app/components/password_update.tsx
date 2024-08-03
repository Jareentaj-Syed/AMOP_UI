import React, { useEffect, useState } from 'react';
import { useAuth } from './auth_context';
import axios from 'axios';
import { useLogoStore } from '../stores/logoStore';
import { getCurrentDateTime } from './header_constants';

const PasswordUpdate: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const { username, partner, role,  } = useAuth();
    const title = useLogoStore((state) => state.title);
    const setTitle = useLogoStore((state) => state.setTitle);
    const {LogoutChooseTenant, setTenantNames, setRole} = useAuth(); 
    useEffect(() => {
        setTitle("Password")
    })
    const handleSave  = async () => {
        // Reset error messages
        setNewPasswordError('');
        setConfirmPasswordError('');

        // Regex for password validation: must contain a number, lowercase, and uppercase letter
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

        // Validate new password
        if (!passwordRegex.test(newPassword)) {
            setNewPasswordError('New password must contain a number, lowercase, and uppercase characters.');
            return; // Stop further checks if new password is invalid
        }

        // Validate confirm password
        if (newPassword !== confirmPassword) {
            setConfirmPasswordError('Password does not match.');
            return;
        }

        // If no errors, perform save logic
        console.log('New Password:', newPassword);
        console.log('Confirm Password:', confirmPassword);

        const data = {
            path: "/password_reset",
            username: username,
            New_password:newPassword,
            request_received_at: getCurrentDateTime()
          };
          try {
            const url = "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/user_auth";
            const response = await axios.post(url, { data: data }, {
              headers: {
                'Content-Type': 'application/json'
              }}
            );
            console.log('Response:', response.data);
            const resp = JSON.parse(response.data.body);
            if(resp["tenant_names"]){
                const tenant_names = resp["tenant_names"];
                setTenantNames(tenant_names);
                const role = resp["role"];
                setRole(role);
            }

          } catch (error) {
            console.error('Error:', error);
          }

        // Clear the password fields
        setNewPassword('');
        setConfirmPassword('');
        LogoutChooseTenant()
    };

    const handleCancel = () => {
        // Logic for handling cancel action
        setNewPassword('');
        setConfirmPassword('');
        setNewPasswordError('');
        setConfirmPasswordError('');
    };

    return (
        <div className="mt-8 p-4 flex">
            {/* form-div */}
            <div className="w-3/4 flex flex-col gap-y-4 p-4 pr-8 pt-0 relative items-center">
                {/* title-msg */}
                <div className='bg-[#C1F3FF] p-4 pl-8 mb-2 border border-sky-300 rounded text-left w-full'>
                    <h3 className='text-blue-500 font-[13px]'>Please update your password.</h3>
                </div>
                {/* main-form-div */}
                <div className='flex flex-col gap-y-4 max-w-md'>
                    {/* new-pswd-field */}
                    <div className="flex flex-col items-end">
                        {newPasswordError && (
                            <div className="text-red-600 text-sm mb-1">{newPasswordError}</div>
                        )}
                        <div className="flex items-center">
                            <div className="w-1/4 items-end">
                                <label htmlFor="new-password" className="whitespace-nowrap text-right font-semibold text-gray-700">
                                    New Password
                                </label>
                            </div>
                            <div className="flex-1 ml-4">
                                <input
                                    type="password"
                                    id="new-password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="input w-full min-w-[320px]"
                                />
                            </div>
                        </div>
                    </div>
                    {/* confirm-pswd-field */}
                    <div className="flex flex-col items-start">
                        {confirmPasswordError && (
                            <div className="text-red-600 text-sm mb-1">{confirmPasswordError}</div>
                        )}
                        <div className="flex items-center">
                            <div className="w-1/4 items-end">
                                <label htmlFor="confirm-password" className="whitespace-nowrap text-right font-semibold text-gray-700">
                                    Confirm Password
                                </label>
                            </div>
                            <div className="flex-1 ml-4">
                                <input
                                    type="password"
                                    id="confirm-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="input w-full min-w-[320px]"
                                />
                            </div>
                        </div>
                    </div>
                    {/* buttons-div */}
                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            onClick={handleCancel}
                            className="cancel-btn"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="save-btn"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
            {/* info-div */}
            <div className="w-1/4 border border-[#00c1f1] rounded shadow-md">
                {/* info-title */}
                <div className='bg-[#00c1f1] text-white p-4'>
                    <h4 className="font-[20px]">Information</h4>
                </div>
                <div className='p-4'>
                    <ul className="list-disc pl-4 space-y-2">
                        <li>Complete this form to update your password.</li>
                        <li>New password must contain a number, lowercase, and uppercase characters.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PasswordUpdate;
