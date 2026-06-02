import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from local storage on load
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
          setToken('cookie-auth');
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to parse auth data", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Generic Login Function
  const login = async (email, password, role = 'user') => {
    try {
      const response = await api.post('/auth/login', { email, password, role });
      
      const userData = response.data;
      
      localStorage.setItem('token', 'cookie-auth');
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken('cookie-auth');
      setUser(userData);
      
      toast.success('Login successful!');
      return userData;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  // User Registration
  const registerUser = async (userData) => {
    try {
      await api.post('/auth/register/user', userData);
      toast.success('Registration successful! Please verify your email.');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  // Admin Registration
  const registerAdmin = async (adminData) => {
    try {
      await api.post('/auth/register/admin', adminData);
      toast.success('Registration successful! Please verify your email.');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
    
    // Hard redirect to clear state and ensure redirect
    window.location.href = '/login';
  };

  const updateContextUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  };


  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated: !!token, 
      login, 
      registerUser, 
      registerAdmin,
      logout,
      updateContextUser,
      role: user?.role,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
