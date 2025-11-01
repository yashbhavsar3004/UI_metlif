import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  // role: null | 'customer' | 'admin'
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null); // { name, email }

  // login expects an object: { role: 'customer'|'admin', user: { name, email } }
  const login = ({ role: newRole, user: newUser }) => {
    setRole(newRole);
    setUser(newUser || null);
  };

  const logout = () => {
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ role, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
