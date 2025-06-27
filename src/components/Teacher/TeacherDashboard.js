import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaClipboardList, FaFileUpload, FaChalkboardTeacher, FaShareAlt, FaBook, FaClipboard, FaCalculator, FaFileAlt, FaRocket, FaUserCheck, FaBullhorn, FaUserCircle, FaCog, FaSignOutAlt, FaBell, FaGraduationCap, FaHome, FaChartBar, FaClipboardCheck, FaCalendarAlt, FaUsers, FaPlus } from 'react-icons/fa';
import '../../styles/TeacherDashboard.css';
import NotesViewer from '../common/NotesViewer';
import AssignmentManager from '../common/AssignmentManager';

// Import teacher dashboard sections
import MySubjects from './Sections/MySubjects';
import UploadQuestions from './Sections/UploadQuestions';
import Assignments from './Sections/Assignments';
import Notes from './Sections/Notes';
import Students from './Sections/Students';
import PracticeTests from './Sections/PracticeTests';
import ClassSectionSelector from './ClassSectionSelector';
import CreateSubjectForm from './CreateSubjectForm';

const TeacherDashboard = () => {
  const { pathname } = useLocation();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New student submission for Mathematics 101', read: false },
    { id: 2, text: 'Question from student in Physics class', read: false },
    { id: 3, text: 'Admin posted a new announcement', read: false }
  ]);
  
  // Class and Subject states
  const [selectedClassSection, setSelectedClassSection] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [subjectsByClass, setSubjectsByClass] = useState({});
  const [showSetupPrompt, setShowSetupPrompt] = useState(true);
  
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const [showCreateSubject, setShowCreateSubject] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch class sections and subjects on component mount
  useEffect(() => {
    // TODO: Replace with actual API calls
    const fetchClassSectionsAndSubjects = async () => {
      try {
        // Mock data - replace with API call
        const fetchedClassSections = [
          { id: 'c1', name: 'Class 10 - A' },
          { id: 'c2', name: 'Class 10 - B' },
          { id: 'c3', name: 'Class 11 - Science' },
          { id: 'c4', name: 'Class 12 - Science' },
          { id: 's1', name: 'Semester 3 - CSE' },
          { id: 's2', name: 'Semester 5 - CSE' },
        ];
        
        // Mock data - replace with API call
        const fetchedSubjectsByClass = {
          'c1': [
            { id: 'math10', name: 'Mathematics' },
            { id: 'physics10', name: 'Physics' },
            { id: 'chem10', name: 'Chemistry' },
            { id: 'cs10', name: 'Computer Science' }
          ],
          'c2': [
            { id: 'math10', name: 'Mathematics' },
            { id: 'physics10', name: 'Physics' },
            { id: 'chem10', name: 'Chemistry' },
            { id: 'bio10', name: 'Biology' }
          ],
          'c3': [
            { id: 'math11', name: 'Mathematics' },
            { id: 'physics11', name: 'Physics' },
            { id: 'chem11', name: 'Chemistry' }
          ],
          'c4': [
            { id: 'math12', name: 'Mathematics' },
            { id: 'physics12', name: 'Physics' },
            { id: 'chem12', name: 'Chemistry' }
          ],
          's1': [
            { id: 'dsa', name: 'Data Structures' },
            { id: 'dbms', name: 'Database Management' },
            { id: 'os', name: 'Operating Systems' }
          ],
          's2': [
            { id: 'cn', name: 'Computer Networks' },
            { id: 'ai', name: 'Artificial Intelligence' },
            { id: 'ml', name: 'Machine Learning' }
          ]
        };
        
        setClassSections(fetchedClassSections);
        setSubjectsByClass(fetchedSubjectsByClass);
        
        // Check local storage for previously selected class and subjects
        const storedClassSection = localStorage.getItem('selectedClassSection');
        const storedSubjects = localStorage.getItem('selectedSubjects');
        
        if (storedClassSection) {
          setSelectedClassSection(storedClassSection);
          setShowSetupPrompt(false);
        }
        
        if (storedSubjects) {
          setSelectedSubjects(JSON.parse(storedSubjects));
        }
      } catch (error) {
        console.error('Error fetching class sections and subjects:', error);
      }
    };
    
    fetchClassSectionsAndSubjects();
  }, []);
  
  // Save selections to local storage when they change
  useEffect(() => {
    if (selectedClassSection) {
      localStorage.setItem('selectedClassSection', selectedClassSection);
    }
    
    if (selectedSubjects.length > 0) {
      localStorage.setItem('selectedSubjects', JSON.stringify(selectedSubjects));
    }
  }, [selectedClassSection, selectedSubjects]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    // Redirect will be handled by AuthContext
  };
  
  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const handleClassSectionChange = (classSectionId) => {
    setSelectedClassSection(classSectionId);
    setSelectedSubjects([]);
    setShowSetupPrompt(false);
  };
  
  const handleSubjectSelection = (subjects) => {
    setSelectedSubjects(subjects);
  };

  const handleEnterSubject = (subject) => {
    setShowCreateSubject(false);
    setRefreshKey(k => k + 1);
    navigate('/teacher'); // Go to dashboard home (MySubjects)
  };

  const renderContent = () => {
    if (showCreateSubject) {
      return <CreateSubjectForm onSubjectCreated={() => setShowCreateSubject(false)} onEnterSubject={handleEnterSubject} />;
    }
    // If no class section is selected, show the selector
    if (showSetupPrompt) {
  return (
        <div className="setup-prompt">
          <ClassSectionSelector 
            classSections={classSections}
            subjectsByClass={subjectsByClass}
            onClassSectionChange={handleClassSectionChange}
            onSubjectSelection={handleSubjectSelection}
          />
    </div>
  );
    }
    
    // Otherwise show the selected route
    return (
      <Routes>
        <Route index element={
          <MySubjects refreshKey={refreshKey} />
        } />
        <Route path="upload-questions" element={
          <UploadQuestions 
            classSection={selectedClassSection} 
            subjects={selectedSubjects} 
          />
        } />
        <Route path="assignments" element={
          <Assignments 
            classSection={selectedClassSection} 
            subjects={selectedSubjects} 
          />
        } />
        <Route path="notes" element={
          <Notes 
            classSection={selectedClassSection} 
            subjects={selectedSubjects} 
          />
        } />
        <Route path="students" element={
          <Students 
            classSection={selectedClassSection} 
            subjects={selectedSubjects} 
          />
        } />
        <Route path="practice-tests" element={
          <PracticeTests 
            classSection={selectedClassSection} 
            subjects={selectedSubjects} 
          />
        } />
        <Route path="*" element={
          <MySubjects 
            classSection={selectedClassSection} 
            subjects={selectedSubjects} 
            subjectData={subjectsByClass[selectedClassSection] || []}
          />
        } />
      </Routes>
    );
  };

  return (
    <div className="teacher-dashboard">
      <div className="teacher-sidebar">
        <div className="sidebar-header">
          <div className="profile-picture" onClick={() => setShowProfileDropdown(!showProfileDropdown)} ref={profileRef}>
            <div className="default-avatar">
              <FaUserCircle />
              <div className="avatar-badge"></div>
            </div>
          </div>
          <div className="profile-info">
            <h3>{currentUser ? currentUser.fullName : 'Teacher'}</h3>
            <p className="teacher-info">{currentUser ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) : 'Teacher'}</p>
          </div>
          
          {showProfileDropdown && (
            <div className="profile-dropdown">
              <div className="dropdown-item">
                <FaUserCircle /> My Profile
              </div>
              <div className="dropdown-item">
                <FaCog /> Settings
              </div>
              <div className="dropdown-item" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </div>
            </div>
          )}
        </div>

        <div className="notification-bell" onClick={() => setShowNotifications(!showNotifications)} ref={notificationRef}>
          <FaBell />
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="notification-badge">{notifications.filter(n => !n.read).length}</span>
          )}
          
          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h4>Notifications</h4>
                <button className="mark-all-read" onClick={markAllNotificationsAsRead}>Mark all as read</button>
              </div>
              <div className="notifications-list">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                    >
                      <p>{notification.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="no-notifications">
                    <p>No notifications</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="sidebar-section">
          <div className="section-title">
            <FaGraduationCap className="section-icon" /> Teaching
          </div>
          <nav className="sidebar-nav">
            <Link to="/teacher" className={pathname === '/teacher' ? 'active' : ''}>
              <FaHome /> <span>My Subjects</span>
            </Link>
            <button
              className="sidebar-link bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded mb-2"
              style={{ width: '100%', textAlign: 'left', padding: '12px 20px', marginBottom: 8 }}
              onClick={() => setShowCreateSubject(true)}
            >
              <FaPlus style={{ marginRight: 8 }} /> Create Subject
            </button>
            <Link to="/teacher/upload-questions" className={pathname.includes('/teacher/upload-questions') ? 'active' : ''}>
              <FaFileUpload /> <span>Upload Questions</span>
            </Link>
            <Link to="/teacher/assignments" className={pathname.includes('/teacher/assignments') ? 'active' : ''}>
              <FaClipboardList /> <span>Assignments</span>
            </Link>
            <Link to="/teacher/notes" className={pathname.includes('/teacher/notes') ? 'active' : ''}>
              <FaBook /> <span>Notes</span>
            </Link>
            <Link to="/teacher/students" className={pathname.includes('/teacher/students') ? 'active' : ''}>
              <FaChalkboardTeacher /> <span>Students</span>
            </Link>
            <Link to="/teacher/practice-tests" className={pathname.includes('/teacher/practice-tests') ? 'active' : ''}>
              <FaRocket /> <span>Practice Tests</span>
            </Link>
          </nav>
        </div>
        
        {selectedClassSection && (
          <div className="sidebar-selection-info">
            <h4>Current Selection</h4>
            <div className="selection-item">
              <strong>Class/Section:</strong> 
              <span>{classSections.find(cs => cs.id === selectedClassSection)?.name || selectedClassSection}</span>
            </div>
            {selectedSubjects.length > 0 && (
              <div className="selection-item">
                <strong>Subjects:</strong>
                <ul>
                  {selectedSubjects.map(subjectId => (
                    <li key={subjectId}>
                      {subjectsByClass[selectedClassSection]?.find(s => s.id === subjectId)?.name || subjectId}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button 
              className="change-selection-btn"
              onClick={() => setShowSetupPrompt(true)}
            >
              Change Selection
            </button>
          </div>
        )}
      </div>

      <div className="teacher-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default TeacherDashboard; 