import { type NextRequest, NextResponse } from "next/server"
import { OrderService, CartService, ProductService } from "@/lib/db-operations"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    let orders
    if (email) {
      orders = await OrderService.getOrdersByEmail(email)
    } else {
      orders = await OrderService.getAllOrders()
    }

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { customer_name, customer_email, userId } = await request.json()

    // Get cart items
    const cartItems = await CartService.getCartItems(userId)
    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // Calculate total and prepare order items
    const items = cartItems.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product.price,
    }))

    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

    // Create order
    const orderId = await OrderService.createOrder({
      items,
      total,
      status: "pending",
      customer_name,
      customer_email,
    })

    // Update product stock
    for (const item of cartItems) {
      await ProductService.updateStock(item.product_id.toString(), item.quantity)
    }

    // Clear cart
    await CartService.clearCart(userId)

    return NextResponse.json({ orderId, total }, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
