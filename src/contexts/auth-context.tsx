import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { AuthUser } from '../api/auth';
import * as authApi from '../api/auth';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (cpf: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const u = await authApi.me();
      const allowed = ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(u.role);
      if (!allowed) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
      } else {
        setUser(u);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(
    async (cpf: string, password: string) => {
      const res = await authApi.login(cpf, password);
      const allowed = ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(res.user.role);
      if (!allowed) {
        throw new Error('Acesso negado. Apenas SUPER_ADMIN, ADMIN ou MANAGER podem usar este painel.');
      }
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      setUser(res.user);
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
