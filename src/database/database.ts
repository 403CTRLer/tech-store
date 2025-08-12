import initSqlJs from 'sql.js';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
  stock: number;
  created_at: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product?: Product;
}

export interface Order {
  id: number;
  total: number;
  status: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
}

class Database {
  private db: any = null;
  private isInitialized = false;

  async init() {
    if (this.isInitialized) return;

    try {
      const SQL = await initSqlJs({
        locateFile: (file) => `https://sql.js.org/dist/${file}`
      });

      // Try to load existing database from localStorage
      const savedDb = localStorage.getItem('ecommerce_db');
      if (savedDb) {
        const buffer = new Uint8Array(JSON.parse(savedDb));
        this.db = new SQL.Database(buffer);
      } else {
        this.db = new SQL.Database();
        this.createTables();
        this.insertSampleData();
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private createTables() {
    // Products table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        image_url TEXT,
        category TEXT,
        stock INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Cart table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        quantity INTEGER DEFAULT 1,
        FOREIGN KEY (product_id) REFERENCES products (id)
      );
    `);

    // Orders table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        total REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        customer_name TEXT,
        customer_email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  private insertSampleData() {
    const sampleProducts = [
      {
        name: 'Wireless Headphones',
        price: 199.99,
        description: 'Premium noise-canceling wireless headphones with 30-hour battery life.',
        image_url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
        category: 'Electronics',
        stock: 25
      },
      {
        name: 'Smart Watch',
        price: 299.99,
        description: 'Advanced fitness tracking and health monitoring smartwatch.',
        image_url: 'https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=500',
        category: 'Electronics',
        stock: 15
      },
      {
        name: 'Coffee Maker',
        price: 149.99,
        description: 'Professional-grade coffee maker with programmable brewing.',
        image_url: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=500',
        category: 'Appliances',
        stock: 12
      },
      {
        name: 'Laptop Backpack',
        price: 79.99,
        description: 'Water-resistant laptop backpack with multiple compartments.',
        image_url: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=500',
        category: 'Accessories',
        stock: 30
      },
      {
        name: 'Bluetooth Speaker',
        price: 89.99,
        description: 'Portable Bluetooth speaker with rich, room-filling sound.',
        image_url: 'https://images.pexels.com/photos/3394654/pexels-photo-3394654.jpeg?auto=compress&cs=tinysrgb&w=500',
        category: 'Electronics',
        stock: 20
      },
      {
        name: 'Desk Lamp',
        price: 59.99,
        description: 'LED desk lamp with adjustable brightness and USB charging port.',
        image_url: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=500',
        category: 'Home',
        stock: 18
      }
    ];

    sampleProducts.forEach(product => {
      this.db.exec(`
        INSERT INTO products (name, price, description, image_url, category, stock)
        VALUES ('${product.name}', ${product.price}, '${product.description}', '${product.image_url}', '${product.category}', ${product.stock});
      `);
    });

    this.saveToLocalStorage();
  }

  private saveToLocalStorage() {
    if (this.db) {
      const data = this.db.export();
      localStorage.setItem('ecommerce_db', JSON.stringify(Array.from(data)));
    }
  }

  // Product methods
  getProducts(): Product[] {
    const stmt = this.db.prepare('SELECT * FROM products ORDER BY created_at DESC');
    const products = [];
    while (stmt.step()) {
      products.push(stmt.getAsObject());
    }
    stmt.free();
    return products as Product[];
  }

  getProduct(id: number): Product | null {
    const stmt = this.db.prepare('SELECT * FROM products WHERE id = ?');
    stmt.bind([id]);
    let product = null;
    if (stmt.step()) {
      product = stmt.getAsObject();
    }
    stmt.free();
    return product as Product | null;
  }

  addProduct(product: Omit<Product, 'id' | 'created_at'>): void {
    this.db.exec(`
      INSERT INTO products (name, price, description, image_url, category, stock)
      VALUES ('${product.name}', ${product.price}, '${product.description}', '${product.image_url}', '${product.category}', ${product.stock});
    `);
    this.saveToLocalStorage();
  }

  updateProduct(id: number, product: Partial<Product>): void {
    const updates = Object.entries(product)
      .map(([key, value]) => `${key} = '${value}'`)
      .join(', ');
    
    this.db.exec(`UPDATE products SET ${updates} WHERE id = ${id}`);
    this.saveToLocalStorage();
  }

  deleteProduct(id: number): void {
    this.db.exec(`DELETE FROM products WHERE id = ${id}`);
    this.saveToLocalStorage();
  }

  // Cart methods
  getCartItems(): CartItem[] {
    const stmt = this.db.prepare(`
      SELECT c.*, p.name, p.price, p.image_url, p.stock
      FROM cart c
      JOIN products p ON c.product_id = p.id
    `);
    const items = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      items.push({
        id: row.id,
        product_id: row.product_id,
        quantity: row.quantity,
        product: {
          id: row.product_id,
          name: row.name,
          price: row.price,
          image_url: row.image_url,
          stock: row.stock
        }
      });
    }
    stmt.free();
    return items as CartItem[];
  }

  addToCart(productId: number, quantity: number = 1): void {
    // Check if item already in cart
    const stmt = this.db.prepare('SELECT * FROM cart WHERE product_id = ?');
    stmt.bind([productId]);
    let existingItem = null;
    if (stmt.step()) {
      existingItem = stmt.getAsObject();
    }
    stmt.free();

    if (existingItem) {
      // Update quantity
      this.db.exec(`
        UPDATE cart SET quantity = quantity + ${quantity} WHERE product_id = ${productId}
      `);
    } else {
      // Add new item
      this.db.exec(`
        INSERT INTO cart (product_id, quantity) VALUES (${productId}, ${quantity})
      `);
    }
    this.saveToLocalStorage();
  }

  updateCartItem(id: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(id);
    } else {
      this.db.exec(`UPDATE cart SET quantity = ${quantity} WHERE id = ${id}`);
      this.saveToLocalStorage();
    }
  }

  removeFromCart(id: number): void {
    this.db.exec(`DELETE FROM cart WHERE id = ${id}`);
    this.saveToLocalStorage();
  }

  clearCart(): void {
    this.db.exec('DELETE FROM cart');
    this.saveToLocalStorage();
  }

  // Order methods
  createOrder(total: number, customerName: string, customerEmail: string): number {
    this.db.exec(`
      INSERT INTO orders (total, customer_name, customer_email)
      VALUES (${total}, '${customerName}', '${customerEmail}')
    `);
    
    // Get the last inserted order ID
    const stmt = this.db.prepare('SELECT last_insert_rowid() as id');
    stmt.step();
    const result = stmt.getAsObject();
    stmt.free();
    
    this.saveToLocalStorage();
    return result.id as number;
  }

  getOrders(): Order[] {
    const stmt = this.db.prepare('SELECT * FROM orders ORDER BY created_at DESC');
    const orders = [];
    while (stmt.step()) {
      orders.push(stmt.getAsObject());
    }
    stmt.free();
    return orders as Order[];
  }
}

export const database = new Database();