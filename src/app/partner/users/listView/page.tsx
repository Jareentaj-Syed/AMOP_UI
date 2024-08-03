import React, { useState,useEffect } from 'react';
import * as XLSX from 'xlsx';
import { PlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import ChartsPage from '../charts/page';
import TableComponent from '@/app/components/TableComponent/page';
import ColumnFilter from '../../../components/columnfilter';
import SearchInput from '../../../components/Search-Input';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import CreateUser from '../createUser/page';
import { usePartnerStore } from '../../partnerStore';
import { useUserStore } from '../createUser/createUserStore';


interface ExcelDataRow {
  [key: string]: any;
}

const ListView: React.FC = () => {
  const [data, setData] = useState<ExcelDataRow[]>([]); // Initialize data with users_table
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]); // Initialize visibleColumns with headers
  const [showCreateUser, setShowCreateUser] = useState(false);
  const router = useRouter();
  const { partnerData } = usePartnerStore.getState();
  const partnerInfo=partnerData["Partner info"]
  const createUser = dynamic(() => import('../createUser/page'));
  const handleCreateClick = () => {
    setShowCreateUser(true);
  };
  const {
    setTenant,
    setRoleName,
    setSubTenant
  } = useUserStore();
  useEffect(() => {
    setTenant('')
    setSubTenant([])
    setRoleName('')
}, []);
  const handleExport = () => {
    // const exportData = [headers, ...data.map(row => headers.map(header => row[header]))];
    const worksheet = XLSX.utils.aoa_to_sheet([]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "Users.xlsx");
  };

  return (
    <div className="container mx-auto">
      {showCreateUser ? (
        <CreateUser/> 
      ) : (
        <>
          <div className="flex items-center justify-between">
            <ChartsPage />
          </div>

          <div className="p-4 flex items-center justify-between mt-2 mb-2">
            <div className="flex space-x-4">
              <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              <ColumnFilter headers={[]} visibleColumns={visibleColumns} setVisibleColumns={setVisibleColumns} headerMap={{}}/>
            </div>

            <div className="flex space-x-4">
              <button
                className="save-btn"
                onClick={handleCreateClick} // Show create user form on click
              >
                <PlusIcon className="h-5 w-5 text-black-500 mr-1" />
                Create New User
              </button>
              <button className="save-btn" onClick={handleExport}>
                <ArrowDownTrayIcon className="h-5 w-5 text-black-500 mr-2" />
                <span>Export</span>
              </button>
            </div>
          </div>

          <div className="">
            <TableComponent
              headers={[]}
              headerMap={{}}
              initialData={data}
              searchQuery={searchTerm}
              visibleColumns={visibleColumns}
              itemsPerPage={100}
              allowedActions={["tabsEdit", "delete", "tabsInfo"]}
              popupHeading='User'
              createModalData={[]}
              pagination={{}}
             
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ListView;
