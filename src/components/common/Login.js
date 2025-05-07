import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useBranding } from '../../context/BrandingContext';

// Mock database of authorized teachers
const authorizedTeachers = [
  { email: 'teacher1@example.com', password: 'password123', authCode: 'T-ABC123' },
  { email: 'teacher2@example.com', password: 'password456', authCode: 'T-DEF456' }
];

// Mock users for demo
const mockUsers = {
  students: [
    { email: 'student@example.com', password: 'student123' }
  ],
  teachers: [
    { email: 'teacher1@example.com', password: 'password123' },
    { email: 'teacher2@example.com', password: 'password456' }
  ],
  admins: [
    { email: 'admin@example.com', password: 'admin123' }
  ]
};

const Login = () => {
  const { branding } = useBranding();
  const [credentials, setCredentials] = useState({ 
    email: '', 
    password: '',
    authCode: ''
  });
  const [role, setRole] = useState('student');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [redirectPath, setRedirectPath] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    let authenticated = false;
    let path = '';

    if (role === 'teacher') {
      // Verify teacher with authorization code
      const teacherExists = authorizedTeachers.find(
        teacher => 
          teacher.email === credentials.email && 
          teacher.password === credentials.password &&
          teacher.authCode === credentials.authCode
      );
      
      if (teacherExists) {
        authenticated = true;
        path = '/teacher';
      } else {
        setError('Invalid teacher credentials or authorization code. Please contact admin.');
      }
    } else if (role === 'student') {
      // Verify student
      const studentExists = mockUsers.students.find(
        student => 
          student.email === credentials.email && 
          student.password === credentials.password
      );
      
      if (studentExists) {
        authenticated = true;
        path = '/student';
      } else {
        setError('Invalid student credentials.');
      }
    } else if (role === 'admin') {
      // Verify admin
      const adminExists = mockUsers.admins.find(
        admin => 
          admin.email === credentials.email && 
          admin.password === credentials.password
      );
      
      if (adminExists) {
        authenticated = true;
        path = '/admin';
      } else {
        setError('Invalid admin credentials.');
      }
    }

    if (authenticated) {
      setIsAuthenticated(true);
      setRedirectPath(path);
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
        
        {/* Quick login options for demo purposes */}
        {process.env.NODE_ENV !== 'production' && (
          <div className="demo-logins">
            <p className="demo-note">Demo Accounts:</p>
            <button
              type="button"
              className="demo-btn"
              onClick={() => {
                setRole('student');
                setCredentials({
                  email: 'student@example.com',
                  password: 'student123',
                  authCode: ''
                });
              }}
            >
              Student Login
            </button>
            <button
              type="button"
              className="demo-btn"
              onClick={() => {
                setRole('teacher');
                setCredentials({
                  email: 'teacher1@example.com',
                  password: 'password123',
                  authCode: 'T-ABC123'
                });
              }}
            >
              Teacher Login
            </button>
            <button
              type="button"
              className="demo-btn"
              onClick={() => {
                setRole('admin');
                setCredentials({
                  email: 'admin@example.com',
                  password: 'admin123',
                  authCode: ''
                });
              }}
            >
              Admin Login
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login; 