"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  SortDescriptor,
} from "@heroui/react";
import { Icon } from "@iconify/react";

import { Input } from "@/components/ui";

export type Column = {
  key: string;
  label: string;
  sortable?: boolean;
};

type AdminDataTableProps<T> = {
  columns: Column[];
  data: T[];
  renderCell: (item: T, columnKey: React.Key) => React.ReactNode;
  searchPlaceholder?: string;
  initialRowsPerPage?: number;
  onRowAction?: (key: React.Key) => void;
};

export default function AdminDataTable<T extends { id: string | number }>({
  columns,
  data,
  renderCell,
  searchPlaceholder = "Rechercher...",
  initialRowsPerPage = 10,
  onRowAction,
}: AdminDataTableProps<T>) {
  const [filterValue, setFilterValue] = React.useState("");
  const [rowsPerPage] = React.useState(initialRowsPerPage);
  const [page, setPage] = React.useState(1);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });

  const hasSearch = Boolean(searchPlaceholder);

  const filteredItems = React.useMemo(() => {
    let filtered = [...data];

    if (hasSearch && filterValue) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(filterValue.toLowerCase()),
        ),
      );
    }

    return filtered;
  }, [data, filterValue, hasSearch]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof T] as unknown as number;
      const second = b[sortDescriptor.column as keyof T] as unknown as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder={searchPlaceholder}
            startContent={<Icon icon="solar:magnifer-linear" />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, onClear, searchPlaceholder]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          classNames={{
            wrapper: "gap-1",
            item: "bg-dashboard-panel text-foreground/60 shadow-none border-none text-sm font-medium rounded-[10px] hover:bg-dashboard-tab",
            cursor:
              "bg-nav-active text-white font-semibold rounded-[10px] shadow-none",
            prev: "bg-dashboard-panel text-foreground/60 shadow-none rounded-[10px] hover:bg-dashboard-tab",
            next: "bg-dashboard-panel text-foreground/60 shadow-none rounded-[10px] hover:bg-dashboard-tab",
          }}
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <span className="text-default-400 text-small">
            Total {data.length} items
          </span>
        </div>
      </div>
    );
  }, [page, pages, data.length]);

  return (
    <Table
      aria-label="Admin Data Table"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: [
          "rounded-[22px]",
          "bg-dashboard-panel",
          "shadow-none",
          "border-none",
          "p-0",
          "min-h-[222px]",
        ],
        th: [
          "bg-transparent",
          "text-[11px]",
          "font-semibold",
          "uppercase",
          "tracking-wider",
          "text-foreground/40",
          "py-4",
          "px-6",
          "first:rounded-tl-[22px]",
          "last:rounded-tr-[22px]",
        ],
        td: [
          "py-4",
          "px-6",
          "text-sm",
          "border-b",
          "border-dashboard-border/60",
          "group-last:border-b-0",
        ],
        tr: [
          "group",
          "transition-colors",
          "hover:bg-dashboard-tab",
          onRowAction ? "cursor-pointer" : "",
        ],
      }}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onRowAction={onRowAction}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.key}
            align={column.key === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"Aucune donnée trouvée"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
