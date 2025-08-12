import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"
import type { RegisterData } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body: RegisterData = await request.json()

    // Basic validation
    if (!body.username || !body.email || !body.password || !body.first_name || !body.last_name) {
      return NextResponse.json({ success: false, message: "All required fields must be provided" }, { status: 400 })
    }

    if (body.password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long" },
        { status: 400 },
      )
    }

    const result = await AuthService.register(body)

    if (result.success) {
      const response = NextResponse.json(result, { status: 201 })

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
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
