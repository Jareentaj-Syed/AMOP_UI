import { Badge, Button, Form } from "antd";
import { FilterValue } from "antd/es/table/interface";
import React, { useMemo, useState } from "react";
import { AdvancedFilterGroup } from "./advanced-filtergroup";
import TextAreaFilterItem from "./text-area-filter-item";
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
interface FilterShape {
  featureCode?: string[];
  iccid?: string[];
  msisdn?: string[];
  ip?: string[];
  imei?: string[];
  eid?: string[];
  carrierRatePlan?: string[];
  username?: string[];
  [key: string]: any;
}

const splitAndFilter = (input?: string): string[] => {
  return input?.split("\n").filter(Boolean) || [];
};

interface AdvancedFilterProps {
  onFilter: (filters: FilterShape) => void; // Corrected function signature
}

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({ onFilter }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterShape>({});
  const [form] = Form.useForm();

  const handleShowAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  const handleFilter = () => {
    const values = form.getFieldsValue();
    console.log("values are:" , values)
    const advancedFilters = Object.entries(values).reduce<FilterShape>(
      (acc, [key, value]) => {
        acc[key as keyof FilterShape] =
          typeof value === "string" ? splitAndFilter(value) : [];
        return acc;
      },
      {},
    );
    console.log(advancedFilters)
    setActiveFilters(advancedFilters);

    onFilter(advancedFilters);
    handleShowAdvanced();
  };

  const handleClear = () => {
   
    const emptyFilters = Object.keys(activeFilters).reduce<FilterShape>(
      (acc, key) => {
        acc[key as keyof FilterShape] = [];
        return acc;
      },
      {} as FilterShape
    );
  
    console.log("empty flters:", emptyFilters);
    // onReset(emptyFilters)
    form.resetFields();
    setActiveFilters({});
    setShowAdvanced(false);
  };

  const countActiveFilters = useMemo(() => {
    return Object.entries(activeFilters).filter(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return Boolean(value);
    }).length;
  }, [activeFilters]);
  // flex justify-end items-center
  return (
    <div className="mb-2">
      <div className="flex flex-col md:flex-row md:justify-end space-y-4 md:space-y-0 md:space-x-4" style={{ margin: '20px' }}>
        <Button
          size="large"
          className="w-full md:w-auto save-btn "
          onClick={handleShowAdvanced}
          icon={showAdvanced ? < CaretUpOutlined /> : <CaretDownOutlined />

          }
          style={{ fontWeight: '450' }}
        >
          {showAdvanced ? "Hide Advanced" : "Show Advanced"}

        </Button>
        <Badge
          count={countActiveFilters}
          showZero
          className="w-full md:w-auto select-none"
          color={countActiveFilters > 0 ? "green" : "blue"}
        >
          <Button
            type="default"
            size="large"
            className="w-full md:w-auto"
            onClick={handleFilter}
            disabled={!showAdvanced}
          // loading={isFetching}
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
        </Button>
      </div>
      <div className="flex justify-start items-center ml-0">
      {showAdvanced && (
        <Form form={form} layout="vertical" style={{ margin: '21px' }}>
          <AdvancedFilterGroup
            title="Account Information"
            filters={
              <>
                <TextAreaFilterItem
                  key="Feature Code"
                  name="Feature Code"
                  label="Feature Code"
                  placeholder="One Feature Code per line"
                />
              </>
            }
          />
          <AdvancedFilterGroup
            title="Device Identifying Information"
            filters={
              <>
                <TextAreaFilterItem
                  key="ICCID"
                  name="ICCID"
                  label="ICCID"
                  placeholder="One ICCID per line"
                />
                <TextAreaFilterItem
                  key="MSISDN"
                  name="MSISDN"
                  label="MSISDN"
                  placeholder="One MSISDN per line"
                />
                <TextAreaFilterItem
                  key="IP"
                  name="IP"
                  label="IP Address"
                  placeholder="One IP Address per line"
                />
                <TextAreaFilterItem
                  key="IMEI"
                  name="IMEI"
                  label="IMEI"
                  placeholder="One IMEI per line"
                />
                <TextAreaFilterItem
                  key="EID"
                  name="EID"
                  label="EID"
                  placeholder="One EID per line"
                />
              </>
            }
          />
          <AdvancedFilterGroup
            title="Device Status"
            filters={
              <>
                <TextAreaFilterItem
                  key="CarrierRatePlan"
                  name="CarrierRatePlan"
                  label="Carrier Rate Plan"
                  placeholder="One Carrier Rate Plan per line"
                />
                <TextAreaFilterItem
                  key="CustomerRatePlan"
                  name="CustomerRatePlan"
                  label="Customer Rate Plan"
                  placeholder="One Customer Rate Plan per line"
                />
              </>
            }
          />
          <AdvancedFilterGroup
            title="Custom Fields"
            filters={
              <>
                <TextAreaFilterItem
                  key="Username"
                  name="Username"
                  label="Username"
                  placeholder="One Username per line"
                />
              </>
            }
          />
        </Form>
      )}
      </div>
    </div>
  );
};

export default AdvancedFilter;
