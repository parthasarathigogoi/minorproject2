import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useBranding } from '../../context/BrandingContext';
import SystemSettings from './SystemSettings';
import BrandingManager from './BrandingManager';
import InstituteManagement from './InstituteManagement';
import '../../styles/AdminDashboard.css';
import '../../styles/InstituteManagement.css';

// Admin-specific components
const AdminHome = () => (
  <>
    <div className="welcome-section">
      <h3>Welcome, Administrator!</h3>
      <div className="quick-stats">
        <div className="stat-card">
          <h4>Total Users</h4>
          <p>256</p>
        </div>
        <div className="stat-card">
          <h4>Active Courses</h4>
          <p>18</p>
        </div>
        <div className="stat-card">
          <h4>New Registrations</h4>
          <p>12</p>
        </div>
        <div className="stat-card">
          <h4>System Health</h4>
          <p className="healthy">Good</p>
        </div>
      </div>
    </div>
    <div className="admin-actions">
      <h3>Quick Actions</h3>
      <div className="action-buttons">
        <button className="action-btn">Add New User</button>
        <button className="action-btn">Create Course</button>
        <button className="action-btn">View System Logs</button>
        <button className="action-btn">Backup System</button>
      </div>
    </div>
    <div className="recent-activity">
      <h3>Recent Activity</h3>
      <div className="activity-list">
        <div className="activity-item">
          <p><strong>New Teacher Registration:</strong> Prof. James Wilson</p>
          <span>Today, 9:30 AM</span>
        </div>
        <div className="activity-item">
          <p><strong>New Course Created:</strong> Advanced Biology by Prof. Martinez</p>
          <span>Yesterday, 2:45 PM</span>
        </div>
        <div className="activity-item">
          <p><strong>System Update:</strong> Version 2.3.1 deployed</p>
          <span>June 3, 2023</span>
        </div>
      </div>
    </div>
  </>
);

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  
  return (
    <div className="user-management-container">
      <h3>User Management</h3>
      <div className="user-tools">
        <div className="search-filter">
          <input 
            type="text" 
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
        <button className="add-user-btn">Add New User</button>
      </div>
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>john.doe@example.com</td>
              <td>Student</td>
              <td><span className="status active">Active</span></td>
              <td>
                <button className="small-btn">Edit</button>
                <button className="small-btn">Delete</button>
              </td>
            </tr>
            <tr>
              <td>Sarah Johnson</td>
              <td>sarah.j@example.com</td>
              <td>Teacher</td>
              <td><span className="status active">Active</span></td>
              <td>
                <button className="small-btn">Edit</button>
                <button className="small-btn">Delete</button>
              </td>
            </tr>
            <tr>
              <td>Michael Chen</td>
              <td>m.chen@example.com</td>
              <td>Teacher</td>
              <td><span className="status pending">Pending</span></td>
              <td>
                <button className="small-btn">Edit</button>
                <button className="small-btn">Delete</button>
              </td>
            </tr>
            <tr>
              <td>Robert Davis</td>
              <td>r.davis@example.com</td>
              <td>Admin</td>
              <td><span className="status active">Active</span></td>
              <td>
                <button className="small-btn">Edit</button>
                <button className="small-btn">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button disabled>&lt; Previous</button>
        <span>Page 1 of 5</span>
        <button>Next &gt;</button>
      </div>
    </div>
  );
};

