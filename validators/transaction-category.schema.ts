import { z } from "zod"

export const createTransactionCategorySchema = z.object({
  name: z.string().min(1, "Transaction category name is required"),
  style: z.object({
    color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
    icon: z.string().min(1, "Icon is required"),
  }),
  description: z.string().optional(),
})

export const updateTransactionCategorySchema = createTransactionCategorySchema.partial()

export type CreateTransactionCategoryInput = z.infer<typeof createTransactionCategorySchema>
export type UpdateTransactionCategoryInput = z.infer<typeof updateTransactionCategorySchema>
