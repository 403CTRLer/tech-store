import { MongoClient, type Db, type Collection } from "mongodb"

const uri =
  "mongodb+srv://71762133014:hcipass%40123@cluster0.2f65pqa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

let client: MongoClient
let db: Db

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri)
    await client.connect()
    db = client.db("techstore")
  }
  return { client, db }
}

export function getDatabase(): Db {
  if (!db) {
    throw new Error("Database not connected. Call connectToDatabase first.")
  }
  return db
}

// Collection helpers
export function getProductsCollection(): Collection {
  return getDatabase().collection("products")
}

export function getCartCollection(): Collection {
  return getDatabase().collection("cart")
}

export function getOrdersCollection(): Collection {
  return getDatabase().collection("orders")
}
