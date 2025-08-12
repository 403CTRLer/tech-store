import bcrypt from "bcryptjs"
import type { ObjectId } from "mongodb"
import { connectToDatabase } from "./mongodb"
import type { User, LoginCredentials, RegisterData, AuthResponse, Session } from "./types"
import { JWTService } from "./jwt"

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  static generateToken(userId: string, email: string, role: "user" | "admin"): string {
    return JWTService.sign({ userId, email, role })
  }

  static verifyToken(token: string): { userId: string; email: string; role: "user" | "admin" } | null {
    const payload = JWTService.verify(token)
    return payload ? { userId: payload.userId, email: payload.email, role: payload.role } : null
  }

  static async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const { db } = await connectToDatabase()

      // Check if user already exists
      const existingUser = await db.collection("users").findOne({
        $or: [{ username: userData.username }, { email: userData.email }],
      })

      if (existingUser) {
        return {
          success: false,
          message: "Username or email already exists",
        }
      }

      // Hash password
      const hashedPassword = await this.hashPassword(userData.password)

      // Create user
      const newUser: Omit<User, "_id"> = {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: "user",
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        created_at: new Date(),
        updated_at: new Date(),
        is_active: true,
      }

      const result = await db.collection("users").insertOne(newUser)
      const token = this.generateToken(result.insertedId.toString(), userData.email, "user")

      // Create session
      await this.createSession(result.insertedId, token)

      const userResponse = { ...newUser, _id: result.insertedId }
      delete (userResponse as any).password

      return {
        success: true,
        message: "User registered successfully",
        user: userResponse,
        token,
      }
    } catch (error) {
      return {
        success: false,
        message: "Registration failed",
      }
    }
  }

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { db } = await connectToDatabase()

      const user = (await db.collection("users").findOne({
        username: credentials.username,
        is_active: true,
      })) as User | null

      if (!user) {
        return {
          success: false,
          message: "Invalid username or password",
        }
      }

      const isPasswordValid = await this.comparePassword(credentials.password, user.password)

      if (!isPasswordValid) {
        return {
          success: false,
          message: "Invalid username or password",
        }
      }

      // Update last login
      await db.collection("users").updateOne(
        { _id: user._id },
        {
          $set: {
            last_login: new Date(),
            updated_at: new Date(),
          },
        },
      )

      const token = this.generateToken(user._id!.toString(), user.email, user.role)
      await this.createSession(user._id!, token)

      const userResponse = { ...user }
      delete (userResponse as any).password

      return {
        success: true,
        message: "Login successful",
        user: userResponse,
        token,
      }
    } catch (error) {
      return {
        success: false,
        message: "Login failed",
      }
    }
  }

  static async createSession(userId: ObjectId, token: string): Promise<void> {
    const { db } = await connectToDatabase()

    const session: Omit<Session, "_id"> = {
      user_id: userId,
      token,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      created_at: new Date(),
    }

    await db.collection("sessions").insertOne(session)
  }

  static async validateSession(token: string): Promise<User | null> {
    try {
      const { db } = await connectToDatabase()

      const session = (await db.collection("sessions").findOne({
        token,
        expires_at: { $gt: new Date() },
      })) as Session | null

      if (!session) return null

      const user = (await db.collection("users").findOne({
        _id: session.user_id,
        is_active: true,
      })) as User | null

      return user
    } catch {
      return null
    }
  }

  static async logout(token: string): Promise<boolean> {
    try {
      const { db } = await connectToDatabase()
      await db.collection("sessions").deleteOne({ token })
      return true
    } catch {
      return false
    }
  }
}
