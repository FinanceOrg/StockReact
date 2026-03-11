"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { transactionCategoryClient } from "@/clients/TransactionCategoryClient";
import { transactionClient } from "@/clients/TransactionClient";
import { Button } from "@/components/ui/button";
import DateTimePicker from "@/components/ui/datetime-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionCategory, TransactionSummary } from "@/types/domain";

const transactionSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  amount: z.number().positive("Amount must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  type: z.enum(["income", "expense"]),
  categoryName: z.string().optional(),
});

type FormValues = z.infer<typeof transactionSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: TransactionSummary | null;
  transactionId: number | null;
  onSuccess?: (transaction: TransactionSummary) => void;
};

export default function TransactionModal({
  open,
  onOpenChange,
  transactionId,
  transaction,
  onSuccess,
}: Props) {
  const [categories, setCategories] = useState<TransactionCategory[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      name: "",
      amount: 0,
      date: "",
      type: "income",
      categoryName: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  // Fetch categories
  useEffect(() => {
    const init = async () => {
      try {
        const data = await transactionCategoryClient.index();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };

    init();
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (!open) return;

    if (transaction) {
      const validType = (
        ["income", "expense"].includes(transaction.type)
          ? transaction.type
          : "income"
      ) as "income" | "expense";
      reset({
        name: transaction.name,
        amount: transaction.amount,
        date: transaction.date,
        type: validType,
        categoryName: transaction.categoryName ?? "",
      });
    } else {
      reset({
        name: "",
        amount: 0,
        date: "",
        type: "income",
        categoryName: "",
      });
    }
  }, [transaction, open, reset]);

  const onFormSubmit = async (data: FormValues) => {
    try {
      const payload = {
        ...data,
        date: format(new Date(data.date), "yyyy-MM-dd HH:mm:ss"),
      };

      let result: TransactionSummary;

      if (transactionId) {
        result = await transactionClient.update(
          transactionId.toString(),
          payload,
        );

        onSuccess?.(result);
        onOpenChange(false);
        reset();
      } else {
        // result = await transactionClient.create(payload);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const isEdit = !!transactionId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Update" : "Create"} transaction</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modify the transaction details below."
              : "Fill in the details to create a new transaction."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Transaction name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date & Time */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date & Time</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) =>
                        field.onChange(date ? date.toISOString() : "")
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="categoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <Button type="submit" isLoading={isSubmitting}>
                {isEdit ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
