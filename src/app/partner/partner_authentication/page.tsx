// app/partner-onboarding-form/partner-info.tsx

"use client";
import React, { useState, useEffect } from 'react';
import { client_id,client_secret } from './partner_authentication_constants';
interface PartnerAuthentication {
  onSubmit: () => void;
}

const PartnerAuthentication: React.FC<PartnerAuthentication> = () => {
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
              value={client_id}
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
              value={client_secret}
              readOnly
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default PartnerAuthentication;
