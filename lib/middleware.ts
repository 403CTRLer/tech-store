import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "./auth"

export async function authMiddleware(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "") || request.cookies.get("auth-token")?.value

  if (!token) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const user = await AuthService.validateSession(token)

  if (!user) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
  }

  // Add user to request headers for API routes
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-user-id", user._id!.toString())
  requestHeaders.set("x-user-role", user.role)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export async function adminMiddleware(request: NextRequest) {
  const authResponse = await authMiddleware(request)

  if (authResponse.status !== 200) {
    return authResponse
  }

  const userRole = request.headers.get("x-user-role")

  if (userRole !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 })
  }

  return NextResponse.next()
}
