// Run this script to seed your MongoDB database with sample data
// Usage: node scripts/seed-mongodb.js

const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

const uri =
  "mongodb+srv://71762133014:hcipass%40123@cluster0.2f65pqa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const sampleProducts = [
  // Laptops & Computers
  {
    name: "MacBook Pro 14-inch M3",
    price: 1999.99,
    description:
      "Apple MacBook Pro with M3 chip, 14-inch Liquid Retina XDR display, 8GB RAM, 512GB SSD. Perfect for professionals and creatives.",
    image_url: "/placeholder.svg?height=400&width=400",
    category: "Laptops",
    stock: 12,
    created_at: new Date(),
  },
  {
    name: "Dell XPS 13 Plus",
    price: 1299.99,
    description:
      "Ultra-thin laptop with 13.4-inch InfinityEdge display, Intel Core i7, 16GB RAM, 512GB SSD. Premium build quality.",
    image_url: "/placeholder.svg?height=400&width=400",
    category: "Laptops",
    stock: 8,
    created_at: new Date(),
  },
  {
    name: "Gaming Desktop PC RTX 4070",
    price: 1599.99,
    description:
      "High-performance gaming PC with NVIDIA RTX 4070, AMD Ryzen 7, 32GB DDR5 RAM, 1TB NVMe SSD. Ready for 4K gaming.",
    image_url: "/placeholder.svg?height=400&width=400",
    category: "Computers",
    stock: 6,
    created_at: new Date(),
  },

  // Smartphones & Tablets
  {
    name: "iPhone 15 Pro Max",
    price: 1199.99,
    description:
      "Latest iPhone with A17 Pro chip, 6.7-inch Super Retina XDR display, Pro camera system, and titanium design.",
    image_url: "/placeholder.svg?height=400&width=400",
    category: "Smartphones",
    stock: 25,
    created_at: new Date(),
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    price: 1099.99,
    description:
      "Premium Android phone with S Pen, 200MP camera, 6.8-inch Dynamic AMOLED display, and AI-powered features.",
    image_url: "/placeholder.svg?height=400&width=400",
    category: "Smartphones",
    stock: 18,
    created_at: new Date(),
  },
  {
    name: "iPad Pro 12.9-inch M2",
    price: 899.99,
    description:
      "Powerful tablet with M2 chip, 12.9-inch Liquid Retina XDR display, Apple Pencil support, perfect for creative work.",
    image_url: "/placeholder.svg?height=400&width=400",
    category: "Tablets",
    stock: 15,
    created_at: new Date(),
  },

  // Audio & Headphones
  {
    name: "Sony WH-1000XM5 Headphones",
    price: 399.99,
    description:
      "Industry-leading noise canceling wireless headphones with 30-hour battery life and premium sound quality.",
    image_url: "/placeholder.svg?height=400&width=400",
    category: "Audio",
    stock: 22,
    created_at: new Date(),
  },
  {
    name: "AirPods Pro 2nd Gen",
    price: 249.99,
    description:
      "Apple's premium wireless earbuds with active noise cancellation, spatial audio, and MagSafe charging case.",
    image_url: "/placeholder.svg?height=400&width=400",
    category: "Audio",
    stock: 35,
    created_at: new Date(),
  },
  {
    name: "JBL Charge 5 Bluetooth Speaker",
    price: 179.99,
    description: "Portable Bluetooth speaker with powerful sound, 20-hour playtime, and IP67 waterproof rating.",
    image_url: "/placeholder.svg?height=400&width=400",
    category: "Audio",
    stock: 28,
    created_at: new Date(),
  },

  // Gaming & Accessories
  {
    name: "PlayStation 5 Console",
    price: 499.99,
    description: "Next-gen gaming console with ultra-high speed SSD, ray tracing, and 4K gaming capabilities.",
    image_url: "/placeholder.svg?height=400&width=400",
    category: "Gaming",
    stock: 5,
    created_at: new Date(),
  },
  {
    name: "Xbox Series X",
    price: 499.99,
    description: "Microsoft's most powerful console with 12 teraflops of processing power and Quick Resume technology.",
    image_url: "/placeholder.svg?height=400&width=400",
    category: "Gaming",
    stock: 7,
    created_at: new Date(),
  },
  {
    name: "Logitech MX Master 3S Mouse",
    price: 99.99,
    description:
      "Advanced wireless mouse with ultra-precise scrolling, customizable buttons, and multi-device connectivity.",
    image_url: "/placeholder.svg?height=400&width=400",
    category: "Accessories",
    stock: 40,
    created_at: new Date(),
  },

  // Smart Home & Wearables
  {
    name: "Apple Watch Series 9",
    price: 399.99,
    description:
      "Advanced health and fitness tracking with ECG, blood oxygen monitoring, and always-on Retina display.",
    image_url: "/placeholder.svg?height=400&width=400",
    category: "Wearables",
    stock: 20,
    created_at: new Date(),
  },
  {
    name: "Amazon Echo Dot 5th Gen",
    price: 49.99,
    description: "Smart speaker with Alexa, improved audio quality, and smart home hub capabilities.",
    image_url: "/placeholder.svg?height=400&width=400",
    category: "Smart Home",
    stock: 50,
    created_at: new Date(),
  },
  {
    name: "Ring Video Doorbell Pro 2",
    price: 249.99,
    description: "Advanced video doorbell with 1536p HD video, 3D motion detection, and built-in Alexa.",
    image_url: "/placeholder.svg?height=400&width=400",
    category: "Smart Home",
    stock: 16,
    created_at: new Date(),
  },

  // Monitors & Displays
  {
    name: "LG 27-inch 4K Monitor",
    price: 349.99,
    description: "27-inch UltraFine 4K monitor with USB-C connectivity, perfect for MacBook users and professionals.",
    image_url: "/placeholder.svg?height=400&width=400",
    category: "Monitors",
    stock: 12,
    created_at: new Date(),
  },
  {
    name: "Samsung Odyssey G7 Gaming Monitor",
    price: 599.99,
    description: "32-inch curved gaming monitor with 240Hz refresh rate, 1ms response time, and QLED technology.",
    image_url: "/placeholder.svg?height=400&width=400",
    category: "Monitors",
    stock: 8,
    created_at: new Date(),
  },

  // Cameras & Photography
  {
    name: "Canon EOS R6 Mark II",
    price: 2499.99,
    description:
      "Professional mirrorless camera with 24.2MP sensor, 4K video recording, and advanced autofocus system.",
    image_url: "/placeholder.svg?height=400&width=400",
    category: "Cameras",
    stock: 4,
    created_at: new Date(),
  },
  {
    name: "DJI Mini 3 Pro Drone",
    price: 759.99,
    description: "Compact drone with 4K/60fps video, 34-minute flight time, and obstacle avoidance technology.",
    image_url: "/placeholder.svg?height=400&width=400",
    category: "Cameras",
    stock: 10,
    created_at: new Date(),
  },

  // Storage & Networking
  {
    name: "Samsung 980 PRO 2TB SSD",
    price: 199.99,
    description:
      "High-performance NVMe SSD with read speeds up to 7,000 MB/s, perfect for gaming and professional work.",
    image_url: "/placeholder.svg?height=400&width=400",
    category: "Storage",
    stock: 25,
    created_at: new Date(),
  },
  {
    name: "ASUS AX6000 WiFi 6 Router",
    price: 299.99,
    description: "Next-gen WiFi 6 router with ultra-fast speeds, advanced security, and mesh network support.",
    image_url: "/placeholder.svg?height=400&width=400",
    category: "Networking",
    stock: 14,
    created_at: new Date(),
  },
]

