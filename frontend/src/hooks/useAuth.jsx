// src/hooks/useAuth.jsx
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'landlord' or 'tenant'
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      // TODO: Implement actual login logic
      console.log('Login:', credentials);
      
      // Simulate API call
      setTimeout(() => {
        setUser({ id: 1, email: credentials.email, name: 'Test User' });
        setUserType(credentials.userType || 'tenant');
        setLoading(false);
      }, 1000);
      
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      // TODO: Implement actual registration logic
      console.log('Register:', userData);
      
      // Simulate API call
      setTimeout(() => {
        setUser({ id: 1, email: userData.email, name: userData.name });
        setUserType(userData.userType);
        setLoading(false);
      }, 1000);
      
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    userType,
    loading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};