import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const verifyRes = await fetch(`${process.env.API_BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (verifyRes.status === 401) {
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("token")
    response.cookies.delete("email")
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|login|register|api|favicon.ico).*)"],
}
