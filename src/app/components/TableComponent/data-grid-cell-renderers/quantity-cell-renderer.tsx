// src/components/QuantityCell.tsx

import React from 'react';
export enum STATUS_TYPE {
    UPLOAD = "upload",
    SUCCESSFUL = "successful",
    ERRORS = "errors",
  }

interface QuantityCellProps {
  value: number;
  type: (typeof STATUS_TYPE)[keyof typeof STATUS_TYPE];
}

const QuantityCell: React.FC<QuantityCellProps> = ({ value, type }) => {
  let color = "bg-gray-300";

  switch (type) {
    case STATUS_TYPE.UPLOAD:
      color = "bg-blue-500";
      break;
    case STATUS_TYPE.SUCCESSFUL:
      color = "bg-green-600";
      break;
    case STATUS_TYPE.ERRORS:
      color = "bg-yellow-600";
      break;
    default:
      break;
  }

  return (
    <div
      className={`my-0 w-[1.6rem] h-[1.6rem] flex items-center justify-center ${color} rounded-full text-white`}
    >
      <span className="font-semibold">{value}</span>
    </div>
  );
};

export default QuantityCell;

export function quantityCellRenderer(type: (typeof STATUS_TYPE)[keyof typeof STATUS_TYPE]) {
  return function renderCell(_: any, value: number) {
    return <QuantityCell value={value} type={type} />;
  };
}
