import { NextResponse } from "next/server";

export function getHeaders(token: string, isJson: boolean): HeadersInit {
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  };

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

export async function getErrorFromBackendResponse(response: Response) {
  const errorData = await response.json();
  return NextResponse.json(errorData, { status: response.status });
}

export function getDefaultServerError() {
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
