import { validate } from "@/lib/api/validation"
import { loginSchema } from "@/validators/auth.schema"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const baseUrl = process.env.API_BASE_URL
    const body = await req.json()

    const parsed = validate(loginSchema, body)
    if (!parsed.success) {
      return parsed.response
    }

    const backendRes = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    })

    if (!backendRes.ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const { token } = await backendRes.json()
    const response = NextResponse.json({ success: true })

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    // TODO: Remove after backend can identify login user
    response.cookies.set("email", parsed.data.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    return response
}