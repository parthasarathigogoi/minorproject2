import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBranding } from '../../context/BrandingContext';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { branding } = useBranding();
  const { login, authError } = useAuth();
  
  const [credentials, setCredentials] = useState({ 
    email: '', 
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Update error from context if available
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const validateForm = useCallback(() => {
    const errors = {};
    
    if (!credentials.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      errors.email = 'Email address is invalid';
    }
    
    if (!credentials.password) {
      errors.password = 'Password is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [credentials]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field when typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [validationErrors]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Reset error messages
    setError('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { email, password } = credentials;
      await login(email, password);
      // Redirect will be handled by the AuthContext and ProtectedRoute
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  }, [credentials, login, validateForm]);

  const setDemoCredentials = useCallback((role) => {
    const demoAccounts = {
      student: { email: 'student@example.com', password: 'student123' },
      teacher: { email: 'teacher@example.com', password: 'teacher123' },
      admin: { email: 'admin@example.com', password: 'admin123' }
    };
    
    if (demoAccounts[role]) {
      setCredentials(demoAccounts[role]);
      // Clear any validation errors
      setValidationErrors({});
    }
  }, []);

  return (
    <div className="login-container">
      <div className="branding-header">
        {branding.logo && (
          <img 
            src={branding.logo} 
            alt={`${branding.institutionName} Logo`} 
            className="institution-logo" 
          />
        )}
        <h2>Welcome to {branding.institutionName}</h2>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className={validationErrors.email ? 'input-error' : ''}
            required
          />
          {validationErrors.email && (
            <span className="field-error">{validationErrors.email}</span>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className={validationErrors.password ? 'input-error' : ''}
            required
          />
          {validationErrors.password && (
            <span className="field-error">{validationErrors.password}</span>
          )}
        </div>
        
        <button 
          type="submit" 
          className="login-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
        
        {/* Quick login options for demo purposes */}
        {process.env.NODE_ENV !== 'production' && (
          <div className="demo-logins">
            <p className="demo-note">Demo Accounts:</p>
            <div className="demo-buttons">
              <button
                type="button"
                className="demo-btn student"
                onClick={() => setDemoCredentials('student')}
              >
                Student Demo
              </button>
              <button
                type="button"
                className="demo-btn teacher"
                onClick={() => setDemoCredentials('teacher')}
              >
                Teacher Demo
              </button>
              <button
                type="button"
                className="demo-btn admin"
                onClick={() => setDemoCredentials('admin')}
              >
                Admin Demo
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default React.memo(Login); 