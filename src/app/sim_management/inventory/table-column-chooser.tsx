import {
    Button,
    Checkbox,
    CheckboxOptionType,
    Divider,
    Popover,
  } from "antd";
  import { useEffect, useState } from "react";
  
  const sampleColumns = [
    { key: "name", title: "Name" },
    { key: "age", title: "Age" },
    { key: "address", title: "Address" },
    { key: "email", title: "Email" },
    { key: "phone", title: "Phone" },
  ];
  
  export function TableColumnChooser() {
    const columns = sampleColumns;
    const defaultSelectedColumns = columns.map((column) => column.key);
  
    const [selectedColumns, setSelectedColumns] = useState<string[]>(
      columns.map((column) => column.key),
    );
  
    const menuItems: CheckboxOptionType<string>[] = columns.map((column) => ({
      value: column.key,
      label: column.title,
    }));
  
    const handleChangedColumns = (selected: string[]) => {
      setSelectedColumns(selected);
    };
  
    useEffect(() => {
      const visibleColumns = columns.map((column) => ({
        ...column,
        hidden: !selectedColumns.includes(column.key),
      }));
      console.log("Visible Columns:", visibleColumns);
    }, [selectedColumns, columns]);
  
    const content = (
      <>
        <Checkbox
          checked={selectedColumns.length === columns.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedColumns(defaultSelectedColumns);
            } else {
              setSelectedColumns([]);
            }
          }}
        >
          All
        </Checkbox>
        <Divider className="my-2" />
        <Checkbox.Group
          onChange={handleChangedColumns}
          value={selectedColumns}
          options={menuItems}
        />
      </>
    );
  
    return (
      <Popover trigger={["click"]} content={content}>
        <Button size="large" type={"primary"} ghost className="mb-2">
          Columns
        </Button>
      </Popover>
    );
  }
  