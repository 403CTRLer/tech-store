# TechStore - MongoDB E-commerce Platform

A full-stack e-commerce platform built with Next.js, MongoDB, and modern authentication.

## Features

- 🔐 **Complete Authentication System**
  - JWT-based authentication with HTTP-only cookies
  - Role-based access control (Admin/User)
  - Password hashing with bcrypt
  - Session management

- 🛍️ **E-commerce Functionality**
  - Product catalog with categories
  - Shopping cart management
  - Order processing and tracking
  - Inventory management

- 👨‍💼 **Admin Dashboard**
  - Product management (CRUD operations)
  - Order management and status updates
  - User management
  - Sales analytics and statistics

- 🎨 **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Beautiful login/register forms with validation
  - Professional admin interface
  - Mobile-first approach

## Test Accounts

### Admin Account
- **Username:** `admin`
- **Password:** `admin123`
- **Email:** `admin@techstore.com`
- **Access:** Full admin dashboard and user management

### User Accounts
- **Username:** `user` | **Password:** `user123`
- **Username:** `jane_smith` | **Password:** `jane123`
- **Username:** `mike_wilson` | **Password:** `mike123`
- **Username:** `sarah_johnson` | **Password:** `sarah123`

## Quick Start

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Seed the Database**
   \`\`\`bash
   npm run seed
   \`\`\`

3. **Start Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Visit the Application**
   - Main site: `http://localhost:3000`
   - Admin dashboard: `http://localhost:3000/admin` (requires admin login)

## Database Structure

### Collections
- **products** - Product catalog with categories, pricing, and inventory
- **users** - User accounts with authentication and profile data
- **orders** - Customer orders with items and status tracking
- **sessions** - JWT session management
- **cart** - Shopping cart items (user-specific)

### Sample Data
- **22 Products** across 11 categories (Laptops, Smartphones, Gaming, etc.)
- **5 Test Users** (1 admin, 4 regular users)
- **4 Sample Orders** with different statuses
- **Realistic pricing** and product descriptions

## Authentication Flow

1. **Registration/Login** - Users create accounts or sign in
2. **JWT Token** - Secure token stored in HTTP-only cookie
3. **Role Verification** - Middleware checks user permissions
4. **Protected Routes** - Admin/user-specific page access
5. **Session Management** - Automatic token validation and refresh

## Admin Features

- **Dashboard** - Overview of sales, orders, and user statistics
- **Product Management** - Add, edit, delete products with image support
- **Order Management** - View and update order statuses
- **User Management** - View user accounts and manage permissions
- **Analytics** - Sales trends and performance metrics

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Orders
- `GET /api/orders` - Get orders
- `POST /api/orders` - Create order
- `PUT /api/orders/[id]` - Update order status (admin)

### Admin
- `GET /api/admin/users` - Get all users (admin)
- `PUT /api/admin/users/[id]` - Update user (admin)
- `DELETE /api/admin/users/[id]` - Delete user (admin)
- `GET /api/admin/stats` - Get dashboard statistics (admin)

## Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Tokens** - Secure authentication tokens
- **HTTP-only Cookies** - Prevent XSS attacks
- **Role-based Access** - Admin/user permission levels
- **Input Validation** - Server-side validation for all inputs
- **CORS Protection** - Secure API endpoints

## Technologies Used

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS, Radix UI components
- **Backend:** Next.js API routes, MongoDB
- **Authentication:** JWT, bcrypt
- **Database:** MongoDB Atlas
- **Icons:** Lucide React

## Environment Variables

\`\`\`env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

## Deployment

Ready for deployment on Vercel with MongoDB Atlas. All environment variables and database connections are configured for production use.
