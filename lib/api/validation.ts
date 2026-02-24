import { z } from "zod"
import { NextResponse } from "next/server"
import { ValidationResult, ValidationErrorResponse } from "@/types/api"

export function validate<S extends z.ZodTypeAny>(
  schema: S,
  data: unknown
): ValidationResult<z.infer<S>> {

  const parsed = schema.safeParse(data)

  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {}

    for (const issue of parsed.error.issues) {
      const field = issue.path.join(".")
      if (!field) continue

      if (!fieldErrors[field]) {
        fieldErrors[field] = []
      }

      fieldErrors[field].push(issue.message)
    }

    const errorBody: ValidationErrorResponse = {
      message: "Validation failed",
      fieldErrors,
    }

    return {
      success: false,
      response: NextResponse.json(errorBody, { status: 400 }),
    }
  }

  return {
    success: true,
    data: parsed.data,
  }
}