import React, { useState, useEffect } from 'react';
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
import dayjs, { Dayjs } from "dayjs";
import { getCurrentDateTime } from '@/app/components/header_constants';
import { useAuth } from '@/app/components/auth_context';
import axios from 'axios';
import { Button, DatePicker, Modal, notification } from 'antd';
import TableSearch from '@/app/components/entire_table_search';
import AdvancedMultiFilter from '@/app/components/advanced_search';
const { RangePicker } = DatePicker;


interface ExcelDataRow {
  [key: string]: any;
}
type HeaderMap = Record<string, [string, number]>;

const ListView: React.FC = () => {
  const [data, setData] = useState<ExcelDataRow[]>([]); // Initialize data with users_table
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [headerMap, setHeadersMap] = useState<HeaderMap>({});
  const [createModalData, setCreateModalData] = useState<any[]>([]);
  const [generalFields, setGeneralFields] = useState<any>({});
  const { partnerData } = usePartnerStore.getState();
  const usersData = partnerData["Partner users"] || {};
  const [isExportModalOpen, setExportModalOpen] = useState(false);

  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const { username, partner, role,settabledata } = useAuth();
  const [pagination, setPagination] = useState<any>({});
  const [filteredData, setFilteredData] = useState([]);
  const handleFilter = (advancedFilters: any) => {
    console.log(advancedFilters)
    setFilteredData(advancedFilters);
  };
  const handleReset = (EmptyFilters: any) => {
    console.log(EmptyFilters)
    setFilteredData(EmptyFilters);
  };

  const sortHeaderMap = (headerMap: HeaderMap): HeaderMap => {
    const entries = Object.entries(headerMap) as [string, [string, number]][];
    entries.sort((a, b) => a[1][1] - b[1][1]);
    return Object.fromEntries(entries) as HeaderMap;
  };
  useEffect(() => {
    const initializeData = () => {
      const data = usersData?.data?.["Partner users"]?.users || [];
      setData(data);
      settabledata(data)
      const header_Map = sortHeaderMap(usersData?.headers_map?.["Partner users"]?.header_map || {});
      const headers_ = Object.keys(header_Map);
      const createModalData_ = usersData?.headers_map?.["Partner users"]?.pop_up || [];
      const generalFields_ = usersData?.data?.["Partner users"] || {}
      const pagination_ = usersData?.data?.pages?.["Partner users"] || {}
      setPagination(pagination_)
      setHeaders(headers_);
      setHeadersMap(header_Map);
      setVisibleColumns(headers_);
      setGeneralFields(generalFields_);
      setCreateModalData(sortPopup(createModalData_))
    };

    initializeData();
  }, [usersData]);
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
  const handleExportModalOpen = () => {
    setExportModalOpen(true);
  };

  const handleExportModalClose = () => {
    setExportModalOpen(false);
    setDateRange([null, null]); // Reset date range
  };
  const sortPopup = (fields: any[]): any[] => {
    return fields.sort((a:any, b:any) => a?.id - b?.id);
  };
  const handleExport = async () => {
    if (!dateRange || dateRange[0] === null || dateRange[1] === null) {
      Modal.error({ title: 'Error', content: 'Please select a date range.' });
      return;
    }

    const [startDate, endDate] = dateRange;

    const data = {
      path: "/export",
      username: username,
      table: "customers",
      module_name: "Users",
      request_received_at: getCurrentDateTime(),
      start_date: startDate.format("YYYY-MM-DD 00:00:00"), // Start of the day
      end_date: endDate.format("YYYY-MM-DD 23:59:59"),

      Partner: partner,
    };

    try {
      const url = "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management";
      const response = await axios.post(url, { data: data }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const resp = JSON.parse(response.data.body);
      const blob = resp.blob;
      console.log(resp)
      // Close the modal after exporting
      if (response.data.statusCode === 200) {
        if (resp.flag === true) {
          notification.success({
            message: 'Success',
            description: 'Successfully exported the record!',
            style: messageStyle,
            placement: 'top',
          });
  
          // Trigger the download after a successful export
          downloadBlob(blob);
        } else {
          // Log and show error message
          console.log('Error message:', resp.message);
          Modal.error({
            title: 'Export Error',
            content: resp.message,
            centered: true,
          });
      
        }
      } else {
        // Handle unexpected status codes
        console.log('Unexpected status code:', response.data.statusCode);
        Modal.error({
          title: 'Export Error',
          content: resp.message,
          centered: true,
        });
      }

      handleExportModalClose();
   

    } catch (error) {
      // console.error("Error downloading the file:", error);
      // Modal.error({ title: 'Export Error', content: 'An error occurred while exporting the file. Please try again.' });
    }
  };

  const messageStyle = {
    fontSize: '14px',  // Adjust font size
    fontWeight: 'bold', // Make the text bold
    padding: '16px',
    // Add padding
  };

  const downloadBlob = (base64Blob: string) => {
    // Decode the Base64 string
    const byteCharacters = atob(base64Blob);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blobObject = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blobObject);
    link.download = 'Partner Users.xlsx'; // Set the file name to .xlsx
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const disableFutureDates = (current: any) => {
    console.log("future dates:", current && current > dayjs().endOf('day'));
    return current && current > dayjs().endOf('day'); // Disable future dates
  };
  return (
    <div className="container mx-auto">
      {showCreateUser ? (
        <CreateUser />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <ChartsPage />
          </div>

          <div className="p-4 flex items-center justify-between mt-2 mb-2">
            <div className="flex space-x-4">
              {/* <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> */}
              <TableSearch
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                tableName={"partner_users"}
                headerMap={headerMap}
              />
            </div>

            <div className="flex space-x-4">
              <button
                className="save-btn"
                onClick={handleCreateClick} // Show create user form on click
              >
                <PlusIcon className="h-5 w-5 text-black-500 mr-1" />
                Create New User
              </button>
              <button className="save-btn" onClick={handleExportModalOpen}>
                <ArrowDownTrayIcon className="h-5 w-5 text-black-500 mr-2" />
                <span>Export</span>
              </button>
              <ColumnFilter headers={headers} visibleColumns={visibleColumns} setVisibleColumns={setVisibleColumns} headerMap={headerMap} />
            </div>
          </div>
          <div className=' mb-4 space-x-2'>

            <AdvancedMultiFilter
              onFilter={handleFilter}
              onReset={handleReset}
              headers={headers}
              headerMap={headerMap}
              tableName={"partner_users"} />
          </div>
          <div className="">
            <TableComponent
              headers={headers}
              headerMap={headerMap}
              initialData={data}
              searchQuery={searchTerm}
              visibleColumns={visibleColumns}
              itemsPerPage={100}
              allowedActions={["tabsEdit", "delete", "tabsInfo"]}
              popupHeading='User'
              createModalData={createModalData}
              pagination={pagination}
              generalFields={generalFields}
              advancedFilters={filteredData}
            />

          </div>
          <Modal
            title="Export Output"
            visible={isExportModalOpen}
            onCancel={() => {
              handleExportModalClose();
              setDateRange([null, null]); // Reset date range here for good measure
            }}
            footer={null}
            centered
            afterClose={() => setDateRange([null, null])}
          >
            <div className="flex flex-col space-y-4">
              <span>Select Date Range:</span>
              <RangePicker
                value={dateRange[0] && dateRange[1] ? [dateRange[0], dateRange[1]] : null} // Bind the date range
                onChange={(dates) => {
                  console.log("Selected dates:", dates); // Debug log
                  if (dates && dates.length === 2) {
                    setDateRange([dates[0], dates[1]] as [Dayjs, Dayjs]);
                  } else {
                    setDateRange([null, null]); // Reset to null if dates are not both available
                  }
                }}
                format="YYYY-MM-DD"
                disabledDate={disableFutureDates}
              />
              <div className="flex justify-end space-x-2">
                <Button onClick={handleExportModalClose}>Cancel</Button>
                <Button type="primary" onClick={handleExport}>Export</Button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default ListView;
