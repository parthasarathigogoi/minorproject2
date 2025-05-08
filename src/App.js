import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/Auth.css';
import './styles/Common.css';

// Lazy load components for code splitting
const TeacherDashboard = lazy(() => import('./components/Teacher/TeacherDashboard'));
const StudentDashboard = lazy(() => import('./components/Student/StudentDashboard'));
const AdminDashboard = lazy(() => import('./components/Admin/AdminDashboard'));
const Login = lazy(() => import('./components/common/Login'));
const SignUp = lazy(() => import('./components/common/SignUp'));

// Import contexts
import { BrandingProvider } from './context/BrandingContext';
import { ExamProvider } from './context/ExamContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Loading component for suspense fallback
const LoadingFallback = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
);

// Protected Route component
const ProtectedRoute = ({ element, requiredRole }) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  
  // Show loading state if authentication is still being checked
  if (loading) {
    return <LoadingFallback />;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Check if the user has the required role (if a role is specified)
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to appropriate dashboard based on actual role
    if (userRole === 'student') {
      return <Navigate to="/student" replace />;
    } else if (userRole === 'teacher') {
      return <Navigate to="/teacher" replace />;
    } else if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      // Fallback to login if role is invalid
      return <Navigate to="/" replace />;
    }
  }
  
  // If all checks pass, render the element
  return element;
};

function App() {
  return (
    <BrandingProvider>
      <AuthProvider>
        <ExamProvider>
          <BrowserRouter>
            <div className="App">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Public routes */}
                  <Route 
                    path="/" 
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    } 
                  />
                  <Route 
                    path="/signup" 
                    element={
                      <PublicRoute>
                        <SignUp />
                      </PublicRoute>
                    } 
                  />
                  
                  {/* Role-specific routes */}
                  <Route 
                    path="/teacher/*" 
                    element={<ProtectedRoute element={<TeacherDashboard />} requiredRole="teacher" />} 
                  />
                  <Route 
                    path="/student/*" 
                    element={<ProtectedRoute element={<StudentDashboard />} requiredRole="student" />} 
                  />
                  <Route 
                    path="/admin/*" 
                    element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />} 
                  />
                  
                  {/* Logout route */}
                  <Route path="/logout" element={<Logout />} />
                  
                  {/* Catch-all redirect */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Suspense>
            </div>
          </BrowserRouter>
        </ExamProvider>
      </AuthProvider>
    </BrandingProvider>
  );
}

// Redirect already authenticated users away from login/signup
const PublicRoute = ({ children }) => {
  const { isAuthenticated, userRole } = useAuth();
  
  if (isAuthenticated) {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'student') {
      return <Navigate to="/student" replace />;
    } else if (userRole === 'teacher') {
      return <Navigate to="/teacher" replace />;
    } else if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    }
  }
  
  return children;
};

// Logout component
const Logout = () => {
  const { logout } = useAuth();
  
  React.useEffect(() => {
    logout();
  }, [logout]);
  
  return <Navigate to="/" />;
};

export default App;
