"use client";

import { useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import EyeOff from "@/icons/eye-off.svg";
import Eye from "@/icons/eye.svg";

interface PasswordProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder?: string
}

export function Password<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
}: PasswordProps<T>) {
  const [show, setShow] = useState(false);
  const size: string = "size-6";

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <FormControl>
            <div className="flex items-center rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
              <Input
                {...field}
                type={show ? "text" : "password"}
                placeholder={placeholder}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />

              <button
                type="button"
                onClick={() => setShow(!show)}
                className="px-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {show ? (
                  <Eye className={size} />
                ) : (
                  <EyeOff className={size} />
                )}
              </button>
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}