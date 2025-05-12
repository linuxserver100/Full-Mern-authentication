# MERN Authentication System

A comprehensive MERN stack authentication system with multiple login options, email verification, and two-factor authentication (2FA) support.

## Features

- **Multiple Authentication Methods**
  - Email/Password Login
  - Social Logins (Google, GitHub, Microsoft, LinkedIn, Facebook, Apple)
  - Two-Factor Authentication (2FA)

- **User Management**
  - User Registration with Email Verification
  - Password Reset/Recovery
  - Profile Management
  - Session Management

- **Security Features**
  - JWT-based Authentication
  - Password Hashing
  - Token Expiration and Refresh
  - Login Attempt Tracking
  - IP Geolocation for Login Monitoring

- **Email Notifications**
  - Registration Confirmation
  - Login Notifications
  - Password Reset Requests
  - Email Change Confirmations

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB Database
- SMTP email provider account (SMTP2GO recommended)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/mern-auth-system.git
cd mern-auth-system
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Setup**

Copy the `.env.example` file to `.env` and update the variables:

```bash
cp .env.example .env
```

Important environment variables to configure:

- `JWT_SECRET`: Your JWT secret key
- `DATABASE_URL`: MongoDB connection string
- `SMTP_*`: SMTP server settings
- OAuth provider credentials (for social logins)

4. **Start the development server**

```bash
npm run dev
```

## Customizing Schema & Data Storage

The authentication system is designed to be flexible and adaptable to your project's needs. Here's how to customize it:

### Modifying the User Schema

1. **Edit the shared schema file**

Open `shared/schema.ts` to modify the user schema:

```typescript
// Example: Adding custom fields to the user schema
export const users = pgTable("users", {
  // Default auth fields (don't remove these)
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password"),
  username: text("username").notNull().unique(),
  isVerified: boolean("is_verified").notNull().default(false),
  // ... other auth fields

  // Add your custom fields here
  age: integer("age"),
  occupation: text("occupation"),
  preferences: jsonb("preferences"),
  // ... any other fields your application needs
});
```

2. **Update types**

After modifying the schema, make sure to update the associated types:

```typescript
// At the bottom of schema.ts
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
```

3. **Update validation schemas**

If you've added fields that need validation during registration or profile updates:

```typescript
export const registerUserSchema = createInsertSchema(users)
  .omit({ id: true })
  .extend({
    // Add validation for your new fields
    age: z.number().min(18).optional(),
    occupation: z.string().min(2).max(100).optional(),
    // More validation rules...
  });
```

### Using Different Database Storage

By default, this system uses PostgreSQL with Drizzle ORM, but you can adapt it to use MongoDB:

1. **MongoDB Integration**

Create a MongoDB schema in a new file, e.g., `server/models/User.js`:

```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  username: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },
  // ... other auth fields from the original schema
  
  // Your custom fields
  age: { type: Number },
  occupation: { type: String },
  preferences: { type: Map, of: Schema.Types.Mixed },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to update timestamps
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', UserSchema);
```

2. **Update the Storage Implementation**

Create a MongoDB implementation of the `IStorage` interface:

```typescript
// server/storage-mongodb.ts
import mongoose from 'mongoose';
import { IStorage } from './storage';
import User from './models/User';
// Import other models

export class MongoDBStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const user = await User.findById(id);
    return user ? user.toObject() : undefined;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await User.findOne({ email });
    return user ? user.toObject() : undefined;
  }
  
  // Implement all other methods from IStorage interface
  // ...
}

// Initialize and connect MongoDB
export async function initMongoDB(uri: string): Promise<MongoDBStorage> {
  await mongoose.connect(uri);
  return new MongoDBStorage();
}
```

3. **Switch Storage Implementation**

In `server/index.ts`, change the storage implementation:

```typescript
// Import your MongoDB storage
import { initMongoDB } from './storage-mongodb';

// Initialize MongoDB storage
const storage = await initMongoDB(process.env.MONGODB_URI);

// Use the storage in your routes
app.use(registerRoutes(app, storage));
```

## Integrating the Auth System into an Existing Project

### Frontend Integration

1. **Copy Authentication Components**

Copy the following directories to your project:
- `client/src/components/auth` - Authentication UI components
- `client/src/contexts/AuthContext.tsx` - Auth context provider
- `client/src/hooks/useAuth.ts` - Auth hook
- `client/src/lib/auth.ts` - Auth utilities

2. **Set Up Auth Provider**

Wrap your application with the AuthProvider in your main component:

```jsx
// src/App.jsx or src/main.jsx
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Your existing app components */}
    </AuthProvider>
  );
}
```

3. **Add Authentication Routes**

Add routes for authentication pages:

```jsx
// In your router configuration
import Login from './pages/login';
import Register from './pages/register';
import ForgotPassword from './pages/forgot-password';
import ResetPassword from './pages/reset-password';
import VerifyEmail from './pages/verify-email';

// Add these routes
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />
<Route path="/verify-email" element={<VerifyEmail />} />
```

4. **Add Protected Routes**

Create a ProtectedRoute component:

```jsx
// src/components/ProtectedRoute.jsx
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

// Usage in your router
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### Backend Integration

1. **Copy Authentication Server Files**

Copy these directories to your backend:
- `server/middleware` - Auth middleware
- `server/services` - Auth services
- `shared/schema.ts` - Data schema
- `shared/types.ts` - Type definitions

2. **Integrate Auth Routes**

Add the authentication routes to your Express app:

```javascript
// In your main server file
import { registerRoutes } from './routes';
import { storage } from './storage'; // Your storage implementation

// Register auth routes
app.use(registerRoutes(app, storage));
```

3. **Protect Your API Routes**

Use the authentication middleware to protect your routes:

```javascript
// In your API routes file
import { authenticateJWT, requireFullAuth } from './middleware/auth';

// Route that requires authentication
router.get('/api/protected-resource', authenticateJWT, (req, res) => {
  // Access authenticated user via req.user
  res.json({ message: 'Protected data', user: req.user });
});

// Route that requires full authentication (including 2FA if enabled)
router.post('/api/very-sensitive-action', requireFullAuth, (req, res) => {
  // Handle sensitive action
});
```

## Environment Variables

For the authentication system to work properly, make sure to set up the following environment variables:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Settings
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=30d

# Database
DATABASE_URL=mongodb://localhost:27017/auth_system

# Email Service (SMTP2GO)
SMTP_HOST=mail.smtp2go.com
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=your-smtp2go-username
SMTP_PASS=your-smtp2go-password
EMAIL_FROM_NAME=Authentication System
EMAIL_FROM_ADDRESS=noreply@yourdomain.com

# Application
APP_URL=http://localhost:5000

# OAuth Providers (for social logins)
# Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Microsoft, LinkedIn, Facebook, Apple (similar format)
# ...

# IP Geolocation API (for login tracking)
GEOLOCATION_API_KEY=your-geolocation-api-key
```

## License

MIT License

## Contact

Your Name - youremail@example.com