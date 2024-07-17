"use client";
import React, { useState } from 'react';
import { Checkbox, Button, Modal } from 'antd';
// import { useRouter } from 'next/router';
import { useRouter } from 'next/navigation'; // Ensure correct import

interface BulkChangeProps {
  headers: string[];
  rowData: { [key: string]: any }[];
  onApplyChanges: (selectedRows: number[], changes: { [key: string]: any }) => void;
}

const BulkChange: React.FC<BulkChangeProps> = ({ headers, rowData, onApplyChanges }) => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [changes, setChanges] = useState<{ [key: string]: any }>({});
  const [modalVisible, setModalVisible] = useState(false);

  const handleRowCheckboxChange = (index: number) => {
    const newSelectedRows = [...selectedRows];
    const rowIndex = newSelectedRows.indexOf(index);
    if (rowIndex === -1) {
      newSelectedRows.push(index);
    } else {
      newSelectedRows.splice(rowIndex, 1);
    }
    setSelectedRows(newSelectedRows);
  };

  const handleInputChange = (key: string, value: any) => {
    setChanges((prevChanges) => ({
      ...prevChanges,
      [key]: value,
    }));
  };

  const handleApplyChanges = () => {
    onApplyChanges(selectedRows, changes);
    setSelectedRows([]);
    setChanges({});
    setModalVisible(false);
  };

  return (
    <div className="bulk-change-container">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-6 border-b border-gray-300 text-left font-semibold table-header">
              <Checkbox
                onChange={(e) => setSelectedRows(e.target.checked ? rowData.map((_, index) => index) : [])}
                checked={selectedRows.length === rowData.length}
                indeterminate={selectedRows.length > 0 && selectedRows.length < rowData.length}
              />
            </th>
            {headers.map((header, index) => (
              <th key={index} className="px-6 border-b border-gray-300 text-left font-semibold table-header">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowData.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
              <td className="px-6 border-b border-gray-300 table-cell">
                <Checkbox
                  checked={selectedRows.includes(index)}
                  onChange={() => handleRowCheckboxChange(index)}
                />
              </td>
              {headers.map((header, columnIndex) => (
                <td key={columnIndex} className="px-6 border-b border-gray-300 table-cell">
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Button type="primary" onClick={() => setModalVisible(true)}>
        Apply Bulk Changes
      </Button>
      <Modal
        title="Bulk Changes"
        visible={modalVisible}
        onOk={handleApplyChanges}
        onCancel={() => setModalVisible(false)}
      >
        {headers.map((header, index) => (
          <div key={index} className="form-item">
            <label>{header}</label>
            <input
              type="text"
              value={changes[header] || ''}
              onChange={(e) => handleInputChange(header, e.target.value)}
              className="input"
            />
          </div>
        ))}
      </Modal>
    </div>
  );
};

const BulkChangePage: React.FC = () => {
  const router = useRouter();

  const headers = ['Column1', 'Column2', 'Column3']; // Replace with your actual headers
  const initialData = [
    { Column1: 'Data1', Column2: 'Data2', Column3: 'Data3' },
    { Column1: 'Data4', Column2: 'Data5', Column3: 'Data6' },
  ]; // Replace with your actual data

  const handleApplyChanges = (selectedRows: number[], changes: { [key: string]: any }) => {
    // Implement your bulk change logic here
    console.log('Selected Rows:', selectedRows);
    console.log('Changes:', changes);
  };

  return (
    <div className="bulk-change-page">
      <h1>Bulk Change</h1>
      <BulkChange headers={headers} rowData={initialData} onApplyChanges={handleApplyChanges} />
    </div>
  );
};

export default BulkChangePage;
