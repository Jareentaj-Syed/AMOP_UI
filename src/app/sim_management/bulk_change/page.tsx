"use client"
import React, { useEffect, useState } from 'react';
import { Input, Button, Modal, Steps } from 'antd';
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import * as XLSX from 'xlsx';
import TableComponent from '@/app/components/TableComponent/page';
import SearchInput from '@/app/components/Search-Input';
// import AdvancedFilter from './Table-feautures/advanced-filter';
import ColumnFilter from '@/app/components/columnfilter';
import AdvancedFilter from '../inventory/Table-feautures/advanced-filter';

const { Step } = Steps;

interface ExcelDataRow {
    [key: string]: any;
}

const BulkChange: React.FC = () => {
    const [data, setData] = useState<ExcelDataRow[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/Inventory-sim-management.xlsx');
                const arrayBuffer = await response.arrayBuffer();
                const data = new Uint8Array(arrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
                    header: 1, // Use first row as header
                    blankrows: false // Include cells with blank values
                });

                if (jsonData.length === 0) {
                    throw new Error('No data found in the Excel sheet.');
                }

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
                ];

                setData(filledData);
                setVisibleColumns(columnNames);
            } catch (error) {
                console.error('Error fetching data from Excel:', error);
            }
        };

        fetchData();
    }, []);

    const headers = visibleColumns;
    const EXPORT = "Export";
    const searchPlaceholder = "Search";
    const [filteredData, setFilteredData] = useState([]);
    const handleFilter = (advancedFilters: any) => {
        console.log(advancedFilters);
        setFilteredData(advancedFilters);
    };

    const steps = [
        {
            title: 'Step 1',
            content: 'Step 1 Content',
        },
        {
            title: 'Step 2',
            content: 'Step 2 Content',
        },
        {
            title: 'Step 3',
            content: 'Step 3 Content',
        },
    ];

    const handleNext = () => {
        setCurrentStep((prev) => prev + 1);
    };

    const handlePrev = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const handleModalOk = () => {
        setModalVisible(false);
    };

    const handleModalCancel = () => {
        setModalVisible(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mt-5 ml-6 mr-6">
                <Button type="primary" onClick={() => setModalVisible(true)}>
                    New Change
                </Button>
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
                popupHeading={''}
            />

            <Modal
                title="New Change"
                visible={modalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                footer={[
                    currentStep > 0 && (
                        <Button key="back" onClick={handlePrev}>
                            Previous
                        </Button>
                    ),
                    currentStep < steps.length - 1 && (
                        <Button key="next" type="primary" onClick={handleNext}>
                            Next
                        </Button>
                    ),
                    currentStep === steps.length - 1 && (
                        <Button key="submit" type="primary" onClick={handleModalOk}>
                            Done
                        </Button>
                    ),
                ]}
            >
                <Steps current={currentStep}>
                    {steps.map((step, index) => (
                        <Step key={index} title={step.title} />
                    ))}
                </Steps>
                <div className="steps-content">{steps[currentStep].content}</div>
            </Modal>
        </div>
    );
};

export default BulkChange;
