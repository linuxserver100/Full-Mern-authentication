import { apiRequest } from "./queryClient";
import { LoginCredentials, RegisterUser, PasswordResetRequest, PasswordReset } from "@shared/schema";

export async function loginUser(credentials: LoginCredentials) {
  try {
    const response = await apiRequest("POST", "/api/auth/login", credentials);
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function registerUser(userData: RegisterUser) {
  try {
    const response = await apiRequest("POST", "/api/auth/register", userData);
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function forgotPassword(data: PasswordResetRequest) {
  try {
    const response = await apiRequest("POST", "/api/auth/forgot-password", data);
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function resetPassword(data: PasswordReset) {
  try {
    const response = await apiRequest("POST", "/api/auth/reset-password", data);
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function verifyEmail(token: string) {
  try {
    const response = await apiRequest("GET", `/api/auth/verify-email?token=${token}`, undefined);
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function logoutUser() {
  try {
    const response = await apiRequest("POST", "/api/auth/logout", undefined);
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function getUserProfile() {
  try {
    const response = await apiRequest("GET", "/api/user/profile", undefined);
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function validateTwoFactorCode(code: string, tempToken: string) {
  try {
    const response = await fetch('/api/auth/2fa/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tempToken}`
      },
      body: JSON.stringify({ code }),
      credentials: 'include'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to validate 2FA code');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function setupTwoFactor() {
  try {
    const response = await apiRequest("POST", "/api/auth/2fa/setup", undefined);
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function verifyTwoFactor(code: string) {
  try {
    const response = await apiRequest("POST", "/api/auth/2fa/verify", { code });
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function disableTwoFactor(code: string) {
  try {
    const response = await apiRequest("POST", "/api/auth/2fa/disable", { code });
    return await response.json();
  } catch (error) {
    throw error;
  }
}
