import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import components
import TeacherDashboard from './components/Teacher/TeacherDashboard';
import StudentDashboard from './components/Student/StudentDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import Login from './components/common/Login';
import SignUp from './components/common/SignUp';

// Import contexts
import { BrandingProvider } from './context/BrandingContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrandingProvider>
        <BrowserRouter>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              
              {/* Role-specific routes */}
              <Route path="/teacher/*" element={<TeacherDashboard />} />
              <Route path="/student/*" element={<StudentDashboard />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              
              {/* Redirect for logout */}
              <Route path="/logout" element={<Navigate to="/" />} />
              
              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </BrowserRouter>
      </BrandingProvider>
    </AuthProvider>
  );
}

export default App;