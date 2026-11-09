import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '../api/axios';

export type AuthUser = { userId: string; email: string; role: 'ADMIN' | 'USER'; status: string };
type AuthState = { user: AuthUser | null; loading: boolean; setSession: (token: string, user: AuthUser) => void; logout: () => Promise<void> };
const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get('/auth/me').then((r) => setUser(r.data.user)).catch(() => sessionStorage.removeItem('gmail_ai_access_token')).finally(() => setLoading(false)); }, []);
  const setSession = (token: string, nextUser: AuthUser) => { sessionStorage.setItem('gmail_ai_access_token', token); setUser(nextUser); };
  const logout = async () => { try { await apiClient.post('/auth/logout'); } finally { sessionStorage.removeItem('gmail_ai_access_token'); setUser(null); } };
  return <AuthContext.Provider value={{ user, loading, setSession, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used inside AuthProvider'); return value; }
