import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"
import type { LoginCredentials } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body: LoginCredentials = await request.json()

    if (!body.username || !body.password) {
      return NextResponse.json({ success: false, message: "Username and password are required" }, { status: 400 })
    }

    const result = await AuthService.login(body)

    if (result.success) {
      const response = NextResponse.json(result)

      // Set HTTP-only cookie
      if (result.token) {
        response.cookies.set("auth-token", result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60, // 7 days
        })
      }

      return response
    } else {
      return NextResponse.json(result, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
