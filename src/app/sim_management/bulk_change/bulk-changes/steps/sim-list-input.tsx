import { BULK_CHANGE_TEXT, VALIDATION_MESSAGE, INPUT_TYPE } from "../../bulk-changes-store/bulk-change-constant";

import {
  Alert,
  AutoComplete,
  Button,
  Col,
  Form,
  FormInstance,
  Input,
  Modal,
  Row,
  Space,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useCallback, useState } from "react";
import { FormatString } from "./utils";
import {
  debounce,
  searchByInputField,
  validateSimList,
} from "./utils";
import { GetSimInfoValidationRules } from "./validation-rules/validation-rules";
import { SearchSimResponse } from "../../bulk-changes-store/bulk-change-types";
type Props = {
  inputField: string;
  form?: FormInstance<any>;
  simList: string[];
  setSimList: (value: string[]) => void;
};

export const SimInput: React.FC<Props> = ({
  inputField,
  form,
  simList,
  setSimList,
}) => {
  const [bulkSims, setBulkSims] = useState("");
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkTextValidate, setBulkTextValidate] = useState<"" | "error">("");
  const [formInstance] = Form.useForm(form);
  const [inputOptions, setInputOptions] = useState<{ value: string }[]>([]);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query) {
        searchByInputField(query).then((results) => {
          // If inputField is "Subscriber Number" then convert it "MSISDN"
          type ObjectKey = keyof SearchSimResponse;
          const searchedField =
            inputField === INPUT_TYPE.SUBSCRIBER_NUMBER
              ? (INPUT_TYPE.MSISDN as ObjectKey)
              : (inputField as ObjectKey);
          const options = results?.map((item) => ({
            value: item[searchedField],
          }));
          setInputOptions(options);
        });
      }
    }, 1000),
    [inputField],
  );

  const handleValuesChange = (changedValues: any, allValues: any) => {
    setSimList(allValues?.simList);
  };

  const showBulkModal = async () => {
    setBulkTextValidate("");
    let bulkText = "";
    simList.forEach((sim) => {
      if (sim?.length) {
        bulkText += `${sim}\n`;
      }
    });
    setBulkSims(bulkText);
    setIsBulkModalOpen(true);
  };

  const handleCancelBulkAdd = () => {
    setIsBulkModalOpen(false);
  };

  const handleBulkAdd = () => {
    setBulkTextValidate("");
    if (bulkSims.length === 0) {
      formInstance.resetFields();
      formInstance.setFieldsValue({ simList: [undefined] });
      setSimList([]);
      setIsBulkModalOpen(false);
      return;
    }
    let bulkSimList = validateSimList(bulkSims);
    if (bulkSimList.length === 0) {
      setBulkTextValidate("error");
      return;
    }
    formInstance.resetFields();
    formInstance.setFieldsValue({ simList: bulkSimList });
    setSimList(bulkSimList);
    setIsBulkModalOpen(false);
  };

  const handleChangeBulkTextArea = (e: any) => {
    setBulkSims(e?.target?.value);
  };

  const handleSearch = (query: string) => {
    setInputOptions([]);
    debouncedSearch(query);
  };

  const clearOptions = () => {
    setInputOptions([]);
  };

  return (
    <>
    <Form
      className="mx-auto max-w-[700px]"
      autoComplete="off"
      initialValues={{ simList }}
      name={FormatString(BULK_CHANGE_TEXT.ADD_INPUT_TYPE, inputField)}
      form={formInstance}
      onValuesChange={handleValuesChange}
    >
      <Form.List name={BULK_CHANGE_TEXT.SIMLIST}>
        {(simFieldList, { add, remove }) => (
          <>
            {simFieldList.map(({ key, name, ...restField }) => {
              return (
                <div key={key}>
                  <div className="pb-1">
                    {inputField} {name + 1}
                  </div>
                  <Space
                    className="add-device-space flex mb-2"
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={name}
                      rules={GetSimInfoValidationRules(
                        inputField,
                        BULK_CHANGE_TEXT.SIMLIST,
                      )}
                    >
                      <AutoComplete
                        placeholder={inputField}
                        allowClear
                        onSearch={handleSearch}
                        options={inputOptions}
                        onSelect={clearOptions}
                        style={{ width: '14rem' }}
                      />
                    </Form.Item>
                    <Button
                      type="text"
                      onClick={() => {
                        remove(name);
                      }}
                      disabled={simFieldList.length < 2 ? true : false}
                    >
                      <MinusCircleOutlined className="-translate-y-1" />
                    </Button>
                  </Space>
                </div>
              );
            })}
            <Form.Item>
              <Row>
                <Col span={16}>
                  <Button
                    type="dashed"
                    onClick={async () => {
                      try {
                        add();
                      } catch (error) {
                        return;
                      }
                    }}
                    block
                    icon={<PlusOutlined />}
                  >
                    {BULK_CHANGE_TEXT.ADD_MORE}
                  </Button>
                </Col>
                <Col span={4}>
                  <Button
                    type="default"
                    onClick={showBulkModal}
                    className="ml-3.5"
                  >
                    {FormatString(BULK_CHANGE_TEXT.BULK_ITEMS, inputField)}
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
    <Modal
      width={700}
      title={FormatString(BULK_CHANGE_TEXT.BULK_ITEMS, inputField)}
      open={isBulkModalOpen}
      okText={BULK_CHANGE_TEXT.ADD}
      onOk={handleBulkAdd}
      cancelText={BULK_CHANGE_TEXT.CLOSE}
      onCancel={handleCancelBulkAdd}
    >
      <Alert
        message={
          <p>
            {BULK_CHANGE_TEXT.BULK_SIM_DESCRIPTION}{" "}
            <span className="font-semibold">{inputField}</span>
          </p>
        }
        type="info"
        showIcon
        className="w-full py-1.5 mt-4 mb-2"
      />
      <Input.TextArea
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            setBulkSims(bulkSims + "\t");
          }
        }}
        status={bulkTextValidate}
        value={bulkSims}
        onChange={handleChangeBulkTextArea}
        rows={14}
      />
      {bulkTextValidate.length > 0 && (
        <p className="text-red-500">
          {VALIDATION_MESSAGE.BULK_FORMAT}
          <br />
          {FormatString(VALIDATION_MESSAGE.LENGTH_RANGE, inputField)}
        </p>
      )}
    </Modal>
  </>
  );
};
