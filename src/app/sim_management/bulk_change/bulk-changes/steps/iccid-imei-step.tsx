import { FormInstance } from "antd";
import React from "react";
import { IccidImeiInput } from "./iccid-imei-input";
import { INPUT_TYPE } from "../../bulk-changes-store/bulk-change-constant";
import { ICCIDIMEI } from "../../bulk-changes-store/bulk-change-types";
import { useForm } from "antd/es/form/Form";
import { useIccidImeiStepStore } from "../../bulk-changes-store/iccid-imei-step.store"
type Props = {
  form?: FormInstance<any>;
};

export const IccidImeiStep: React.FC<Props> = ({ form }) => {
  const { iccidImeiList, setIccidImeiList } = useIccidImeiStepStore();
  const [formInstance] = useForm(form);

  return (
    <>
      <IccidImeiInput<ICCIDIMEI>
        form={formInstance}
        firstInputField={INPUT_TYPE.ICCID}
        lastInputField={INPUT_TYPE.IMEI}
        simInfoList={iccidImeiList}
        setSimInfoList={setIccidImeiList}
      />
    </>
  );
};
