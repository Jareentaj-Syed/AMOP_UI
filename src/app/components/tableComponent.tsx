import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface TableComponentProps {
  headers: string[];
  rowData: { [key: string]: any }[];
  actions?: ('edit' | 'delete' | 'info')[];
  onEdit?: (row: { [key: string]: any }) => void;
  onDelete?: (row: { [key: string]: any }) => void;
  onInfo?: (row: { [key: string]: any }) => void;
  searchQuery?: string;
  visibleColumns?: string[];
}

const TableComponent: React.FC<TableComponentProps> = ({
  headers,
  rowData,
  actions,
  onEdit,
  onDelete,
  onInfo,
  searchQuery,
  visibleColumns,
}) => {
  const [filteredData, setFilteredData] = useState(rowData);

  useEffect(() => {
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = rowData.filter((row) =>
        headers.some(
          (header) =>
            row[header]?.toString().toLowerCase().includes(lowercasedQuery)
        )
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(rowData);
    }
  }, [searchQuery, rowData, headers]);

  const handleActionClick = (action: string, row: { [key: string]: any }) => {
    switch (action) {
      case 'edit':
        if (onEdit) onEdit(row);
        break;
      case 'delete':
        if (onDelete) onDelete(row);
        break;
      case 'info':
        if (onInfo) onInfo(row);
        break;
      default:
        break;
    }
  };

  const renderActionIcon = (action: string, rowIndex: number, row: { [key: string]: any }) => {
    switch (action) {
      case 'edit':
        return (
          <PencilIcon
            key={`edit-${rowIndex}`}
            className="h-5 w-5 text-blue-500 cursor-pointer"
            onClick={() => handleActionClick('edit', row)}
          />
        );
      case 'delete':
        return (
          <TrashIcon
            key={`delete-${rowIndex}`}
            className="h-5 w-5 text-red-500 cursor-pointer"
            onClick={() => handleActionClick('delete', row)}
          />
        );
      case 'info':
        return (
          <InformationCircleIcon
            key={`info-${rowIndex}`}
            className="h-5 w-5 text-green-500 cursor-pointer"
            onClick={() => handleActionClick('info', row)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
      <thead className="bg-gray-200">
        <tr>
          <th className="py-3 px-6 border-b border-gray-300 text-left font-semibold">S.no</th>
          {headers.map(
            (header, index) =>
              visibleColumns?.includes(header) && (
                <th key={index} className="py-3 px-6 border-b border-gray-300 text-left font-semibold">
                  {header}
                </th>
              )
          )}
          {actions && <th className="py-3 px-6 border-b border-gray-300 text-left font-semibold">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {filteredData.map((row, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
            <td className="py-3 px-6 border-b border-gray-300">{rowIndex + 1}</td>
            {headers.map(
              (header, colIndex) =>
                visibleColumns?.includes(header) && (
                  <td key={colIndex} className="py-3 px-6 border-b border-gray-300">
                    {row[header]}
                  </td>
                )
            )}
            {actions && (
              <td className="py-3 px-6 border-b border-gray-300">
                <div className="flex space-x-2">
                  {actions.map((action) => renderActionIcon(action, rowIndex, row))}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
