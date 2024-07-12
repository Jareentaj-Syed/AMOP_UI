import { FaCircle } from "react-icons/fa";
import Icon from "@ant-design/icons";
import { Flex, Tooltip } from "antd";

type StatusCellRendererProps<TRecord = any, TValue extends string = string> = {
  record: TRecord;
  value: TValue;
  index: number;
  colorMap: Record<string, string>;
};

export function StatusCellRenderer<TRecord, TValue extends string>(
  props: StatusCellRendererProps<TRecord, TValue>,
) {
  const { record, value, colorMap } = props;

  const color = colorMap[value];

  return (
    <Tooltip title={value}>
      <Flex align="center" justify="center">
        <Icon
          component={FaCircle}
          style={{ color, fontSize: "1.5em" }}
          label={value}
        />
      </Flex>
    </Tooltip>
  );
}
