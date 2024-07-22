import { BULK_CHANGE_TEXT, VALIDATION_MESSAGE, INPUT_TYPE } from "../../bulk-changes-store/bulk-change-constant";

import { FormatString, debounce, searchByInputField, validateSimListWithDualInfo } from "./utils";
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
import { GetSimInfoValidationRules } from "./validation-rules/validation-rules";
import { SearchSimResponse } from "../../bulk-changes-store/bulk-change-types";

// Define a new type for the items in simInfoList
type SimInfoItem = {
  [key: string]: string; // This allows any string as a key and string as a value
};

type Props<T extends SimInfoItem> = {
  firstInputField: string;
  lastInputField: string;
  simInfoList: T[];
  setSimInfoList: (value: T[]) => void;
  form: FormInstance<any>;
};

export const IccidImeiInput = <T extends SimInfoItem>({
  firstInputField,
  lastInputField,
  simInfoList,
  setSimInfoList,
  form,
}: Props<T>) => {
  const [bulkSims, setBulkSims] = useState("");
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkTextValidate, setBulkTextValidate] = useState<"" | "error">("");
  const [formInstance] = Form.useForm(form);
  const [inputOptions, setInputOptions] = useState<{ value: string }[]>([]);

  const debouncedSearch = useCallback(
    debounce((query: string, inputField: string) => {
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
    [firstInputField, lastInputField],
  );

  const handleValuesChange = (changedValues: any, allValues: any) => {
    const newSimInfoList = allValues?.simInfoList?.map((item: T) => ({
      [firstInputField]: item?.[firstInputField],
      [lastInputField]: item?.[lastInputField],
    }));
    setSimInfoList(newSimInfoList as T[]);
  };

  const showBulkModal = async () => {
    setBulkTextValidate("");
    let bulkText = "";
    simInfoList.forEach((simInfo) => {
      if (simInfo?.[firstInputField]?.length) {
        bulkText += `${simInfo?.[firstInputField]}`;
      }
      if (simInfo?.[lastInputField]?.length) {
        bulkText += `,${simInfo?.[lastInputField]}`;
      }
      if (simInfo !== undefined) {
        bulkText += "\n";
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
      formInstance.setFieldsValue({ simInfoList: [undefined] });
      setSimInfoList([]);
      setIsBulkModalOpen(false);
      return;
    }
    let bulkSimList = validateSimListWithDualInfo<T>(
      bulkSims,
      firstInputField,
      lastInputField,
    );
    if (bulkSimList.length === 0) {
      setBulkTextValidate("error");
      return;
    }
    formInstance.resetFields();
    formInstance.setFieldsValue({ simInfoList: bulkSimList });
    setSimInfoList(bulkSimList);
    setIsBulkModalOpen(false);
  };

  const handleChangeBulkTextArea = (e: any) => {
    setBulkSims(e?.target?.value);
  };

  const handleSearch = (query: string, inputField: string) => {
    setInputOptions([]);
    debouncedSearch(query, inputField);
  };

  const clearOptions = () => {
    setInputOptions([]);
  };

  return (
    <>
      <Form
        className="mx-auto max-w-[700px]"
        autoComplete="off"
        initialValues={{ simInfoList }}
        name={FormatString(
          BULK_CHANGE_TEXT.ADD_INPUT_TYPE,
          `${firstInputField}, ${lastInputField}`,
        )}
        form={formInstance}
        onValuesChange={handleValuesChange}
      >
        <Form.List name={BULK_CHANGE_TEXT.SIMINFOLIST}>
          {(simInfoFieldList, { add, remove }) => (
            <>
              {simInfoFieldList.map(({ key, name, ...restField }) => {
                return (
                  <div key={key}>
                    <div className="pb-1">
                      {firstInputField}, {lastInputField} {name + 1}
                    </div>
                    <Space
                      className="add-device-space flex mb-2"
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, firstInputField]}
                        rules={GetSimInfoValidationRules(
                          firstInputField,
                          BULK_CHANGE_TEXT.SIMINFOLIST,
                          false,
                        )}
                      >
                        <AutoComplete
                          placeholder={firstInputField}
                          allowClear
                          onSearch={(text: string) =>
                            handleSearch(text, firstInputField)
                          }
                          options={inputOptions}
                          onSelect={clearOptions}
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, lastInputField]}
                        rules={GetSimInfoValidationRules(
                          lastInputField,
                          BULK_CHANGE_TEXT.SIMINFOLIST,
                          false,
                        )}
                      >
                        <AutoComplete
                          placeholder={lastInputField}
                          allowClear
                          onSearch={(text: string) =>
                            handleSearch(text, lastInputField)
                          }
                          options={inputOptions}
                          onSelect={clearOptions}
                        />
                      </Form.Item>
                      <Button
                        type="text"
                        onClick={() => {
                          remove(name);
                        }}
                        disabled={simInfoFieldList.length < 2 ? true : false}
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
                      {FormatString(
                        BULK_CHANGE_TEXT.BULK_ITEMS,
                        `(${firstInputField}, ${lastInputField})`,
                      )}
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
        title={FormatString(
          BULK_CHANGE_TEXT.BULK_ITEMS,
          `${firstInputField}, ${lastInputField}`,
        )}
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
              <span className="font-semibold">{`${firstInputField}, ${lastInputField}`}</span>
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
            {FormatString(
              VALIDATION_MESSAGE.LENGTH_RANGE,
              `${firstInputField}, ${lastInputField}`,
            )}
          </p>
        )}
      </Modal>
    </>
  );
};
