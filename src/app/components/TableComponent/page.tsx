"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { PencilIcon, TrashIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import EditModal from '../../components/editPopup';
import Pagination from '@/app/components/pagination';
import DateTimeCellRenderer from './data-grid-cell-renderers/date-time-cell-renderer';
import EditUsernameCellRenderer from './data-grid-cell-renderers/edit-username-cell-renderer';
import { StatusCellRenderer } from './data-grid-cell-renderers/status-cell-renderer';
import { StatusHistoryCellRenderer } from './data-grid-cell-renderers/status-history-cell-renderer';
import ServiceProviderCellRenderer from './data-grid-cell-renderers/service-provider-cell-renderer';
import { Modal, Checkbox } from 'antd';

import ActionItems from '@/app/sim_management/inventory/Table-feautures/action-items';
import AdvancedFilter from '@/app/sim_management/inventory/Table-feautures/advanced-filter';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';



interface TableComponentProps {
  headers: string[];
  initialData: { [key: string]: any }[];
  searchQuery: string;
  visibleColumns: string[];
  itemsPerPage: number;
  allowedActions?: ('edit' | 'delete' | 'info' | 'Actions' | 'SingleClick'|'tabsEdit'|'tabsInfo')[];
  popupHeading: string;
  advancedFilters?: any
  infoColumns: any[]
  editColumns: any[]
  isSelectRowVisible?:boolean
}

