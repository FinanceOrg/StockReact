import { z } from "zod";

const optionalPassword = z.union([
  z.literal(""),
  z.string().min(10, "Password must be at least 10 characters"),
]);

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(10, "Password must be at least 10 characters"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: optionalPassword.optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
