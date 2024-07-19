// src/components/StatusIndicator.tsx

import React from 'react';
const STATUS = {
    PROCESSED: "PROCESSED",
    ERROR: "ERROR",
    PENDING:"PENDING"
  };

interface StatusIndicatorProps {
  status: (typeof STATUS)[keyof typeof STATUS];
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
    console.log('Rendering StatusIndicator with status:', status);
  let colorClass = "";

  switch (status) {
    case STATUS.PROCESSED:
      colorClass = "text-green-500";
      break;
    case STATUS.ERROR:
      colorClass = "text-red-500";
      break;
    case STATUS.PENDING:
      colorClass = "text-yellow-500";
      break;
    default:
      colorClass = "text-gray-500";
  }

  return <div className={`rounded-md font-bold ${colorClass}`}>{status}</div>;
};

export default StatusIndicator;

export function statusIndicatorRender(value: keyof typeof STATUS) {
  const status = STATUS[value];
  return <StatusIndicator status={status} />;
}
