// Base API URL
const API_BASE_URL = 'http://localhost:5000/api';

// Auth API methods
const authApi = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Login user
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store token and user info in localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Get current user
  getCurrentUser: async () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return null;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get user profile');
      }
      
      return data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },
  
  // Logout user
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
  
  // Get user role
  getUserRole: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      const user = JSON.parse(userStr);
      return user.role;
    } catch (error) {
      console.error('Error parsing user:', error);
      return null;
    }
  }
};

// Mock Auth API for development without backend
const mockAuthApi = {
  register: async (userData) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate validation
    if (!userData.email || !userData.password || !userData.fullName || !userData.role) {
      throw new Error('All fields are required');
    }
    
    // Simulate successful registration
    const mockToken = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('authToken', mockToken);
    localStorage.setItem('user', JSON.stringify({
      id: 'user_' + Date.now(),
      fullName: userData.fullName,
      email: userData.email,
      role: userData.role
    }));
    
    return { token: mockToken };
  },
  
  login: async (email, password) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock user validation
    if (email === 'student@example.com' && password === 'student123') {
      const user = {
        id: 'student_1',
        fullName: 'Alex Johnson',
        email: 'student@example.com',
        role: 'student'
      };
      const mockToken = 'mock-jwt-token-student';
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('user', JSON.stringify(user));
      return { token: mockToken, user };
    } else if (email === 'teacher@example.com' && password === 'teacher123') {
      const user = {
        id: 'teacher_1',
        fullName: 'Prof. Sarah Johnson',
        email: 'teacher@example.com',
        role: 'teacher'
      };
      const mockToken = 'mock-jwt-token-teacher';
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('user', JSON.stringify(user));
      return { token: mockToken, user };
    } else if (email === 'admin@example.com' && password === 'admin123') {
      const user = {
        id: 'admin_1',
        fullName: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
      };
      const mockToken = 'mock-jwt-token-admin';
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('user', JSON.stringify(user));
      return { token: mockToken, user };
    } else {
      throw new Error('Invalid credentials');
    }
  },
  
  getCurrentUser: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    return JSON.parse(userStr);
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
  
  getUserRole: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      const user = JSON.parse(userStr);
      return user.role;
    } catch (error) {
      console.error('Error parsing user:', error);
      return null;
    }
  }
};

// Export either the real API or the mock API based on environment
export default process.env.REACT_APP_USE_MOCK_API === 'true' 
  ? mockAuthApi 
  : authApi; 