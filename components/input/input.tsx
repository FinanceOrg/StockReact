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
import { Input } from "@/components/ui/input";

interface FormInputItemProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> extends Omit<
  React.ComponentProps<typeof Input>,
  "name" | "value" | "onChange"
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  description?: React.ReactNode;
  parseValue?: (value: string) => PathValue<TFieldValues, TName>;
  formatValue?: (
    value: PathValue<TFieldValues, TName>,
  ) => React.ComponentProps<typeof Input>["value"];
}

export function FormInputItem<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  parseValue,
  formatValue,
  ...inputProps
}: FormInputItemProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <FormControl>
            <Input
              {...inputProps}
              name={field.name}
              ref={field.ref}
              onBlur={field.onBlur}
              value={
                formatValue
                  ? formatValue(field.value as PathValue<TFieldValues, TName>)
                  : field.value === undefined || field.value === null
                    ? ""
                    : field.value
              }
              onChange={(event) => {
                const nextValue = event.target.value;

                field.onChange(
                  parseValue
                    ? parseValue(nextValue)
                    : (nextValue as PathValue<TFieldValues, TName>),
                );
              }}
            />
          </FormControl>

          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
