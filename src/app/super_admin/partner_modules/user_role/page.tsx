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

interface UserRoleProps {
    rolesData: any; // Replace `any` with the actual type if known
    moduleData: any;
    rolesHeaders:any;
    moduleHeaders:any
    rolesHeadersMap:any;
    moduleHeadersMap:any // Replace `any` with the actual type if known
}

const UserRole: React.FC<UserRoleProps> = ({ rolesData, moduleData, rolesHeaders, moduleHeaders,rolesHeadersMap, moduleHeadersMap }) => {

    console.log("rolesData", rolesData)
    console.log("modulesData", moduleData)
    console.log(rolesHeaders)
    console.log(moduleHeaders)

    const [data, setData] = useState<ExcelDataRow[]>([]);
    const [data2, setData2] = useState<ExcelDataRow[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
    const [visibleColumns2, setVisibleColumns2] = useState<string[]>([]);
    const [pagination1,setpagination1]=useState<any>({});
    const [pagination2,setpagination2]=useState<any>({});
    
    const headers1 = rolesHeaders
    const headers2 = moduleHeaders
    
    // const headermap1={
    //     "rolename": "Role",
    //     "isactive":"Role_status",
    //     "createdby":"Assigned by" ,
    //     "modifiedby":"Last modified by",
    //      "modifieddate":"Last modified date & time"
    // }

    // const headermap2={
    //    "module_name": " Module name",
    //    "is_active":"Module_state",
    //    "modified_by":"Last modified by",
    //    "modified_date":"Last modified date & time"
    // }



    useEffect(() => {
        setData(rolesData);
        setData2(moduleData);
    }, [rolesData, moduleData]);

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
                        visibleColumns={headers1}
                        itemsPerPage={100}
                        popupHeading='User'
                        createModalData={[]}
                        pagination={pagination1}
                       
                        headerMap={rolesHeadersMap}
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
                        visibleColumns={headers2}
                        itemsPerPage={100}
                        popupHeading='UserModule'
                        createModalData={[]}
                        pagination={pagination2}
                        headerMap={moduleHeadersMap}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserRole;
