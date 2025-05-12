export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    isVerified: boolean;
    twoFactorEnabled: boolean;
    profilePicture?: string;
  };
}

export interface TwoFactorResponse {
  requiresTwoFactor: boolean;
  tempToken?: string;
}

export interface TwoFactorSetupResponse {
  secret: string;
  qrCodeUrl: string;
}

export interface VerificationResponse {
  success: boolean;
  message: string;
}

export interface ProfileResponse {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  isVerified: boolean;
  profilePicture?: string;
  twoFactorEnabled: boolean;
  socialConnections: string[];
}

export interface SessionInfo {
  id: number;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  timezone?: string;
  createdAt: string;
}

export enum SocialProvider {
  GOOGLE = 'google',
  GITHUB = 'github',
  MICROSOFT = 'microsoft',
  LINKEDIN = 'linkedin',
  FACEBOOK = 'facebook',
  APPLE = 'apple',
}
