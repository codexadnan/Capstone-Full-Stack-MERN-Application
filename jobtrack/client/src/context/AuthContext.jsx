import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { fetchCurrentUser, loginUser, logoutUser, registerUser } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking the session
  const [sessionExpired, setSessionExpired] = useState(false);

  // Restores the session on page refresh (the cookie is sent automatically)
  const getCurrentUser = useCallback(async () => {
    try {
      const { data } = await fetchCurrentUser();
      setUser(data.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  // Fired by the Axios interceptor when a protected call returns 401
  useEffect(() => {
    const handleExpired = () => {
      setUser((current) => {
        if (current) setSessionExpired(true);
        return null;
      });
    };
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  const register = async (formData) => {
    const { data } = await registerUser(formData);
    setSessionExpired(false);
    setUser(data.data.user);
  };

  const login = async (formData) => {
    const { data } = await loginUser(formData);
    setSessionExpired(false);
    setUser(data.data.user);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      sessionExpired,
      register,
      login,
      logout,
      getCurrentUser,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, loading, sessionExpired, getCurrentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
