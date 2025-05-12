import { randomBytes } from 'crypto';
import { storage } from '../storage';
import { hashPassword, comparePassword } from './password';
import { generateToken, verifyToken } from './tokens';
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail, sendLoginNotificationEmail } from './email';
import { SocialProvider } from '@shared/types';
import {
  RegisterUser,
  LoginCredentials,
  User,
  PasswordResetRequest,
  PasswordReset,
  EmailChange,
  PasswordChange
} from '@shared/schema';

// Register a new user
export async function registerUser(userData: RegisterUser) {
  // Check if email already exists
  const existingEmail = await storage.getUserByEmail(userData.email);
  if (existingEmail) {
    throw new Error('Email already in use');
  }

  // Check if username already exists
  const existingUsername = await storage.getUserByUsername(userData.username);
  if (existingUsername) {
    throw new Error('Username already in use');
  }

  // Create verification token
  const verificationToken = randomBytes(32).toString('hex');
  const verificationExpires = new Date();
  verificationExpires.setHours(verificationExpires.getHours() + 24); // 24 hours from now

  // Hash password
  const hashedPassword = await hashPassword(userData.password);

  // Create user
  const user = await storage.createUser({
    email: userData.email,
    username: userData.username,
    password: hashedPassword,
    firstName: userData.firstName,
    lastName: userData.lastName,
    isVerified: false,
    verificationToken,
    verificationExpires,
  });

  // Send verification email
  await sendVerificationEmail(user.email, user.verificationToken!);

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    isVerified: user.isVerified,
  };
}

// Login user
export async function loginUser(credentials: LoginCredentials, ipInfo: any = {}) {
  // Find user by email
  const user = await storage.getUserByEmail(credentials.email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check password
  const validPassword = await comparePassword(credentials.password, user.password!);
  if (!validPassword) {
    throw new Error('Invalid credentials');
  }

  // Check if email is verified
  if (!user.isVerified) {
    throw new Error('Please verify your email before logging in');
  }

  // Check if 2FA is enabled
  if (user.twoFactorEnabled) {
    // Generate a temporary token that will be used only for 2FA verification
    const tempToken = generateToken({ 
      userId: user.id, 
      require2FA: true 
    }, '5m'); // Short expiry for security
    
    return {
      requiresTwoFactor: true,
      tempToken,
    };
  }

  // Generate token
  const token = generateToken({ userId: user.id });

  // Create session
  await storage.createSession({
    userId: user.id,
    token,
    ipAddress: ipInfo.ip,
    userAgent: ipInfo.userAgent,
    location: ipInfo.location,
    timezone: ipInfo.timezone,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });

  // Send login notification
  try {
    await sendLoginNotificationEmail(user.email, ipInfo);
  } catch (error) {
    console.error('Failed to send login notification', error);
    // Don't fail the login if notification fails
  }

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      isVerified: user.isVerified,
      twoFactorEnabled: user.twoFactorEnabled,
      profilePicture: user.profilePicture,
    },
  };
}

// Verify email
export async function verifyEmail(token: string) {
  const user = await storage.getUserByVerificationToken(token);
  if (!user) {
    throw new Error('Invalid or expired verification token');
  }

  if (user.verificationExpires && new Date(user.verificationExpires) < new Date()) {
    throw new Error('Verification token has expired');
  }

  // Update user
  await storage.updateUser(user.id, {
    isVerified: true,
    verificationToken: null,
    verificationExpires: null,
  });

  // Send welcome email
  await sendWelcomeEmail(user.email, user.firstName || user.username);

  return {
    success: true,
    message: 'Email verified successfully',
  };
}

// Request password reset
export async function requestPasswordReset({ email }: PasswordResetRequest) {
  const user = await storage.getUserByEmail(email);
  if (!user) {
    // Don't reveal if email exists for security
    return {
      success: true,
      message: 'If your email is registered, you will receive a password reset link',
    };
  }

  // Generate reset token
  const resetToken = randomBytes(32).toString('hex');
  const resetExpires = new Date();
  resetExpires.setHours(resetExpires.getHours() + 1); // 1 hour from now

  // Update user
  await storage.updateUser(user.id, {
    resetPasswordToken: resetToken,
    resetPasswordExpires: resetExpires,
  });

  // Send password reset email
  await sendPasswordResetEmail(user.email, resetToken);

  return {
    success: true,
    message: 'If your email is registered, you will receive a password reset link',
  };
}

// Reset password
export async function resetPassword({ token, password }: PasswordReset) {
  const user = await storage.getUserByResetToken(token);
  if (!user) {
    throw new Error('Invalid or expired reset token');
  }

  // Hash new password
  const hashedPassword = await hashPassword(password);

  // Update user
  await storage.updateUser(user.id, {
    password: hashedPassword,
    resetPasswordToken: null,
    resetPasswordExpires: null,
  });

  return {
    success: true,
    message: 'Password reset successfully',
  };
}

