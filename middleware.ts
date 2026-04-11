import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("admin_token");
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isAuthenticated = token?.value === "authenticated";

  // Unauthenticated user trying to access admin (not login) → send to login
  if (!isLoginPage && !isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Already authenticated user visiting login page → send to dashboard
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
