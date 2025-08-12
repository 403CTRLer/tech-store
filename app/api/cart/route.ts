import { type NextRequest, NextResponse } from "next/server"
import { CartService } from "@/lib/db-operations"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    const cartItems = await CartService.getCartItems(userId || undefined)
    return NextResponse.json(cartItems)
  } catch (error) {
    console.error("Error fetching cart items:", error)
    return NextResponse.json({ error: "Failed to fetch cart items" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity, userId } = await request.json()
    const result = await CartService.addToCart(productId, quantity, userId)
    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    const success = await CartService.clearCart(userId || undefined)
    return NextResponse.json({ success })
  } catch (error) {
    console.error("Error clearing cart:", error)
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 })
  }
}
