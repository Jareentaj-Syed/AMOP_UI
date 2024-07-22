"use client";

import { FC, useEffect } from "react";
import { Form, Select, Spin } from "antd";
import { useBulkChangeChooseServiceProvider } from "../../bulk-changes-store/choose-service-provider.store";
import { ContinueButton } from "../continue-button";
import { useBulkChangeModalStore } from "../../bulk-changes-store/bulk-change-modal.store";
import { useIccidStepStore } from "../../bulk-changes-store/iccid-step.store";

type OptionType<TVal = number> = {
  value: TVal;
  label: string;
};

export const ChooseServiceProvider: FC = () => {
  const { setCurrentStepStatus } = useBulkChangeModalStore();
  const { setIntegrationId } = useIccidStepStore();
  const {
    selectedServiceProvider,
    setSelectedServiceProvider,
    selectedAction,
    setSelectedAction,
  } = useBulkChangeChooseServiceProvider();
  type ServiceProviderType = {
    id: number;
    Name: string;
    DisplayName: string;
    IntegrationId: number;
    PortalTypeId: number;
  };
 
  
  const serviceProviders: ServiceProviderType[] = [
    {
      id: 1,
      DisplayName: "AT&T - Cisco Jasper",
      Name: "AT&T - Cisco Jasper",
      PortalTypeId: 0,
      IntegrationId: 1,
    },
    {
      id: 4,
      DisplayName: "Verizon - ThingSpace IoT",
      Name: "Verizon - ThingSpace IoT",
      PortalTypeId: 0,
      IntegrationId: 4,
    },
    {
      id: 20,
      DisplayName: "AT&T - Telegence UAT",
      Name: "AT&T - Telegence UAT",
      PortalTypeId: 2,
      IntegrationId: 6,
    },
    {
      id: 37,
      DisplayName: "T-Mobile Jasper",
      Name: "T-Mobile Jasper",
      PortalTypeId: 0,
      IntegrationId: 11,
    },
    {
      id: 36,
      DisplayName: "AT&T - POD19",
      Name: "AT&T - POD19",
      PortalTypeId: 0,
      IntegrationId: 9,
    },
    {
      id: 38,
      DisplayName: "AT&T - Cisco Jasper 1",
      Name: "AT&T - Cisco Jasper 1",
      PortalTypeId: 0,
      IntegrationId: 1,
    },
    {
      id: 43,
      DisplayName: "Teal",
      Name: "Teal",
      PortalTypeId: 0,
      IntegrationId: 12,
    },
    {
      id: 44,
      DisplayName: "Verizon - ThingSpace PN",
      Name: "Verizon - ThingSpace PN",
      PortalTypeId: 0,
      IntegrationId: 4,
    },
    {
      id: 49,
      DisplayName: "POND IoT",
      Name: "POND IoT",
      PortalTypeId: 0,
      IntegrationId: 13,
    },
    {
      id: 45,
      DisplayName: "T-Mobile - Advantage",
      Name: "T-Mobile - Advantage",
      PortalTypeId: 0,
      IntegrationId: 11,
    }
  ];
  
  
  
  const changeRequestTypes = [
    {
      id: 1,
      Code: "StatusUpdate",
      DisplayName: "Update Device Status",
    },
    {
      id: 2,
      Code: "CarrierRatePlanChange",
      DisplayName: "Change Carrier Rate Plans",
    },
    {
      id: 3,
      Code: "CustomerRatePlanChange",
      DisplayName: "Change Customer Rate Plans",
    },
    {
      id: 4,
      Code: "CustomerAssignment",
      DisplayName: "Assign Customer",
    },
    {
      id: 5,
      Code: "Archival",
      DisplayName: "Archive",
    },
    {
      id: 6,
      Code: "ActivateNewService",
      DisplayName: "Activate New Service",
    },
    {
      id: 7,
      Code: "CreateRevService",
      DisplayName: "Create Rev Service",
    },
    {
      id: 8,
      Code: "ChangeICCID/IMEI",
      DisplayName: "Change ICCID/IMEI",
    },
    {
      id: 9,
      Code: "EditUsername",
      DisplayName: "Edit Username",
    }
  ];

 
  useEffect(() => {
    if (selectedServiceProvider?.IntegrationId) {
      setIntegrationId(selectedServiceProvider.IntegrationId);
    }
  }, [selectedServiceProvider?.IntegrationId]);

  const serviceProviderOptions: OptionType[] = serviceProviders.map((sp) => ({
    value: sp.id,
    label: sp.DisplayName,
  }));
  const actions: OptionType<string>[] = changeRequestTypes.map((cr) => ({
    value: cr.Code,
    label: cr.DisplayName,
  }));

  const handleSelectAction = (value: string) => {
    setSelectedAction(value);
  };

  const handleSelectServiceProvider = (value: number) => {
    setSelectedServiceProvider(
      serviceProviders.find((sp) => sp.id === value) ?? null,
    );
  };

  const handleValuesChange = (changedValues: any) => {
    if ("serviceProvider" in changedValues) {
      handleSelectServiceProvider(changedValues.serviceProvider);
    }
    if ("action" in changedValues) {
      handleSelectAction(changedValues.action);
    }
  };

  const handleFinish = () => {
    setCurrentStepStatus("finish");
  };
  const handleFinishFailed = () => {
    setCurrentStepStatus("error");
  };

  return (
    <Form
      className={"bulk-changes-modal-steps-content-form"}
      layout={"vertical"}
      initialValues={{
        serviceProvider: selectedServiceProvider?.id,
        action: selectedAction,
      }}
      onValuesChange={handleValuesChange}
      onFinish={handleFinish}
      onFinishFailed={handleFinishFailed}
    >
      <Form.Item
        label={"Service Provider"}
        name="serviceProvider"
        rules={[
          {
            required: true,
            message: "Please select a service provider",
          },
        ]}
      >
        <Select<number, OptionType>
          showSearch
          filterOption={(input, option) =>
            option?.label?.toLowerCase()?.includes(input) || false
          }
          placeholder={"Service Provider"}
          options={serviceProviderOptions}
         
         
        />
      </Form.Item>
      <Form.Item
        label={"Change Type"}
        name="action"
        rules={[
          {
            required: true,
            message: "Please select an action",
          },
        ]}
      >
        <Select<number, OptionType<string>>
          showSearch
          filterOption={(input, option) =>
            option?.label?.toLowerCase()?.includes(input) || false
          }
          placeholder={"Select an option"}
          options={actions}
         
        />
      </Form.Item>

      <Form.Item>
        <ContinueButton />
      </Form.Item>
    </Form>
  );
};
