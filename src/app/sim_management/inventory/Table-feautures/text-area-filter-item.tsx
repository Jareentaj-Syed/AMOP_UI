import React from "react";
import { Form, Input } from "antd";

const { TextArea } = Input;

interface TextAreaFilterItemProps {
  key: string;
  name: string;
  label: string;
  rows?: number;
  placeholder?: string;
}

const TextAreaFilterItem: React.FC<TextAreaFilterItemProps> = ({
  key,
  name,
  label,
  rows = 3,
  placeholder,
}) => {
  return (
    <div key={key}>
      <Form.Item name={name} label={label} className="mb-0">
        <TextArea rows={rows} placeholder={placeholder} />
      </Form.Item>
    </div>
  );
};

export default TextAreaFilterItem;
