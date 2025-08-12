import { ObjectId } from "mongodb"
import { connectToDatabase, getProductsCollection, getCartCollection, getOrdersCollection } from "./mongodb"
import type { Product, Order, CartItemWithProduct } from "./types"

// Product CRUD Operations
export class ProductService {
  static async getAllProducts(): Promise<Product[]> {
    await connectToDatabase()
    const collection = getProductsCollection()
    return await collection.find({}).sort({ created_at: -1 }).toArray()
  }

  static async getProductById(id: string): Promise<Product | null> {
    await connectToDatabase()
    const collection = getProductsCollection()
    return await collection.findOne({ _id: new ObjectId(id) })
  }

  static async getProductsByCategory(category: string): Promise<Product[]> {
    await connectToDatabase()
    const collection = getProductsCollection()
    return await collection.find({ category }).sort({ created_at: -1 }).toArray()
  }

  static async createProduct(product: Omit<Product, "_id" | "created_at">): Promise<ObjectId> {
    await connectToDatabase()
    const collection = getProductsCollection()
    const result = await collection.insertOne({
      ...product,
      created_at: new Date(),
    })
    return result.insertedId
  }

  static async updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
    await connectToDatabase()
    const collection = getProductsCollection()
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updated_at: new Date() } },
    )
    return result.modifiedCount > 0
  }

  static async deleteProduct(id: string): Promise<boolean> {
    await connectToDatabase()
    const collection = getProductsCollection()
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  static async updateStock(id: string, quantity: number): Promise<boolean> {
    await connectToDatabase()
    const collection = getProductsCollection()
    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $inc: { stock: -quantity } })
    return result.modifiedCount > 0
  }

  static async searchProducts(query: string): Promise<Product[]> {
    await connectToDatabase()
    const collection = getProductsCollection()
    return await collection
      .find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      })
      .toArray()
  }
}

// Cart CRUD Operations
export class CartService {
  static async getCartItems(userId?: string): Promise<CartItemWithProduct[]> {
    await connectToDatabase()
    const cartCollection = getCartCollection()
    const productsCollection = getProductsCollection()

    const pipeline = [
      ...(userId ? [{ $match: { user_id: userId } }] : []),
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $sort: { created_at: -1 },
      },
    ]

    return await cartCollection.aggregate(pipeline).toArray()
  }

  static async addToCart(productId: string, quantity = 1, userId?: string): Promise<ObjectId | boolean> {
    await connectToDatabase()
    const collection = getCartCollection()

    // Check if item already exists in cart
    const existingItem = await collection.findOne({
      product_id: new ObjectId(productId),
      ...(userId && { user_id: userId }),
    })

    if (existingItem) {
      // Update quantity
      const result = await collection.updateOne({ _id: existingItem._id }, { $inc: { quantity: quantity } })
      return result.modifiedCount > 0
    } else {
      // Add new item
      const result = await collection.insertOne({
        product_id: new ObjectId(productId),
        quantity,
        ...(userId && { user_id: userId }),
        created_at: new Date(),
      })
      return result.insertedId
    }
  }

  static async updateCartItem(id: string, quantity: number): Promise<boolean> {
    await connectToDatabase()
    const collection = getCartCollection()

    if (quantity <= 0) {
      return await CartService.removeFromCart(id)
    }

    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { quantity } })
    return result.modifiedCount > 0
  }

  static async removeFromCart(id: string): Promise<boolean> {
    await connectToDatabase()
    const collection = getCartCollection()
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  static async clearCart(userId?: string): Promise<boolean> {
    await connectToDatabase()
    const collection = getCartCollection()
    const filter = userId ? { user_id: userId } : {}
    const result = await collection.deleteMany(filter)
    return result.deletedCount > 0
  }

  static async getCartTotal(userId?: string): Promise<number> {
    const cartItems = await CartService.getCartItems(userId)
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }
}

// Order CRUD Operations
export class OrderService {
  static async createOrder(orderData: Omit<Order, "_id" | "created_at">): Promise<ObjectId> {
    await connectToDatabase()
    const collection = getOrdersCollection()
    const result = await collection.insertOne({
      ...orderData,
      created_at: new Date(),
    })
    return result.insertedId
  }

  static async getAllOrders(): Promise<Order[]> {
    await connectToDatabase()
    const collection = getOrdersCollection()
    return await collection.find({}).sort({ created_at: -1 }).toArray()
  }

  static async getOrderById(id: string): Promise<Order | null> {
    await connectToDatabase()
    const collection = getOrdersCollection()
    return await collection.findOne({ _id: new ObjectId(id) })
  }

  static async updateOrderStatus(id: string, status: Order["status"]): Promise<boolean> {
    await connectToDatabase()
    const collection = getOrdersCollection()
    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { status, updated_at: new Date() } })
    return result.modifiedCount > 0
  }

  static async getOrdersByEmail(email: string): Promise<Order[]> {
    await connectToDatabase()
    const collection = getOrdersCollection()
    return await collection.find({ customer_email: email }).sort({ created_at: -1 }).toArray()
  }

  static async deleteOrder(id: string): Promise<boolean> {
    await connectToDatabase()
    const collection = getOrdersCollection()
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }
}
