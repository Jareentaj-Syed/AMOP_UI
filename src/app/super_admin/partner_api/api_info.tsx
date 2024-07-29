import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import TableComponent from '../../components/TableComponent/page';
import SearchInput from '../../components/Search-Input';
import axios from 'axios';
import { useAuth } from '@/app/components/auth_context';
import { DropdownStyles } from '@/app/components/css/dropdown';
import { Spin } from 'antd'; // Import Ant Design Spin component
import { createModalData } from './api_constants';

interface ExcelData {
  [key: string]: any;
}

const CarrierInfo: React.FC = () => {
  const { username, partner, role } = useAuth();
  const editableDrp = DropdownStyles;
  const [environmentOptions, setEnvironmentOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [Partneroptions, setPartnerOptions] = useState<{ value: string; label: string }[]>([]);
  const [tableData, setTableData] = useState<any>([]);
  const editColumns = createModalData; // Initialize as empty array or with appropriate columns if needed
  const [environment, setEnvironment] = useState<{ value: string; label: string } | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<{ value: string; label: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true before the request
        const url = `https://zff5caoge3.execute-api.ap-south-1.amazonaws.com/dev/get_partner_info`;
        const data = {
          tenant_name: partner || "default_value",
          username: username,
          path: "/get_superadmin_info",
          role_name: role,
          "sub_module": "Partner API",
          "sub_tab": "Amop APIs"
        };
        const response = await axios.post(url, { data: data });
        // console.log(response.data);
        const resp = JSON.parse(response.data.body);
        // console.log(resp);
        // console.log("Environment:", resp.data.Environment);
        // console.log("Partner:", resp.data.Partner);
        // console.log("amop_apis_data:", resp.data.amop_apis_data.amop_apis);
       
        const carrierApis = resp.data.amop_apis_data.amop_apis;
        
        setTableData(carrierApis);
        const environments = resp.data.Environment.map((env: string) => ({ value: env, label: env }));
        setEnvironmentOptions(environments);
        
        const partners = resp.data.Partner.map((partner: string) => ({ value: partner, label: partner }));
        setPartnerOptions(partners);
        setLoading(false);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // Set loading to false after the request is done
      }
    };
  
    fetchData();
  }, [username, partner, role]); // Add dependencies if necessary

  useEffect(() => {
    const fetchData = async () => {
      if (environment && selectedPartner) {
        try {
          setLoading(true); // Set loading to true before the request
          const url = `https://zff5caoge3.execute-api.ap-south-1.amazonaws.com/dev/get_partner_info`;
          const data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/get_superadmin_info",
            role_name: role,
            "sub_module": "Partner API",
            "sub_tab": "Amop APIs",
            flag: "withparameters",
            "Environment": environment.value,
            "Partner": selectedPartner.value
          };
          const response = await axios.post(url, { data });
          const resp = JSON.parse(response.data.body);
          // console.log(resp)
          // console.log("Environment:", resp.data.partners_and_subpartners);
          // console.log("Partner:", resp.data.role_module_data);
          // console.log("amop_apis_data:", resp.data.amop_apis_data);
          const carrierApis = resp.data.amop_apis_data.amop_apis;
        
          setTableData(carrierApis);
          setLoading(false);
          const environments = resp.data.Environment.map((env: string) => ({ value: env, label: env }));
          setEnvironmentOptions(environments);
          
          const partners = resp.data.Partner.map((partner: string) => ({ value: partner, label: partner }));
          setPartnerOptions(partners);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false); // Set loading to false after the request is done
        }
      }
    };

    fetchData();
  }, [environment, selectedPartner]); // Add dependencies if necessary

  const headers = ["module_name", "api_name", "api_url", "api_params", "api_state", "last_modified_by", "last_modified_date_time"];
  const headersmap = {
      "module_name":"Module name",
     "api_name":"API name",
    "api_url": "API url",
     "api_params":"API params",
     "api_state": "API_state", 
     "last_modified_by":"Last modified by", 
     "last_modified_date_time":"Last modified date & time"
  }
  

  // Show loader until data is fully loaded
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

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
            <div className='w-[250px] '>
              <label className="block text-gray-700">Partner<span className="text-red-500">*</span></label>
              <Select
                value={selectedPartner}
                onChange={(selectedOption) => setSelectedPartner(selectedOption)}
                options={Partneroptions}
                styles={editableDrp}
              />
            </div>
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
              popupHeading='API'
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
