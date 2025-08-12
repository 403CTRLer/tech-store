import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { JWTService } from "./lib/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/register", "/products", "/api/products"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Admin routes that require admin role
  const adminRoutes = ["/admin"]
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  // API routes that require authentication
  const protectedApiRoutes = ["/api/cart", "/api/orders", "/api/auth/me"]
  const isProtectedApiRoute = protectedApiRoutes.some((route) => pathname.startsWith(route))

  // Admin API routes that require admin role
  const adminApiRoutes = ["/api/admin"]
  const isAdminApiRoute = adminApiRoutes.some((route) => pathname.startsWith(route))

  // Get token from cookie or authorization header
  const token = request.cookies.get("auth-token")?.value || request.headers.get("authorization")?.replace("Bearer ", "")

  // Handle public routes
  if (isPublicRoute && !isAdminRoute) {
    return NextResponse.next()
  }

  // Check authentication for protected routes
  if (!token) {
    if (isAdminRoute) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    if (isProtectedApiRoute || isAdminApiRoute) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    return NextResponse.next()
  }

  const payload = JWTService.verify(token)

  if (!payload) {
    // Invalid token - clear cookie and redirect/return error
    const response = isAdminRoute
      ? NextResponse.redirect(new URL("/login", request.url))
      : isProtectedApiRoute || isAdminApiRoute
        ? NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
        : NextResponse.next()

    if (response instanceof NextResponse) {
      response.cookies.set("auth-token", "", { maxAge: 0 })
    }
    return response
  }

  // Check admin access for admin routes
  if ((isAdminRoute || isAdminApiRoute) && payload.role !== "admin") {
    if (isAdminRoute) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    if (isAdminApiRoute) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }
  }

  // Add user info to request headers for API routes
  if (isProtectedApiRoute || isAdminApiRoute) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", payload.userId)
    requestHeaders.set("x-user-role", payload.role)
    requestHeaders.set("x-user-email", payload.email)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
