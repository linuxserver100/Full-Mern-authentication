import { createContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { AuthResponse, ErrorResponse, ProfileResponse } from "@shared/types";
import { LoginCredentials } from "@shared/schema";

interface User {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<any>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({}),
  logout: () => {},
  setUser: () => {},
  setToken: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("auth_token"));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Effect to fetch user profile on initial load if token exists
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        try {
          const response = await fetch('/api/user/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
          });
          
          if (response.ok) {
            const userData: ProfileResponse = await response.json();
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem("auth_token");
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          localStorage.removeItem("auth_token");
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      
      setIsLoading(false);
    };

    fetchUserProfile();
  }, [token]);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<any> => {
    try {
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      const data = await response.json();
      
      // Check if 2FA is required
      if (data.requiresTwoFactor && data.tempToken) {
        return {
          requiresTwoFactor: true,
          tempToken: data.tempToken
        };
      }
      
      // Normal login success
      const { token: authToken, user: userData } = data as AuthResponse;
      
      // Store token in localStorage
      localStorage.setItem("auth_token", authToken);
      
      // Update context state
      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      // Redirect to dashboard
      setLocation("/dashboard");
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (token) {
        await apiRequest("POST", "/api/auth/logout", undefined);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage and state regardless of API success
      localStorage.removeItem("auth_token");
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setLocation("/login");
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setUser,
    setToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
