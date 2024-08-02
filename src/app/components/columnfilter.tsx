import React from "react";
import { Checkbox, Divider, Popover } from "antd";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

interface ColumnFilterProps {
  headers: string[];
  visibleColumns: string[];
  setVisibleColumns: (columns: string[]) => void;
  headerMap?:any
}

const ColumnFilter: React.FC<ColumnFilterProps> = ({
  headers,
  visibleColumns,
  setVisibleColumns,
  headerMap
}) => {
  // Use headers passed as props for the list of all columns
  const allColumns = headers;

  const handleColumnVisibilityChange = (checked: boolean, column: string) => {
    // Update visibleColumns based on whether the checkbox is checked or not
    const updatedVisibleColumns = checked
      ? [...visibleColumns, column] // Add column if checked
      : visibleColumns.filter((col) => col !== column); // Remove column if unchecked
    // Set updated visible columns in parent component
    setVisibleColumns(updatedVisibleColumns);
  };

  const handleCheckAllChange = (e: { target: { checked: any } }) => {
    // Check or uncheck all columns
    if (e.target.checked) {
      setVisibleColumns(allColumns);
    } else {
      setVisibleColumns([]);
    }
  };

  const formatColumnName = (name: string) => {
    return name
      .replace(/_/g, ' ')          // Replace underscores with spaces
      .split(' ')                  // Split the string into words
      .map(word =>                 // Capitalize each word
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(' ');                  // Join the words back into a single string
  };
  const columnContent = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        maxHeight: "300px",
        overflowY: "auto",
      }}
    >
      <Checkbox
        onChange={handleCheckAllChange}
        checked={visibleColumns.length === allColumns.length}
        style={{ marginBottom: "4px" }}
      >
        All
      </Checkbox>
      <Divider style={{ margin: "0.5rem 0 0.2rem" }} />
      {allColumns.map((column) => (
        <Checkbox
          key={column}
          value={column}
          checked={visibleColumns.includes(column)}
          onChange={(e) =>
            handleColumnVisibilityChange(e.target.checked, column)
          }
          style={{ marginBottom: "4px", whiteSpace: "nowrap" }}
        >
          {headerMap && headerMap[column] ? headerMap[column][0] : formatColumnName(column)}
        </Checkbox>
      ))}
    </div>
  );

  return (
    <Popover content={columnContent} trigger="click" placement="bottom">
      <button className="flex items-center p-2 save-btn">
        <AdjustmentsHorizontalIcon className="h-5 w-5 text-black-500 mr-2" />
        Filter
      </button>
    </Popover>
  );
};

export default ColumnFilter;
