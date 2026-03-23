import { NextResponse } from "next/server";

import { removeServerCookie } from "@/lib/api/helper";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true }, { status: 200 });

    removeServerCookie(response, "token");
    removeServerCookie(response, "id");
    removeServerCookie(response, "preferredCurrency");
    removeServerCookie(response, "role");

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to logout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
