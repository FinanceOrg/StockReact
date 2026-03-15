"use client";

import * as React from "react";
import { Control, FieldValues, Path, PathValue } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOption {
  label: string;
  value: string;
}

interface FormSelectItemProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  placeholder?: string;
  description?: React.ReactNode;
  options: SelectOption[];
  parseValue?: (value: string) => PathValue<TFieldValues, TName>;
  formatValue?: (value: PathValue<TFieldValues, TName>) => string;
  widthClass?: string;
}

export function FormSelectItem<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder,
  description,
  options,
  parseValue,
  formatValue,
  widthClass,
}: FormSelectItemProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <Select
            onValueChange={(value) => {
              field.onChange(
                parseValue
                  ? parseValue(value)
                  : (value as PathValue<TFieldValues, TName>),
              );
            }}
            value={
              formatValue
                ? formatValue(field.value as PathValue<TFieldValues, TName>)
                : String(field.value ?? "")
            }
          >
            <FormControl>
              <SelectTrigger className={widthClass}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>

            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
