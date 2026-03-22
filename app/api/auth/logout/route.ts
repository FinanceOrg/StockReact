import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true }, { status: 200 });

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    response.cookies.set("id", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to logout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
