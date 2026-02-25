import { z } from "zod"

export const createVendorSchema = z.object({
  name: z.string().min(1, "Vendor name is required"),
  style: z.object({
    color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
    icon: z.string().min(1, "Icon is required"),
  }),
  description: z.string().optional(),
})

export const updateVendorSchema = createVendorSchema.partial()

export type CreateVendorInput = z.infer<typeof createVendorSchema>
export type UpdateVendorInput = z.infer<typeof updateVendorSchema>
