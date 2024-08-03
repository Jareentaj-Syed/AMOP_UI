import React, { useState } from 'react';
import Image from 'next/image';
import { Input, Button, Modal } from 'antd';
import Link from 'next/link';
import { Footer } from './footer-nested';
import Login from './login_page';
import axios from 'axios';
import { useAuth } from './auth_context';
import { getCurrentDateTime } from './header_constants';

const PasswordReset: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { setShowPassword } = useAuth();
  const [email, setEmail] = useState(''); // State variable for input value
  const [username, setUsername] = useState(''); // State variable for username
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleBackClick = () => {
    setShowLogin(true);
  };

  const handleReset = async () => {
    if (!username) {
      // Set the appropriate message based on which fields are missing
      setModalMessage(
        // !username && !email ? 'Please enter both username and email address to reset your password.' :
        !username ? 'Please enter a username to reset your password.' :
        ''
      );
      setIsModalVisible(true);
      setShowPassword(false);
      setShowLogin(false);
      return;
    }

    setShowPassword(true);
    const data = {
      path: "/reset_password_email",
      username: username,
      // email: email,
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
      if(response.data&&response.data&&response.data.statusCode===200){
        setShowLogin(true);
      
      }
      else{
        const parsedData=JSON.parse(response.data.body)
        Modal.error({
          title: 'Reset Password Error',
          content:parsedData?parsedData.message:'An unexpected error occurred during resetting password. Please try again.',
          centered: true,
      });
      }
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error) {
        Modal.error({
            title: 'Reset Password Error',
            content: error.message || 'An unexpected error occurred during login. Please try again.',
            centered: true,
        });
    } else {
        Modal.error({
            title: 'Reset Password Error',
            content: 'An unexpected error occurred during login. Please try again.',
            centered: true,
        });
    }
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {showLogin ? (
        <Login />
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="w-[320px] h-[55px] mb-6">
            <Image
              src="/amop_logo_header.png"
              alt="AMOP Core Logo"
              width={300}
              height={55}
            />
          </div>
          <div className="flex flex-col space-y-4 items-start w-[320px] pr-2 mb-6">
            <label className="text-[20px] text-left text-[#00C1F1] font-[700] mb-1">
              Reset Password
            </label>
            <Input
              placeholder="Username"
              style={{
                width: '320px',
                height: '35px',
                backgroundColor: '#F7F9FA',
                padding: '6px 12px',
                borderRadius: '1px',
                borderColor: '#ccc',
              }}
              value={username} // Bind the input value
              onChange={(e) => setUsername(e.target.value)} // Update state on change
            />

            <div className="flex justify-end w-full mt-4">
              <Button
                type="primary"
                className="rounded-full"
                style={{
                  borderColor: '#00C1F1',
                  color: '#00C1F1',
                  backgroundColor: 'transparent',
                }}
                onClick={handleReset}
              >
                Reset
              </Button>
            </div>
            <div className="flex justify-end w-full">
              <a
                href="#"
                onClick={handleBackClick}
                className="hover:underline cursor-pointer text-[#337AB7]"
              >
                Back to login
              </a>
            </div>
          </div>
          {/* <Footer /> */}
          <Modal
            title="Error"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="OK"
            centered
            cancelButtonProps={{ style: { display: 'none' } }} // Hide cancel button
          >
            <p>{modalMessage}</p>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default PasswordReset;



{/* <Input
placeholder="Email"
style={{
  width: '320px',
  height: '35px',
  backgroundColor: '#F7F9FA',
  padding: '6px 12px',
  borderRadius: '1px',
  borderColor: '#ccc',
}} */}
// value={email} // Bind the input value
// onChange={(e) => setEmail(e.target.value)} // Update state on change
// />