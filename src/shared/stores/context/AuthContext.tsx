"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { AppRoutes } from "../../constants/navigation";

export enum AuthCookies {
  AUTH_TOKEN = "auth_token",
  USER_SESSION = "user_session",
}

export interface User {
  id: string;
  email: string;
  avatar?: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  user: User;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authToken: string | null;
  login: (loginData: LoginData) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updateAvatar: (avatarUrl: string | null) => void;
  updateTokens: (authToken: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const cookieOptions: Cookies.CookieAttributes = {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: 7,
  };

  useEffect(() => {
    try {
      const storedUser = Cookies.get(AuthCookies.USER_SESSION);
      const storedAuthToken = Cookies.get(AuthCookies.AUTH_TOKEN);

      if (storedUser && storedAuthToken) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setAuthToken(storedAuthToken);
      }
    } catch (error) {
      console.error("Error loading user from cookies:", error);
      Cookies.remove(AuthCookies.USER_SESSION);
      Cookies.remove(AuthCookies.AUTH_TOKEN);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (loginData: LoginData) => {
    const { user: userData, token } = loginData;

    try {
      setUser(userData);
      setAuthToken(token);

      Cookies.set(
        AuthCookies.USER_SESSION,
        JSON.stringify(userData),
        cookieOptions
      );
      Cookies.set(AuthCookies.AUTH_TOKEN, token, cookieOptions);
    } catch (error) {
      console.error("Error saving user to cookies:", error);
    }
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);

    Cookies.remove(AuthCookies.USER_SESSION);
    Cookies.remove(AuthCookies.AUTH_TOKEN);
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;

      const updatedUser = { ...prevUser, ...updates };

      try {
        Cookies.set(
          AuthCookies.USER_SESSION,
          JSON.stringify(updatedUser),
          cookieOptions
        );
      } catch (error) {
        console.error("Error updating user cookie:", error);
      }

      return updatedUser;
    });
  };

  const updateAvatar = (avatarUrl: string | null) => {
    updateUser({ avatar: avatarUrl || undefined });
  };

  const updateTokens = (newAuthToken: string) => {
    try {
      setAuthToken(newAuthToken);

      Cookies.set(AuthCookies.AUTH_TOKEN, newAuthToken, cookieOptions);
    } catch (error) {
      console.error("Error updating tokens:", error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user && !!authToken,
    authToken,
    login,
    logout,
    updateUser,
    updateAvatar,
    updateTokens,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}


export function withAuth<T extends object>(Component: React.ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
    const { isAuthenticated, isLoading } = useAuth();
    const { push } = useRouter();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      push(AppRoutes.AUTH);
      return null;
    }

    return <Component {...props} />;
  };
}
