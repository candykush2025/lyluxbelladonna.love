import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This middleware runs on every request
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't need authentication
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/admin/login",
    "/about-us",
    "/contact-us",
    "/privacy",
    "/products",
  ];

  // Check if the route is public or starts with public path
  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/products/") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".");

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, check authentication
  // Note: We can't access Firebase Auth directly in middleware
  // So we'll handle this client-side with route guards
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
};
