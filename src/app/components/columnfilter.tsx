// src/app/components/ColumnFilter.tsx

import React from 'react';
import { Checkbox, Divider, Popover } from 'antd';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

interface ColumnFilterProps {
  data: any[];
  visibleColumns: string[];
  setVisibleColumns: (columns: string[]) => void;
}

const ColumnFilter: React.FC<ColumnFilterProps> = ({ data, visibleColumns, setVisibleColumns }) => {
  const handleColumnVisibilityChange = (checkedValues: string[]) => {
    setVisibleColumns(checkedValues);
  };

  const handleCheckAllChange = (e: { target: { checked: any } }) => {
    const allColumns = Object.keys(data.length > 0 ? data[0] : {});
    if (e.target.checked) {
      handleColumnVisibilityChange(allColumns);
    } else {
      handleColumnVisibilityChange([]);
    }
  };

  const columnContent = (
    <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '300px', overflowY: 'auto' }}>
      <Checkbox
        onChange={handleCheckAllChange}
        checked={visibleColumns.length === Object.keys(data.length > 0 ? data[0] : {}).length}
        style={{ marginBottom: '4px' }}
      >
        All
      </Checkbox>
      <Divider style={{ margin: "0.5rem 0 0.2rem" }} />
      {Object.keys(data.length > 0 ? data[0] : {}).map((column) => (
        <Checkbox
          key={column}
          value={column}
          checked={visibleColumns.includes(column)}
          onChange={(e) =>
            handleColumnVisibilityChange(
              e.target.checked
                ? [...visibleColumns, column]
                : visibleColumns.filter((col) => col !== column)
            )
          }
          style={{ marginBottom: '4px', whiteSpace: 'nowrap' }}
        >
          {column}
        </Checkbox>
      ))}
    </div>
  );

  return (
    <Popover content={columnContent} trigger="click" placement="bottom">
      <button className="flex items-center p-2 rounded-lg shadow button border border-gray-300 bg-white text-black">
        <AdjustmentsHorizontalIcon className="h-5 w-5 text-black-500 mr-2" />
        Filter
      </button>
    </Popover>
  );
};

export default ColumnFilter;
