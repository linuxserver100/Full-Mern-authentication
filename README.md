# MERN Authentication System

A comprehensive MERN stack authentication system with multiple login options, email verification, and two-factor authentication (2FA) support. This system provides a complete authentication solution that can be used as a standalone application or integrated into existing projects.

## Project Overview

This authentication system is built using the MERN stack (MongoDB, Express, React, Node.js) with support for PostgreSQL as a fallback database option. It provides a complete, production-ready authentication solution with multiple login methods, security features, and user management capabilities.

### Key Features at a Glance
- Dual database support (MongoDB primary, PostgreSQL fallback)
- Multiple authentication methods (Email/Password, Social logins)
- Two-factor authentication with TOTP
- Email verification and notifications
- Session management across devices
- JWT-based secure authentication
- Comprehensive user profile management
- Responsive, modern UI with Tailwind CSS and Shadcn UI
- Fully customizable and extendable architecture

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [MongoDB Configuration](#mongodb-configuration)
  - [PostgreSQL Configuration](#postgresql-configuration)
  - [Email Configuration](#email-configuration)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Frontend Components](#frontend-components)
- [Database Integration](#database-integration)
- [Security Features](#security-features)
- [Customizing Schema & Data Storage](#customizing-schema--data-storage)
- [Integrating into Existing Projects](#integrating-into-existing-projects)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

### Authentication Methods
- **Email/Password Authentication**
  - Secure registration and login with email verification
  - Strong password requirements with secure hashing
  - Remember me functionality for extended sessions

- **Social Authentication**
  - Google OAuth 2.0 integration
  - GitHub OAuth integration
  - Microsoft OAuth integration
  - LinkedIn OAuth integration
  - Facebook OAuth integration
  - Apple Sign In integration

- **Two-Factor Authentication (2FA)**
  - Time-based One-Time Password (TOTP) implementation
  - QR code generation for easy setup with authenticator apps
  - Backup recovery codes for emergency access
  - Option to enable/disable 2FA per user

### User Management
- **User Registration**
  - Email verification with secure tokens
  - Username and email validation
  - Customizable profile fields

- **Account Recovery**
  - Secure password reset workflow
  - Time-limited reset tokens
  - Email notifications for recovery actions

- **Profile Management**
  - User profile editing
  - Email address change with verification
  - Password change with current password confirmation
  - Profile picture upload and management
  - Account deletion with confirmation

- **Session Management**
  - View all active sessions across devices
  - Terminate individual sessions
  - Logout from all devices
  - Session expiration and automatic renewal

### Security Features
- **Token-Based Authentication**
  - JWT (JSON Web Token) implementation
  - Token expiration and refresh mechanism
  - Secure token storage and transmission

- **Password Security**
  - Bcrypt hashing with salt rounds
  - Password strength requirements
  - Brute force protection
  - Password history to prevent reuse

- **Session Security**
  - CSRF protection with tokens
  - XSS protection
  - Secure HTTP-only cookies
  - IP tracking and validation

- **Login Monitoring**
  - Failed login attempt tracking
  - Automatic temporary account locking after multiple failures
  - IP geolocation tracking for suspicious activity
  - Email notifications for unusual login locations

### Notification System
- **Email Notifications**
  - Welcome emails
  - Email verification
  - Password reset requests
  - Successful/unsuccessful login attempts
  - Account changes (email, password)
  - New device logins
  - Account security alerts

### Legal Compliance
- **Terms & Policies**
  - Terms of Service page
  - Privacy Policy page
  - Cookie Policy page
  - User consent tracking
  - GDPR compliance helpers

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL Database (primary)
- **PostgreSQL** - SQL Database (alternative)
- **Drizzle ORM** - Database ORM for PostgreSQL
- **Mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT implementation
- **bcrypt** - Password hashing
- **speakeasy** - TOTP for 2FA
- **nodemailer** - Email sending
- **passport.js** - Authentication middleware

### Frontend
- **React** - UI library
- **Shadcn UI** - Component library
- **TailwindCSS** - Utility-first CSS framework
- **React Hook Form** - Form validation
- **Zod** - Schema validation
- **React Query** - Data fetching and caching
- **Wouter** - Routing
- **Lucide React** - Icon library
- **React Icons** - Social media icons

### Tooling
- **TypeScript** - Type safety
- **Vite** - Build tool and development server

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB Database or PostgreSQL Database (configurable)
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
- `USE_MONGODB`: Set to "true" to use MongoDB or "false" to use PostgreSQL
- `MONGODB_URI`: MongoDB connection string (if using MongoDB)
- `DATABASE_URL`: PostgreSQL connection string (if using PostgreSQL)
- `SMTP_*`: SMTP server settings
- OAuth provider credentials (for social logins)

### MongoDB Configuration

The system supports MongoDB as the primary database. To use MongoDB:

1. Make sure you have MongoDB installed locally or have access to a MongoDB Atlas cluster
2. Set the `USE_MONGODB` environment variable to "true" in your `.env` file
3. Set the `MONGODB_URI` environment variable to your MongoDB connection string:
   - For MongoDB Atlas: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority`
   - For local MongoDB: `mongodb://localhost:27017/auth_system`

Example .env configuration for MongoDB:

```
USE_MONGODB=true
MONGODB_URI=mongodb://localhost:27017/auth_system
```

### PostgreSQL Configuration

The system also supports PostgreSQL as an alternative database:

1. Make sure you have PostgreSQL installed locally or have access to a cloud PostgreSQL instance
2. Set the `USE_MONGODB` environment variable to "false" in your `.env` file
3. Set the `DATABASE_URL` environment variable to your PostgreSQL connection string:
   - Format: `postgresql://username:password@hostname:port/database?sslmode=require`

Example .env configuration for PostgreSQL:

```
USE_MONGODB=false
DATABASE_URL=postgresql://postgres:password@localhost:5432/auth_system
```

### Email Configuration

Email notifications are an essential part of the authentication system. Configure your SMTP settings:

1. Sign up for an SMTP provider (SMTP2GO, SendGrid, etc.)
2. Update the .env file with your SMTP credentials:

```
SMTP_HOST=mail.smtp2go.com
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
EMAIL_FROM_NAME=Your App Name
EMAIL_FROM_ADDRESS=no-reply@yourdomain.com
```

4. **Start the development server**

```bash
npm run dev
```

The server will start at http://localhost:5000 with both the API and client served from the same port.

## Project Structure

The project follows a clear and organized structure:

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── auth/       # Authentication-specific components
│   │   │   ├── layout/     # Layout components (header, footer, etc.)
│   │   │   └── ui/         # UI components (buttons, cards, etc.)
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and services
│   │   ├── pages/          # Application pages
│   │   └── App.tsx         # Root component
│   └── index.html          # HTML entry point
├── server/                 # Backend Express application
│   ├── db/                 # Database connection and models
│   ├── middleware/         # Express middleware
│   ├── services/           # Business logic services
│   ├── routes.ts           # API routes definition
│   ├── storage.ts          # Storage interface
│   └── index.ts            # Server entry point
├── shared/                 # Shared code between client and server
│   ├── schema.ts           # Database schema definitions
│   └── types.ts            # Shared TypeScript types
└── .env                    # Environment variables
```

## API Documentation

The authentication system provides a comprehensive set of API endpoints:

### Backend API Endpoints

#### Authentication Endpoints

| Endpoint | Method | Description | Request Body | Response | Implementation Notes |
|----------|--------|-------------|--------------|----------|---------------------|
| `/api/auth/register` | POST | Register a new user | `{ email, username, password, firstName?, lastName? }` | `{ message, user }` | Creates user, sends verification email, handles username uniqueness |
| `/api/auth/login` | POST | Login user | `{ email, password, rememberMe }` | `{ token, user }` or `{ requiresTwoFactor, tempToken }` | Includes brute force protection, session tracking, IP logging |
| `/api/auth/verify-email` | GET | Verify email address | `?token=<verification_token>` | `{ success, message }` | Validates time-limited token, updates user verification status |
| `/api/auth/forgot-password` | POST | Request password reset | `{ email }` | `{ message }` | Generates reset token, sends email with secure reset link |
| `/api/auth/reset-password` | POST | Reset password | `{ token, password }` | `{ message }` | Validates token, enforces password strength, updates password |
| `/api/auth/logout` | POST | Logout current session | - | `{ message }` | Invalidates current session token |
| `/api/auth/logout-all` | POST | Logout all sessions | - | `{ message }` | Invalidates all user sessions across devices |
| `/api/auth/refresh-token` | POST | Refresh JWT token | `{ refreshToken }` | `{ token, refreshToken }` | Issues new access token using refresh token |

#### Two-Factor Authentication Endpoints

| Endpoint | Method | Description | Request Body | Response | Implementation Details |
|----------|--------|-------------|--------------|----------|------------------------|
| `/api/auth/2fa/setup` | POST | Setup 2FA | - | `{ secret, qrCodeUrl }` | Generates TOTP secret, creates QR code for authenticator apps |
| `/api/auth/2fa/verify` | POST | Verify and enable 2FA | `{ code }` | `{ success, message, recoveryCodes }` | Verifies TOTP code, enables 2FA, provides backup codes |
| `/api/auth/2fa/disable` | POST | Disable 2FA | `{ code, password }` | `{ success, message }` | Requires both TOTP code and password for security |
| `/api/auth/2fa/validate` | POST | Validate 2FA during login | `{ code, tempToken }` | `{ token, user }` | Validates TOTP code during 2FA login flow |
| `/api/auth/2fa/recovery` | POST | Use recovery code | `{ recoveryCode, tempToken }` | `{ token, user }` | Alternative to TOTP when authenticator unavailable |

#### User Profile and Management Endpoints

| Endpoint | Method | Description | Request Body | Response | Features |
|----------|--------|-------------|--------------|----------|----------|
| `/api/user/profile` | GET | Get user profile | - | User profile object | Returns user data with sensitive fields removed |
| `/api/user/profile` | PATCH | Update user profile | Profile fields to update | `{ success, message, user }` | Updates allowed user fields with validation |
| `/api/user/email` | POST | Change email address | `{ newEmail, password }` | `{ message }` | Requires verification for new email address |
| `/api/user/password` | POST | Change password | `{ currentPassword, newPassword }` | `{ message }` | Enforces password history, strength requirements |
| `/api/user/sessions` | GET | Get active sessions | - | Array of active sessions | Includes device info, IP, location data |
| `/api/user/sessions/:id` | DELETE | Terminate specific session | - | `{ success, message }` | Allows terminating individual sessions by ID |
| `/api/user/account` | DELETE | Delete user account | `{ password }` | `{ success, message }` | Permanently deletes user data with password confirmation |

#### Social Authentication Endpoints

| Endpoint | Method | Description | Implementation Details |
|----------|--------|-------------|------------------------|
| `/api/auth/google` | GET | Initiate Google OAuth flow | Uses OAuth 2.0 with configured scopes, state parameter for CSRF protection |
| `/api/auth/github` | GET | Initiate GitHub OAuth flow | Requests user profile, email scopes |
| `/api/auth/microsoft` | GET | Initiate Microsoft OAuth flow | Requests user.read scope |
| `/api/auth/linkedin` | GET | Initiate LinkedIn OAuth flow | Requests r_liteprofile, r_emailaddress scopes |
| `/api/auth/facebook` | GET | Initiate Facebook OAuth flow | Requests public_profile, email scopes |
| `/api/auth/apple` | GET | Initiate Apple Sign In flow | Implements PKCE flow for enhanced security |
| `/api/auth/<provider>/callback` | GET | OAuth callback for each provider | Handles authorization code, creates/links account, issues JWT |
| `/api/auth/social/link` | POST | Link social account | `{ provider, code }` | Links social account to existing user |
| `/api/auth/social/unlink` | POST | Unlink social account | `{ provider }` | Removes social account link from user |

### Frontend Routes and Components

#### Main Application Routes

| Route | Component | Description | Protected | Features |
|-------|-----------|-------------|-----------|----------|
| `/` | `Home` | Landing page | No | Feature showcase, login/register CTAs |
| `/login` | `Login` | User login | No | Email/password form, social login buttons, 2FA support |
| `/register` | `Register` | User registration | No | Registration form with validation, terms acceptance |
| `/forgot-password` | `ForgotPassword` | Password reset request | No | Email form for reset link |
| `/reset-password` | `ResetPassword` | Reset password form | No | New password form, token validation |
| `/verify-email` | `VerifyEmail` | Email verification | No | Verifies email token, shows status |
| `/dashboard` | `Dashboard` | User dashboard | Yes | Overview of user account, recent activity |
| `/profile` | `Profile` | User profile management | Yes | Edit profile details, avatar upload |
| `/settings` | `Settings` | Account settings | Yes | Password change, email change, 2FA setup |
| `/settings/security` | `SecuritySettings` | Security settings | Yes | 2FA, sessions management, account deletion |
| `/settings/sessions` | `Sessions` | Active sessions | Yes | List of active sessions with management |
| `/settings/2fa` | `TwoFactorSetup` | 2FA configuration | Yes | Setup wizard for 2FA |
| `/404` | `NotFound` | 404 page | No | Friendly error page with navigation |

#### Authentication Components

| Component | Description | Props | State Management |
|-----------|-------------|-------|------------------|
| `LoginForm` | Email/password login form | `onSuccess`, `onError` | Form state, validation errors |
| `RegisterForm` | User registration form | `onSuccess`, `onError` | Form state, validation errors |
| `SocialLoginButtons` | Social auth buttons | `onSuccess` | Loading states for each provider |
| `TwoFactorForm` | 2FA verification form | `tempToken`, `onSuccess` | Code input, validation |
| `TwoFactorSetupForm` | 2FA setup wizard | - | Setup steps, QR code, verification |
| `PasswordResetForm` | Password reset form | `token` | Password input, confirmation, strength |
| `EmailVerificationStatus` | Email verification status | `token` | Verification status, messages |
| `SessionTable` | Active sessions list | - | Session data, delete confirmation |
| `ProfileForm` | Profile edit form | `user` | Form state, profile data |

#### Key Frontend API Integration

| Service Function | Endpoint | Purpose | Implementation |
|------------------|----------|---------|----------------|
| `loginUser()` | `/api/auth/login` | User login | Handles credentials, stores token in localStorage/context |
| `registerUser()` | `/api/auth/register` | User registration | Validates and submits registration data |
| `forgotPassword()` | `/api/auth/forgot-password` | Request password reset | Submits email for reset link |
| `resetPassword()` | `/api/auth/reset-password` | Reset password | Validates token, submits new password |
| `verifyEmail()` | `/api/auth/verify-email` | Verify email | Processes email verification token |
| `logoutUser()` | `/api/auth/logout` | Logout | Clears token, context state, redirects to login |
| `getUserProfile()` | `/api/user/profile` | Get profile | Fetches and returns user profile data |
| `updateUserProfile()` | `/api/user/profile` | Update profile | Sends profile updates to server |
| `setupTwoFactor()` | `/api/auth/2fa/setup` | Setup 2FA | Initiates 2FA setup process |
| `verifyTwoFactor()` | `/api/auth/2fa/verify` | Verify 2FA | Completes 2FA setup with verification |

#### Authentication State Management

The frontend implements global authentication state management through React Context:

```typescript
// AuthContext provides:
{
  user: User | null;           // Current user object or null if not authenticated
  token: string | null;        // JWT token for authenticated requests
  isAuthenticated: boolean;    // Whether user is authenticated
  isLoading: boolean;          // Loading state during auth operations
  login: Function;             // Login function
  logout: Function;            // Logout function
  setUser: Function;           // Update user state
  setToken: Function;          // Update token state
}
```

This context is consumed throughout the application to:
- Control access to protected routes
- Display user-specific UI elements
- Make authenticated API requests

## Frontend Components

The frontend provides a complete user interface for authentication flows:

### Page Components

- **Home**: Landing page with feature showcase
- **Login**: User login form with social options and 2FA support
- **Register**: User registration form with terms acceptance
- **ForgotPassword**: Password reset request form
- **ResetPassword**: New password form after reset
- **VerifyEmail**: Email verification page
- **Profile**: User profile management
- **Settings**: Security settings and session management
- **Dashboard**: User dashboard after login
- **NotFound**: 404 page
- **Terms/Privacy/Cookies**: Legal pages

### Auth Components

- **LoginForm**: Email/password login form
- **RegisterForm**: User registration form
- **SocialLogin**: Social login buttons
- **TwoFactorForm**: 2FA verification form
- **TwoFactorSetup**: 2FA setup wizard
- **PasswordResetForm**: Password reset form
- **EmailVerification**: Email verification status
- **SessionList**: Active sessions management

### Layout Components

- **Navbar**: Navigation with auth-aware states
- **Footer**: Site footer with legal links
- **AuthLayout**: Layout for authentication pages
- **DashboardLayout**: Layout for authenticated pages

## Database Integration

The system supports both MongoDB and PostgreSQL databases with a flexible storage interface:

### Database Models

#### User Model
- ID (primary key)
- Email (unique)
- Username (unique)
- Password (hashed)
- First/Last Name
- Profile Picture
- Email Verification Status
- Verification Token
- Reset Token
- Two-Factor Authentication Settings
- Created/Updated Timestamps

#### Social Connection Model
- User ID (foreign key)
- Provider (Google, GitHub, etc.)
- Provider ID
- Provider-specific Data
- Created/Updated Timestamps

#### Session Model
- User ID (foreign key)
- Token
- IP Address
- User Agent
- Location
- Timezone
- Expiration Time
- Created Timestamp

### Storage Interface

The system uses a consistent storage interface (`IStorage`) that abstracts database operations, making it easy to switch between MongoDB and PostgreSQL:

```typescript
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User>;
  deleteUser(id: number): Promise<boolean>;

  // Social connection operations
  getSocialConnection(userId: number, provider: string): Promise<SocialConnection | undefined>;
  getSocialConnectionByProviderId(provider: string, providerId: string): Promise<SocialConnection | undefined>;
  createSocialConnection(connection: InsertSocialConnection): Promise<SocialConnection>;
  deleteSocialConnection(id: number): Promise<boolean>;
  getUserSocialConnections(userId: number): Promise<SocialConnection[]>;

  // Session operations
  getSession(id: number): Promise<Session | undefined>;
  getSessionByToken(token: string): Promise<Session | undefined>;
  getUserSessions(userId: number): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
  deleteSession(id: number): Promise<boolean>;
  deleteUserSessions(userId: number): Promise<boolean>;
}
```

## Security Features

The authentication system implements multiple layers of security:

### Password Security

Passwords are securely hashed using bcrypt with appropriate salt rounds:

```typescript
// server/services/password.ts
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### JWT Implementation

The system uses JWT tokens for secure authentication:

```typescript
// server/services/tokens.ts
export function generateToken(
  payload: TokenPayload,
  expiresIn: string = process.env.JWT_EXPIRES_IN || '30d'
): string {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-production',
    { expiresIn }
  );
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-production'
    ) as TokenPayload;
  } catch (err) {
    return null;
  }
}
```

### Two-Factor Authentication

TOTP-based two-factor authentication is implemented using speakeasy:

```typescript
// From server/routes.ts

// Generate new secret
const secret = speakeasy.generateSecret({
  name: `AuthSystem:${user.email}`,
  length: 20
});

// Verify the token
const verified = speakeasy.totp.verify({
  secret: user.twoFactorSecret,
  encoding: 'base32',
  token: req.body.code,
  window: 1 // Allow 1 time step before and after for clock drift
});
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

## Integrating into Existing Projects

This authentication system is designed to be easily integrated into existing projects. Here's how to add it to your React application:

### Frontend Integration

#### 1. Install Required Dependencies

First, install the necessary dependencies for the authentication system:

```bash
# Core authentication dependencies
npm install jsonwebtoken bcrypt react-hook-form zod @hookform/resolvers

# UI components (if using shadcn/ui)
npm install @radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-checkbox
npm install @radix-ui/react-tabs @radix-ui/react-toast
npm install lucide-react react-icons

# For API requests
npm install @tanstack/react-query
```

#### 2. Copy CSS Styles

Copy the authentication-related CSS from `client/src/index.css` to your project's CSS file:

```css
/* Authentication specific styles */
.auth-layout {
  @apply flex flex-col min-h-screen;
}

.auth-container {
  @apply flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8;
}

.auth-form-container {
  @apply w-full max-w-md mx-auto;
}

.auth-form {
  @apply space-y-6;
}

.auth-header {
  @apply text-center;
}

.auth-divider {
  @apply relative my-6;
}

.auth-divider::before {
  @apply absolute inset-0 flex items-center;
  content: "";
}

.auth-divider::before {
  @apply border-t border-gray-200 w-full;
}

.auth-divider-text {
  @apply relative flex justify-center text-sm;
}

.auth-divider-text span {
  @apply px-2 bg-background text-gray-500;
}

/* Add any additional authentication-related styles here */
```

#### 3. Copy Authentication Components

Copy the following directories to your project:

```
client/src/components/auth/        → src/components/auth/
client/src/contexts/AuthContext.tsx → src/contexts/AuthContext.tsx
client/src/hooks/useAuth.ts         → src/hooks/useAuth.ts
client/src/lib/auth.ts              → src/lib/auth.ts
client/src/lib/queryClient.ts       → src/lib/queryClient.ts
client/src/lib/utils.ts             → src/lib/utils.ts (if not already present)
```

#### 4. Copy Authentication Pages

Copy all authentication-related pages to your project:

```
client/src/pages/login.tsx            → src/pages/login.tsx
client/src/pages/register.tsx         → src/pages/register.tsx
client/src/pages/forgot-password.tsx  → src/pages/forgot-password.tsx
client/src/pages/reset-password.tsx   → src/pages/reset-password.tsx
client/src/pages/verify-email.tsx     → src/pages/verify-email.tsx
client/src/pages/profile.tsx          → src/pages/profile.tsx
client/src/pages/settings.tsx         → src/pages/settings.tsx (optional)
```

#### 5. Set Up QueryClient

In your main application file (`main.tsx` or `index.tsx`):

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
```

#### 6. Set Up Auth Provider

Wrap your application with the AuthProvider in your `App.tsx` file:

```tsx
import { AuthProvider } from './contexts/AuthContext';
import Router from './Router'; // Your existing router component

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
```

#### 7. Configure Router with Auth Routes

Add authentication routes to your router (using React Router or Wouter):

**With React Router:**
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import ForgotPassword from './pages/forgot-password';
import ResetPassword from './pages/reset-password';
import VerifyEmail from './pages/verify-email';
import Profile from './pages/profile';
import Dashboard from './pages/dashboard';
import NotFound from './pages/not-found';
import Terms from './pages/terms';
import Privacy from './pages/privacy';
import Cookies from './pages/cookies';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        
        {/* Legal pages */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<Cookies />} />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
```

**With Wouter:**
```tsx
import { Switch, Route } from 'wouter';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import ForgotPassword from './pages/forgot-password';
import ResetPassword from './pages/reset-password';
import VerifyEmail from './pages/verify-email';
import Profile from './pages/profile';
import Dashboard from './pages/dashboard';
import NotFound from './pages/not-found';
import Terms from './pages/terms';
import Privacy from './pages/privacy';
import Cookies from './pages/cookies';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function Router() {
  return (
    <>
      <Switch>
        {/* Public routes */}
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/verify-email" component={VerifyEmail} />
        
        {/* Legal pages */}
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/cookies" component={Cookies} />
        
        {/* Protected routes */}
        <Route path="/dashboard">
          {() => (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/profile">
          {() => (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          )}
        </Route>
        
        {/* 404 route */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

export default Router;
```

#### 8. Create Protected Route Component

```tsx
// src/components/auth/ProtectedRoute.tsx
import { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom'; // Use appropriate import for your router

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}
```

#### 9. Update Navigation

Add authentication-related links to your navigation component:

```tsx
import { useAuth } from '../hooks/useAuth';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  
  return (
    <nav>
      {/* Site logo and other navigation links */}
      
      <div className="auth-links">
        {isAuthenticated ? (
          <>
            <a href="/profile">Profile</a>
            <a href="/dashboard">Dashboard</a>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </>
        )}
      </div>
    </nav>
  );
}
```

#### 10. Add Footer with Legal Pages

Create a Footer component with links to legal pages:

```tsx
// src/components/layout/Footer.tsx
import { Link } from "wouter"; // or react-router-dom

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-semibold text-white">Your App</span>
            </div>
            <p className="mb-4">Authentication system with multiple login options</p>
          </div>
          
          {/* Quick Links section */}
          <div>
            <h3 className="text-white font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <span className="hover:text-white transition-colors cursor-pointer">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/login">
                  <span className="hover:text-white transition-colors cursor-pointer">Login</span>
                </Link>
              </li>
              <li>
                <Link href="/register">
                  <span className="hover:text-white transition-colors cursor-pointer">Register</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal section */}
          <div>
            <h3 className="text-white font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms">
                  <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/cookies">
                  <span className="hover:text-white transition-colors cursor-pointer">Cookie Policy</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact section */}
          <div>
            <h3 className="text-white font-medium mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@yourapp.com" className="hover:text-white transition-colors">
                  support@yourapp.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright section */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© {currentYear} Your App. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy">
                <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
              </Link>
              <Link href="/terms">
                <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
              </Link>
              <Link href="/cookies">
                <span className="hover:text-white transition-colors cursor-pointer">Cookies</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

Create basic pages for Terms, Privacy Policy, and Cookie Policy:

```tsx
// src/pages/terms.tsx
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

export default function Terms() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2>1. Introduction</h2>
            <p>
              Welcome to Your App. These Terms of Service govern your use of our website and services.
            </p>
            
            {/* Add more content as needed */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

Create similar pages for privacy.tsx and cookies.tsx, then add them to your router as shown earlier.

#### 11. Update Environmental Variables

Create or update your `.env` file with the necessary authentication variables:

```
VITE_API_URL=http://localhost:5000/api
```

### Backend Integration

#### 1. Install Required Backend Dependencies

```bash
npm install express express-session jsonwebtoken bcrypt helmet cors
npm install drizzle-orm drizzle-zod zod mongodb mongoose
npm install nodemailer speakeasy qrcode
```

#### 2. Copy Authentication Server Files

Create the necessary directories and copy these files to your backend:

```
server/middleware/   → your-backend/middleware/
server/services/     → your-backend/services/
shared/schema.ts     → your-backend/shared/schema.ts
shared/types.ts      → your-backend/shared/types.ts
```

#### 3. Set Up Express Server with Authentication

Update your main server file:

```typescript
// server/index.ts
import express, { Express, Request, Response, NextFunction } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import cors from 'cors';
import { registerRoutes } from './routes';
import { storage } from './storage'; // Your storage implementation

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Register auth and API routes
registerRoutes(app);

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    errors: err.errors
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
```

#### 4. Create Authentication Routes

Create or update your routes file:

```typescript
// server/routes.ts
import { Express, Request, Response } from 'express';
import { z } from 'zod';
import * as authService from './services/auth';
import { authenticateJWT, requireFullAuth } from './middleware/auth';
import {
  loginSchema,
  registerUserSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
  profileUpdateSchema,
  emailChangeSchema,
  passwordChangeSchema,
  twoFactorVerifySchema
} from './shared/schema';

export function registerRoutes(app: Express) {
  // Validation middleware
  const validateRequest = (schema: any) => async (req: Request, res: Response, next: Function) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: 'Validation failed',
          errors: error.format()
        });
      } else {
        next(error);
      }
    }
  };

  // Authentication routes
  app.post('/api/auth/register', validateRequest(registerUserSchema), async (req, res, next) => {
    try {
      const result = await authService.registerUser(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/auth/login', validateRequest(loginSchema), async (req, res, next) => {
    try {
      const ipInfo = {
        ip: req.ip,
        userAgent: req.headers['user-agent']
      };
      const result = await authService.loginUser(req.body, ipInfo);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/auth/logout', authenticateJWT, async (req, res, next) => {
    try {
      await authService.logoutUser(req.token!);
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/auth/verify-email', async (req, res, next) => {
    try {
      const token = req.query.token as string;
      const result = await authService.verifyEmail(token);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/auth/forgot-password', validateRequest(passwordResetRequestSchema), async (req, res, next) => {
    try {
      await authService.requestPasswordReset(req.body);
      res.json({ message: 'Password reset instructions sent' });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/auth/reset-password', validateRequest(passwordResetSchema), async (req, res, next) => {
    try {
      const result = await authService.resetPassword(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  // User profile routes (protected)
  app.get('/api/user/profile', authenticateJWT, async (req, res, next) => {
    try {
      const profile = await authService.getUserProfile(req.user!.id);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  });

  app.put('/api/user/profile', authenticateJWT, validateRequest(profileUpdateSchema), async (req, res, next) => {
    try {
      const updatedProfile = await authService.updateUserProfile(req.user!.id, req.body);
      res.json(updatedProfile);
    } catch (error) {
      next(error);
    }
  });

  // Add other authentication routes (2FA, social login, etc.)
  
  return app;
}
```

#### 5. Implement Storage Interface

Choose between memory storage (for development) or a database implementation:

**For MongoDB Storage:**

```typescript
// server/storage-mongodb.ts
import mongoose from 'mongoose';
import { IStorage } from './storage';
import User from './models/User';
import SocialConnection from './models/SocialConnection';
import Session from './models/Session';

export class MongoDBStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const user = await User.findById(id);
    return user ? user.toObject() : undefined;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await User.findOne({ email });
    return user ? user.toObject() : undefined;
  }
  
  // Implement all other methods from IStorage interface...
}

// Initialize MongoDB connection
export async function initMongoDB(uri: string): Promise<MongoDBStorage> {
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
  return new MongoDBStorage();
}
```

#### 6. Create MongoDB Models

Create the Mongoose models for your database:

```typescript
// server/models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationExpires: { type: Date },
  resetToken: { type: String },
  resetExpires: { type: Date },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String },
  profilePicture: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
```

```typescript
// server/models/SocialConnection.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SocialConnectionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: String, required: true }, // 'google', 'github', etc.
  providerId: { type: String, required: true },
  data: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create compound index for userId and provider
SocialConnectionSchema.index({ userId: 1, provider: 1 }, { unique: true });

module.exports = mongoose.model('SocialConnection', SocialConnectionSchema);
```

```typescript
// server/models/Session.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, unique: true },
  ipAddress: { type: String },
  userAgent: { type: String },
  location: { type: String },
  timezone: { type: String },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', SessionSchema);
```

#### 7. Set Up Environment Variables

Create a `.env` file in your backend root:

```
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# JWT Settings
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=30d

# Database
MONGODB_URI=mongodb://localhost:27017/your_database_name

# Email Service (SMTP2GO)
SMTP_HOST=mail.smtp2go.com
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=your-smtp2go-username
SMTP_PASS=your-smtp2go-password
EMAIL_FROM_NAME=Authentication System
EMAIL_FROM_ADDRESS=noreply@yourdomain.com

# Application URL (for email links)
APP_URL=http://localhost:5000

# Session
SESSION_SECRET=your-session-secret-key
```

#### 8. Connect Authentication to Your Existing API

If you already have an API, integrate the authentication middleware:

```typescript
// Existing API route file
import { authenticateJWT, requireFullAuth } from './middleware/auth';

// Public route - no authentication needed
app.get('/api/public-data', (req, res) => {
  res.json({ message: 'This data is public' });
});

// Protected route - requires authentication
app.get('/api/protected-data', authenticateJWT, (req, res) => {
  // Access authenticated user via req.user
  res.json({ 
    message: 'This data is protected',
    userId: req.user.id
  });
});

// Highly sensitive route - requires full authentication (including 2FA if enabled)
app.post('/api/sensitive-action', requireFullAuth, (req, res) => {
  res.json({ message: 'Sensitive action completed' });
});
```

### Testing the Integration

1. Start your backend server:
   ```bash
   npm run server
   ```

2. Start your frontend development server:
   ```bash
   npm run dev
   ```

3. Test the authentication flow:
   - Navigate to `/register` to create a new account
   - Verify your email (check the email or console logs in development)
   - Login with your credentials
   - Test protected routes
   - Test password reset functionality

### Troubleshooting Common Integration Issues

1. **Cross-Origin Resource Sharing (CORS) Issues**:
   - Ensure your backend CORS settings allow requests from your frontend origin
   - Check that credentials are included in CORS configuration

2. **Session/Cookie Issues**:
   - Verify that cookies are being set properly
   - Check that session middleware is configured correctly

3. **Authentication Token Problems**:
   - Ensure JWT_SECRET is properly set in environment variables
   - Verify token expiration times are appropriate

4. **Database Connection Issues**:
   - Check database connection string
   - Verify database models match schema definitions

5. **Email Sending Problems**:
   - Verify SMTP settings
   - Test email service with a simple test email

6. **Missing Dependencies**:
   - Install any missed dependencies
   - Check for version compatibility issues

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