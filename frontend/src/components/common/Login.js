import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useBranding } from '../../context/BrandingContext';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const { branding } = useBranding();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ 
    email: '', 
    password: '',
    authCode: ''
  });
  const [role, setRole] = useState('student');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [redirectPath, setRedirectPath] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await api.login({
        email: credentials.email,
        password: credentials.password,
        role: role,
        authCode: credentials.authCode
      });

      if (data.message === 'Login successful') {
        localStorage.setItem('token', data.token);
        login(data.user);
        setIsAuthenticated(true);
        setRedirectPath(`/${role}`);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError(error.message || 'Login failed');
    }
  };

  if (isAuthenticated) {
    return <Navigate to={redirectPath} />;
  }

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
      <form onSubmit={handleSubmit}>
        <div className="role-selector">
          <button 
            type="button" 
            className={role === 'student' ? 'active' : ''} 
            onClick={() => setRole('student')}
          >
            Student
          </button>
          <button 
            type="button" 
            className={role === 'teacher' ? 'active' : ''} 
            onClick={() => setRole('teacher')}
          >
            Teacher
          </button>
          <button 
            type="button" 
            className={role === 'admin' ? 'active' : ''} 
            onClick={() => setRole('admin')}
          >
            Admin
          </button>
        </div>
        <input
          type="email"
          placeholder="Email"
          value={credentials.email}
          onChange={(e) => setCredentials({...credentials, email: e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          required
        />
        {role === 'teacher' && (
          <>
            <input
              type="text"
              placeholder="Authorization Code (provided by admin)"
              value={credentials.authCode}
              onChange={(e) => setCredentials({...credentials, authCode: e.target.value})}
              required
            />
            <p className="auth-note">
              * Teachers must use an authorization code provided by the administrator
            </p>
          </>
        )}
        <button type="submit">Login</button>
        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </form>
    </div>
  );
};

export default Login;