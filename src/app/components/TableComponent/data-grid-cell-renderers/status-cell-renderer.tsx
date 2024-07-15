import { FaCircle } from "react-icons/fa";
import Icon from "@ant-design/icons";
import { Tooltip } from "antd";
import { Flex } from "antd"; // Adjust the import according to your project setup

type StatusCellRendererProps<TRecord = any, TValue extends string = string> = {
  record: TRecord;
  value: TValue;
  index: number;
  colorMap: Record<string, string>;
};

export function StatusCellRenderer<TRecord, TValue extends string>(
  props: StatusCellRendererProps<TRecord, TValue>,
) {
  const { value, colorMap } = props;

  const color = colorMap[value];

  return (
    <Tooltip title={value}>
      <div className="flex items-center justify-center">
        <Icon
          component={FaCircle}
          style={{ color, fontSize: "1.5em" }}
          aria-label={value}
        />
      </div>
    </Tooltip>
  );
}
