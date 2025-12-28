# E-Commerce Application

A full-stack secure e-commerce platform built with React Vite frontend and Express.js backend with MongoDB database.

## Features

### Security
- ✅ JWT authentication with HTTP-only cookies
- ✅ CSRF protection with sameSite cookies
- ✅ Password hashing with bcrypt
- ✅ Rate limiting on API endpoints
- ✅ Helmet.js for HTTP security headers
- ✅ Input validation and sanitization
- ✅ CORS protection

### User Features
- Product browsing with search and filters
- Shopping cart management
- Secure checkout with Stripe payments
- Order tracking and history
- User profile management
- Product reviews and ratings

### Admin Features
- Dashboard with analytics and metrics
- Product management (CRUD operations)
- Order management and status updates
- User management
- Sales analytics by category
- Top selling products tracking

## Tech Stack

### Frontend
- React 18 with Vite
- React Router v6
- Zustand for state management
- Tailwind CSS for styling
- Stripe.js for payments
- Axios for API requests

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Stripe for payment processing
- Express-validator for validation
- Helmet, CORS, rate limiting for security

## Setup Instructions

### Prerequisites
- Node.js v16 or higher
- MongoDB (local or Atlas)
- Stripe account

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend folder:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

4. Start the frontend dev server:
```bash
npm run dev
```

The frontend will run on http://localhost:5173

## Default Admin Account

After starting the application, you can create an admin account by:

1. Register a new user account
2. Connect to MongoDB and manually update the user's role:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

Or use this seed script in MongoDB:
```javascript
// Create admin user
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$10$encrypted-password-here", // Use bcrypt to hash "admin123"
  role: "admin",
  isActive: true,
  createdAt: new Date()
})
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove from cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/cancel` - Cancel order

### Payments
- `POST /api/payment/create-intent` - Create Stripe payment intent
- `POST /api/payment/webhook` - Stripe webhook handler

### Admin
- `GET /api/admin/analytics` - Get dashboard analytics
- `GET /api/admin/products` - Get all products
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id` - Update order status
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user

## Stripe Webhook Setup

For local development, use Stripe CLI:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login to Stripe: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:5000/api/payment/webhook`
4. Copy the webhook signing secret to your `.env` file

## Production Deployment

### Backend
1. Set all environment variables
2. Change `NODE_ENV` to `production`
3. Use a secure `JWT_SECRET`
4. Deploy to services like Heroku, Railway, or Vercel

### Frontend
1. Update `VITE_API_URL` to production backend URL
2. Update Stripe public key to production key
3. Build: `npm run build`
4. Deploy the `dist` folder to Vercel, Netlify, or similar

## Security Notes

- JWT tokens are stored in HTTP-only cookies (not accessible via JavaScript)
- Cookies use sameSite: 'strict' for CSRF protection
- All passwords are hashed with bcrypt (salt rounds: 10)
- Rate limiting prevents brute force attacks
- Input validation on all endpoints
- CORS configured to allow only frontend origin

## License

MIT License
