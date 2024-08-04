import Select from 'react-select';
import * as XLSX from 'xlsx';
import TableComponent from '../../components/TableComponent/page';
import { TrashIcon, PencilIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import SearchInput from '../../components/Search-Input';
import { useEffect, useState } from 'react';
import { partnerCarrierData } from '@/app/constants/partnercarrier';
import { createModalData } from './carrier_constant';
import { useAuth } from '@/app/components/auth_context';
import { Modal, Spin } from 'antd'; // Import Ant Design Spin component
import axios from 'axios';
import { DropdownStyles } from '@/app/components/css/dropdown';
import TableSearch from '@/app/components/entire_table_search';

interface ExcelData {
  [key: string]: any;
}

const Partneroptions = Object.keys(partnerCarrierData).map(partner => ({ value: partner, label: partner }));

const CarrierInfo: React.FC = () => {
  const { username, partner, role } = useAuth();
  const [carrierData, setCarrierData] = useState<ExcelData[]>([]);
  const [apiState, setApiState] = useState<{ [key: number]: string }>({});
  const [originalCarrierData, setOriginalCarrierData] = useState<ExcelData[]>([]);
  const [environment, setEnvironment] = useState<{ value: string; label: string } | null>(null);
  const [editRowIndex, setEditRowIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<{ value: string; label: string } | null>(null);
  const [environmentOptions, setEnvironmentOptions] = useState<{ value: string; label: string }[]>([]);
  const [Partneroptions, setPartnerOptions] = useState<{ value: string; label: string }[]>([]);
  const [tableData, setTableData] = useState<any>([]);
  const editableDrp = DropdownStyles;
  const [loading, setLoading] = useState(true); // State to manage loading
  const [pagination,setpagination]=useState<any>({});
  const module_name= "Carrier Api"
  const [headers,setHeaders]=useState<any[]>([]);
  const [headerMap,setHeaderMap]=useState<any>({});
  const [createModalData,setcreateModalData]=useState<any[]>([]);
  const [generalFields,setgeneralFields]=useState<any[]>([])
  useEffect(() => {
    fetchData();
  }, []); // Fetch initial data once on mount
  const fetchData = async () => {
    setEnvironment(null)
    setSelectedPartner(null)
    setLoading(true); 
    // Set loading to true before the request
    try {
      const url = `https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management`;
      const data = {
        tenant_name: partner || "default_value",
        username: username,
        path: "/get_superadmin_info",
        role_name: role,
        sub_module: "Partner API", 
        sub_tab: "Carrier APIs",
      };
      
      const response = await axios.post(url, { data: data });
      const resp = JSON.parse(response.data.body);
      console.log(resp)
      // Check if the flag is false
      if (resp.flag === false) {
        Modal.error({
          title: 'Data Fetch Error',
          content: resp.message || 'An error occurred while fetching Carrier APIs. Please try again.',
          centered: true,
        });
        return; // Exit early if there's an error
      }
  
      const carrierApis = resp.data.Carrier_apis_data.carrier_apis;
      console.log(carrierApis);
      setTableData(carrierApis);
          const headersMap=resp.headers_map["carrier apis"].header_map
          const sortedheaderMap=sortHeaderMap(headersMap)
          setHeaderMap(sortedheaderMap)
          const headers=Object.keys(sortedheaderMap)
          setHeaders(headers)
    
      const environments = resp.data.Environment.map((env: string) => ({ value: env, label: env }));
      setEnvironmentOptions(environments);
  
      const partners = resp.data.Partner.map((partner: string) => ({ value: partner, label: partner }));
      setPartnerOptions(partners);
    } catch (err) {
      console.error("Error fetching data:", err);
      Modal.error({
        title: 'Data Fetch Error',
        content: err instanceof Error ? err.message : 'An unexpected error occurred while fetching data. Please try again.',
        centered: true,
      });
    } finally {
      setLoading(false); // Set loading to false after the request is done
    }
  };

  type HeaderMap = Record<string, [string, number]>;

const sortHeaderMap = (headerMap: HeaderMap): HeaderMap => {
  // Convert the object to an array of [key, value] pairs
  const entries = Object.entries(headerMap) as [string, [string, number]][];

  // Sort the array based on the second item of each value
  entries.sort((a, b) => a[1][1] - b[1][1]);

  // Convert the sorted array back to an object
  return Object.fromEntries(entries) as HeaderMap;
}
  
  useEffect(() => {
    if (environment && selectedPartner) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const url = `https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management`;
          const data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/get_superadmin_info",
            role_name: role,
            sub_module: "Partner API", 
            sub_tab: "Carrier APIs",
            Environment: environment.value,
            Partner: selectedPartner.value,
          };
          const response = await axios.post(url, { data });
          const resp = JSON.parse(response.data.body);
          console.log(resp)
          // Check if the flag is false
          if (resp.flag === false) {
            Modal.error({
              title: 'Data Fetch Error',
              content: resp.message || 'An error occurred while fetching data. Please try again.',
              centered: true,
            });
            return; // Exit early if there's an error
          }
  
          const carrierApis = resp.data.Carrier_apis_data.carrier_apis;
  
          setTableData(carrierApis);
          console.log("response",resp)
          const headersMap=resp.headers_map["carrier apis"].header_map
          const sortedheaderMap=sortHeaderMap(headersMap)
          setHeaderMap(sortedheaderMap)
          const headers=Object.keys(sortedheaderMap)
          setHeaders(headers)
          console.log("headersMap",sortedheaderMap,headers)
          const environments = resp.data.Environment.map((env: string) => ({ value: env, label: env }));
          setEnvironmentOptions(environments);
  
          const partners = resp.data.Partner.map((partner: string) => ({ value: partner, label: partner }));
          setPartnerOptions(partners);
        } catch (err) {
          console.error("Error fetching data:", err);
          Modal.error({
            title: 'Data Fetch Error',
            content: err instanceof Error ? err.message : 'An unexpected error occurred while fetching data. Please try again.',
            centered: true,
          });
        } finally {
          setLoading(false); // Ensure loading is set to false after the request
        }
      };
  
      fetchData();
    }
  }, [environment, selectedPartner]);
  // Call fetchData when environment or selectedPartner changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

