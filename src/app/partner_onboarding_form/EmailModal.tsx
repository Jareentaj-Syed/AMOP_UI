import React, { useState } from 'react';

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
        <h2 className="text-xl font-semibold mb-4">Manage Emails</h2>
        <div className="flex mb-4">
          <input
            type="text"
            className="input w-full"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <button
            type="button"
            className="ml-2 bg-blue-500 text-white p-2 rounded-lg h-full email-add-btn"
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
