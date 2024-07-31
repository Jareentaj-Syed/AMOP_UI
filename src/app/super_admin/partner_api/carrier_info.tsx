import Select from 'react-select';
import * as XLSX from 'xlsx';
import TableComponent from '../../components/TableComponent/page';
import { TrashIcon, PencilIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import SearchInput from '../../components/Search-Input';
import { useEffect, useState } from 'react';
import { partnerCarrierData } from '@/app/constants/partnercarrier';
import { createModalData } from './carrier_constant';
import { useAuth } from '@/app/components/auth_context';
import { Spin } from 'antd'; // Import Ant Design Spin component
import axios from 'axios';
import { DropdownStyles } from '@/app/components/css/dropdown';

interface ExcelData {
  [key: string]: any;
}

const Partneroptions = Object.keys(partnerCarrierData).map(partner => ({ value: partner, label: partner }));

const CarrierInfo: React.FC = () => {
  const { username, partner, role } = useAuth();
  const editColumns = createModalData;
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
  const module_name= "Carrier Api"
  useEffect(() => {
 

    fetchData();
  }, []); // Fetch initial data once on mount
  const fetchData = async () => {
    try {
      setLoading(true);
      const url = `https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management`;
      const data = {
        tenant_name: partner || "default_value",
        username: username,
        path: "/get_superadmin_info",
        role_name: role,
        "sub_module": "Partner API", 
        "sub_tab": "Carrier APIs",
      };
      const response = await axios.post(url, { data: data });
      const resp = JSON.parse(response.data.body);

      const carrierApis = resp.data.Carrier_apis_data.carrier_apis;
      console.log(carrierApis)
      setTableData(carrierApis);
  
      const environments = resp.data.Environment.map((env: string) => ({ value: env, label: env }));
      setEnvironmentOptions(environments);

      const partners = resp.data.Partner.map((partner: string) => ({ value: partner, label: partner }));
      setPartnerOptions(partners);
      setLoading(false);
    } catch (err) {

      console.error(err);
    }finally {
      setLoading(false); 
    }
  
  };
  useEffect(() => {
    if (environment && selectedPartner) {
      const fetchData = async () => {
        try {
          setLoading(true)
          const url = `https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management`;
          const data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/get_superadmin_info",
            role_name: role,
            "sub_module": "Partner API", 
            "sub_tab": "Carrier APIs",
            "Environment": environment.value,
            "Partner": selectedPartner.value
          };
          const response = await axios.post(url, { data });
          const resp = JSON.parse(response.data.body);
          // console.log(resp)
          // console.log("Environment:", resp.data.partners_and_subpartners);
          // console.log("Partner:", resp.data.role_module_data);
          // console.log("amop_apis_data:", resp.data.Carrier_apis_data);
          
        const carrierApis = resp.data.Carrier_apis_data.carrier_apis;

        setTableData(carrierApis);
    
        const environments = resp.data.Environment.map((env: string) => ({ value: env, label: env }));
        setEnvironmentOptions(environments);

        const partners = resp.data.Partner.map((partner: string) => ({ value: partner, label: partner }));
        setPartnerOptions(partners);
        setLoading(false)
        } catch (err) {
          console.error(err);
        }
      };

      fetchData();
    }
  }, [environment, selectedPartner]); // Call fetchData when environment or selectedPartner changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const headers = ["service_provider_name", "api_name", "api_url", "api_params", "api_state",  "env", "partner","last_modified_by", "last_modified_datetime"];
  const headersmap = {
  
    "service_provider_name":"Service provider name",
   "api_name":"API name",
  "api_url": "API url",
   "api_params":"API params",
   "api_state": "API state", 
   "env": "Environment",
   "partner":"Partner",
   "last_modified_by":"Last modified by", 
   "last_modified_datetime":"Last modified date & time"
}

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
            <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
        </div>

        <div className="container mx-auto">
          {tableData.length > 0 && (
            <TableComponent
              headers={headers}
              headerMap={headersmap}
              initialData={tableData}
              searchQuery={searchTerm}
              visibleColumns={headers}
              itemsPerPage={10}
              allowedActions={["edit"]}
              popupHeading='Carrier'
              infoColumns={editColumns}
              editColumns={editColumns}
              advancedFilters={[]}        
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CarrierInfo;
