/**
 * @fileoverview Example step component for bulk changes.
 */
import { FC, useEffect } from "react";
import { Form, Input } from "antd";
import { ContinueButton } from "../continue-button";
import { useBulkChangeModalStore } from "../../bulk-changes-store/bulk-change-modal.store";

export const ExampleStep: FC = () => {
  const { setCurrentStepStatus } = useBulkChangeModalStore();

  useEffect(() => {
    setCurrentStepStatus("process");
  }, [setCurrentStepStatus]);

  return (
    <Form
      className="bulk-changes-modal-steps-content-form"
      initialValues={{
        "example-field": "",
      }}
      onFinish={() => setCurrentStepStatus("finish")}
      onFinishFailed={() => setCurrentStepStatus("error")}
    >
      <Form.Item
        label="Example Field"
        name="example-field"
        rules={[{ required: true, message: "Please input example field." }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <ContinueButton />
      </Form.Item>
    </Form>
  );
};
