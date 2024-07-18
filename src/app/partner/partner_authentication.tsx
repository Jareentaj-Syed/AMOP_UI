// app/partner-onboarding-form/partner-info.tsx

"use client";
import React, { useState, useEffect } from 'react';

interface PartnerAuthentication {
  onSubmit: () => void;
}

const PartnerAuthentication: React.FC<PartnerAuthentication> = () => {
  const [clientId, setClientId] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  return (
    <div className='p-2'>
      <form>
        <h3 className="tabs-sub-headings">Partner Authentication</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="field-label">
              Client ID
            </label>
            <input
              type="text"
              className="non-editable-input "
              value={'135791113151719'}
              onChange={(e) => setClientId(e.target.value)}
              readOnly
            />
          </div>
          <div>
            <label className="field-label">
              Client Secret
            </label>
            <input
              type="text"
              className="non-editable-input "
              value={'zyxwvutsrqponmlkjihgfedcba987654'}
              onChange={(e) => setClientSecret(e.target.value)}
              readOnly
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default PartnerAuthentication;
