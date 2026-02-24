export interface ValidationErrorResponse {
  message: string
  fieldErrors?: Record<string, string[]>
}

export type ValidationSuccess<T> = {
  success: true
  data: T
}

export type ValidationFailure = {
  success: false
  response: Response
}

export type ValidationResult<T> =
  | ValidationSuccess<T>
  | ValidationFailure