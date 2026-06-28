import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api } from '../lib/api';
import type { User } from '../types';

type AuthContextValue = {
  token: string | null;
  user: User | null;
  isReady: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedToken = window.localStorage.getItem('nebula.platform.token');
    if (!storedToken) {
      setIsReady(true);
      return;
    }
    api
      .me(storedToken)
      .then(nextUser => {
        setToken(storedToken);
        setUser(nextUser);
      })
      .catch(() => {
        window.localStorage.removeItem('nebula.platform.token');
      })
      .finally(() => setIsReady(true));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isReady,
      login(nextToken, nextUser) {
        window.localStorage.setItem('nebula.platform.token', nextToken);
        setToken(nextToken);
        setUser(nextUser);
      },
      logout() {
        window.localStorage.removeItem('nebula.platform.token');
        setToken(null);
        setUser(null);
      },
    }),
    [token, user, isReady],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
