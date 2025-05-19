import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, NavLink, Navigate } from 'react-router-dom';
import { useBranding } from '../../context/BrandingContext';
import { useExam } from '../../context/ExamContext';
import { useAuth } from '../../context/AuthContext';
import { FaUserGraduate, FaBookOpen, FaClipboardList, FaBook, FaFileAlt, FaCalendarAlt, FaClipboardCheck, FaPencilAlt, FaClock, FaLink, FaFileUpload, FaTasks, FaCheckCircle, FaFileDownload, FaExclamationTriangle, FaHome, FaChartBar, FaComments, FaUserCircle, FaCog, FaSignOutAlt, FaBell, FaGraduationCap, FaBrain, FaPlus } from 'react-icons/fa';
import '../../styles/StudentDashboard.css';
import '../../styles/PracticeTestBuilder.css';
import '../../styles/CustomTestBuilder.css';
import NotesViewer from '../common/NotesViewer';
import AssignmentManager from '../common/AssignmentManager';
import PracticeTestBuilder from './PracticeTestBuilder';
import CustomTestBuilder from './CustomTestBuilder';
import StudentProfile from './StudentProfile';
import ExamInterface from './ExamInterface';

// Student-specific components
const StudentHome = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showJoinModal, setShowJoinModal] = useState(false);
  
  // Dummy data for enrolled classes
  const enrolledClasses = [
    { id: 1, name: 'Mathematics 101', teacher: 'Prof. Smith', color: '#3563E9' },
    { id: 2, name: 'Physics', teacher: 'Dr. Johnson', color: '#00C853' },
    { id: 3, name: 'Computer Science', teacher: 'Prof. Davis', color: '#FF6D00' },
  ];
  
  // Dummy data for upcoming assignments
  const upcomingAssignments = [
    { id: 1, title: 'Calculus Problem Set', class: 'Mathematics 101', dueDate: '2023-06-15', status: 'pending' },
    { id: 2, title: 'Physics Lab Report', class: 'Physics', dueDate: '2023-06-18', status: 'pending' },
    { id: 3, title: 'Programming Assignment', class: 'Computer Science', dueDate: '2023-06-20', status: 'draft' },
  ];
  
  // Dummy data for recent uploads by teachers
  const recentUploads = [
    { id: 1, title: 'Linear Algebra Notes', class: 'Mathematics 101', type: 'notes', date: '2023-06-10' },
    { id: 2, title: 'Mechanics Formulas', class: 'Physics', type: 'document', date: '2023-06-09' },
    { id: 3, title: 'Algorithm Examples', class: 'Computer Science', type: 'slides', date: '2023-06-08' },
  ];

  // Dummy data for upcoming exams
  const upcomingExams = [
    { id: 1, title: 'Mid-term Exam', class: 'Mathematics 101', date: '2023-06-25', duration: '90 min' },
    { id: 2, title: 'Physics Quiz', class: 'Physics', date: '2023-06-16', duration: '30 min' },
  ];

  // Get current date
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);
  
  const goPracticeTest = () => {
    navigate('/student/exam/practice');
  };

  return (
    <div className="student-home">
      <section className="welcome-banner">
        <div className="welcome-text">
          <h2>Welcome, {currentUser ? currentUser.fullName : 'Student'}</h2>
          <p>{formattedDate} | <span className="highlight">2 Assignments Due This Week</span></p>
        </div>
        <div className="student-stats">
          <div className="stat-item">
            <div className="stat-value">3</div>
            <div className="stat-label">Classes</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">5</div>
            <div className="stat-label">Assignments</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">2</div>
            <div className="stat-label">Exams</div>
          </div>
        </div>
      </section>
      
      <section className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-tiles">
          <div className="action-tile" onClick={() => setShowJoinModal(true)}>
            <div className="tile-icon join">
              <FaLink />
            </div>
            <h4>Join Class</h4>
            <p>With code or link</p>
          </div>
          
          <div className="action-tile">
            <div className="tile-icon notes">
              <FaBookOpen />
            </div>
            <h4>Read Notes</h4>
            <p>View class materials</p>
          </div>
          
          <div className="action-tile">
            <div className="tile-icon submit">
              <FaFileUpload />
            </div>
            <h4>Submit Work</h4>
            <p>Assignments & homework</p>
          </div>
          
          <div className="action-tile" onClick={goPracticeTest}>
            <div className="tile-icon exam">
              <FaPencilAlt />
            </div>
            <h4>Take Exam</h4>
            <p>Practice or graded</p>
          </div>
        </div>
      </section>
      
      <div className="dashboard-grid">
        <section className="classes-section">
          <div className="section-header">
            <h3>Your Classes</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="classes-list">
            {enrolledClasses.map(class_ => (
              <div className="class-card" key={class_.id}>
                <div className="class-color" style={{ backgroundColor: class_.color }}></div>
                <div className="class-details">
                  <h4>{class_.name}</h4>
                  <p className="class-teacher"><FaUserGraduate /> {class_.teacher}</p>
                  <div className="class-actions">
                    <button className="class-btn">Materials</button>
                    <button className="class-btn">Assignments</button>
                  </div>
                </div>
              </div>
            ))}
            <div className="join-class-card" onClick={() => setShowJoinModal(true)}>
              <div className="add-icon">+</div>
              <p>Join New Class</p>
            </div>
          </div>
        </section>
        
        <section className="assignments-section">
          <div className="section-header">
            <h3>Upcoming Assignments</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="assignments-list">
            {upcomingAssignments.map(assignment => (
              <div className="assignment-card" key={assignment.id}>
                <div className="assignment-header">
                  <h4>{assignment.title}</h4>
                  <span className={`assignment-status ${assignment.status}`}>
                    {assignment.status === 'pending' ? 'Due Soon' : 'Draft'}
                  </span>
                </div>
                <div className="assignment-details">
                  <p><FaBook /> {assignment.class}</p>
                  <p><FaCalendarAlt /> Due: {assignment.dueDate}</p>
                </div>
                <div className="assignment-actions">
                  <button className="assignment-btn">View</button>
                  <button className="assignment-btn primary">
                    {assignment.status === 'draft' ? 'Complete Draft' : 'Submit Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="uploads-section">
          <div className="section-header">
            <h3>Recent Teacher Uploads</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="uploads-list">
            {recentUploads.map(upload => (
              <div className="upload-item" key={upload.id}>
                <div className="upload-icon">
                  {upload.type === 'notes' ? <FaFileAlt /> : 
                   upload.type === 'document' ? <FaBook /> : <FaFileAlt />}
                </div>
                <div className="upload-details">
                  <h4>{upload.title}</h4>
                  <div className="upload-meta">
                    <span>{upload.class}</span>
                    <span>•</span>
                    <span>{upload.date}</span>
                  </div>
                </div>
                <div className="upload-actions">
                  <button className="icon-btn read"><FaBookOpen /></button>
                  <button className="icon-btn download"><FaFileDownload /></button>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="exams-section">
          <div className="section-header">
            <h3>Upcoming Exams</h3>
            <button className="practice-btn" onClick={goPracticeTest}>Practice Tests</button>
          </div>
          <div className="exams-list">
            {upcomingExams.map(exam => (
              <div className="exam-card" key={exam.id}>
                <div className="exam-header">
                  <h4>{exam.title}</h4>
                  <span className="exam-duration"><FaClock /> {exam.duration}</span>
                </div>
                <div className="exam-details">
                  <p><FaBook /> {exam.class}</p>
                  <p><FaCalendarAlt /> {exam.date}</p>
                </div>
                <div className="exam-actions">
                  <button className="exam-btn">Review Material</button>
                  <button className="exam-btn practice">Take Practice Test</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      
      {/* Join Class Modal */}
      {showJoinModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Join a Class</h3>
              <button className="close-btn" onClick={() => setShowJoinModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="join-options">
                <div className="join-option">
                  <input type="radio" id="join-code" name="join-type" defaultChecked />
                  <label htmlFor="join-code">Join with Class Code</label>
                </div>
                <div className="join-option">
                  <input type="radio" id="join-link" name="join-type" />
                  <label htmlFor="join-link">Join with Invitation Link</label>
                </div>
              </div>
              
              <div className="join-code-input">
                <label>Enter Class Code</label>
                <input type="text" placeholder="e.g., MATH101-ABC123" />
                <p className="help-text">Class codes are usually provided by your teacher and look like "SUBJECT-CODE123"</p>
              </div>
              
              <div className="terms-checkbox">
                <input type="checkbox" id="agree-terms" />
                <label htmlFor="agree-terms">I confirm this is a class I'm enrolled in</label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowJoinModal(false)}>Cancel</button>
              <button className="join-btn">Join Class</button>
            </div>
          </div>
        </div>
      )}

      {/* Task Progress Sidebar - Mobile Friendly */}
      <div className="task-progress">
        <div className="progress-header">
          <h3>Today's Tasks</h3>
          <span className="task-count">3/5 Complete</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '60%' }}></div>
        </div>
        <div className="task-list">
          <div className="task-item completed">
            <FaCheckCircle className="task-icon" />
            <div className="task-details">
              <span className="task-name">Read Physics Chapter 5</span>
              <span className="task-class">Physics</span>
            </div>
          </div>
          <div className="task-item completed">
            <FaCheckCircle className="task-icon" />
            <div className="task-details">
              <span className="task-name">Watch Math Video Lecture</span>
              <span className="task-class">Mathematics 101</span>
            </div>
          </div>
          <div className="task-item completed">
            <FaCheckCircle className="task-icon" />
            <div className="task-details">
              <span className="task-name">Complete CS Quiz</span>
              <span className="task-class">Computer Science</span>
            </div>
          </div>
          <div className="task-item">
            <FaTasks className="task-icon" />
            <div className="task-details">
              <span className="task-name">Submit Math Assignment</span>
              <span className="task-class">Mathematics 101</span>
            </div>
          </div>
          <div className="task-item">
            <FaTasks className="task-icon" />
            <div className="task-details">
              <span className="task-name">Review Lab Notes</span>
              <span className="task-class">Physics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CoursesList = () => (
  <div className="courses-container">
    <h3>My Courses</h3>
    <div className="courses-list">
      <div className="course-item">
        <div className="course-header">
          <h4>Mathematics 101</h4>
          <div className="course-status">In Progress</div>
        </div>
        <p>Prof. Sarah Johnson • MWF 9:00 AM</p>
        <div className="course-progress">
          <div className="progress-bar">
            <div className="progress" style={{ width: '70%' }}></div>
          </div>
          <span>70% Complete</span>
        </div>
        <button className="enter-course-btn">Enter Course</button>
      </div>
      <div className="course-item">
        <div className="course-header">
          <h4>Introduction to Physics</h4>
          <div className="course-status">In Progress</div>
        </div>
        <p>Prof. Michael Chen • TR 11:00 AM</p>
        <div className="course-progress">
          <div className="progress-bar">
            <div className="progress" style={{ width: '45%' }}></div>
          </div>
          <span>45% Complete</span>
        </div>
        <button className="enter-course-btn">Enter Course</button>
      </div>
      <div className="course-item">
        <div className="course-header">
          <h4>Computer Science Fundamentals</h4>
          <div className="course-status">In Progress</div>
        </div>
        <p>Prof. Robert Davis • TR 2:00 PM</p>
        <div className="course-progress">
          <div className="progress-bar">
            <div className="progress" style={{ width: '60%' }}></div>
          </div>
          <span>60% Complete</span>
        </div>
        <button className="enter-course-btn">Enter Course</button>
      </div>
    </div>
    <div className="join-new-course">
      <h4>Join a New Course</h4>
      <div className="join-course-form">
        <input type="text" placeholder="Enter Course Code" />
        <button>Join</button>
      </div>
    </div>
  </div>
);

const Assignments = () => (
  <div className="assignments-container">
    <h3>My Assignments</h3>
    <div className="assignment-filters">
      <button className="filter-btn active">All</button>
      <button className="filter-btn">Pending</button>
      <button className="filter-btn">Completed</button>
      <button className="filter-btn">Late</button>
    </div>
    <div className="assignment-list">
      <div className="assignment-item pending">
        <div className="assignment-header">
          <h4>Week 3 Math Quiz</h4>
          <div className="assignment-status">Pending</div>
        </div>
        <p>Mathematics 101 • Due: Tomorrow, 11:59 PM</p>
        <div className="assignment-actions">
          <button className="start-btn">Start Quiz</button>
        </div>
      </div>
      <div className="assignment-item pending">
        <div className="assignment-header">
          <h4>Physics Lab Report</h4>
          <div className="assignment-status">Pending</div>
        </div>
        <p>Introduction to Physics • Due: June 15, 2023</p>
        <div className="assignment-actions">
          <button className="start-btn">View Details</button>
        </div>
      </div>
      <div className="assignment-item completed">
        <div className="assignment-header">
          <h4>Computer Science Quiz</h4>
          <div className="assignment-status">Completed</div>
        </div>
        <p>Computer Science Fundamentals • Submitted: June 2, 2023</p>
        <div className="assignment-grade">
          <span>Grade: 92%</span>
          <button className="feedback-btn">View Feedback</button>
        </div>
      </div>
    </div>
  </div>
);

const Grades = () => (
  <div className="grades-container">
    <h3>My Grades</h3>
    <div className="course-selector">
      <select>
        <option>All Courses</option>
        <option>Mathematics 101</option>
        <option>Introduction to Physics</option>
        <option>Computer Science Fundamentals</option>
      </select>
    </div>
    <div className="grades-overview">
      <div className="overall-gpa">
        <h4>Overall GPA</h4>
        <div className="gpa-value">3.7</div>
      </div>
      <div className="grade-distribution">
        <div className="grade-bar a" style={{ width: '60%' }}>A (60%)</div>
        <div className="grade-bar b" style={{ width: '30%' }}>B (30%)</div>
        <div className="grade-bar c" style={{ width: '10%' }}>C (10%)</div>
      </div>
    </div>
    <div className="grades-table">
      <table>
        <thead>
          <tr>
            <th>Course</th>
            <th>Assignment</th>
            <th>Grade</th>
            <th>Feedback</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Computer Science</td>
            <td>Week 2 Quiz</td>
            <td>92%</td>
            <td><button className="small-btn">View</button></td>
          </tr>
          <tr>
            <td>Mathematics</td>
            <td>Homework 3</td>
            <td>88%</td>
            <td><button className="small-btn">View</button></td>
          </tr>
          <tr>
            <td>Physics</td>
            <td>Lab 1</td>
            <td>85%</td>
            <td><button className="small-btn">View</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const Discussion = () => (
  <div className="discussion-container">
    <h3>Discussion Forums</h3>
    <div className="course-selector">
      <select>
        <option>All Courses</option>
        <option>Mathematics 101</option>
        <option>Introduction to Physics</option>
        <option>Computer Science Fundamentals</option>
      </select>
    </div>
    <div className="forum-list">
      <div className="forum-item">
        <h4>General Questions - Mathematics</h4>
        <div className="forum-stats">
          <span>12 Topics</span>
          <span>45 Posts</span>
          <span>Last Post: 2 hours ago</span>
        </div>
        <button className="view-forum-btn">View Forum</button>
      </div>
      <div className="forum-item">
        <h4>Homework Help - Physics</h4>
        <div className="forum-stats">
          <span>8 Topics</span>
          <span>32 Posts</span>
          <span>Last Post: Yesterday</span>
        </div>
        <button className="view-forum-btn">View Forum</button>
      </div>
      <div className="forum-item">
        <h4>Programming Projects - CS</h4>
        <div className="forum-stats">
          <span>5 Topics</span>
          <span>17 Posts</span>
          <span>Last Post: 3 days ago</span>
        </div>
        <button className="view-forum-btn">View Forum</button>
      </div>
    </div>
  </div>
);

// Student Assignment Details component
const AssignmentDetails = () => {
  return (
    <div className="assignment-details-page">
      <h3>Assignment Details</h3>
      {/* Assignment details content */}
    </div>
  );
};

// Student Notes Reader component
const NotesReader = () => {
  return (
    <div className="notes-reader">
      <h3>Class Notes & Materials</h3>
      {/* Notes reader content */}
    </div>
  );
};

const StudentNotes = () => (
  <div className="student-view notes-view">
    <NotesViewer userRole="student" />
  </div>
);

const StudentAssignments = () => (
  <div className="student-view assignments-view">
    <AssignmentManager userRole="student" />
  </div>
);

const StudentDashboard = () => {
  const { branding } = useBranding();
  const { pathname } = useLocation();
  const { currentUser, logout } = useAuth();
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New grade posted in Computer Science', read: false },
    { id: 2, text: 'New assignment in Physics', read: false },
    { id: 3, text: 'Teacher posted an announcement', read: false }
  ]);
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: 'Computer Science major, Junior year',
    photo: null
  });
  const [activeSection, setActiveSection] = useState('home');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

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

  const renderContent = () => {
    return (
      <Routes>
        <Route index element={<StudentHome />} />
        <Route path="courses" element={<CoursesList />} />
        <Route path="assignments" element={<StudentAssignments />} />
        <Route path="grades" element={<Grades />} />
        <Route path="discussion" element={<Discussion />} />
        <Route path="notes" element={<StudentNotes />} />
        <Route path="assignments/:id" element={<AssignmentDetails />} />
        <Route path="notes/:id" element={<NotesReader />} />
        <Route path="exam/:id" element={<ExamInterface />} />
        <Route path="exam/practice" element={<PracticeTestBuilder />} />
        <Route path="custom-test" element={<CustomTestBuilder />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="*" element={<Navigate to="/student" replace />} />
      </Routes>
    );
  };

  return (
    <div className="student-dashboard">
      <div className="student-sidebar">
        <div className="sidebar-header">
          <div className="profile-picture" onClick={() => setShowProfileDropdown(!showProfileDropdown)} ref={profileRef}>
            {profileData.photo ? (
              <img src={profileData.photo} alt="Profile" className="student-avatar" />
            ) : (
              <div className="default-avatar">
                <FaUserCircle />
                <div className="avatar-badge"></div>
              </div>
            )}
          </div>
          <div className="profile-info">
            <h3>{currentUser ? currentUser.fullName : 'Student'}</h3>
            <p className="student-info">{currentUser ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) : 'Student'}</p>
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
            <FaGraduationCap className="section-icon" /> Academics
          </div>
          <nav className="sidebar-nav">
            <Link to="/student" className={pathname === '/student' ? 'active' : ''}>
              <FaHome /> <span>Dashboard</span>
            </Link>
            <Link to="/student/courses" className={pathname.includes('/student/courses') ? 'active' : ''}>
              <FaBookOpen /> <span>My Courses</span>
            </Link>
            <Link to="/student/assignments" className={pathname.includes('/student/assignments') ? 'active' : ''}>
              <FaClipboardList /> <span>Assignments</span>
            </Link>
            <Link to="/student/notes" className={pathname.includes('/student/notes') ? 'active' : ''}>
              <FaFileAlt /> <span>Notes & Materials</span>
            </Link>
            <Link to="/student/grades" className={pathname.includes('/student/grades') ? 'active' : ''}>
              <FaChartBar /> <span>Grades</span>
            </Link>
            <Link to="/student/discussion" className={pathname.includes('/student/discussion') ? 'active' : ''}>
              <FaComments /> <span>Discussion</span>
            </Link>
            <Link to="/student/exam/practice" className={pathname.includes('/student/exam/practice') ? 'active' : ''}>
              <FaBrain /> <span>Practice Tests</span>
            </Link>
            <Link to="/student/custom-test" className={pathname.includes('/student/custom-test') ? 'active' : ''}>
              <FaPlus /> <span>Create Custom Test</span>
            </Link>
          </nav>
        </div>
      </div>

      <div className="student-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default StudentDashboard; 