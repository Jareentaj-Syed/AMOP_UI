import { Badge, Button, Form } from "antd";
import { FilterValue } from "antd/es/table/interface";
import React, { useMemo, useState } from "react";
import { AdvancedFilterGroup } from "./advanced-filtergroup";
import TextAreaFilterItem from "./text-area-filter-item";

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

const AdvancedFilter: React.FC = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterShape>({});
  const [form] = Form.useForm();

  const handleShowAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  const handleFilter = () => {
    const values = form.getFieldsValue();
    const advancedFilters = Object.entries(values).reduce<FilterShape>(
      (acc, [key, value]) => {
        acc[key as keyof FilterShape] =
          typeof value === "string" ? splitAndFilter(value) : [];
        return acc;
      },
      {},
    );
    setActiveFilters(advancedFilters);
    // onFilter({ ...filters, ...advancedFilters });
    handleShowAdvanced();
  };

  const handleClear = () => {
    form.resetFields();
    setActiveFilters({});
    // onReset?.();
    setShowAdvanced(false);
    // setTableKey?.(Math.random().toString());
  };

  const countActiveFilters = useMemo(() => {
    return Object.entries(activeFilters).filter(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return Boolean(value);
    }).length;
  }, [activeFilters]);

  return (
    <div className="mb-2">
      <div className="flex flex-col md:flex-row md:justify-end space-y-4 md:space-y-0 md:space-x-4" style={{ margin: '20px' }}>
        <Button
          type="primary"
          size="large"
          className="w-full md:w-auto"
          onClick={handleShowAdvanced}
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

      {showAdvanced && (
        <Form form={form} layout="vertical" style={{ margin: '21px' }}>
          <AdvancedFilterGroup
            title="Account Information"
            filters={
              <>
                <TextAreaFilterItem
                  key="featureCode"
                  name="featureCode"
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
                  key="iccid"
                  name="iccid"
                  label="ICCID"
                  placeholder="One ICCID per line"
                />
                <TextAreaFilterItem
                  key="msisdn"
                  name="msisdn"
                  label="MSISDN"
                  placeholder="One MSISDN per line"
                />
                <TextAreaFilterItem
                  key="ip"
                  name="ip"
                  label="IP Address"
                  placeholder="One IP Address per line"
                />
                <TextAreaFilterItem
                  key="imei"
                  name="imei"
                  label="IMEI"
                  placeholder="One IMEI per line"
                />
                <TextAreaFilterItem
                  key="eid"
                  name="eid"
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
                  key="carrierRatePlan"
                  name="carrierRatePlan"
                  label="Carrier Rate Plan"
                  placeholder="One Carrier Rate Plan per line"
                />
                <TextAreaFilterItem
                  key="customerRatePlan"
                  name="customerRatePlan"
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
                  key="username"
                  name="username"
                  label="Username"
                  placeholder="One Username per line"
                />
              </>
            }
          />
        </Form>
      )}
    </div>
  );
};

export default AdvancedFilter;
