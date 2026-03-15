"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { transactionCategoryClient } from "@/clients/TransactionCategoryClient";
import { transactionClient } from "@/clients/TransactionClient";
import { FormInputItem } from "@/components/input/input";
import { FormSelectItem } from "@/components/input/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { TransactionCategory, TransactionSummary } from "@/types/domain";

const transactionSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  amount: z
    .number({ message: "Amount is required" })
    .positive("Amount must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  type: z.enum(["income", "expense"]),
  categoryName: z.string().optional(),
  categoryId: z.number(),
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
      amount: NaN,
      date: "",
      type: "income",
      categoryName: "",
      categoryId: 0,
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
        date: format(new Date(transaction.date), "yyyy-MM-dd HH:mm:ss"),
        type: validType,
        categoryName: transaction.categoryName ?? "",
        categoryId: transaction.categoryId,
      });
    } else {
      reset({
        name: "",
        amount: NaN,
        date: "",
        type: "income",
        categoryName: "",
        categoryId: 0,
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
            <FormInputItem
              control={form.control}
              name="name"
              label="Name"
              placeholder="Transaction name"
            />

            <FormInputItem
              control={form.control}
              name="amount"
              label="Amount"
              type="number"
              step="0.01"
              parseValue={(value) => (value === "" ? NaN : Number(value))}
              formatValue={(value) => (isNaN(value) ? "" : value)}
            />

            <FormInputItem
              control={form.control}
              name="date"
              label="Date"
              type="datetime-local"
              formatValue={(value) => value ?? ""}
            />

            <FormSelectItem
              control={form.control}
              name="type"
              label="Type"
              placeholder="Select type"
              options={[
                { value: "income", label: "Income" },
                { value: "expense", label: "Expense" },
              ]}
              widthClass="sm:w-1/3"
            />

            <FormSelectItem
              control={form.control}
              name="categoryId"
              label="Category"
              placeholder="Select category"
              parseValue={(value) => Number(value)}
              formatValue={(value) => String(value ?? "")}
              options={categories.map((category) => ({
                value: category.id.toString(),
                label: category.name,
              }))}
              widthClass="sm:w-1/3"
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
