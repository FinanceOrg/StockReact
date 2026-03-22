import { NextResponse } from "next/server";

import { validate } from "@/lib/api/validation";
import { authService } from "@/lib/services/auth.service";
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

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    response.cookies.set("id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to login";

    if (message.includes("Invalid credentials")) {
      return NextResponse.json({ error: message }, { status: 401 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
