import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const AdminAuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  error: null,
});

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Auth verification failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [router.pathname]);

  useEffect(() => {
    // Protection redirect logic
    if (!loading) {
      const isAdminRoute = router.pathname.startsWith('/admin');
      const isLoginRoute = router.pathname === '/admin/login';

      if (isAdminRoute && !isLoginRoute && !user) {
        router.replace('/admin/login');
      } else if (isLoginRoute && user) {
        router.replace('/admin');
      }
    }
  }, [user, loading, router.pathname]);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        router.push('/admin');
        return { success: true };
      } else {
        const errMsg = data.error || 'Invalid credentials';
        setError(errMsg);
        return { success: false, error: errMsg };
      }
    } catch (err) {
      setError('Connection error, please try again.');
      return { success: false, error: 'Connection error' };
    }
  };

  const logout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setUser(null);
        router.push('/admin/login');
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ user, loading, login, logout, error }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
export default AdminAuthContext;
