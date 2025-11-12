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

const userKey = 'tanstack.auth.user';
const accessTokenKey = 'tanstack.auth.access_token';
const refreshTokenKey = 'tanstack.auth.refresh_token';

function getStoredUser() {
  const user = localStorage.getItem(userKey);
  return user ? JSON.parse(user) : null;
}

export function setStoredUser(user: AuthenticatedUser | null) {
  if (user) {
    localStorage.setItem(userKey, JSON.stringify(user));
  } else {
    localStorage.removeItem(userKey);
  }
}

export function setStoredTokens(
  accessToken: string | null,
  refreshToken: string | null,
) {
  if (accessToken) {
    localStorage.setItem(accessTokenKey, accessToken);
  } else {
    localStorage.removeItem(accessTokenKey);
  }

  if (refreshToken) {
    localStorage.setItem(refreshTokenKey, refreshToken);
  } else {
    localStorage.removeItem(refreshTokenKey);
  }
}

export function getAccessToken() {
  return localStorage.getItem(accessTokenKey);
}

export function getRefreshToken() {
  return localStorage.getItem(refreshTokenKey);
}

export function Provider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthenticatedUser | null>(
    getStoredUser(),
  );
  const isAuthenticated = !!user;

  const logout = React.useCallback(() => {
    if (isAuthenticated) {
      api.post('/accounts/logout/').catch(() => {});
    }

    setStoredUser(null);
    setStoredTokens(null, null);
    setUser(null);
  }, []);

  const login = React.useCallback(async (credentials: Credentials) => {
    const { data } = await api.post('/auth/token/', credentials, {
      headers: { 'X-Without-Auth': 'true' },
    });

    setStoredTokens(data.access, data.refresh);
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
