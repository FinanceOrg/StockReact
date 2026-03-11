import { z } from "zod";
const mysqlDateTimeRegex =
  /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) ([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

export const createTransactionSchema = z.object({
  name: z.string().min(1, "Transaction name is required"),
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["expense", "income"], {
    message: "Type must be either 'expense' or 'income'",
  }),
   date: z
    .string()
    .regex(mysqlDateTimeRegex, "Date must be in yyyy-MM-dd HH:mm:ss format"),
  assetId: z.number().int().positive("Asset ID must be positive"),
  categoryId: z.number().int().positive("Category ID must be positive"),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>
