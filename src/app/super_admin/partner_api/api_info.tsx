import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import TableComponent from '../../components/TableComponent/page';
import SearchInput from '../../components/Search-Input';
import axios from 'axios';
import { useAuth } from '@/app/components/auth_context';
import { DropdownStyles } from '@/app/components/css/dropdown';
import { Modal, Spin } from 'antd'; // Import Ant Design Spin component
import { createModalData } from './api_constants';
import TableSearch from '@/app/components/entire_table_search';
import AdvancedMultiFilter from '@/app/components/advanced_search';
import { getCurrentDateTime } from '@/app/components/header_constants';

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
  // const editColumns = createModalData; // Initialize as empty array or with appropriate columns if needed
  const [environment, setEnvironment] = useState<{ value: string; label: string } | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<{ value: string; label: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setpagination] = useState<any>({});
  const [headers, setHeaders] = useState<any[]>([]);
  const [headerMap, setHeaderMap] = useState<any>({});
  const [createModalData, setcreateModalData] = useState<any[]>([]);
  const [generalFields, setgeneralFields] = useState<any[]>([])
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState([]);
  const handleFilter = (advancedFilters: any) => {
    console.log(advancedFilters)
    setFilteredData(advancedFilters);
  };
  const handleReset = (EmptyFilters: any) => {
    console.log(EmptyFilters)
    setFilteredData(EmptyFilters);
  };

  useEffect(() => {


    fetchData();
  }, [username, partner, role]); // Add dependencies if necessary

  const fetchData = async () => {
    setLoading(true); // Set loading to true before the request
    try {
      const url = `https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management`;
      const data = {
        tenant_name: partner || "default_value",
        username: username,
        path: "/get_superadmin_info",
        role_name: role,
        sub_module: "Partner API",
        sub_tab: "Amop APIs",
        request_received_at: getCurrentDateTime(),
        Partner: partner,
      };

      const response = await axios.post(url, { data: data });
      const resp = JSON.parse(response.data.body);
      console.log(resp)
      // Check if the flag is false
      if (resp.flag === false) {
        Modal.error({
          title: 'Data Fetch Error',
          content: resp.message || 'An error occurred while fetching Super Admin info. Please try again.',
          centered: true,
        });
        return; // Exit early if there's an error
      }

      const carrierApis = resp.data.amop_apis_data.amop_apis;
      console.log(carrierApis)
      setTableData(carrierApis);


      const environments = resp.data.Environment.map((env: string) => ({ value: env, label: env }));
      setEnvironmentOptions(environments);

      const partners = resp.data.Partner.map((partner: string) => ({ value: partner, label: partner }));
      setPartnerOptions(partners);

      const headerMap = resp.headers_map["amop apis"]["header_map"]
      const createModalData = resp.headers_map["amop apis"]["pop_up"]
      const sortedheaderMap = sortHeaderMap(headerMap)
      const headers = Object.keys(sortedheaderMap)
      // const generalFields=parsedData.data
      // setgeneralFields(generalFields)
      setHeaders(headers)
      setHeaderMap(sortedheaderMap)
      setcreateModalData(createModalData)
      // setTable(tableData);
      setVisibleColumns(headers)

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
    const fetchData = async () => {
      if (environment && selectedPartner) {
        try {
          setLoading(true); // Set loading to true before the request
          const url = `https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management`;
          const data = {
            tenant_name: partner || "default_value",
            username: username,
            path: "/get_superadmin_info",
            role_name: role,
            "sub_module": "Partner API",
            "sub_tab": "Amop APIs",
            request_received_at: getCurrentDateTime(),
            Partner: partner,
            "Environment": environment.value,
            Selected_Partner: selectedPartner.value
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
          const headerMap = resp.headers_map["amop api"]["header_map"]
          const createModalData = resp.headers_map["amop api"]["pop_up"]
          const sortedheaderMap = sortHeaderMap(headerMap)
          const headers = Object.keys(sortedheaderMap)
          // const generalFields=parsedData.data
          // setgeneralFields(generalFields)
          setHeaders(headers)
          setHeaderMap(sortedheaderMap)
          setcreateModalData(createModalData)
          // setTable(tableData);
          setVisibleColumns(headers)
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false); // Set loading to false after the request is done
        }
      }
    };

    fetchData();
  }, [environment, selectedPartner]); // Add dependencies if necessary




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
        <div className="p-4 items-center justify-between mb-2">
          <div className="flex space-x-4 mb-4">
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
                tableName={"amop_apis"}
                headerMap={headerMap}
              />
            </div>
          </div>


          <div className=' mb-4 space-x-2'>
            <AdvancedMultiFilter
              onFilter={handleFilter}
              onReset={handleReset}
              headers={headers}
              headerMap={headerMap}
              tableName={"amop_apis"} />
          </div>

          <TableComponent
            headers={headers}
            headerMap={headerMap}
            initialData={tableData}
            searchQuery={searchTerm}
            visibleColumns={headers}
            itemsPerPage={100}
            allowedActions={["edit"]}
            popupHeading='API'
            createModalData={createModalData}
            pagination={pagination}
            advancedFilters={[]}
          />

        </div>
      </div>
    </div >
  );
};

export default CarrierInfo;
