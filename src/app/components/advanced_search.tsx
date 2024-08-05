import { Badge, Button, Input } from "antd";
import { CaretDownOutlined, CaretUpOutlined, SearchOutlined } from '@ant-design/icons';
import React, { useMemo, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface FilterShape {
  [key: string]: string[];
}

const splitAndFilter = (input?: string): string[] => {
  return input?.split("\n").filter(Boolean) || [];
};

interface AdvancedFilterProps {
  onFilter: (filters: FilterShape) => void;
  onReset: (filters: FilterShape) => void;
  headers?: string[];
  headerMap?: any;
}

const AdvancedMultiFilter: React.FC<AdvancedFilterProps> = ({ onFilter, onReset, headers, headerMap }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterShape>({});
  const [formValues, setFormValues] = useState<{ [key: string]: string }>({});

  const handleShowAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  const handleFilter = () => {
    const advancedFilters = Object.entries(formValues).reduce<FilterShape>(
      (acc, [key, value]) => {
        acc[key] = splitAndFilter(value);
        return acc;
      },
      {}
    );
    setActiveFilters(advancedFilters);

    onFilter(advancedFilters);
    handleShowAdvanced();
  };

  const handleClear = () => {
    const emptyFilters = Object.keys(activeFilters).reduce<FilterShape>(
      (acc, key) => {
        acc[key] = [];
        return acc;
      },
      {} as FilterShape
    );

    onReset(emptyFilters);
    setFormValues({});
    setActiveFilters({});
    setShowAdvanced(false);
  };

  const handleInputChange = (key: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const countActiveFilters = useMemo(() => {
    return Object.values(activeFilters).filter(value => value.length > 0).length;
  }, [activeFilters]);

  return (
    <div className="mb-4">
      <div className="flex flex-col md:flex-row md:justify-end space-y-4 md:space-y-0 md:space-x-4">
        <Button
          size="large"
          className="w-full md:w-auto save-btn"
          onClick={handleShowAdvanced}
          icon={showAdvanced ? <CaretUpOutlined /> : <CaretDownOutlined />}
          style={{ fontWeight: '450' }}
        >
          {showAdvanced ? "Hide Advanced" : "Show Advanced"}
        </Button>
        <Badge
          count={countActiveFilters}
          showZero
          className="w-full md:w-auto"
          color={countActiveFilters > 0 ? "green" : "blue"}
        >

          <Button
            type="default"
            size="large"
            className="outline-none border-none"
            onClick={handleFilter}
            disabled={!showAdvanced}
          >
            <SearchOutlined className="text-gray-500 ml-2" />

          </Button>
        </Badge>
        <Button
          type="default"
          size="large"
          className="outline-none border-none"
          onClick={handleClear}
        >
          <XMarkIcon className="h-5 w-5 text-black-500 mr-2" />

        </Button>
        {/* <Badge
          count={countActiveFilters}
          showZero
          className="w-full md:w-auto"
          color={countActiveFilters > 0 ? "green" : "blue"}
        >

          <Button
            type="default"
            size="large"
            className="w-full md:w-auto"
            onClick={handleFilter}
            disabled={!showAdvanced}
          >
            Filter
          </Button>
        </Badge>
        <Button
          type="default"
          size="large"
          className="w-full md:w-auto"
          onClick={handleClear}
        >
          Clear
        </Button> */}
      </div>
      {showAdvanced && headers && (
        <div className="overflow-x-auto border border-gray-500 rounded-md mt-4 block">
          <div className="flex space-x-4 p-2">
            {headers.map((header, index) => (
              header !== "modified_by" && header !== "modified_date"
              && (
                <div className="flex-none w-64">
                  {/* <label htmlFor={header} className="block mb-2 font-medium">{headerMap?headerMap[header][0]:""}</label> */}
                  <Input
                    id={header}
                    value={formValues[header] || ''}
                    onChange={e => handleInputChange(header, e.target.value)}
                    placeholder={headerMap ? headerMap[header][0] : ""}
                    key={index}
                    className="resize-none text-left max-w-[250px] whitespace-nowrap overflow-hidden text-ellipsis input"
                  />
                </div>
              )

            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedMultiFilter;
