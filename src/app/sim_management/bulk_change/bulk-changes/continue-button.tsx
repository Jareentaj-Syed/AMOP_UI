import { FC } from "react";
import { Button, Flex, Form } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useBulkChangeModalStore } from "../bulk-changes-store/bulk-change-modal.store";

export const ContinueButton: FC = () => {
  const form = Form.useFormInstance();
  const { nextStep, backStep, stepIndex, steps } = useBulkChangeModalStore();

  const onBackClick = () => {
    backStep();
  };
  const onNextClick = async () => {
    await form.validateFields();
    nextStep();
  };

  return (
    <Flex wrap justify="space-evenly">
      {stepIndex === 0 ? null : (
        <Button
          icon={<ArrowLeftOutlined />}
          iconPosition={"start"}
          type={"link"}
          onClick={onBackClick}
        >
          Back
        </Button>
      )}
      {stepIndex === steps.length - 1 ? null : (
        <Button
          icon={<ArrowRightOutlined />}
          iconPosition={"end"}
          type={"link"}
          onClick={onNextClick}
        >
          Continue
        </Button>
      )}
    </Flex>
  );
};
