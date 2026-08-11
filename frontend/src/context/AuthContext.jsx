import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TOKEN_KEY, USER_KEY, registerUnauthorizedHandler } from '../api/axiosClient';

const AuthContext = createContext(null);

// NOTE on storage: the backend returns the JWT in the JSON response body rather than an
// httpOnly cookie, so the only place an SPA can keep it is browser storage. localStorage is
// used here (persists across tabs/refreshes). This is the standard approach for a bearer-token
// API, but it's worth knowing it's readable by any JS on the page - if this app grows to handle
// more sensitive data, switching the backend to set an httpOnly cookie would be the harder-to-
// intercept option. That's a backend change, not something the frontend can opt into alone.
function readStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const navigate = useNavigate();

  const logout = useCallback(
    (message) => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
      setToken(null);
      navigate('/login', message ? { state: { flashMessage: message } } : undefined);
    },
    [navigate]
  );

  // Wired to the axios 401 interceptor so an expired/invalid token anywhere in the app
  // triggers the same clean logout + redirect (requirement #14).
  useEffect(() => {
    registerUnauthorizedHandler(() => logout('Your session has expired. Please log in again.'));
  }, [logout]);

  const login = useCallback((loginResponseData) => {
    const { token: jwt, ...userInfo } = loginResponseData;
    localStorage.setItem(TOKEN_KEY, jwt);
    localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
    setToken(jwt);
    setUser(userInfo);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
