import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email(),
  password: z.string().min(1, "Password is required"),
});

export const loginBESchema = z.object({
  email: z.string().min(1, "Email is required").email(),
  password: z.string().min(10, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
