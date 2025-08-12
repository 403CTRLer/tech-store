// Using string type instead since ObjectIds are serialized as strings in client-side code

export interface Product {
  _id?: string
  name: string
  price: number
  description: string
  image_url: string
  category: string
  stock: number
  created_at: Date
}

export interface CartItem {
  _id?: string
  product_id: string
  quantity: number
  user_id?: string // For future user authentication
  created_at: Date
}

export interface Order {
  _id?: string
  items: {
    product_id: string
    quantity: number
    price: number
  }[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  customer_name: string
  customer_email: string
  created_at: Date
}

export interface CartItemWithProduct extends CartItem {
  product: Product
}

export interface User {
  _id?: string
  username: string
  email: string
  password: string // Will be hashed
  role: "user" | "admin"
  first_name: string
  last_name: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zip_code: string
    country: string
  }
  created_at: Date
  updated_at: Date
  last_login?: Date
  is_active: boolean
}

export interface Session {
  _id?: string
  user_id: string
  token: string
  expires_at: Date
  created_at: Date
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: Omit<User, "password">
  token?: string
}

export interface ServerProduct extends Omit<Product, "_id" | "product_id"> {
  _id?: import("mongodb").ObjectId
}

export interface ServerCartItem extends Omit<CartItem, "_id" | "product_id"> {
  _id?: import("mongodb").ObjectId
  product_id: import("mongodb").ObjectId
}

export interface ServerOrder extends Omit<Order, "_id" | "items"> {
  _id?: import("mongodb").ObjectId
  items: {
    product_id: import("mongodb").ObjectId
    quantity: number
    price: number
  }[]
}

export interface ServerUser extends Omit<User, "_id"> {
  _id?: import("mongodb").ObjectId
}
