// Base API URL
const API_BASE_URL = 'http://localhost:5000/api';

// Mock user database to store registered users
let mockUsers = [
  {
    id: 'student_1',
    fullName: 'Alex Johnson',
    email: 'student@example.com',
    password: 'student123',
    role: 'student'
  },
  {
    id: 'teacher_1',
    fullName: 'Prof. Sarah Johnson',
    email: 'teacher@example.com',
    password: 'teacher123',
    role: 'teacher'
  },
  {
    id: 'admin_1',
    fullName: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  }
];

// Try to load any previously registered mock users from localStorage
try {
  const storedUsers = localStorage.getItem('mockUsers');
  if (storedUsers) {
    const parsedUsers = JSON.parse(storedUsers);
    if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
      mockUsers = parsedUsers;
    }
  }
} catch (error) {
  console.error('Error loading mock users:', error);
}

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
    
    // Check if user already exists
    const existingUser = mockUsers.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser = {
      id: 'user_' + Date.now(),
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      role: userData.role
    };
    
    // Add to mock database
    mockUsers.push(newUser);
    
    // Save updated users to localStorage
    localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
    
    // Simulate successful registration
    const mockToken = 'mock-jwt-token-' + Date.now();
    
    // Store user data without password
    const userToStore = { ...newUser };
    delete userToStore.password;
    
    localStorage.setItem('authToken', mockToken);
    localStorage.setItem('user', JSON.stringify(userToStore));
    
    return { token: mockToken, user: userToStore };
  },
  
  login: async (email, password) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find user in mock database
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Create a copy without the password
      const userToReturn = { ...user };
      delete userToReturn.password;
      
      const mockToken = 'mock-jwt-token-' + user.id;
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('user', JSON.stringify(userToReturn));
      
      return { token: mockToken, user: userToReturn };
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