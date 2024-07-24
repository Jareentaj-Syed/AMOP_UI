// pages/choose_tenant.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from 'antd';
import { Footer } from './footer-nested';

const partners: string[] = [
  'Altaworx-GT',
  'AWX',
  'AWX-AWX',
  'AWX Test',
  'CSV RS AG',
  'Go Tech - AWX Test',
  'GT',
  'Test Theme',
];

const ChooseTenant: React.FC = () => {
  const [partner, setPartner] = useState<string | null>(null);

  const handleSelectedPartner = (partnerName: string) => {
    console.log('Selected Partner:', partnerName);
    setPartner(partnerName);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="w-[300px] h-[55px] mb-1">
        <Image
          src="/amop_logo_header.png"
          alt="AMOP Core Logo"
          layout="responsive"
          width={300}
          height={55}
        />
      </div>
      <h1 className="text-[28px] text-[#00C1F1] font-medium mb-2">Choose Partner</h1>
      <div className="space-y-[1px] flex flex-col mb-2">
        {partners.map((partner) => (
          <Button
            key={partner}
            onClick={() => handleSelectedPartner(partner)}
            className="rounded-full"
            style={{
              width: '150px',
              height: '35px',
              borderColor: '#00C1F1',
              color: '#00C1F1',
            }}
          >
            {partner}
          </Button>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default ChooseTenant;
