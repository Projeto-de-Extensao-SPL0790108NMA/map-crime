import * as React from 'react';
import api from './lib/axios';

interface Credentials {
  email: string;
  password: string;
}

interface AuthenticatedUser {
  id: string;
  email: string;
  roles: Array<string>;
}

export interface AuthContext {
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
  user: AuthenticatedUser | null;
}

const AuthContext = React.createContext<AuthContext | null>(null);

const key = 'tanstack.auth.user';

function getStoredUser() {
  const user = localStorage.getItem(key);
  return user ? JSON.parse(user) : null;
}

export function setStoredUser(user: AuthenticatedUser | null) {
  if (user) {
    localStorage.setItem(key, JSON.stringify(user));
  } else {
    localStorage.removeItem(key);
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthenticatedUser | null>(
    getStoredUser(),
  );
  const isAuthenticated = !!user;

  const logout = React.useCallback(() => {
    api.post(
      '/auth/sign-out',
      {},
      {
        withCredentials: true,
      },
    );
    setStoredUser(null);
    setUser(null);
  }, []);

  const login = React.useCallback(async (credentials: Credentials) => {
    const { data } = await api.post(
      '/auth/sign-in/email',
      {
        ...credentials,
      },
      { withCredentials: true },
    );
    setStoredUser(data.user);
    setUser(data.user);
  }, []);

  React.useEffect(() => {
    setUser(getStoredUser());
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function getContext() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
