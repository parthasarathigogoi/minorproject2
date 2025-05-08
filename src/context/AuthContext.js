import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import authApi from '../services/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthState = async () => {
      setLoading(true);
      setAuthError(null);
      try {
        // Check if token exists
        if (authApi.isAuthenticated()) {
          // Get user role from localStorage
          const role = authApi.getUserRole();
          if (role) {
            setIsAuthenticated(true);
            setUserRole(role);

            // Try to fetch user data from API
            try {
              const userData = await authApi.getCurrentUser();
              if (userData) {
                setCurrentUser(userData);
              }
            } catch (err) {
              console.error('Error fetching user data:', err);
              // If API call fails, still keep user authenticated based on token
            }
          } else {
            // No role found, clear authentication
            authApi.logout();
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth state check error:', error);
        setAuthError(error.message || 'Authentication check failed');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await authApi.login(email, password);
      
      // Get user role from the response or localStorage
      const role = authApi.getUserRole();
      
      if (role) {
        setIsAuthenticated(true);
        setUserRole(role);
        
        // If we have user data from response
        if (response.user) {
          setCurrentUser(response.user);
        } else {
          // Attempt to fetch user data
          try {
            const userData = await authApi.getCurrentUser();
            if (userData) {
              setCurrentUser(userData);
            }
          } catch (err) {
            console.error('Error fetching user data after login:', err);
          }
        }
        
        return { success: true, role };
      } else {
        throw new Error('Could not determine user role');
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthError(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setAuthError(null);
    try {
      await authApi.register(userData);
      
      // After registration, log the user in
      return await login(userData.email, userData.password);
    } catch (error) {
      console.error('Registration error:', error);
      setAuthError(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [login]);

  const logout = useCallback(() => {
    authApi.logout();
    setCurrentUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
    setAuthError(null);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    currentUser,
    userRole,
    isAuthenticated,
    loading,
    authError,
    login,
    register,
    logout
  }), [
    currentUser,
    userRole,
    isAuthenticated,
    loading,
    authError,
    login,
    register,
    logout
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
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

export default AuthContext; 