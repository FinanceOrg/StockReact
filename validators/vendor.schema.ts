import { z } from "zod";

const optionalImageUrl = z.union([
  z.literal(""),
  z
    .string()
    .url("Must be a valid URL")
    .refine(
      (url) => url.startsWith("https://") || url.startsWith("http://"),
      "Only http:// and https:// URLs are allowed",
    ),
]);

export const createVendorSchema = z.object({
  name: z.string().min(1, "Vendor name is required"),
  style: z
    .object({
      color: z
        .union([
          z.literal(""),
          z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
        ])
        .optional(),
      image: optionalImageUrl.optional(),
    })
    .optional()
    .transform((style) => {
      if (!style) return undefined;

      const nextStyle = {
        color: style.color || undefined,
        image: style.image || undefined,
      };

      if (!nextStyle.color && !nextStyle.image) {
        return undefined;
      }

      return nextStyle;
    }),
  description: z.string().optional(),
});

export const updateVendorSchema = createVendorSchema.partial();

export type CreateVendorInput = z.infer<typeof createVendorSchema>;
export type UpdateVendorInput = z.infer<typeof updateVendorSchema>;
