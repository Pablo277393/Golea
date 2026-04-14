import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('golea_token');
    if (token) {
      authService.getMe()
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('golea_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const { token, user } = res.data;
    localStorage.setItem('golea_token', token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('golea_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
