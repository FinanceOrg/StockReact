import { z } from "zod"

export const createTransactionSchema = z.object({
  name: z.string().min(1, "Transaction name is required"),
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["expense", "income"], {
    errorMap: () => ({ message: "Type must be either 'expense' or 'income'" }),
  }),
  date: z.string().datetime("Invalid date format"),
  assetId: z.number().int().positive("Asset ID must be positive"),
  categoryId: z.number().int().positive("Category ID must be positive"),
})

export const updateTransactionSchema = createTransactionSchema.partial()

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>
