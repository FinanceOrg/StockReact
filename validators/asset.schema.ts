import { z } from "zod";

export const createAssetSchema = z.object({
  name: z.string().min(1, "Asset name is required"),
  value: z.float32().min(1, "Value required"),
  currency: z.string().min(3).max(3),
  description: z.string().optional(),
  userId: z.int(),
  categoryId: z.int(),
  vendorId: z.int(),
});

export const updateAssetSchema = createAssetSchema.partial();

export type CreateAssetInput = z.infer<typeof createAssetSchema>
export type UpdateAssetInput = z.infer<typeof updateAssetSchema>
