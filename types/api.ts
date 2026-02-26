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


export type TokenSuccess = {
  success: true
  data: string
}

export type TokenFailure = {
  success: false
  response: Response
}

export type DeleteResponse = {
  success: boolean
  message: string
}

export type TokenResult = TokenSuccess | TokenFailure