"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
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
import { ID, TransactionCategory, TransactionSummary } from "@/types/domain";

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
  transaction: TransactionSummary | null;
  assetId: ID;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (transaction: TransactionSummary) => void;
  onDelete?: (id: number) => void;
};

export default function TransactionModal({
  transaction,
  assetId,
  open,
  onOpenChange,
  onSuccess,
  onDelete,
}: Props) {
  const isEdit = !!transaction?.id;
  const router = useRouter();
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      name: "",
      amount: NaN,
      date: "",
      type: "income",
      categoryName: "",
      categoryId: 1,
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
        categoryId: 1,
      });
    }
  }, [transaction, open, reset]);

  const onFormSubmit = async (data: FormValues) => {
    try {
      let result: TransactionSummary;

      if (transaction?.id) {
        const payload = {
          ...data,
          date: format(new Date(data.date), "yyyy-MM-dd HH:mm:ss"),
        };

        result = await transactionClient.update(transaction.id, payload);
      } else {
        const payload = {
          ...data,
          date: format(new Date(data.date), "yyyy-MM-dd HH:mm:ss"),
          assetId: assetId,
        };
        result = await transactionClient.create(payload);
      }

      result.categoryId = data.categoryId;
      onSuccess?.(result);
      await router.refresh();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onDeleteTransaction = async () => {
    try {
      if (!transaction?.id) return;

      setIsDeleting(true);

      await transactionClient.delete(transaction.id);

      onDelete?.(transaction.id);
      await router.refresh();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

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
              step="1"
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

            <DialogFooter className="justify-between">
              <Button
                type="button"
                className="bg-red-500"
                onClick={onDeleteTransaction}
                isLoading={isDeleting}
                disabled={isSubmitting || isDeleting}
              >
                Delete
              </Button>
              <div className="flex gap-2 flex-col-reverse sm:flex-row">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isSubmitting || isDeleting}
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting || isDeleting}
                >
                  {isEdit ? "Update" : "Create"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
