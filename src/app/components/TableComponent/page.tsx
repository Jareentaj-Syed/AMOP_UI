import React, { useEffect, useState } from 'react';
import { PencilIcon, TrashIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import EditModal from '../../components/editPopup';
import Pagination from '@/app/components/pagination';
import DateTimeCellRenderer from './data-grid-cell-renderers/date-time-cell-renderer';
import EditUsernameCellRenderer from './data-grid-cell-renderers/edit-username-cell-renderer';
import { StatusCellRenderer } from './data-grid-cell-renderers/status-cell-renderer';
import { StatusHistoryCellRenderer } from './data-grid-cell-renderers/status-history-cell-renderer';
import ServiceProviderCellRenderer from './data-grid-cell-renderers/service-provider-cell-renderer';
import { Modal, Checkbox } from 'antd'
import ActionItems from '@/app/sim_management/inventory/action-items';
interface TableComponentProps {
  headers: string[];
  initialData: { [key: string]: any }[];
  searchQuery: string;
  visibleColumns: string[];
  itemsPerPage: number;
  allowedActions: ('edit' | 'delete' | 'info' | 'Actions')[];
  popupHeading:string;
}

const TableComponent: React.FC<TableComponentProps> = ({ headers, initialData, searchQuery, visibleColumns, itemsPerPage, allowedActions,popupHeading }) => {
  const [rowData, setRowData] = useState<{ [key: string]: any }[]>(initialData);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editRowIndex, setEditRowIndex] = useState<number | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [apiState, setApiState] = useState<{ [key: number]: string }>({});
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteRowIndex, setDeleteRowIndex] = useState<number | null>(null);


  const handleSelectAllChange = (e: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
    setSelectAll(e.target.checked);
    if (e.target.checked) {
      // Select all rows
      const allRowIndices = paginatedData.map((_, index) => index);
      setSelectedRows(allRowIndices);
    } else {
      // Deselect all rows
      setSelectedRows([]);
    }
  };

  const handleRowCheckboxChange = (index: number) => {
    const currentIndex = selectedRows.indexOf(index);
    const newSelectedRows = [...selectedRows];

    if (currentIndex === -1) {
      newSelectedRows.push(index);
    } else {
      newSelectedRows.splice(currentIndex, 1);
    }

    setSelectedRows(newSelectedRows);
  };


  useEffect(() => {
    setRowData(initialData);
    console.log(initialData)
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
        setDeleteRowIndex(rowIndex);
        setDeleteModalOpen(true);
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

  const confirmDelete = () => {
    if (deleteRowIndex !== null) {
      handleDelete(deleteRowIndex);
    }
    setDeleteModalOpen(false);
    setDeleteRowIndex(null);
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
          className={`${apiState === 'enable' ? 'active-btn' : 'inactive-btn'
            }`}
          style={{ width: '100%' }}
          onClick={() => handleToggle(index)}
        >
          Enable
        </button>
        <button
          className={`${apiState === 'disable' ? 'active-btn' : 'inactive-btn'
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
  const colorMap = {
    Activated: '#19AF91', // Light Green
    Deactivated: '#E95463', // Light Red
    // Add more statuses and colors as needed
  };

  return (
    <div className="relative max-h-96">
      <div className="overflow-auto" style={{ maxHeight: "500px", height: "500px" }}>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 border-b border-gray-300 text-left font-semibold table-header">
                <Checkbox
                  onChange={handleSelectAllChange}
                  checked={selectAll}
                  indeterminate={
                    selectedRows.length > 0 &&
                    selectedRows.length < paginatedData.length
                  }
                  style={{ fontSize: '2rem' }}
                />
              </th>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 border-b border-gray-300 text-left font-semibold table-header"
                >
                  {formatColumnName(header)}
                </th>
              ))}
              <th className="px-6 border-b border-gray-300 text-left font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-50" : ""}
              >
                <td className="px-6 border-b border-gray-300 table-cell">
                  <Checkbox
                    onChange={() => handleRowCheckboxChange(index as number)}
                    checked={selectedRows.map(String).includes(String(index))}
                    style={{ fontSize: '2rem' }}
                  />


                </td>
                {headers.map((header, columnIndex) => (
                  <td
                    key={columnIndex}
                    className="px-6 border-b border-gray-300 table-cell"
                  >
                    {visibleColumns.includes(header) && (
                      header === "API_state" ? (
                        renderApiState(row[header], index)
                      ) : header === "User status" ? (
                        renderUserStatus(row[header])
                      ) : header === "DateAdded" ||
                        header === "DateActivated" ? (
                        <DateTimeCellRenderer value={row[header]} />
                      ) : header === "Username" ? (
                        <EditUsernameCellRenderer value={row[header]} />
                      ) : header === "SimStatus" ? (
                        <StatusCellRenderer
                          record={row}
                          value={row[header]}
                          index={index}
                          colorMap={colorMap}
                        />
                      ) : header === "StatusHistory" ? (
                        <StatusHistoryCellRenderer value={row[header]} />
                      ) : header === "Provider" ? (
                        <ServiceProviderCellRenderer value={row[header]} />
                      ) : (
                        row[header]
                      )
                    )}
                  </td>
                ))}
                <td className="px-6 border-b border-gray-300 table-cell">
                  <div className="flex items-center space-x-2">
                    {allowedActions.includes("edit") && (
                      <PencilIcon
                        className="h-5 w-5 text-blue-500 cursor-pointer"
                        onClick={() =>
                          handleActionClick(
                            "edit",
                            (currentPage - 1) * itemsPerPage + index
                          )
                        }
                      />
                    )}
                    {allowedActions.includes("delete") && (
                      <TrashIcon
                        className="h-5 w-5 text-red-500 cursor-pointer"
                        onClick={() =>
                          handleActionClick(
                            "delete",
                            (currentPage - 1) * itemsPerPage + index
                          )
                        }
                      />
                    )}
                    {allowedActions.includes("info") && (
                      <InformationCircleIcon
                        className="h-5 w-5 text-green-500 cursor-pointer"
                        onClick={() =>
                          handleActionClick(
                            "info",
                            (currentPage - 1) * itemsPerPage + index
                          )
                        }
                      />
                    )}
                      {allowedActions.includes("Actions") && (
                      <ActionItems record={undefined}/>
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
        heading={popupHeading}
      />

<Modal
        title="Confirm Deletion"
        open={deleteModalOpen}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      >
        <p>Do you want to delete this row?</p>
      </Modal>

    </div>
  );
};

export default TableComponent;
