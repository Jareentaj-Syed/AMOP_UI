import { FC, Fragment, PropsWithChildren, ReactNode, useMemo } from "react";
import { Descriptions, Form, Typography } from "antd";
import { ContinueButton } from "../continue-button";
import { useBulkChangeModalStore } from "../../bulk-changes-store/bulk-change-modal.store";
import { useIccidStepStore } from "../../bulk-changes-store/iccid-step.store";
import { useBulkChangeChooseServiceProvider } from "../../bulk-changes-store/choose-service-provider.store";
import { useSimLabel } from "./use-sim-label";
import { BULK_CHANGE_SUMMARY_MESSAGE } from "../../bulk-changes-store/bulk-change-constant";

export interface BulkChangeSummaryProps {
  extraContent?: ReactNode;
}

export const BulkChangeSummary: FC<BulkChangeSummaryProps> = ({
  extraContent,
}) => {
  const simList = useIccidStepStore((s) => s.simList);
  const serviceProvider = useBulkChangeChooseServiceProvider(
    (s) => s.selectedServiceProvider,
  );
  const { assignCustomer, createServiceProduct, updateDeviceStatus } =
    useBulkChangeModalStore();

  const inputLabel = useSimLabel(serviceProvider?.IntegrationId ?? 0);

  const simListDescItems = useMemo(() => {
    return simList.map((sim, idx) => (
      <Descriptions.Item
        key={sim}
        label={formatMessage(BULK_CHANGE_SUMMARY_MESSAGE.SIM, idx + 1)}
      >
        {inputLabel}: {sim}
      </Descriptions.Item>
    ));
  }, [simList]);

  return (
    <Form>
      <div className="bulk-changes-summary-wrapper">
        <SummaryColumn>
          <Typography.Title level={4}>
            {BULK_CHANGE_SUMMARY_MESSAGE.SUMMARY}
          </Typography.Title>
          <div className="bulk-changes-descriptions-summary">
            <Descriptions
              title={BULK_CHANGE_SUMMARY_MESSAGE.SIMS_TO_UPDATE}
              className="bulk-changes-descriptions max-h-[300px] overflow-auto"
            >
              <Descriptions.Item label={BULK_CHANGE_SUMMARY_MESSAGE.TOTAL_SIMS}>
                {simList.length}
              </Descriptions.Item>
              <Descriptions.Item
                label={BULK_CHANGE_SUMMARY_MESSAGE.SERVICE_PROVIDER}
                span={2}
              >
                {serviceProvider?.DisplayName}
              </Descriptions.Item>
              {simListDescItems}
            </Descriptions>
            {!!updateDeviceStatus && (
              <Descriptions
                title={BULK_CHANGE_SUMMARY_MESSAGE.DEVICE_STATUS}
                className="bulk-changes-descriptions"
              >
                <Descriptions.Item
                  label={BULK_CHANGE_SUMMARY_MESSAGE.TARGET_STATUS}
                >
                  {updateDeviceStatus.targetStatus}
                </Descriptions.Item>
              </Descriptions>
            )}
            {!!assignCustomer && (
              <Descriptions
                title={BULK_CHANGE_SUMMARY_MESSAGE.ASSIGN_CUSTOMER}
                className="bulk-changes-descriptions"
              >
                <Descriptions.Item label={BULK_CHANGE_SUMMARY_MESSAGE.CUSTOMER}>
                  {formatMessage(
                    BULK_CHANGE_SUMMARY_MESSAGE.CUSTOMER_NAME_TPL,
                    assignCustomer.customerId,
                    assignCustomer.customerName,
                  )}
                </Descriptions.Item>
              </Descriptions>
            )}
            {!!createServiceProduct && (
              <Descriptions
                title={BULK_CHANGE_SUMMARY_MESSAGE.SERVICE_PRODUCT}
                className="bulk-changes-descriptions"
              >
                <Descriptions.Item label={BULK_CHANGE_SUMMARY_MESSAGE.PROVIDER}>
                  {createServiceProduct.provider?.name}
                </Descriptions.Item>
                <Descriptions.Item
                  label={BULK_CHANGE_SUMMARY_MESSAGE.SERVICE_TYPE}
                  span={2}
                >
                  {createServiceProduct.serviceType?.name}
                </Descriptions.Item>
                <Descriptions.Item label={BULK_CHANGE_SUMMARY_MESSAGE.PACKAGE}>
                  {createServiceProduct.package?.name}
                </Descriptions.Item>
                <Descriptions.Item
                  label={BULK_CHANGE_SUMMARY_MESSAGE.PRODUCTS}
                  span={2}
                >
                  {createServiceProduct.products?.map((product) => (
                    <Fragment key={product.id}>
                      {formatMessage(
                        BULK_CHANGE_SUMMARY_MESSAGE.PRODUCT_NAME_RATE_TPL,
                        product.name,
                        product.rate.toFixed(2),
                      )}
                      <br />
                    </Fragment>
                  ))}
                </Descriptions.Item>
              </Descriptions>
            )}
          </div>
        </SummaryColumn>
        {extraContent && <SummaryColumn>{extraContent}</SummaryColumn>}
      </div>
      <Form.Item>
        <ContinueButton />
      </Form.Item>
    </Form>
  );
};

function formatMessage(
  message: string,
  ...args: (string | number | undefined)[]
) {
  return args.reduce<string>((acc, arg, idx) => {
    return acc.replace(`{${idx}}`, arg + "");
  }, message);
}

function SummaryColumn({ children }: PropsWithChildren) {
  return <div className="flex-1">{children}</div>;
}
