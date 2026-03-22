import { NextResponse } from "next/server";

import { userService } from "@/lib/services/user.service";

export async function GET() {
  try {
    const users = await userService.getAll();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch users";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await userService.create(body);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create user";

    if (message.includes("Validation failed")) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
