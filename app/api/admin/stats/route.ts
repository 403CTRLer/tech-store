import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const userRole = request.headers.get("x-user-role")

    if (userRole !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { db } = await connectToDatabase()

    // Get various statistics
    const [totalProducts, totalUsers, totalOrders, orders] = await Promise.all([
      db.collection("products").countDocuments(),
      db.collection("users").countDocuments(),
      db.collection("orders").countDocuments(),
      db.collection("orders").find({}).toArray(),
    ])

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

    // Get recent orders
    const recentOrders = await db.collection("orders").find({}).sort({ created_at: -1 }).limit(5).toArray()

    // Calculate monthly growth (mock data for now)
    const stats = {
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      recentOrders,
      growth: {
        products: 12,
        users: 8,
        orders: 23,
        revenue: 15,
      },
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Failed to fetch admin stats:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