const testUsers = [
  {
    username: "admin",
    email: "admin@techstore.com",
    password: "admin123", // Will be hashed
    role: "admin",
    first_name: "Admin",
    last_name: "User",
    phone: "+1 (555) 123-4567",
    address: {
      street: "123 Admin Street",
      city: "Tech City",
      state: "CA",
      zip_code: "90210",
      country: "USA",
    },
    created_at: new Date(),
    updated_at: new Date(),
    is_active: true,
  },
  {
    username: "user",
    email: "user@example.com",
    password: "user123", // Will be hashed
    role: "user",
    first_name: "John",
    last_name: "Doe",
    phone: "+1 (555) 987-6543",
    address: {
      street: "456 User Avenue",
      city: "Customer City",
      state: "NY",
      zip_code: "10001",
      country: "USA",
    },
    created_at: new Date(),
    updated_at: new Date(),
    is_active: true,
  },
  {
    username: "jane_smith",
    email: "jane@example.com",
    password: "jane123", // Will be hashed
    role: "user",
    first_name: "Jane",
    last_name: "Smith",
    phone: "+1 (555) 456-7890",
    address: {
      street: "789 Customer Lane",
      city: "Shopping Town",
      state: "TX",
      zip_code: "75001",
      country: "USA",
    },
    created_at: new Date(),
    updated_at: new Date(),
    is_active: true,
  },
  {
    username: "mike_wilson",
    email: "mike@example.com",
    password: "mike123", // Will be hashed
    role: "user",
    first_name: "Mike",
    last_name: "Wilson",
    phone: "+1 (555) 321-6540",
    created_at: new Date(),
    updated_at: new Date(),
    is_active: true,
  },
  {
    username: "sarah_johnson",
    email: "sarah@example.com",
    password: "sarah123", // Will be hashed
    role: "user",
    first_name: "Sarah",
    last_name: "Johnson",
    phone: "+1 (555) 654-3210",
    address: {
      street: "321 Tech Boulevard",
      city: "Innovation City",
      state: "WA",
      zip_code: "98101",
      country: "USA",
    },
    created_at: new Date(),
    updated_at: new Date(),
    is_active: true,
  },
]

