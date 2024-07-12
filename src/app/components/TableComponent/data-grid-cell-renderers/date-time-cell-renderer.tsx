import { format, toZonedTime } from "date-fns-tz";
import React from "react";

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
export const DEFAULT_TIMEZONE = timeZone;

export const FULL_TIME_FORMAT = "MMM dd y HH:mm:ss";
export const TABLE_TIME_FORMAT = "MMM dd y HH:mm";

interface DateTimeCellRendererProps {
  value: string;
}

const DateTimeCellRenderer: React.FC<DateTimeCellRendererProps> = ({ value }) => {
  if (!value) return null;
  
  const zonedTime = toZonedTime(value, DEFAULT_TIMEZONE);
  const formattedTime = format(zonedTime, TABLE_TIME_FORMAT);

  return <span>{formattedTime}</span>;
};

export const dateTimeCellRenderer = (value: string) => {
  return <DateTimeCellRenderer value={value} />;
};

export default DateTimeCellRenderer;
