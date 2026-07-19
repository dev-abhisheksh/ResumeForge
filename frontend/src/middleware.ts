import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Consider authenticated if either accessToken or refreshToken is present
  const isAuthenticated = Boolean(accessToken || refreshToken);

  const { pathname } = request.nextUrl;
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // Not logged in → protect private routes
  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Already logged in → redirect away from login/register
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/resume/:path*",
    "/analysis/:path*",
    "/login",
    "/register",
  ],
};
