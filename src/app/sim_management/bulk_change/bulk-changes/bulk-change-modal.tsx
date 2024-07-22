"use client";

import "./bulk-change-modal.css";

import { FC, PropsWithChildren, useEffect, useState } from "react";
import {
  Divider,
  Modal,
  Steps,
  StepsProps,
  Typography,
  notification,
} from "antd";
import { ChooseServiceProvider } from "./steps/choose-service-provider";
import { useBulkChangeModalStore } from "../bulk-changes-store/bulk-change-modal.store";
import { useBulkChangeChooseServiceProvider } from "../bulk-changes-store/choose-service-provider.store";

import { BulkChangeSteps } from "../bulk-changes-store/bulk-change-steps-constants";
import { useIccidStepStore } from "../bulk-changes-store/iccid-step.store";
import { useIccidImeiStepStore } from "../bulk-changes-store/iccid-imei-step.store";
import { useArchivalConfirmationStore } from "../bulk-changes-store/archival-confirmation.store";
import { BulkChangeCreateResponse } from "../bulk-changes-store/bulk-change-types";
import { BULK_CHANGE_TEXT } from "../bulk-changes-store/bulk-change-constant";
import { createBulkChange, MODAL_WIDTH } from "./steps/utils";
import LoadingPannelWrapper from "./steps/loading-panel-wrapper";
import { useBulkChangeData } from "./bulk-change.hooks";

export const BulkChangeModal: FC = () => {
  const { visible, setVisible, reset, setSteps } = useBulkChangeModalStore();
  const { selectedAction, reset: resetServiceProviderForm } =
    useBulkChangeChooseServiceProvider();
  const { reset: resetIccidStep } = useIccidStepStore();
  const { reset: resetIccidImeiStep } = useIccidImeiStepStore();
  const { reset: resetArchivalConfirmation } = useArchivalConfirmationStore();
  const [stepContents, setStepContents] = useState<FC[]>([]);
  const [disabledSubmit, setDisabledSubmit] = useState(true);
  const stepIndex = useBulkChangeModalStore((s) => s.stepIndex);
  const [api, contextHolder] = notification.useNotification({
    maxCount: 1,
    placement: "bottomRight",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const getBulkChangeData = useBulkChangeData();

  const handleClosed = () => {
    reset();
    resetServiceProviderForm();
    resetIccidStep();
    resetIccidImeiStep();
    resetArchivalConfirmation();
  };

  const handleSubmit = () => {
    const request = getBulkChangeData();
    setIsProcessing(true);
    if (request) {
      createBulkChange(request)
        .then((response: BulkChangeCreateResponse) => {
          if (response.bulkChangeId) {
            api.success({
              message: "Success",
              description: BULK_CHANGE_TEXT.BULK_CHANGE_CREATED_SUCCESSFULLY,
            });
            // Close bulk change modal when success
            handleClosed();
            setVisible(false);
          } else {
            api.error({
              message: "Error",
              description: response.errorMessage,
            });
          }
        })
        .catch((error: any) => {
          api.error({
            message: "Error",
            description: error?.message,
          });
        })
        .finally(() => {
          setIsProcessing(false);
        });
    } else {
      setIsProcessing(false);
      api.error({
        message: "Error",
        description: BULK_CHANGE_TEXT.UNSUPPORTED_ACTION_OR_SERVICE_PROVIDER,
      });
    }
  }; //after submttng

  useEffect(() => {
    if (!selectedAction) {
      setSteps([]);
      setStepContents([]);
      return;
    }
    const steps = BulkChangeSteps.get(selectedAction) || [];
    setSteps(
      steps.map((s) => ({
        title: s.title,
        status: undefined,
      })),
    );
    setStepContents(steps.map((s) => s.StepContent));
  }, [selectedAction, setSteps]);  //useEffect hook is designed to update the steps and step contents based on the selectedAction variable

  useEffect(() => {
    if (stepIndex !== 0 && stepIndex >= stepContents?.length) {
      setDisabledSubmit(false);
    } else {
      setDisabledSubmit(true);
    }
  }, [stepIndex, stepContents]); // to enable and dsable submt

  const title = selectedAction
    ? `Bulk Change - ${selectedAction}`
    : "Bulk Change";

  return (
    <>
      {contextHolder}
      <Modal
        open={visible}
        onCancel={() => setVisible(false)}
        afterClose={handleClosed}
        maskClosable={false}
        destroyOnClose
        title={<BulkChangeModalTitle title={title} />}
        centered
        width={MODAL_WIDTH.LARGE}
        okText={"Submit"}
        onOk={() => handleSubmit()}
        okButtonProps={{ disabled: disabledSubmit }}
      >
        <LoadingPannelWrapper loadingText="" isLoading={isProcessing}>
          <StepDisplay />
          <div className="bulk-changes-modal-steps-content">
            <StepContent index={0}>
              <ChooseServiceProvider />
            </StepContent>
            {stepContents.map((Content, index) => (
              <StepContent key={index} index={index + 1}>
                <Content />
              </StepContent>
            ))}
          </div>
        </LoadingPannelWrapper>
      </Modal>
    </>
  );
};

function StepContent({
  children,
  index,
}: PropsWithChildren<{ index: number }>) {
  const stepIndex = useBulkChangeModalStore((s) => s.stepIndex);

  if (stepIndex !== index) return null;

  return <>{children}</>;
}

function StepDisplay() {
  const { stepIndex, steps, setStepIndex } = useBulkChangeModalStore();

  const stepItems: StepsProps["items"] = steps.map((step, index) => ({
    title: step.title,
    status: step.status,
    onClick: () => {
      if (!step.status) return;
      setStepIndex(() => index);
    },
    disabled: !step.status,
  }));
  console.log("steps:",stepItems)
  return (
    <Steps
      progressDot
      className={"bulk-changes-modal-steps"}
      current={stepIndex}
      items={stepItems}
    />
  );
}

function BulkChangeModalTitle({ title }: { title: string }) {
  return (
    <>
      <Typography.Title level={4}>{title}</Typography.Title>
      <Divider className="mt-0" />
    </>
  );
}
