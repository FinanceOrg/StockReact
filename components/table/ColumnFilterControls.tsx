"use client";

import { Column, FilterFn } from "@tanstack/react-table";
import { ReactNode } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type NumberRangeFilter = {
  min?: number;
  max?: number;
};

export type DateRangeFilter = {
  from?: string;
  to?: string;
};

export const numberRangeFilterFn = <TData,>(): FilterFn<TData> => {
  return (row, columnId, filterValue) => {
    const numericValue = Number(row.getValue(columnId));
    const range = (filterValue as NumberRangeFilter | undefined) ?? {};

    if (Number.isNaN(numericValue)) {
      return false;
    }

    if (typeof range.min === "number" && numericValue < range.min) {
      return false;
    }

    if (typeof range.max === "number" && numericValue > range.max) {
      return false;
    }

    return true;
  };
};

export const dateRangeFilterFn = <TData,>(): FilterFn<TData> => {
  return (row, columnId, filterValue) => {
    const range = (filterValue as DateRangeFilter | undefined) ?? {};
    const rawValue = String(row.getValue(columnId));
    const rowDate = new Date(rawValue);

    if (Number.isNaN(rowDate.getTime())) {
      return false;
    }

    if (range.from) {
      const fromDate = new Date(range.from);
      if (!Number.isNaN(fromDate.getTime()) && rowDate < fromDate) {
        return false;
      }
    }

    if (range.to) {
      const toDate = new Date(range.to);
      if (!Number.isNaN(toDate.getTime())) {
        toDate.setHours(23, 59, 59, 999);
        if (rowDate > toDate) {
          return false;
        }
      }
    }

    return true;
  };
};

export const caseInsensitiveEqualsFilterFn = <TData,>(): FilterFn<TData> => {
  return (row, columnId, filterValue) => {
    if (!filterValue) {
      return true;
    }

    return (
      String(row.getValue(columnId)).toLowerCase() ===
      String(filterValue).toLowerCase()
    );
  };
};

type ColumnHeaderWithFilterProps<TData> = {
  column: Column<TData, unknown>;
  label: string;
  children: ReactNode;
};

export function ColumnHeaderWithFilter<TData>({
  column,
  label,
  children,
}: ColumnHeaderWithFilterProps<TData>) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        className="cursor-pointer font-medium"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {label}{" "}
        {column.getIsSorted() === "asc"
          ? "↑"
          : column.getIsSorted() === "desc"
            ? "↓"
            : ""}
      </button>

      {children}
    </div>
  );
}

type TextColumnFilterProps<TData> = {
  column: Column<TData, unknown>;
  placeholder?: string;
};

export function TextColumnFilter<TData>({
  column,
  placeholder = "Filter",
}: TextColumnFilterProps<TData>) {
  return (
    <Input
      value={(column.getFilterValue() as string) ?? ""}
      onChange={(event) => column.setFilterValue(event.target.value)}
      placeholder={placeholder}
      className="h-8 bg-white"
    />
  );
}

type NumberRangeColumnFilterProps<TData> = {
  column: Column<TData, unknown>;
  minPlaceholder?: string;
  maxPlaceholder?: string;
};

const toNumberRangeFilter = (
  current: NumberRangeFilter | undefined,
  key: "min" | "max",
  rawValue: string,
) => {
  const numericValue = rawValue === "" ? undefined : Number(rawValue);
  const next: NumberRangeFilter = {
    ...(current ?? {}),
    [key]: Number.isNaN(numericValue) ? undefined : numericValue,
  };

  return next.min === undefined && next.max === undefined ? undefined : next;
};

export function NumberRangeColumnFilter<TData>({
  column,
  minPlaceholder = "Min",
  maxPlaceholder = "Max",
}: NumberRangeColumnFilterProps<TData>) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Input
        type="number"
        value={
          ((column.getFilterValue() as NumberRangeFilter | undefined)?.min ??
            "") as number | ""
        }
        onChange={(event) =>
          column.setFilterValue(
            toNumberRangeFilter(
              column.getFilterValue() as NumberRangeFilter | undefined,
              "min",
              event.target.value,
            ),
          )
        }
        placeholder={minPlaceholder}
        className="h-8 bg-white"
      />
      <Input
        type="number"
        value={
          ((column.getFilterValue() as NumberRangeFilter | undefined)?.max ??
            "") as number | ""
        }
        onChange={(event) =>
          column.setFilterValue(
            toNumberRangeFilter(
              column.getFilterValue() as NumberRangeFilter | undefined,
              "max",
              event.target.value,
            ),
          )
        }
        placeholder={maxPlaceholder}
        className="h-8 bg-white"
      />
    </div>
  );
}

type DateRangeColumnFilterProps<TData> = {
  column: Column<TData, unknown>;
};

const toDateRangeFilter = (
  current: DateRangeFilter | undefined,
  key: "from" | "to",
  rawValue: string,
) => {
  const next: DateRangeFilter = {
    ...(current ?? {}),
    [key]: rawValue || undefined,
  };

  return !next.from && !next.to ? undefined : next;
};

export function DateRangeColumnFilter<TData>({
  column,
}: DateRangeColumnFilterProps<TData>) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Input
        type="date"
        value={
          (column.getFilterValue() as DateRangeFilter | undefined)?.from ?? ""
        }
        onChange={(event) =>
          column.setFilterValue(
            toDateRangeFilter(
              column.getFilterValue() as DateRangeFilter | undefined,
              "from",
              event.target.value,
            ),
          )
        }
        className="h-8 bg-white"
      />
      <Input
        type="date"
        value={
          (column.getFilterValue() as DateRangeFilter | undefined)?.to ?? ""
        }
        onChange={(event) =>
          column.setFilterValue(
            toDateRangeFilter(
              column.getFilterValue() as DateRangeFilter | undefined,
              "to",
              event.target.value,
            ),
          )
        }
        className="h-8 bg-white"
      />
    </div>
  );
}

type SelectColumnFilterOption = {
  value: string;
  label: string;
};

type SelectColumnFilterProps<TData> = {
  column: Column<TData, unknown>;
  options: SelectColumnFilterOption[];
  allLabel?: string;
};

export function SelectColumnFilter<TData>({
  column,
  options,
  allLabel = "All",
}: SelectColumnFilterProps<TData>) {
  return (
    <Select
      value={(column.getFilterValue() as string) ?? "all"}
      onValueChange={(value) =>
        column.setFilterValue(value === "all" ? undefined : value)
      }
    >
      <SelectTrigger className="h-8 bg-white">
        <SelectValue placeholder={allLabel} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLabel}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
