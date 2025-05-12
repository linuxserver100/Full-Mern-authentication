import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
// Import the PostgreSQL storage as fallback
import { storage as pgStorage } from "./storage";
// Import the MongoDB storage as primary
import { mongoDBStorage } from "./mongodb-storage";

// Use MongoDB storage if available, otherwise fallback to PostgreSQL
const storage = process.env.USE_MONGODB === "true" ? mongoDBStorage : pgStorage;
import { 
  registerUserSchema, 
  loginSchema, 
  passwordResetRequestSchema,
  passwordResetSchema,
  profileUpdateSchema,
  emailChangeSchema,
  passwordChangeSchema,
  twoFactorSetupSchema,
  twoFactorVerifySchema
} from "@shared/schema";
import { authenticateJWT, requireFullAuth, validateSession, trackClientInfo } from "./middleware/auth";
import { 
  registerUser, 
  loginUser, 
  verifyEmail, 
  requestPasswordReset, 
  resetPassword,
  getUserProfile,
  getUserSessions,
  changeEmail,
  changePassword,
  logoutUser,
  logoutAllDevices
} from "./services/auth";
import { verifyToken } from "./services/tokens";
import { ZodError } from "zod";
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper function to handle validation errors
  const validateRequest = (schema: any) => async (req: Request, res: Response, next: Function) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string[]> = {};
        error.errors.forEach(err => {
          const path = err.path.join('.');
          if (!formattedErrors[path]) {
            formattedErrors[path] = [];
          }
          formattedErrors[path].push(err.message);
        });
        
        return res.status(400).json({
          message: 'Validation failed',
          errors: formattedErrors
        });
      }
      return res.status(400).json({ message: 'Invalid request data' });
    }
  };
  
  // Add client tracking middleware to all routes
  app.use(trackClientInfo);

  // ==== Auth Routes ====
  
  // Register a new user
  app.post('/api/auth/register', validateRequest(registerUserSchema), async (req, res) => {
    try {
      const result = await registerUser(req.body);
      res.status(201).json({
        message: 'Registration successful. Please check your email to verify your account.',
        user: result
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Login user
  app.post('/api/auth/login', validateRequest(loginSchema), async (req, res) => {
    try {
      const result = await loginUser(req.body, req.clientInfo);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  });

  // Verify email
  app.get('/api/auth/verify-email', async (req, res) => {
    try {
      const token = req.query.token as string;
      if (!token) {
        return res.status(400).json({ message: 'Verification token is required' });
      }
      
      const result = await verifyEmail(token);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Request password reset
  app.post('/api/auth/forgot-password', validateRequest(passwordResetRequestSchema), async (req, res) => {
    try {
      const result = await requestPasswordReset(req.body);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Reset password
  app.post('/api/auth/reset-password', validateRequest(passwordResetSchema), async (req, res) => {
    try {
      const result = await resetPassword(req.body);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Logout (revoke session)
  app.post('/api/auth/logout', authenticateJWT, async (req, res) => {
    try {
      if (!req.token) {
        return res.status(400).json({ message: 'No active session' });
      }
      
      const result = await logoutUser(req.token);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Logout from all devices
  app.post('/api/auth/logout-all', authenticateJWT, requireFullAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const result = await logoutAllDevices(req.user.id);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==== Two-Factor Authentication Routes ====

  // Setup 2FA
  app.post('/api/auth/2fa/setup', authenticateJWT, requireFullAuth, validateSession, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Generate new secret
      const secret = speakeasy.generateSecret({
        name: `AuthSystem:${user.email}`,
        length: 20
      });
      
      // Store the secret temporarily
      await storage.updateUser(user.id, {
        twoFactorSecret: secret.base32,
      });
      
      // Generate QR code
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || '');
      
      res.json({
        secret: secret.base32,
        qrCodeUrl
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Verify and enable 2FA
  app.post('/api/auth/2fa/verify', authenticateJWT, requireFullAuth, validateSession, validateRequest(twoFactorVerifySchema), async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const user = await storage.getUser(req.user.id);
      if (!user || !user.twoFactorSecret) {
        return res.status(400).json({ message: '2FA setup not initiated' });
      }
      
      // Verify the token
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: req.body.code,
        window: 1 // Allow 1 time step before and after for clock drift
      });
      
      if (!verified) {
        return res.status(400).json({ message: 'Invalid verification code' });
      }
      
      // Enable 2FA
      await storage.updateUser(user.id, {
        twoFactorEnabled: true
      });
      
      res.json({
        success: true,
        message: 'Two-factor authentication enabled successfully'
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Disable 2FA
  app.post('/api/auth/2fa/disable', authenticateJWT, requireFullAuth, validateSession, validateRequest(twoFactorVerifySchema), async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const user = await storage.getUser(req.user.id);
      if (!user || !user.twoFactorSecret || !user.twoFactorEnabled) {
        return res.status(400).json({ message: '2FA is not enabled' });
      }
      
      // Verify the token
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: req.body.code,
        window: 1
      });
      
      if (!verified) {
        return res.status(400).json({ message: 'Invalid verification code' });
      }
      
      // Disable 2FA
      await storage.updateUser(user.id, {
        twoFactorEnabled: false,
        twoFactorSecret: null
      });
      
      res.json({
        success: true,
        message: 'Two-factor authentication disabled successfully'
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Validate 2FA code for login
  app.post('/api/auth/2fa/validate', validateRequest(twoFactorVerifySchema), async (req, res) => {
    try {
      const tempToken = req.headers.authorization?.split(' ')[1];
      if (!tempToken) {
        return res.status(401).json({ message: 'Temporary token required' });
      }
      
      // Verify the temp token
      const payload = verifyToken(tempToken);
      if (!payload || !payload.userId || !payload.require2FA) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
      
      const user = await storage.getUser(payload.userId);
      if (!user || !user.twoFactorSecret || !user.twoFactorEnabled) {
        return res.status(400).json({ message: '2FA is not enabled for this user' });
      }
      
      // Verify the token
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: req.body.code,
        window: 1
      });
      
      if (!verified) {
        return res.status(400).json({ message: 'Invalid verification code' });
      }
      
      // Generate full token without 2FA requirement
      const fullToken = require('./services/tokens').generateToken({ userId: user.id });
      
      // Create session
      await storage.createSession({
        userId: user.id,
        token: fullToken,
        ipAddress: req.clientInfo?.ip,
        userAgent: req.clientInfo?.userAgent,
        location: req.clientInfo?.location,
        timezone: req.clientInfo?.timezone,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });
      
      res.json({
        token: fullToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: user.isVerified,
          twoFactorEnabled: user.twoFactorEnabled,
          profilePicture: user.profilePicture,
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==== User Profile Routes ====

  // Get user profile
  app.get('/api/user/profile', authenticateJWT, requireFullAuth, validateSession, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const profile = await getUserProfile(req.user.id);
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update user profile
  app.patch('/api/user/profile', authenticateJWT, requireFullAuth, validateSession, validateRequest(profileUpdateSchema), async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      // Check if username is being updated and if it's unique
      if (req.body.username) {
        const existingUser = await storage.getUserByUsername(req.body.username);
        if (existingUser && existingUser.id !== req.user.id) {
          return res.status(400).json({ message: 'Username is already taken' });
        }
      }
      
      // Update the user
      const updatedUser = await storage.updateUser(req.user.id, req.body);
      
      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          username: updatedUser.username,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          profilePicture: updatedUser.profilePicture,
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Change email
  app.post('/api/user/email', authenticateJWT, requireFullAuth, validateSession, validateRequest(emailChangeSchema), async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const result = await changeEmail(req.user.id, req.body);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Change password
  app.post('/api/user/password', authenticateJWT, requireFullAuth, validateSession, validateRequest(passwordChangeSchema), async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const result = await changePassword(req.user.id, req.body);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get active sessions
  app.get('/api/user/sessions', authenticateJWT, requireFullAuth, validateSession, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const sessions = await getUserSessions(req.user.id);
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==== Social Auth Routes ====
  
  // Note: These routes would typically use Passport.js strategies.
  // For simplicity, we are just providing the endpoints that would be set up.
  
  // Google OAuth routes
  app.get('/api/auth/google', (req, res) => {
    // This would normally redirect to Google OAuth consent screen
    res.status(501).json({ message: 'Google OAuth not implemented in this demo' });
  });
  
  app.get('/api/auth/google/callback', (req, res) => {
    // This would normally handle the OAuth callback
    res.status(501).json({ message: 'Google OAuth callback not implemented in this demo' });
  });
  
  // GitHub OAuth routes
  app.get('/api/auth/github', (req, res) => {
    res.status(501).json({ message: 'GitHub OAuth not implemented in this demo' });
  });
  
  app.get('/api/auth/github/callback', (req, res) => {
    res.status(501).json({ message: 'GitHub OAuth callback not implemented in this demo' });
  });
  
  // Microsoft OAuth routes
  app.get('/api/auth/microsoft', (req, res) => {
    res.status(501).json({ message: 'Microsoft OAuth not implemented in this demo' });
  });
  
  app.get('/api/auth/microsoft/callback', (req, res) => {
    res.status(501).json({ message: 'Microsoft OAuth callback not implemented in this demo' });
  });
  
  // LinkedIn OAuth routes
  app.get('/api/auth/linkedin', (req, res) => {
    res.status(501).json({ message: 'LinkedIn OAuth not implemented in this demo' });
  });
  
  app.get('/api/auth/linkedin/callback', (req, res) => {
    res.status(501).json({ message: 'LinkedIn OAuth callback not implemented in this demo' });
  });
  
  // Facebook OAuth routes
  app.get('/api/auth/facebook', (req, res) => {
    res.status(501).json({ message: 'Facebook OAuth not implemented in this demo' });
  });
  
  app.get('/api/auth/facebook/callback', (req, res) => {
    res.status(501).json({ message: 'Facebook OAuth callback not implemented in this demo' });
  });
  
  // Apple OAuth routes
  app.get('/api/auth/apple', (req, res) => {
    res.status(501).json({ message: 'Apple OAuth not implemented in this demo' });
  });
  
  app.get('/api/auth/apple/callback', (req, res) => {
    res.status(501).json({ message: 'Apple OAuth callback not implemented in this demo' });
  });

  const httpServer = createServer(app);
  return httpServer;
}
