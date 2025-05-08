import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useBranding } from '../../context/BrandingContext';
import { useAuth } from '../../context/AuthContext';

const SignUp = () => {
  const { branding } = useBranding();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when typing after an error
    if (submitAttempted && errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors, submitAttempted]);

  const handleSelectRole = useCallback((role) => {
    setFormData(prev => ({
      ...prev,
      role
    }));
    
    // Clear role error if exists
    if (errors.role) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.role;
        return newErrors;
      });
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/[A-Za-z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain both letters and numbers';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.role) {
      newErrors.role = 'Please select your role';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        // Submit to backend using AuthContext
        const userData = {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role
        };
        
        await register(userData);
        // Redirect will be handled by the AuthContext and PublicRoute
      } catch (error) {
        setErrors({ 
          submit: error.message || 'Registration failed. Please try again.' 
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [formData, register, validateForm]);

  // Memoize role options to prevent re-renders
  const roleOptions = useMemo(() => [
    {
      id: 'student',
      title: 'Student',
      description: 'Join classes, take exams, view grades',
      iconClass: 'student'
    },
    {
      id: 'teacher',
      title: 'Teacher',
      description: 'Create classes, assignments, exams',
      iconClass: 'teacher'
    },
    {
      id: 'admin',
      title: 'Administrator',
      description: 'Manage users, subjects, system settings',
      iconClass: 'admin'
    }
  ], []);

  return (
    <div className="signup-container">
      <div className="branding-header">
        {branding.logo && (
          <img 
            src={branding.logo} 
            alt={`${branding.institutionName} Logo`} 
            className="institution-logo" 
          />
        )}
        <h2>Create Your {branding.institutionName} Account</h2>
      </div>
      
      {errors.submit && (
        <div className="error-message">{errors.submit}</div>
      )}
      
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-section">
          <h3>Select Your Role</h3>
          <div className="role-selector">
            {roleOptions.map(role => (
              <div 
                key={role.id}
                className={`role-option ${formData.role === role.id ? 'selected' : ''}`}
                onClick={() => handleSelectRole(role.id)}
              >
                <div className={`role-icon ${role.iconClass}`}></div>
                <div className="role-title">{role.title}</div>
                <div className="role-description">{role.description}</div>
              </div>
            ))}
          </div>
          {errors.role && <span className="error">{errors.role}</span>}
        </div>
        
        <div className="form-section">
          <h3>Personal Information</h3>
          
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? 'input-error' : ''}
              disabled={isLoading}
            />
            {errors.fullName && <span className="error">{errors.fullName}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
              disabled={isLoading}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
        </div>
        
        <div className="form-section">
          <h3>Create Password</h3>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create password (min. 6 characters)"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
              disabled={isLoading}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'input-error' : ''}
              disabled={isLoading}
            />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
          </div>
        </div>
        
        <button 
          type="submit" 
          className="signup-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
        
        <p className="login-link">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default React.memo(SignUp); 