import { NextRequest, NextResponse } from "next/server";

const isValidToken = (token?: string): boolean => {
  if (!token) return false;
  const cleaned = token.trim();
  return (
    cleaned !== "" &&
    cleaned !== "undefined" &&
    cleaned !== "null" &&
    cleaned !== "false"
  );
};

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isLoggedIn = request.cookies.get("isLoggedIn")?.value;

  // In cross-domain setup (Vercel + Render), check client-side isLoggedIn cookie
  const isAuthenticated =
    isValidToken(accessToken) ||
    isValidToken(refreshToken) ||
    isLoggedIn === "true";

  const { pathname } = request.nextUrl;
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // Not logged in → protect private routes
  if (!isAuthenticated && !isAuthPage) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    response.cookies.delete("isLoggedIn");
    return response;
  }

  // Already logged in → redirect away from login/register
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/profile",
    "/profile/:path*",
    "/resumes",
    "/resumes/:path*",
    "/analysis",
    "/analysis/:path*",
    "/login",
    "/register",
  ],
};
