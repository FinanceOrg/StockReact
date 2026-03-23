import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ROLES } from "@/types/auth";

const ADMIN_ONLY_PATHS = ["/users", "/vendors", "/asset-categories"];

function isAdminOnlyPath(pathname: string): boolean {
  return ADMIN_ONLY_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = request.cookies.get("role")?.value;
  const isAdmin = role === ROLES.ADMIN;
  const pathname = request.nextUrl.pathname;

  if (!isAdmin && isAdminOnlyPath(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|login|register|api|favicon.ico).*)"],
};
