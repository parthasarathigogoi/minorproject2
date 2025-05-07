import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useBranding } from '../../context/BrandingContext';

const SignUp = () => {
  const { branding } = useBranding();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    authCode: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
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
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.role === 'teacher' && !formData.authCode) {
      newErrors.authCode = 'Authorization code is required for teachers';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, submit
      console.log('Form submitted successfully', formData);
      setIsSubmitted(true);
      setErrors({});
    } else {
      // Form has errors
      setErrors(validationErrors);
    }
  };

  if (isSubmitted) {
    // Redirect to login page after successful signup
    return <Navigate to="/" />;
  }

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
      <form onSubmit={handleSubmit}>
        <div className="role-selector">
          <button 
            type="button" 
            className={formData.role === 'student' ? 'active' : ''} 
            onClick={() => setFormData({...formData, role: 'student'})}
          >
            Student
          </button>
          <button 
            type="button" 
            className={formData.role === 'teacher' ? 'active' : ''} 
            onClick={() => setFormData({...formData, role: 'teacher'})}
          >
            Teacher
          </button>
        </div>
        
        <div className="form-group">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <span className="error">{errors.fullName}</span>}
        </div>
        
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        
        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </div>
        
        {formData.role === 'teacher' && (
          <div className="form-group">
            <input
              type="text"
              name="authCode"
              placeholder="Teacher Authorization Code"
              value={formData.authCode}
              onChange={handleChange}
            />
            {errors.authCode && <span className="error">{errors.authCode}</span>}
            <p className="auth-note">
              * Teachers must use an authorization code provided by the administrator
            </p>
          </div>
        )}
        
        <button type="submit" className="signup-btn">Create Account</button>
        <p>Already have an account? <Link to="/">Login</Link></p>
      </form>
    </div>
  );
};

export default SignUp; 