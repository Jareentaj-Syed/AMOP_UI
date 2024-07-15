import React, { useState } from 'react';
import {XMarkIcon} from '@heroicons/react/24/outline';
interface EmailModalProps {
  isOpen: boolean;
  emailList: string[];
  onClose: () => void;
  onAddEmail: (email: string) => void;
  onRemoveEmail: (index: number) => void;
}

const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  emailList,
  onClose,
  onAddEmail,
  onRemoveEmail
}) => {
  const [emailInput, setEmailInput] = useState<string>('');

  const handleAddEmail = () => {
    if (emailInput.trim() !== '') {
      onAddEmail(emailInput);
      setEmailInput('');
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 "  style={{ zIndex: 9999 }}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <div className="flex justify-between items-center mb-4">
  <h2 className="text-xl font-semibold">Manage Emails: </h2>
  <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
</div>

        <div className="flex mb-4">
          <input
            type="text"
            className="input w-full focus:border-sky-500 "
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <button
            type="button"
            className="ml-2 mt-1 bg-blue-500 text-white p-2 rounded-lg h-full email-add-btn"
            onClick={handleAddEmail}
          >
            Add
          </button>
        </div>
        <div className="max-h-40 overflow-y-auto mb-4">
          {emailList.map((email, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-200 p-2 rounded-lg mb-2">
              <span>{email}</span>
              <button
                type="button"
                className="ml-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-200"
                onClick={() => onRemoveEmail(index)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="w-full bg-gray-300 text-black p-2 rounded-lg"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  ) : null;
};

export default EmailModal;
