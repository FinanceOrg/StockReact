import { ZodError } from "zod";

import { DeleteResponse } from "@/types/api";

function getBackendErrorMessage(payload: unknown): string | null {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "message" in payload &&
    typeof payload.message === "string" &&
    payload.message.length > 0
  ) {
    return payload.message;
  }

  return null;
}

export function requireId(id: string | number | undefined, label: string) {
  if (!id) {
    throw new Error(`${label} ID is required`);
  }
}

export function throwValidationError(error: ZodError): never {
  const errors = error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");

  throw new Error(`Validation failed: ${errors}`);
}

export async function assertResponseOk(
  response: Response,
  fallbackMessage: string,
  options?: { notFoundMessage?: string },
) {
  if (response.ok) {
    return;
  }

  if (response.status === 404 && options?.notFoundMessage) {
    throw new Error(options.notFoundMessage);
  }

  let errorMessage = `${fallbackMessage}: ${response.status}`;

  try {
    const errorData = await response.json();
    errorMessage = getBackendErrorMessage(errorData) || errorMessage;
  } catch {}

  throw new Error(errorMessage);
}

export async function getDeleteResponse(
  response: Response,
  successMessage: string,
): Promise<DeleteResponse> {
  try {
    return await response.json();
  } catch {
    return { success: true, message: successMessage };
  }
}
