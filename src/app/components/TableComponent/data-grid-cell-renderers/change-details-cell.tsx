import React from "react";
import { Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const ChangeDetailCell: React.FC = () => (
  <Tooltip title="More information about the bulk change">
    <InfoCircleOutlined className="text-blue-600 text-xl hover:text-blue-800 cursor-pointer" />
  </Tooltip>
);

export const changeDetailCellRenderer = () => <ChangeDetailCell />;
