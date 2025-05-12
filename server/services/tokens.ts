import jwt from 'jsonwebtoken';

// Set a default secret for development
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-development-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

// Interface for JWT payload
interface TokenPayload {
  userId: number;
  require2FA?: boolean;
  [key: string]: any;
}

/**
 * Generate a JWT token
 * @param payload The data to include in the token
 * @param expiresIn How long the token should be valid (defaults to JWT_EXPIRES_IN env var)
 * @returns JWT token string
 */
export function generateToken(
  payload: TokenPayload,
  expiresIn: string = JWT_EXPIRES_IN
): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify and decode a JWT token
 * @param token The JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}
