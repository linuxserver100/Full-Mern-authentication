import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/tokens';
import { storage } from '../storage';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        require2FA?: boolean;
      };
      token?: string;
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  // Get token from header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // Verify token
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  // Attach user and token to request
  req.user = {
    id: payload.userId,
    require2FA: payload.require2FA,
  };
  req.token = token;
  
  next();
}

/**
 * Middleware to ensure user is fully authenticated (including 2FA if enabled)
 */
export function requireFullAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.require2FA) {
    return res.status(403).json({ 
      message: 'Two-factor authentication required',
      requiresTwoFactor: true
    });
  }

  next();
}

/**
 * Middleware to ensure session is valid
 */
export async function validateSession(req: Request, res: Response, next: NextFunction) {
  if (!req.user || !req.token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // Check if session exists
  const session = await storage.getSessionByToken(req.token);
  if (!session) {
    return res.status(401).json({ message: 'Session expired or invalid' });
  }

  next();
}

/**
 * Middleware to get client IP and info for security tracking
 */
export function trackClientInfo(req: Request, res: Response, next: NextFunction) {
  // Get client IP
  const ip = req.ip || 
             req.headers['x-forwarded-for'] || 
             req.socket.remoteAddress || 
             'unknown';
  
  // Get user agent
  const userAgent = req.headers['user-agent'] || 'unknown';
  
  // Attach to request
  req.clientInfo = {
    ip: typeof ip === 'string' ? ip : Array.isArray(ip) ? ip[0] : 'unknown',
    userAgent,
    // Location and timezone would normally come from a geolocation service
    location: 'Unknown', 
    timezone: 'Unknown'
  };
  
  next();
}

// Also extend Request to include clientInfo
declare global {
  namespace Express {
    interface Request {
      clientInfo?: {
        ip: string;
        userAgent: string;
        location: string;
        timezone: string;
      };
    }
  }
}
