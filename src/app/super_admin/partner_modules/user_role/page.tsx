"use client";
import TableComponent from '@/app/components/TableComponent/page';
import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid';
import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { partnerCarrierData, subPartnersData } from '@/app/constants/partnercarrier'
import ColumnFilter from '../../../components/columnfilter';
import SearchInput from '../../../components/Search-Input';
import * as XLSX from 'xlsx';

interface ExcelDataRow {
    [key: string]: any;
}

const UserRole: React.FC = () => {
    const [data, setData] = useState<ExcelDataRow[]>([]);
    const [data2, setData2] = useState<ExcelDataRow[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
    const [visibleColumns2, setVisibleColumns2] = useState<string[]>([]);

    const fetchData = async (url: string, setData: React.Dispatch<React.SetStateAction<ExcelDataRow[]>>, setVisibleColumns: React.Dispatch<React.SetStateAction<string[]>>) => {
        try {
            const response = await fetch(url);
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
            const columnNames = jsonData[0];

            // Processing rows excluding the first row (header)
            const filledData = jsonData.slice(1).map(row => {
                const filledRow: any = {};
                columnNames.forEach((header: any, index: number) => {
                    filledRow[header] = row[index] || '';
                });
                return filledRow;
            });

            setData(filledData);
            setVisibleColumns(columnNames);
        } catch (error) {
            console.error('Error fetching data from Excel:', error);
            // Handle error state or display a message to the user
        }
    };

    useEffect(() => {
        fetchData('/Roles.xlsx', setData, setVisibleColumns);
        fetchData('/modules.xlsx', setData2, setVisibleColumns2);
    }, []);

    const headers1 = visibleColumns;
    const headers2 = visibleColumns2;

    return (
        <div className=''>
         
            <div>
                <div className="mb-2">
                <div className='p-2'>
      <h3 className="tabs-sub-headings">Roles</h3>
      </div>
                    <TableComponent
                    isSelectRowVisible={false}
                        headers={headers1}
                        initialData={data}
                        searchQuery={searchTerm}
                        visibleColumns={visibleColumns}
                        itemsPerPage={10}
                        popupHeading='User'
                        infoColumns={[]}
                        editColumns={[]}
                        
                    />
                </div>

                <div>
                <div className='p-2'>
      <h3 className="tabs-sub-headings">Module Access</h3>
      </div>
                    <TableComponent
                        isSelectRowVisible={false}
                        headers={headers2}
                        initialData={data2}
                        searchQuery={searchTerm}
                        visibleColumns={visibleColumns2}
                        itemsPerPage={10}
                        popupHeading='User'
                        infoColumns={[]}
                        editColumns={[]}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserRole;
