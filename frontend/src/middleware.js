"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.middleware = middleware;
const server_1 = require("next/server");
const isValidToken = (token) => {
    if (!token)
        return false;
    const cleaned = token.trim();
    return (cleaned !== "" &&
        cleaned !== "undefined" &&
        cleaned !== "null" &&
        cleaned !== "false");
};
function middleware(request) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    // Check if either token is a valid non-empty string
    const isAuthenticated = isValidToken(accessToken) || isValidToken(refreshToken);
    const { pathname } = request.nextUrl;
    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
    // Not logged in → protect private routes
    if (!isAuthenticated && !isAuthPage) {
        const response = server_1.NextResponse.redirect(new URL("/login", request.url));
        // Clear stale cookie values if present
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
    }
    // Already logged in → redirect away from login/register
    if (isAuthenticated && isAuthPage) {
        return server_1.NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return server_1.NextResponse.next();
}
exports.config = {
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
//# sourceMappingURL=middleware.js.map