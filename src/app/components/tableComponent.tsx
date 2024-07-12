import React, { useState } from 'react';
import { TrashIcon, PencilIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface TableComponentProps {
  headers: string[];
  rowData: any[];
  actions: ('edit' | 'delete' | 'info')[];
  onDelete: (row: any) => void;
  onEdit?: (row: any, key: string, value: string) => void;
  editMode?: boolean; // New prop for edit mode
  handleAddRow?: (index: number) => void; // Optional callback for adding a row
}

const TableComponent: React.FC<TableComponentProps> = ({
  headers,
  rowData,
  actions,
  onDelete,
  onEdit,
  editMode,
  handleAddRow,
}) => {
  const [editableCell, setEditableCell] = useState<{ rowIndex: number; colKey: string } | null>(null);
  const [value, setValue] = useState('');
  
  const handleEditCell = (rowIndex: number, colKey: string) => {
    if (editMode) {
      setEditableCell({ rowIndex, colKey });
    }
  };

  const handleSaveCell = (rowIndex: number, colKey: string, value: string) => {
    if (onEdit) {
      onEdit(rowData[rowIndex], colKey, value);
    }
    setEditableCell(null);
  };

  const handleCancelEdit = () => {
    setEditableCell(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, rowIndex: number, colKey: string) => {
    const newValue = e.target.value;
    const updatedRow = { ...rowData[rowIndex], [colKey]: newValue };
    onEdit?.(rowData[rowIndex], colKey, newValue);
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    const newValue = event.target.value; // event.target.value is of type string
    // Handle your onBlur logic here, e.g., set state or perform validation
    setValue(newValue);
  };

  return (
    <table className="min-w-full border border-gray-200 table-fixed bg-white">
      <thead className="bg-blue-100">
        <tr className="table-header-row border-gray-300">
          <th className="py-3 px-6 border-b border-gray-300 text-left font-semibold table-header">S.no</th>
          {headers.map(header => (
            <th key={header} className="py-3 px-6 border-b border-gray-300 text-left font-semibold table-header">
              {header}
            </th>
          ))}
          {actions.length > 0 && <th className="py-3 px-6 border-b border-gray-300 text-left font-semibold table-header">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {rowData.map((row, rowIndex) => (
          <tr key={rowIndex} className="table-row relative">
            <td className="py-2 px-4 border-b border-gray-300 text-center table-cell">{rowIndex + 1}</td>
            {headers.map((key, colIndex) => (
              <td key={colIndex} className="py-2 px-4 border-b border-gray-300 text-center table-cell">
                {editableCell?.rowIndex === rowIndex && editableCell?.colKey === key ? (
                  <input
                    type="text"
                    value={row[key]}
                    onChange={(e) => handleChange(e, rowIndex, key)}
                    onBlur={handleBlur}
                    className="w-full p-2 focus:outline-none"
                  />
                ) : (
                  row[key] || '-'
                )}
              </td>
            ))}
            {actions.length > 0 && (
              <td className="py-2 px-4 border-b border-gray-300 text-center table-cell">
                {actions.includes('edit') && (
                  <button
                    className="mx-1 text-gray-500 hover:text-blue-500 focus:outline-none"
                    onClick={() => handleEditCell(rowIndex, headers[0])}
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                )}
                {actions.includes('delete') && (
                  <button
                    className="mx-1 text-gray-500 hover:text-red-500 focus:outline-none"
                    onClick={() => onDelete(row)}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
                {actions.includes('info') && (
                  <button className="mx-1 text-gray-500 hover:text-blue-500 focus:outline-none">
                    <InformationCircleIcon className="h-5 w-5" />
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
        {editMode && handleAddRow && (
          <tr>
            <td colSpan={headers.length + (actions.length > 0 ? 1 : 0)}>
              <button
                onClick={() => handleAddRow(rowData.length - 1)}
                className="text-blue-500 text-xl p-1"
              >
                +
              </button>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TableComponent;
