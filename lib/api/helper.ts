import { NextResponse } from "next/server";

function getBaseCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

export function setServerCookie(
  response: NextResponse,
  name: string,
  value: string,
) {
  response.cookies.set(name, value, getBaseCookieOptions());
}

export function removeServerCookie(response: NextResponse, name: string) {
  response.cookies.set(name, "", {
    ...getBaseCookieOptions(),
    expires: new Date(0),
  });
}

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
