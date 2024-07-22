import { FC } from "react";
import { ChangeRequestTypeEnum } from "./change-request-types-constants";
import { ExampleStep } from "../bulk-changes/steps/example-step";
import { IccidStep } from "../bulk-changes/steps/iccid-step";
import { BulkChangeSummary } from "../bulk-changes/steps/bulk-change-summary";
import { Typography } from "antd";
import { ArchivalConfirmation } from "../bulk-changes/steps/archival-confirmation";

export type BulkChangeStep = {
  title: string;
  // React component, which will be rendered in the step as <StepContent />
  StepContent: FC;
};

export const InputDeviceStep: BulkChangeStep = {
  title: "Input SIMs",
  StepContent: IccidStep,
};
export const SelectStatusStep: BulkChangeStep = {
  title: "Select Status",
  StepContent: ExampleStep,
};
export const CreateServiceProductStep: BulkChangeStep = {
  title: "Create Service Product",
  StepContent: ExampleStep,
};
export const EditUsernameStep: BulkChangeStep = {
  title: "Edit Username",
  StepContent: ExampleStep,
};
export const AssignCustomerStep: BulkChangeStep = {
  title: "Assign Customer",
  StepContent: ExampleStep,
};
export const ChooseCustomerRatePlanStep: BulkChangeStep = {
  title: "Choose Customer Rate Plan",
  StepContent: ExampleStep,
};
export const ChooseCarrierRatePlanStep: BulkChangeStep = {
  title: "Choose Carrier Rate Plan",
  StepContent: ExampleStep,
};
export const ChangeICCIDIMEIStep: BulkChangeStep = {
  title: "Change ICCID/IMEI",
  StepContent: ExampleStep,
};
export const ConfirmationStep: BulkChangeStep = {
  title: "Confirmation",
  StepContent: () => <BulkChangeSummary />,
};
export const ArchivalConfirmationStep: BulkChangeStep = {
  title: "Confirmation",
  StepContent: () => (
    <BulkChangeSummary
      extraContent={
        <div>
          <Typography.Title level={4}>Confirmation</Typography.Title>
          <ArchivalConfirmation />
        </div>
      }
    />
  ),
};

export const ActivateNewServiceStep: BulkChangeStep = {
  title: "Activate New Service",
  StepContent: ExampleStep,
};
/**
 * Step for Activate New Service APN Input
 *
 * When user select Static IP = true
 */
export const ActivateNewServiceAPNInputStep: BulkChangeStep = {
  title: "APN Input",
  StepContent: ExampleStep,
};

export const BulkChangeSteps = new Map<
  ChangeRequestTypeEnum | (string & {}),
  BulkChangeStep[]
>([
  [
    ChangeRequestTypeEnum.StatusUpdate,
    [
      SelectStatusStep,
      InputDeviceStep,
      CreateServiceProductStep,
      ConfirmationStep,
    ],
  ],
  [
    ChangeRequestTypeEnum.CarrierRatePlanChange,
    [ChooseCarrierRatePlanStep, InputDeviceStep, ConfirmationStep],
  ],
  [
    ChangeRequestTypeEnum.CustomerRatePlanChange,
    [ChooseCustomerRatePlanStep, InputDeviceStep, ConfirmationStep],
  ],
  [
    ChangeRequestTypeEnum.CustomerAssignment,
    [AssignCustomerStep, InputDeviceStep, ConfirmationStep],
  ],
  [ChangeRequestTypeEnum.Archival, [InputDeviceStep, ArchivalConfirmationStep]],
  [
    ChangeRequestTypeEnum.ActivateNewService,
    [
      ActivateNewServiceStep,
      // ActivateNewServiceAPNInputStep, when Static IP = true, use `addStepAtIndex` from useBulkChangeModalStore() to add this step
      InputDeviceStep,
      ConfirmationStep,
    ],
  ],
  [ChangeRequestTypeEnum.CreateRevService, [InputDeviceStep, ConfirmationStep]],
  [
    ChangeRequestTypeEnum.ChangeICCIDIMEI,
    [ChangeICCIDIMEIStep, InputDeviceStep, ConfirmationStep],
  ],
  [
    ChangeRequestTypeEnum.EditUsername,
    [EditUsernameStep, InputDeviceStep, ConfirmationStep],
  ],
]);


