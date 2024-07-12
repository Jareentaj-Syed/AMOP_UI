import React, { useState } from 'react';
import { PencilIcon, TrashIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import EditModal from '../components/editPopup';

interface TableComponentProps {
  headers: string[];
  initialData: { [key: string]: any }[];
}

const TableComponent: React.FC<TableComponentProps> = ({ headers, initialData }) => {
  const [rowData, setRowData] = useState<{ [key: string]: any }[]>(initialData);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editRowIndex, setEditRowIndex] = useState<number | null>(null);
  const [isEditable, setIsEditable] = useState(false);

  const formatColumnName = (name: string) => {
    return name.replace(/_/g, ' ');
  };

  const handleActionClick = (action: string, rowIndex: number) => {
    switch (action) {
      case 'edit':
        setEditRowIndex(rowIndex);
        setIsEditable(true);
        setEditModalOpen(true);
        break;
      case 'delete':
        handleDelete(rowIndex);
        break;
      case 'info':
        setEditRowIndex(rowIndex);
        setIsEditable(false);
        setEditModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleSaveModal = (updatedRow: { [key: string]: any }) => {
    if (editRowIndex !== null) {
      const updatedData = [...rowData];
      updatedData[editRowIndex] = updatedRow;
      setRowData(updatedData);
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setIsEditable(false);
    setEditRowIndex(null);
  };

  const handleDelete = (rowIndex: number) => {
    if (rowIndex >= 0 && rowIndex < rowData.length) {
      const updatedData = [...rowData];
      updatedData.splice(rowIndex, 1);
      setRowData(updatedData);
    }
  };

  const renderActionIcon = (action: string, rowIndex: number) => {
    switch (action) {
      case 'edit':
        return (
          <PencilIcon
            className="h-5 w-5 text-blue-500 cursor-pointer"
            onClick={() => handleActionClick('edit', rowIndex)}
          />
        );
      case 'delete':
        return (
          <TrashIcon
            className="h-5 w-5 text-red-500 cursor-pointer"
            onClick={() => handleActionClick('delete', rowIndex)}
          />
        );
      case 'info':
        return (
          <InformationCircleIcon
            className="h-5 w-5 text-green-500 cursor-pointer"
            onClick={() => handleActionClick('info', rowIndex)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-6 border-b border-gray-300 text-left font-semibold">S.no</th>
            {headers.map((header, index) => (
              <th key={index} className="py-3 px-6 border-b border-gray-300 text-left font-semibold">
                 {formatColumnName(header)}
              </th>
            ))}
            <th className="py-3 px-6 border-b border-gray-300 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rowData.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="py-3 px-6 border-b border-gray-300">{rowIndex + 1}</td>
              {headers.map((header, colIndex) => (
                <td key={colIndex} className="py-3 px-6 border-b border-gray-300">
                  {row[header]}
                </td>
              ))}
              <td className="py-3 px-6 border-b border-gray-300">
                <div className="flex space-x-2">
                  {['edit', 'delete', 'info'].map((action) => (
                    <span key={action} className="cursor-pointer">
                      {renderActionIcon(action, rowIndex)}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Render EditModal */}
      {editModalOpen && (
        <EditModal
          isOpen={editModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveModal}
          rowData={rowData[editRowIndex as number]}
          columnNames={headers}
          isEditable={isEditable}
        />
      )}
    </>
  );
};

export default TableComponent;