//   const headers = ["service_provider_name", "api_name", "api_url", "api_params", "api_state",  "env", "partner","last_modified_by", "last_modified_datetime"];
//   const headersmap = {
  
//     "service_provider_name":"Service provider name",
//    "api_name":"API name",
//   "api_url": "API url",
//    "api_params":"API params",
//    "api_state": "API state", 
//    "env": "Environment",
//    "partner":"Partner",
//    "last_modified_by":"Last modified by", 
//    "last_modified_datetime":"Last modified date & time"
// }

  const formatColumnName = (name: string) => {
    return name.replace(/_/g, ' ');
  };

  const handleOpenEditModal = (index: number) => {
    setEditRowIndex(index);
  };

  const handleSaveModal = (updatedRow: any) => {
    const updatedData = [...carrierData];
    updatedData[editRowIndex as number] = updatedRow;
    setCarrierData(updatedData);
    setEditRowIndex(null);
  };

  return (
    <div className=''>
      <div className="">
        <div className="p-4 flex items-center justify-between mb-2">
          <div className="flex space-x-4">
            <div className='w-[250px]'>
              <label className="block text-gray-700">
                Environment<span className="text-red-500">*</span>
              </label>
              <Select
                value={environment}
                onChange={(selectedOption) => setEnvironment(selectedOption)}
                options={environmentOptions}
                styles={editableDrp}
                
              />
            </div>
            <div className='w-[250px]'>
              <label className="block text-gray-700">Partner<span className="text-red-500">*</span></label>
              <Select
                value={selectedPartner}
                onChange={(selectedOption) => setSelectedPartner(selectedOption)}
                options={Partneroptions}
               
                styles={editableDrp}
              />
            </div>
          </div>
          <div className='mt-5 ml-3'>
          <button
              className='save-btn'
              type="submit"
              onClick={() => fetchData()}
            >
              Clear
            </button>
            </div>
          <div className="ml-auto mt-4">
            {/* <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> */}
            <TableSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              tableName={"carrier_apis "}
              headerMap={headerMap}
            />
          </div>
        </div>

        <div className="container mx-auto">
          {(
            <TableComponent
              headers={headers}
              headerMap={headerMap}
              initialData={tableData}
              searchQuery={searchTerm}
              visibleColumns={headers}
              itemsPerPage={100}
              allowedActions={["edit"]}
              popupHeading='Carrier'
              createModalData={createModalData}
              advancedFilters={[]}     
              pagination={pagination}   
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CarrierInfo;