// Change email
export async function changeEmail(userId: number, { newEmail, password }: EmailChange) {
  const user = await storage.getUser(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Verify password
  const validPassword = await comparePassword(password, user.password!);
  if (!validPassword) {
    throw new Error('Invalid password');
  }

  // Check if new email is already in use
  const existingEmail = await storage.getUserByEmail(newEmail);
  if (existingEmail) {
    throw new Error('Email already in use');
  }

  // Create verification token
  const verificationToken = randomBytes(32).toString('hex');
  const verificationExpires = new Date();
  verificationExpires.setHours(verificationExpires.getHours() + 24); // 24 hours from now

  // Update user with new email but not verified yet
  await storage.updateUser(user.id, {
    email: newEmail,
    isVerified: false,
    verificationToken,
    verificationExpires,
  });

  // Send verification email to new email
  await sendVerificationEmail(newEmail, verificationToken);

  return {
    success: true,
    message: 'Email updated. Please verify your new email address',
  };
}

// Change password
export async function changePassword(userId: number, { currentPassword, newPassword }: PasswordChange) {
  const user = await storage.getUser(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Verify current password
  const validPassword = await comparePassword(currentPassword, user.password!);
  if (!validPassword) {
    throw new Error('Current password is incorrect');
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update user
  await storage.updateUser(user.id, {
    password: hashedPassword,
  });

  return {
    success: true,
    message: 'Password changed successfully',
  };
}

// Get user profile
export async function getUserProfile(userId: number) {
  const user = await storage.getUser(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Get social connections
  const connections = await storage.getUserSocialConnections(userId);
  const socialProviders = connections.map(c => c.provider);

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    isVerified: user.isVerified,
    profilePicture: user.profilePicture,
    twoFactorEnabled: user.twoFactorEnabled,
    socialConnections: socialProviders,
  };
}

// Get user sessions
export async function getUserSessions(userId: number) {
  const sessions = await storage.getUserSessions(userId);
  return sessions.map(session => ({
    id: session.id,
    ipAddress: session.ipAddress,
    userAgent: session.userAgent,
    location: session.location,
    timezone: session.timezone,
    createdAt: session.createdAt.toISOString(),
  }));
}

// Logout (revoke session)
export async function logoutUser(token: string) {
  const session = await storage.getSessionByToken(token);
  if (!session) {
    return { success: true }; // Don't error if session not found
  }

  await storage.deleteSession(session.id);
  return { success: true };
}

// Logout from all devices
export async function logoutAllDevices(userId: number) {
  await storage.deleteUserSessions(userId);
  return { success: true };
}

// Social login helper
export async function handleSocialLogin(
  provider: SocialProvider,
  providerId: string, 
  email: string, 
  providerData: any,
  ipInfo: any = {}
) {
  // Check if this social account is already connected to a user
  let connection = await storage.getSocialConnectionByProviderId(provider, providerId);
  let user: User | undefined;

  if (connection) {
    // Get the user associated with this connection
    user = await storage.getUser(connection.userId);
    if (!user) {
      throw new Error('User associated with this social account not found');
    }
  } else {
    // Check if a user with this email already exists
    user = await storage.getUserByEmail(email);
    
    if (user) {
      // Link this social account to the existing user
      await storage.createSocialConnection({
        userId: user.id,
        provider,
        providerId,
        data: providerData,
      });
    } else {
      // Create a new user for this social account
      const username = await generateUniqueUsername(email.split('@')[0]);
      
      user = await storage.createUser({
        email,
        username,
        password: null, // Social login users don't have passwords
        firstName: providerData.firstName || null,
        lastName: providerData.lastName || null,
        isVerified: true, // Social logins are pre-verified
        profilePicture: providerData.profilePicture || null,
      });
      
      // Create social connection
      await storage.createSocialConnection({
        userId: user.id,
        provider,
        providerId,
        data: providerData,
      });
      
      // Send welcome email for new users
      await sendWelcomeEmail(user.email, user.firstName || user.username);
    }
  }

  // Generate token
  const token = generateToken({ userId: user.id });

  // Create session
  await storage.createSession({
    userId: user.id,
    token,
    ipAddress: ipInfo.ip,
    userAgent: ipInfo.userAgent,
    location: ipInfo.location,
    timezone: ipInfo.timezone,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });

  // Send login notification
  try {
    await sendLoginNotificationEmail(user.email, ipInfo);
  } catch (error) {
    console.error('Failed to send login notification', error);
  }

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      isVerified: user.isVerified,
      twoFactorEnabled: user.twoFactorEnabled,
      profilePicture: user.profilePicture,
    },
  };
}

// Helper to generate a unique username
async function generateUniqueUsername(baseUsername: string): Promise<string> {
  let username = baseUsername;
  let counter = 1;
  let isUnique = false;
  
  while (!isUnique) {
    const existing = await storage.getUserByUsername(username);
    if (!existing) {
      isUnique = true;
    } else {
      username = `${baseUsername}${counter}`;
      counter++;
    }
  }
  
  return username;
}
