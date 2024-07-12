import React, { useEffect, useState } from 'react';
import { PencilIcon, TrashIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import EditModal from '../../components/editPopup';
import Pagination from '@/app/components/pagination';

interface TableComponentProps {
  headers: string[];
  initialData: { [key: string]: any }[];
  searchQuery: string;
  visibleColumns: string[];
  itemsPerPage: number;
  allowedActions: ('edit' | 'delete' | 'info')[];
}

const TableComponent: React.FC<TableComponentProps> = ({ headers, initialData, searchQuery, visibleColumns, itemsPerPage, allowedActions }) => {
  const [rowData, setRowData] = useState<{ [key: string]: any }[]>(initialData);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editRowIndex, setEditRowIndex] = useState<number | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [apiState, setApiState] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    setRowData(initialData);
  }, [initialData]);

  useEffect(() => {
    // Filter row data based on search query
    const filteredData = initialData.filter(row =>
      Object.values(row).some(value =>
        typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setRowData(filteredData);
    setCurrentPage(1);
  }, [searchQuery, initialData]);

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

  const handleToggle = (rowIndex: number) => {
    const updatedData = [...rowData];
    updatedData[rowIndex].API_state = apiState[rowIndex] === 'enable' ? 'disable' : 'enable'; // Toggle API state
    setRowData(updatedData);
    setApiState(prevState => ({
      ...prevState,
      [rowIndex]: prevState[rowIndex] === 'enable' ? 'disable' : 'enable'
    }));
  };

  const renderApiState = (apiState: string, index: number) => {
    return (
      <div className="flex items-center space-x-2">
        <button
          className={`font-bold px-4 rounded-3xl border-4 focus:outline-none focus:shadow-outline ${apiState === 'enable' ? 'bg-blue-100 text-blue-500 border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'
            }`}
          style={{ width: '100%' }}
          onClick={() => handleToggle(index)}
        >
          Enable
        </button>
        <button
          className={`font-bold px-4 rounded-3xl border-4 focus:outline-none focus:shadow-outline ${apiState === 'disable' ? 'bg-blue-100 text-blue-500 border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'
            }`}
          style={{ width: '100%' }}
          onClick={() => handleToggle(index)}
        >
          Disable
        </button>
      </div>
    );
  };

  const renderUserStatus = (status: string) => {
    let textColorClass = '';
    if (status === 'Active') {
      textColorClass = 'text-blue-500';
    } else if (status === 'Inactive') {
      textColorClass = 'text-red-500';
    }
    return <span className={`${textColorClass}`}>{status}</span>;
  };

  // Calculate pagination
  const totalPages = Math.ceil(rowData.length / itemsPerPage);
  const paginatedData = rowData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="relative max-h-96">
      <div className='overflow-auto' style={{ maxHeight: '600px' }}>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg ">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-6 border-b border-gray-300 text-left font-semibold table-header">S.no</th>
              {headers.map((header, index) => (
                <th key={index} className="py-3 px-6 border-b border-gray-300 text-left font-semibold table-header">
                  {formatColumnName(header)}
                </th>
              ))}
              <th className="py-3 px-6 border-b border-gray-300 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="py-3 px-6 border-b border-gray-300 table-cell">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                {headers.map((header, columnIndex) => (
                  <td key={columnIndex} className="py-3 px-6 border-b border-gray-300 table-cell">
                    {visibleColumns.includes(header) && (header === 'API_state' ? (
                      renderApiState(row[header], index)
                    ) : header === 'User status' ? (
                      renderUserStatus(row[header])
                    ) : (
                      row[header]
                    ))}
                  </td>
                ))}
                <td className="py-3 px-6 border-b border-gray-300 table-cell">
                  <div className="flex items-center space-x-2">
                    {allowedActions.includes('edit') && (
                      <PencilIcon
                        className="h-5 w-5 text-blue-500 cursor-pointer"
                        onClick={() => handleActionClick('edit', (currentPage - 1) * itemsPerPage + index)}
                      />
                    )}
                    {allowedActions.includes('delete') && (
                      <TrashIcon
                        className="h-5 w-5 text-red-500 cursor-pointer"
                        onClick={() => handleActionClick('delete', (currentPage - 1) * itemsPerPage + index)}
                      />
                    )}
                    {allowedActions.includes('info') && (
                      <InformationCircleIcon
                        className="h-5 w-5 text-green-500 cursor-pointer"
                        onClick={() => handleActionClick('info', (currentPage - 1) * itemsPerPage + index)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-5">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <EditModal
        columnNames={headers}
        isOpen={editModalOpen}
        isEditable={isEditable}
        rowData={editRowIndex !== null ? rowData[editRowIndex] : null}
        onSave={handleSaveModal}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default TableComponent;
