import { createContext, useContext, useState } from 'react';
import { roleProfiles } from '../data/mockData';

import { login as apiLogin } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mentorlink_user');
    if (saved) return JSON.parse(saved);
    return null;
  });

  const login = async (email, password) => {
    try {
      const res = await apiLogin(email, password);
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('mentorlink_user', JSON.stringify(res.data.user));
        return { success: true };
      }
      return { success: false, message: 'Login failed' };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mentorlink_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