const sampleOrders = [
  {
    items: [
      {
        product_id: null, // Will be set after products are inserted
        quantity: 1,
        price: 1199.99,
      },
      {
        product_id: null, // Will be set after products are inserted
        quantity: 2,
        price: 249.99,
      },
    ],
    total: 1699.97,
    status: "delivered",
    customer_name: "John Doe",
    customer_email: "user@example.com",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  },
  {
    items: [
      {
        product_id: null, // Will be set after products are inserted
        quantity: 1,
        price: 1999.99,
      },
    ],
    total: 1999.99,
    status: "shipped",
    customer_name: "Jane Smith",
    customer_email: "jane@example.com",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    items: [
      {
        product_id: null, // Will be set after products are inserted
        quantity: 1,
        price: 499.99,
      },
      {
        product_id: null, // Will be set after products are inserted
        quantity: 1,
        price: 99.99,
      },
    ],
    total: 599.98,
    status: "processing",
    customer_name: "Mike Wilson",
    customer_email: "mike@example.com",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    items: [
      {
        product_id: null, // Will be set after products are inserted
        quantity: 1,
        price: 399.99,
      },
    ],
    total: 399.99,
    status: "pending",
    customer_name: "Sarah Johnson",
    customer_email: "sarah@example.com",
    created_at: new Date(), // Today
  },
]

async function seedDatabase() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("techstore")
    const productsCollection = db.collection("products")
    const usersCollection = db.collection("users")
    const ordersCollection = db.collection("orders")

    // Clear existing data
    await productsCollection.deleteMany({})
    await usersCollection.deleteMany({})
    await ordersCollection.deleteMany({})
    console.log("Cleared existing data")

    // Insert sample products
    const productResult = await productsCollection.insertMany(sampleProducts)
    console.log(`Inserted ${productResult.insertedCount} products`)

    console.log("Hashing passwords and inserting users...")
    const hashedUsers = await Promise.all(
      testUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12),
      })),
    )

    const userResult = await usersCollection.insertMany(hashedUsers)
    console.log(`Inserted ${userResult.insertedCount} users`)

    console.log("Creating sample orders...")
    const productIds = Object.values(productResult.insertedIds)

    // Update orders with actual product IDs
    const ordersWithProductIds = sampleOrders.map((order, index) => ({
      ...order,
      items: order.items.map((item, itemIndex) => ({
        ...item,
        product_id: productIds[index * 2 + itemIndex] || productIds[0], // Assign different products
      })),
    }))

    const orderResult = await ordersCollection.insertMany(ordersWithProductIds)
    console.log(`Inserted ${orderResult.insertedCount} orders`)

    // Create indexes for better performance
    await productsCollection.createIndex({ name: "text", description: "text" })
    await productsCollection.createIndex({ category: 1 })
    await productsCollection.createIndex({ created_at: -1 })
    await productsCollection.createIndex({ price: 1 })

    await usersCollection.createIndex({ username: 1 }, { unique: true })
    await usersCollection.createIndex({ email: 1 }, { unique: true })
    await usersCollection.createIndex({ created_at: -1 })

    await ordersCollection.createIndex({ customer_email: 1 })
    await ordersCollection.createIndex({ status: 1 })
    await ordersCollection.createIndex({ created_at: -1 })

    console.log("Created indexes")
    console.log("Database seeding completed successfully!")

    console.log("\n=== SEEDED DATA SUMMARY ===")
    console.log(`✅ Products: ${productResult.insertedCount}`)
    console.log(`✅ Users: ${userResult.insertedCount}`)
    console.log(`✅ Orders: ${orderResult.insertedCount}`)

    console.log("\n=== TEST USER ACCOUNTS ===")
    console.log("🔑 Admin Account:")
    console.log("   Username: admin")
    console.log("   Password: admin123")
    console.log("   Email: admin@techstore.com")
    console.log("   Role: admin")

    console.log("\n🔑 User Accounts:")
    testUsers
      .filter((user) => user.role === "user")
      .forEach((user) => {
        console.log(`   Username: ${user.username}`)
        console.log(`   Password: ${user.password}`)
        console.log(`   Email: ${user.email}`)
        console.log(`   Role: ${user.role}`)
        console.log("")
      })

    console.log("=== PRODUCT CATEGORIES ===")
    const categories = [...new Set(sampleProducts.map((p) => p.category))]
    categories.forEach((cat) => console.log(`📦 ${cat}`))

    console.log("\n=== ORDER STATUSES ===")
    const statuses = [...new Set(sampleOrders.map((o) => o.status))]
    statuses.forEach((status) => console.log(`📋 ${status}`))

    console.log("\n🚀 Ready to test! Visit your app and try logging in with the test accounts.")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
