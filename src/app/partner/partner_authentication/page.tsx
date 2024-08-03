// app/partner-onboarding-form/partner-info.tsx

"use client";
import React, { useState, useEffect } from 'react';
import { usePartnerStore } from '../partnerStore';

interface PartnerAuthentication {
  onSubmit: () => void;
}

const PartnerAuthentication: React.FC<PartnerAuthentication> = () => {
  const { partnerData } = usePartnerStore.getState();
  const partnerAuthentication=partnerData["Partner authentication"]?.data?.["Partner authentication"]||{}
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
              value={partnerAuthentication.client_id||"NA"}
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
              value={partnerAuthentication.client_secret||"NA"}
              readOnly
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default PartnerAuthentication;