const TableComponent: React.FC<TableComponentProps> = ({ headers, initialData, searchQuery, visibleColumns, itemsPerPage, allowedActions, popupHeading, infoColumns, editColumns, advancedFilters,isSelectRowVisible= true }) => {
  const router = useRouter();

  const [rowData, setRowData] = useState<{ [key: string]: any }[]>(initialData);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editRowIndex, setEditRowIndex] = useState<number | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [apiState, setApiState] = useState<{ [key: number]: string }>({});
  const [moduleState, setModuleState] = useState<{ [key: number]: string }>({});
  const [roleState, setRoleState] = useState<{ [key: number]: string }>({});

  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [EnableModalOpen, setEnableModalOpen] = useState(false); // State for Enable Modal
  const [DisableModalOpen, setDisableModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteRowIndex, setDeleteRowIndex] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'ascending' | 'descending' } | null>(null);
  const [tabsEdit,setTabsEdit]=useState(false)
  useEffect(() => {
    if (!router) {
      console.error('NextRouter is not available.');
    }
  }, [router]);

  const handleActionSingleClick = () => {
    if (router) {
      router.push('/super_admin/partner_modules/user_role');
    } else {
      console.error('NextRouter is not available.');
    }
  };
  const handleSelectAllChange = (e: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
    setSelectAll(e.target.checked);
    if (e.target.checked) {
      const allRowIndices = paginatedData.map((_, index) => index);
      setSelectedRows(allRowIndices);
    } else {
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
        case 'tabsEdit':
        setTabsEdit(true)
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
    setTabsEdit(false)
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
    updatedData[rowIndex].Module_state = moduleState[rowIndex] === 'enable' ? 'disable' : 'enable'; // Toggle Module state
    updatedData[rowIndex].Role_status = roleState[rowIndex] === 'Active' ? 'Inactive' : 'Active'; // Toggle Module state

    setRowData(updatedData);
    
    setApiState(prevState => ({
      ...prevState,
      [rowIndex]: prevState[rowIndex] === 'enable' ? 'disable' : 'enable'
    }));
  
    setModuleState(prevState => ({
      ...prevState,
      [rowIndex]: prevState[rowIndex] === 'enable' ? 'disable' : 'enable'
    }));

    setRoleState(prevState => ({
      ...prevState,
      [rowIndex]: prevState[rowIndex] === 'Active' ? 'Inactive' : 'Active'
    }));
  
    if (updatedData[rowIndex].API_state === 'enable') {
      setEnableModalOpen(true);
      setDisableModalOpen(false);
    } else if (updatedData[rowIndex].API_state === 'disable') {
      setDisableModalOpen(true);
      setEnableModalOpen(false);
    } else if (updatedData[rowIndex].Module_state === 'enable') {
      setEnableModalOpen(true);
      setDisableModalOpen(false);
    } else if (updatedData[rowIndex].Module_state === 'disable') {
      setDisableModalOpen(true);
      setEnableModalOpen(false);
    }
    else if (updatedData[rowIndex].Role_status === 'enable') {
      setEnableModalOpen(true);
      setDisableModalOpen(false);
    } else if (updatedData[rowIndex].Role_status === 'disable') {
      setDisableModalOpen(true);
      setEnableModalOpen(false);
    }
  };
  
  const confirmSubmit = () => {
    setEnableModalOpen(false);
    setDisableModalOpen(false);
  };
  const renderApiState = (apiState: string, index: number) => {
    return (
      
      <div className="flex items-center space-x-2">
        <button
          className={`${apiState === 'enable' || apiState === 'Active'? 'active-btn' : 'inactive-btn'
            }`}
          style={{ width: '100%' }}
          onClick={() => handleToggle(index)}
        >
           {`${apiState === 'enable' || apiState === 'disable' ? 'Enable' : 'Active'}`}

        </button>
        <button
          className={`${apiState === 'disable' || apiState === 'Inactive' ? 'active-btn' : 'inactive-btn'
            }`}
          style={{ width: '100%' }}
          onClick={() => handleToggle(index)}
        >
        {`${apiState === 'enable' || apiState === 'disable' ? 'Disable' : 'Inactive'}`}

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

  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    const sortedData = [...rowData].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setSortConfig({ key, direction });
    setRowData(sortedData);
  };

  // Calculate pagination
  const totalPages = Math.ceil(rowData.length / itemsPerPage);
  const paginatedData = rowData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const colorMap = {
    Activated: '#19AF91', // Light Green
    Deactivated: '#E95463', // Light Red
    // Add more statuses and colors as needed
  };

  console.log(advancedFilters)

  return (
    <div className="relative max-h-96">
      <div className="overflow-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-200">
            <tr>
            {headers.map((header, index) => (
  <th
    key={index}
    className="px-6 border-b border-gray-300 text-left font-semibold table-header"
    onClick={() => handleSort(header)}
    style={{ cursor: 'pointer' }}
  >
    {formatColumnName(header)}
    {sortConfig && sortConfig.key === header ? (
      sortConfig.direction === 'ascending' ? (
        <ArrowUpOutlined style={{ marginLeft: 8 }} />
      ) : (
        <ArrowDownOutlined style={{ marginLeft: 8 }} />
      )
    ) : (
      <ArrowUpOutlined style={{ marginLeft: 8, opacity: 0.5 }} />
    )}

    {/* Check if the header is 'select', render the Checkbox */}
    {header === 'Select' && (
      <Checkbox
        onChange={handleSelectAllChange}
        checked={selectAll}
        indeterminate={selectedRows.length > 0 && selectedRows.length < paginatedData.length}
        style={{ fontSize: '1rem', marginLeft: 8 }}
      />
    )}
  </th>
))}

                {allowedActions && (
      <th className="px-6 border-b border-gray-300 text-left font-semibold">Actions</th>
    )}
  
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-50" : ""}
              >
              {headers.map((header, columnIndex) => (
  <td
    key={columnIndex}
    className="px-6 border-b border-gray-300 table-cell"
  >
    {visibleColumns.includes(header) && (
      // Check if the header is the selection column
      header === "Select" ? (
        <Checkbox
          onChange={() => handleRowCheckboxChange(index as number)} // Assuming `index` is defined
          checked={selectedRows.map(String).includes(String(index))}
          style={{ fontSize: '2rem' }}
        />
      ) : // If not the selection column, render based on other headers
      header === "API_state" || header === "Module_state"   || header === "Role_status"  ? (
        renderApiState(row[header], index)
      ) : header === "User status"? (
        renderUserStatus(row[header])
      ) : header === "DateAdded" || header === "DateActivated" ? (
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

{allowedActions && (<td className="px-6 border-b border-gray-300 table-cell">
                  <div className="flex items-center space-x-2">
                    {allowedActions?.includes("edit") && (
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
                    {allowedActions?.includes("delete") && (
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
                    {allowedActions?.includes("info") && (
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
                    {allowedActions?.includes("Actions") && (
                      <ActionItems
                        initialData={initialData}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        index={index}
                        handleActionClick={handleActionClick}
                      />
                    )}
                     {allowedActions?.includes("SingleClick") && (
                      <PencilIcon
                        className="h-5 w-5 text-blue-500 cursor-pointer"
                        onClick={() =>
                          handleActionSingleClick()
                        }
                      />
                    )}
                    {allowedActions?.includes("tabsEdit") && (
                      <PencilIcon
                      className="h-5 w-5 text-blue-500 cursor-pointer"
                      onClick={() =>
                        handleActionClick(
                          "tabsEdit",
                          (currentPage - 1) * itemsPerPage + index
                        )
                      }
                    />
                    )}
                    {allowedActions?.includes("tabsInfo") && (
                      <InformationCircleIcon
                      className="h-5 w-5 text-green-500 cursor-pointer"
                      onClick={() =>
                        handleActionClick(
                          "tabsEdit",
                          (currentPage - 1) * itemsPerPage + index
                        )
                      }
                    />
                    )}
                  </div>
                </td>)}
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-5">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
      <EditModal
        infoColumns={infoColumns}
        editColumns={infoColumns}
        isOpen={editModalOpen}
        isEditable={isEditable}
        rowData={editRowIndex !== null ? rowData[editRowIndex] : null}
        onSave={handleSaveModal}
        onClose={handleCloseModal}
        heading={popupHeading}
        isTabEdit={tabsEdit}
      />
      <Modal
        title="Confirm Deletion"
        open={deleteModalOpen}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      >
        <p>Do you want to delete this row?</p>
      </Modal>
      <Modal
        title={<span style={{ fontWeight: 'bold', fontSize: '16px' }}>Confirm Enable</span>}
        open={EnableModalOpen}
        onOk={confirmSubmit}
        onCancel={() => setEnableModalOpen(false)}
        centered
      >
        <p>Do you want to <strong>Enable</strong> this State?</p>
      </Modal>
      <Modal
        title={<span style={{ fontWeight: 'bold', fontSize: '16px' }}>Confirm Disable</span>}
        open={DisableModalOpen}
        onOk={confirmSubmit}
        onCancel={() => setDisableModalOpen(false)}
        centered
      >
        <p>Do you want to <strong>Disable</strong> this State?</p>
      </Modal>
    </div>
  );
  
};

export default TableComponent;
