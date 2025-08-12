import { type NextRequest, NextResponse } from "next/server"
import { CartService } from "@/lib/db-operations"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { quantity } = await request.json()
    const success = await CartService.updateCartItem(params.id, quantity)
    return NextResponse.json({ success })
  } catch (error) {
    console.error("Error updating cart item:", error)
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await CartService.removeFromCart(params.id)
    return NextResponse.json({ success })
  } catch (error) {
    console.error("Error removing cart item:", error)
    return NextResponse.json({ error: "Failed to remove cart item" }, { status: 500 })
  }
}
