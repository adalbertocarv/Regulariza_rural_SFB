import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminApi } from '../lib/api';

interface Usuario {
  id: number;
  email: string;
  nome: string | null;
}

interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('rr_admin_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('rr_admin_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await adminApi.getMe();
        setUser(me);
        setToken(storedToken);
      } catch {
        localStorage.removeItem('rr_admin_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    validateToken();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await adminApi.login(email, password);
    localStorage.setItem('rr_admin_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('rr_admin_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
