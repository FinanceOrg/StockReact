import { NextResponse } from "next/server";

import { setServerCookie } from "@/lib/api/helper";
import { validate } from "@/lib/api/validation";
import { authService } from "@/lib/services/auth.service";
import { getRole } from "@/types/auth";
import { loginSchema } from "@/validators/auth.schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = validate(loginSchema, body);

    if (!parsed.success) {
      return parsed.response;
    }

    const { token, user } = await authService.login(parsed.data);
    const response = NextResponse.json({ success: true }, { status: 200 });

    setServerCookie(response, "token", token);
    setServerCookie(response, "id", String(user.id));

    if (user.preferredCurrency) {
      setServerCookie(response, "preferredCurrency", user.preferredCurrency);
    }

    const role = getRole(user.roles);

    if (role) {
      setServerCookie(response, "role", role);
    }

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to login";

    if (message.includes("Invalid credentials")) {
      return NextResponse.json({ error: message }, { status: 401 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