const CourseManagement = () => (
  <div className="course-management-container">
    <h3>Course Management</h3>
    <div className="course-tools">
      <div className="search-filter">
        <input type="text" placeholder="Search courses..." />
        <select>
          <option>All Departments</option>
          <option>Mathematics</option>
          <option>Science</option>
          <option>Computer Science</option>
          <option>Humanities</option>
        </select>
      </div>
      <button className="add-course-btn">Create New Course</button>
    </div>
    <div className="courses-table">
      <table>
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Department</th>
            <th>Instructor</th>
            <th>Students</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mathematics 101</td>
            <td>Mathematics</td>
            <td>Prof. Sarah Johnson</td>
            <td>32</td>
            <td><span className="status active">Active</span></td>
            <td>
              <button className="small-btn">Edit</button>
              <button className="small-btn">Archive</button>
            </td>
          </tr>
          <tr>
            <td>Introduction to Physics</td>
            <td>Science</td>
            <td>Prof. Michael Chen</td>
            <td>28</td>
            <td><span className="status active">Active</span></td>
            <td>
              <button className="small-btn">Edit</button>
              <button className="small-btn">Archive</button>
            </td>
          </tr>
          <tr>
            <td>Computer Science Fundamentals</td>
            <td>Computer Science</td>
            <td>Prof. Robert Davis</td>
            <td>35</td>
            <td><span className="status active">Active</span></td>
            <td>
              <button className="small-btn">Edit</button>
              <button className="small-btn">Archive</button>
            </td>
          </tr>
          <tr>
            <td>Advanced Biology</td>
            <td>Science</td>
            <td>Prof. Martinez</td>
            <td>0</td>
            <td><span className="status draft">Draft</span></td>
            <td>
              <button className="small-btn">Edit</button>
              <button className="small-btn">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const TeacherAuthorization = () => {
  const [newAuthCode, setNewAuthCode] = useState('');
  
  const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'T-';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setNewAuthCode(result);
  };
  
  return (
    <div className="teacher-auth-container">
      <h3>Teacher Authorization Codes</h3>
      <div className="auth-code-generator">
        <h4>Generate New Authorization Code</h4>
        <div className="code-generator">
          <input 
            type="text" 
            value={newAuthCode} 
            onChange={(e) => setNewAuthCode(e.target.value)}
            placeholder="Authorization Code"
          />
          <button onClick={generateRandomCode}>Generate Random</button>
          <button>Save Code</button>
        </div>
      </div>
      
      <div className="current-auth-codes">
        <h4>Current Authorization Codes</h4>
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Generated For</th>
              <th>Date Created</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>T-ABC123</td>
              <td>John Smith</td>
              <td>June 1, 2023</td>
              <td><span className="status active">Active</span></td>
              <td><button className="small-btn">Revoke</button></td>
            </tr>
            <tr>
              <td>T-DEF456</td>
              <td>Emily Johnson</td>
              <td>June 3, 2023</td>
              <td><span className="status active">Active</span></td>
              <td><button className="small-btn">Revoke</button></td>
            </tr>
            <tr>
              <td>T-GHI789</td>
              <td>Michael Wilson</td>
              <td>May 25, 2023</td>
              <td><span className="status used">Used</span></td>
              <td><button className="small-btn" disabled>Revoke</button></td>
            </tr>
            <tr>
              <td>T-JKL012</td>
              <td>Sarah Davis</td>
              <td>May 20, 2023</td>
              <td><span className="status revoked">Revoked</span></td>
              <td><button className="small-btn" disabled>Revoke</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { branding } = useBranding();
  const [activeSection, setActiveSection] = useState('home');

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <AdminHome />;
      case 'users':
        return <UserManagement />;
      case 'courses':
        return <CourseManagement />;
      case 'teachers':
        return <TeacherAuthorization />;
      case 'institutes':
        return <InstituteManagement />;
      case 'branding':
        return <BrandingManager />;
      case 'system':
        return <SystemSettings />;
      default:
        return <AdminHome />;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          {branding.logo && (
            <img src={branding.logo} alt="School Logo" className="school-logo" />
          )}
          <h2>{branding.institutionName} Admin</h2>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li 
              className={activeSection === 'home' ? 'active' : ''}
              onClick={() => setActiveSection('home')}
            >
              <span className="nav-icon">📊</span>
              Dashboard
            </li>
            <li 
              className={activeSection === 'institutes' ? 'active' : ''}
              onClick={() => setActiveSection('institutes')}
            >
              <span className="nav-icon">🏫</span>
              Institute Management
            </li>
            <li 
              className={activeSection === 'users' ? 'active' : ''}
              onClick={() => setActiveSection('users')}
            >
              <span className="nav-icon">👥</span>
              User Management
            </li>
            <li 
              className={activeSection === 'courses' ? 'active' : ''}
              onClick={() => setActiveSection('courses')}
            >
              <span className="nav-icon">📚</span>
              Course Management
            </li>
            <li 
              className={activeSection === 'teachers' ? 'active' : ''}
              onClick={() => setActiveSection('teachers')}
            >
              <span className="nav-icon">👨‍🏫</span>
              Teacher Authorization
            </li>
            <li 
              className={activeSection === 'branding' ? 'active' : ''}
              onClick={() => setActiveSection('branding')}
            >
              <span className="nav-icon">🎨</span>
              Branding
            </li>
            <li 
              className={activeSection === 'system' ? 'active' : ''}
              onClick={() => setActiveSection('system')}
            >
              <span className="nav-icon">⚙️</span>
              System Settings
            </li>
          </ul>
        </nav>
      </div>

      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard; 