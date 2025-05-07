import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useBranding } from '../../context/BrandingContext';

// Student-specific components
const StudentHome = () => (
  <>
    <div className="welcome-section">
      <h3>Welcome, Student!</h3>
      <div className="quick-stats">
        <div className="stat-card">
          <h4>Enrolled Classes</h4>
          <p>4</p>
        </div>
        <div className="stat-card">
          <h4>Pending Assignments</h4>
          <p>3</p>
        </div>
        <div className="stat-card">
          <h4>Overall Grade</h4>
          <p>A-</p>
        </div>
      </div>
    </div>
    <div className="upcoming-deadlines">
      <h3>Upcoming Deadlines</h3>
      <div className="deadline-list">
        <div className="deadline-item">
          <h4>Math Quiz</h4>
          <p>Due: Tomorrow, 11:59 PM</p>
        </div>
        <div className="deadline-item">
          <h4>Physics Lab Report</h4>
          <p>Due: June 15, 2023</p>
        </div>
      </div>
    </div>
    <div className="recent-activity">
      <h3>Recent Activity</h3>
      <div className="activity-list">
        <div className="activity-item">
          <p><strong>Grade Posted:</strong> 92% on Computer Science Quiz</p>
          <span>Yesterday, 2:30 PM</span>
        </div>
        <div className="activity-item">
          <p><strong>New Assignment:</strong> Physics Lab Report assigned</p>
          <span>June 5, 2023</span>
        </div>
      </div>
    </div>
  </>
);

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

const StudentDashboard = () => {
  const { branding } = useBranding();
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New grade posted in Computer Science', read: false },
    { id: 2, text: 'New assignment in Physics', read: false },
    { id: 3, text: 'Teacher posted an announcement', read: false }
  ]);
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Alex Johnson',
    bio: 'Computer Science major, Junior year',
    photo: null
  });

  return (
    <div className="dashboard student-dashboard">
      <header className="dashboard-header">
        <h2>{branding.institutionName} - Student Portal</h2>
        <div className="header-actions">
          <div className="notifications">
            <span className="notification-icon">🔔</span>
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </div>
          <div className="profile-icon" onClick={() => setShowProfile(!showProfile)}>
            <img src={profileData.photo || 'https://via.placeholder.com/50'} alt="Profile" />
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <nav className="sidebar">
          {branding.logo && (
            <div className="sidebar-logo">
              <img src={branding.logo} alt={`${branding.institutionName} Logo`} />
            </div>
          )}
          <ul>
            <li><Link to="/student">Home</Link></li>
            <li><Link to="/student/courses">My Courses</Link></li>
            <li><Link to="/student/assignments">Assignments</Link></li>
            <li><Link to="/student/grades">Grades</Link></li>
            <li><Link to="/student/discussion">Discussion</Link></li>
            <li><Link to="/logout">Logout</Link></li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<StudentHome />} />
            <Route path="/courses" element={<CoursesList />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/grades" element={<Grades />} />
            <Route path="/discussion" element={<Discussion />} />
          </Routes>
        </main>
      </div>

      {showProfile && (
        <div className="profile-modal">
          <h3>Edit Profile</h3>
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
            placeholder="Name"
          />
          <textarea
            name="bio"
            value={profileData.bio}
            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
            placeholder="Bio"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setProfileData({...profileData, photo: URL.createObjectURL(file)});
              }
            }}
          />
          <button onClick={() => setShowProfile(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard; 