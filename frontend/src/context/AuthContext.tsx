'use client';

import { createContext, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { authStorage } from '@/lib/auth';
import { User, UserRole } from '@/types/user';

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentToken = authStorage.getToken();
    const currentUser = authStorage.getUser();
    setToken(currentToken);
    setUser(currentUser);
    setLoading(false);
  }, []);

  async function login(input: LoginInput) {
    const { data } = await api.post('/auth/login', input);
    authStorage.setToken(data.accessToken);
    authStorage.setUser(data.user);
    setToken(data.accessToken);
    setUser(data.user);
    return data.user as User;
  }

  async function register(input: RegisterInput) {
    const { data } = await api.post('/auth/register', input);
    authStorage.setToken(data.accessToken);
    authStorage.setUser(data.user);
    setToken(data.accessToken);
    setUser(data.user);
    return data.user as User;
  }

  function logout() {
    authStorage.clearAll();
    setToken(null);
    setUser(null);
  }

  function hasRole(roles: UserRole[]) {
    return !!user && roles.includes(user.role);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!token && !!user,
      login,
      register,
      logout,
      hasRole,
    }),
    [loading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
