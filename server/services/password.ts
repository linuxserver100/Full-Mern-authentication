import bcrypt from 'bcrypt';

// Number of salt rounds for bcrypt
const SALT_ROUNDS = 10;

/**
 * Hash a password
 * @param password Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plain text password with a hash
 * @param password Plain text password
 * @param hash Hashed password
 * @returns Boolean indicating if password matches
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
