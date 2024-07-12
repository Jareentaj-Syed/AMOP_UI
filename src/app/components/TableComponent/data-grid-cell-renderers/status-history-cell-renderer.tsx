import { FC } from "react";
import Link from "next/link";
import { Tooltip } from "antd";
import { HistoryOutlined } from "@ant-design/icons";

export const StatusHistoryCellRenderer: FC<{
  value: string; // ICCID value
}> = ({ value }) => {
  // TODO: fake link, replace with actual link
  return (
    <Tooltip title="Click to view Status History">
      <Link href={`status-history/${value}`} className="text-center block">
        <HistoryOutlined />
      </Link>
    </Tooltip>
  );
};

export function renderStatusHistoryCell(value: string) {
  return <StatusHistoryCellRenderer value={value} />;
}
