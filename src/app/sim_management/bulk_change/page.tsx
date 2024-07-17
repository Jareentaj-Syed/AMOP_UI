"use client"
import React, { useEffect, useState } from 'react';
import { Input, Button, Badge } from 'antd';
import { DownloadOutlined } from "@ant-design/icons";
import { SearchOutlined } from '@ant-design/icons';
// import AdvancedFilter from './Table-feautures/advanced-filter';
import * as XLSX from 'xlsx';
import TableComponent from '@/app/components/TableComponent/page';
import SearchInput from '@/app/components/Search-Input';
import ColumnFilter from '@/app/components/columnfilter';
import AdvancedFilter from '../inventory/Table-feautures/advanced-filter';
interface ExcelDataRow {
    [key: string]: any;
}

// const BulkChange: React.FC<BulkChangeProps> = ({ headers, rowData, onApplyChanges }) => {
//   const [selectedRows, setSelectedRows] = useState<number[]>([]);
//   const [changes, setChanges] = useState<{ [key: string]: any }>({});
//   const [modalVisible, setModalVisible] = useState(false);

//   const handleRowCheckboxChange = (index: number) => {
//     const newSelectedRows = [...selectedRows];
//     const rowIndex = newSelectedRows.indexOf(index);
//     if (rowIndex === -1) {
//       newSelectedRows.push(index);
//     } else {
//       newSelectedRows.splice(rowIndex, 1);
//     }
//     setSelectedRows(newSelectedRows);
//   };

//   const handleInputChange = (key: string, value: any) => {
//     setChanges((prevChanges) => ({
//       ...prevChanges,
//       [key]: value,
//     }));
//   };

//   const handleApplyChanges = () => {
//     onApplyChanges(selectedRows, changes);
//     setSelectedRows([]);
//     setChanges({});
//     setModalVisible(false);
//   };

