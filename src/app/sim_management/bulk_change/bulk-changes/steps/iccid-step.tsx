"use client";

import React, { useEffect, useState } from "react";
import { Alert, Form, FormInstance } from "antd";
import { SimInput } from "./sim-list-input";
import { BULK_CHANGE_TEXT, VALIDATION_MESSAGE, INPUT_TYPE } from "../../bulk-changes-store/bulk-change-constant";
import { IntegrationEnum } from "./integration-enum";
import { ContinueButton } from "../continue-button";
import { useIccidStepStore } from "../../bulk-changes-store/iccid-step.store";

type Props = {
  form?: FormInstance<any>;
};

export const IccidStep: React.FC<Props> = ({ form }) => {
  const { simList, setSimList, integrationId } = useIccidStepStore();
  const [inputField, setInputField] = useState("");
  const [formInstance] = Form.useForm(form);

  useEffect(() => {
    switch (integrationId) {
      case IntegrationEnum.ATT_TELEGENCE:
      case IntegrationEnum.ATT_PARTNER_EXCHANGE:
      case IntegrationEnum.ATT_EBONDING:
        setInputField(INPUT_TYPE.SUBSCRIBER_NUMBER);
        break;
      case IntegrationEnum.ATT_CISCO_JASPER:
      case IntegrationEnum.VERIZON_THINGSPACE:
      case IntegrationEnum.ATT_POD19:
      case IntegrationEnum.T_MOBILE_JASPER:
      case IntegrationEnum.TEAL:
      case IntegrationEnum.POND_MOBILE:
        setInputField(INPUT_TYPE.ICCID);
        break;
      default:
        setInputField("");
        break;
    }
  }, [integrationId]);

  return (
    <div>
      {inputField && (
        <Form form={formInstance}>
          <SimInput
            inputField={inputField}
            form={formInstance}
            simList={simList}
            setSimList={setSimList}
          />
          <Form.Item>
            <ContinueButton />
          </Form.Item>
        </Form>
      )}
      {!inputField && (
        <Alert
          message={<p>{BULK_CHANGE_TEXT.UNSUPPORTED_SERVICE_PROVIDER}</p>}
          type="info"
          showIcon
          className="w-full py-1.5 mb-4"
        />
      )}
    </div>
  );
};
