import { z } from "zod"

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  style: z.object({
    color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
    icon: z.string().min(1, "Icon is required"),
  }),
  description: z.string().optional(),
})

export const updateCategorySchema = createCategorySchema.partial()

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