//   return (
//     <div className="bulk-change-container">
//       <table className="min-w-full bg-white border border-gray-200 rounded-lg">
//         <thead className="bg-gray-200">
//           <tr>
//             <th className="px-6 border-b border-gray-300 text-left font-semibold table-header">
//               <Checkbox
//                 onChange={(e) => setSelectedRows(e.target.checked ? rowData.map((_, index) => index) : [])}
//                 checked={selectedRows.length === rowData.length}
//                 indeterminate={selectedRows.length > 0 && selectedRows.length < rowData.length}
//               />
//             </th>
//             {headers.map((header, index) => (
//               <th key={index} className="px-6 border-b border-gray-300 text-left font-semibold table-header">
//                 {header}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {rowData.map((row, index) => (
//             <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
//               <td className="px-6 border-b border-gray-300 table-cell">
//                 <Checkbox
//                   checked={selectedRows.includes(index)}
//                   onChange={() => handleRowCheckboxChange(index)}
//                 />
//               </td>
//               {headers.map((header, columnIndex) => (
//                 <td key={columnIndex} className="px-6 border-b border-gray-300 table-cell">
//                   {row[header]}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <Button type="primary" onClick={() => setModalVisible(true)}>
//         Apply Bulk Changes
//       </Button>
//       <Modal
//         title="Bulk Changes"
//         visible={modalVisible}
//         onOk={handleApplyChanges}
//         onCancel={() => setModalVisible(false)}
//       >
//         {headers.map((header, index) => (
//           <div key={index} className="form-item">
//             <label>{header}</label>
//             <input
//               type="text"
//               value={changes[header] || ''}
//               onChange={(e) => handleInputChange(header, e.target.value)}
//               className="input"
//             />
//           </div>
//         ))}
//       </Modal>
//     </div>
//   );
// };
const BulkChange: React.FC = () => {
    const [data, setData] = useState<ExcelDataRow[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/Inventory-sim-management.xlsx');
                const arrayBuffer = await response.arrayBuffer();
                const data = new Uint8Array(arrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // Adjusting sheet_to_json options to include empty cells
                const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
                    header: 1, // Use first row as header
                    blankrows: false // Include cells with blank values
                });

                if (jsonData.length === 0) {
                    throw new Error('No data found in the Excel sheet.');
                }

                // Extracting column names from the first row
                // const columnNames = jsonData[0];

                // Processing rows excluding the first row (header)
                // const filledData = jsonData.slice(1).map(row => {
                //     const filledRow: any = {};
                //     columnNames.forEach((header: any, index: number) => {
                //         filledRow[header] = row[index] || '';
                //     });
                //     return filledRow;
                // });

                const filledData = [
                    {
                        "Service Provider": "AT&T - POD19",
                        "Change Type": "Update",
                        "Status": "Completed",
                        "Uploaded": 45,
                        "Successfull": 9,
                        "Errors": 1,
                        "Processed By": "User5",
                        "Processed Date": "2024-09-25T14:30:00.000Z",
                        "Change Details": "Updated DN(s) added"
                    },
                    {
                        "Service Provider": "Verizon",
                        "Change Type": "Update",
                        "Status": "Pending",
                        "Uploaded": 30,
                        "Successfull": 10,
                        "Errors": 5,
                        "Processed By": "User6",
                        "Processed Date": "2024-09-26T10:20:00.000Z",
                        "Change Details": "Removed DN(s) failed"
                    },
                    {
                        "Service Provider": "AT&T - POD19",
                        "Change Type": "Delete",
                        "Status": "Completed",
                        "Uploaded": 28,
                        "Successfull": 20,
                        "Errors": 0,
                        "Processed By": "User7",
                        "Processed Date": "2024-09-27T16:45:00.000Z",
                        "Change Details": "Updated DN(s) deleted"
                    },
                    {
                        "Service Provider": "Verizon",
                        "Change Type": "Add",
                        "Status": "Completed",
                        "Uploaded": 15,
                        "Successfull": 28,
                        "Errors": 2,
                        "Processed By": "User8",
                        "Processed Date": "2024-09-28T11:15:00.000Z",
                        "Change Details": "Added new DN(s)"
                    }
                ];
                const columnNames = [
                    "Service Provider",
                    "Change Type",
                    "Status",
                    "Uploaded",
                    "Successfull",
                    "Errors",
                    "Processed By",
                    "Processed Date",
                    "Change Details"
                ]
                
                setData(filledData);
                setVisibleColumns(columnNames);
            } catch (error) {
                console.error('Error fetching data from Excel:', error);
                // Handle error state or display a message to the user
            }
        };

        fetchData();
    }, []);

    const headers = visibleColumns;
    const EXPORT = " Export";
    const searchPlaceholder = "Search"
    const [filteredData, setFilteredData] = useState([]);
    const handleFilter = (advancedFilters: any) => {
        console.log(advancedFilters)
        setFilteredData(advancedFilters);
    };
    return (
        <div>
            <div className="flex justify-end items-center mt-5 mr-6">
                <div className="flex space-x-5">
                    {/* <ColumnFilter data={data} visibleColumns={visibleColumns} setVisibleColumns={setVisibleColumns} />
                    <button className="flex items-center p-2 save-btn">
                        <DownloadOutlined className="h-5 w-5 text-black-500 mr-2" />
                        {EXPORT}
                    </button> */}
                    {/* <Button
        type="primary"
        className="ml-2"
        icon={<DownloadOutlined />}
        size="large"
        ghost
      >
        {EXPORT}
      </Button> */}
                </div>
            </div>




            <div>
         
        <div className="flex justify-between items-center ml-4 mb-5">
    <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    {/* <AdvancedFilter onFilter={handleFilter} /> */}
  </div>
  
        </div>
            <TableComponent
                infoColumns={[]}
                editColumns={[]}
                headers={headers}
                initialData={data}
                searchQuery={searchTerm}
                visibleColumns={visibleColumns}
                itemsPerPage={10}
                allowedActions={['info']}
                advancedFilters={filteredData}
                isSelectRowVisible={false}
                 popupHeading={''} />
        </div>
    );
};
// const BulkChangePage: React.FC = () => {
//   const router = useRouter();

//   const headers = ['Column1', 'Column2', 'Column3']; // Replace with your actual headers
//   const initialData = [
//     { Column1: 'Data1', Column2: 'Data2', Column3: 'Data3' },
//     { Column1: 'Data4', Column2: 'Data5', Column3: 'Data6' },
//   ]; // Replace with your actual data

//   const handleApplyChanges = (selectedRows: number[], changes: { [key: string]: any }) => {
//     // Implement your bulk change logic here
//     console.log('Selected Rows:', selectedRows);
//     console.log('Changes:', changes);
//   };

//   return (
//     <div className="bulk-change-page">
//       <h1>Bulk Change</h1>
//       <BulkChange headers={headers} rowData={initialData} onApplyChanges={handleApplyChanges} />
//     </div>
//   );
// };

export default BulkChange;
