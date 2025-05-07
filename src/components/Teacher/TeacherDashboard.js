import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Teacher-specific components
const TeacherHome = () => (
  <>
    <div className="welcome-section">
      <h3>Welcome, Teacher!</h3>
      <div className="quick-stats">
        <div className="stat-card">
          <h4>Your Classes</h4>
          <p>3</p>
        </div>
        <div className="stat-card">
          <h4>Pending Assignments</h4>
          <p>5</p>
        </div>
        <div className="stat-card">
          <h4>Students</h4>
          <p>45</p>
        </div>
      </div>
    </div>
    <div className="recent-activity">
      <h3>Recent Activity</h3>
      <div className="activity-list">
        <div className="activity-item">
          <p><strong>Assignment submitted:</strong> John D. completed Math Quiz</p>
          <span>Today, 10:30 AM</span>
        </div>
        <div className="activity-item">
          <p><strong>Question asked:</strong> Sarah M. asked a question in Physics</p>
          <span>Yesterday, 3:45 PM</span>
        </div>
      </div>
    </div>
  </>
);

const AssignmentsManager = () => (
  <div className="assignments-container">
    <h3>Assignments Manager</h3>
    <div className="assignments-actions">
      <button className="action-button">Create New Assignment</button>
      <button className="action-button">Import From Library</button>
    </div>
    <div className="assignment-list">
      <div className="assignment-item">
        <div className="assignment-header">
          <h4>Week 3 Quiz</h4>
          <div className="assignment-status published">Published</div>
        </div>
        <p>Math 101 • Due: June 15, 2023</p>
        <div className="assignment-stats">
          <span>24/30 Submitted</span>
          <span>15 Graded</span>
        </div>
        <div className="assignment-actions">
          <button>Edit</button>
          <button>Grade</button>
          <button>Details</button>
        </div>
      </div>
      <div className="assignment-item">
        <div className="assignment-header">
          <h4>Final Project</h4>
          <div className="assignment-status draft">Draft</div>
        </div>
        <p>Computer Science • Due: July 10, 2023</p>
        <div className="assignment-stats">
          <span>Not published yet</span>
        </div>
        <div className="assignment-actions">
          <button>Edit</button>
          <button>Publish</button>
          <button>Delete</button>
        </div>
      </div>
    </div>
  </div>
);

const GradingTool = () => (
  <div className="grading-container">
    <h3>Grading Tool</h3>
    <div className="class-selector">
      <select>
        <option>Math 101</option>
        <option>Physics 202</option>
        <option>Computer Science 110</option>
      </select>
    </div>
    <table className="grading-table">
      <thead>
        <tr>
          <th>Student</th>
          <th>Assignment 1</th>
          <th>Assignment 2</th>
          <th>Midterm</th>
          <th>Final</th>
          <th>Overall</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>John Doe</td>
          <td>85%</td>
          <td>92%</td>
          <td>78%</td>
          <td>--</td>
          <td>85%</td>
        </tr>
        <tr>
          <td>Sarah Miller</td>
          <td>90%</td>
          <td>88%</td>
          <td>94%</td>
          <td>--</td>
          <td>91%</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const AttendanceTracker = () => (
  <div className="attendance-container">
    <h3>Attendance Tracker</h3>
    <div className="class-date-selector">
      <select>
        <option>Math 101</option>
        <option>Physics 202</option>
        <option>Computer Science 110</option>
      </select>
      <input type="date" defaultValue="2023-06-10" />
    </div>
    <div className="attendance-list">
      <div className="attendance-item">
        <span>John Doe</span>
        <div className="attendance-actions">
          <button className="present">Present</button>
          <button className="absent">Absent</button>
          <button className="late">Late</button>
        </div>
      </div>
      <div className="attendance-item">
        <span>Sarah Miller</span>
        <div className="attendance-actions">
          <button className="present active">Present</button>
          <button className="absent">Absent</button>
          <button className="late">Late</button>
        </div>
      </div>
    </div>
  </div>
);

const AnnouncementsManager = () => {
  const [announcement, setAnnouncement] = useState('');
  
  return (
    <div className="announcements-container">
      <h3>Announcements</h3>
      <div className="new-announcement">
        <textarea 
          placeholder="Type your announcement here..." 
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
        />
        <div className="announcement-options">
          <select>
            <option>All Classes</option>
            <option>Math 101</option>
            <option>Physics 202</option>
          </select>
          <button>Post Announcement</button>
        </div>
      </div>
      <div className="announcements-list">
        <div className="announcement-item">
          <h4>Reminder: Final Project Due Next Week</h4>
          <p>Don't forget that your final projects are due next Friday. Office hours will be extended this week.</p>
          <div className="announcement-meta">
            <span>Posted to: All Classes</span>
            <span>June 5, 2023</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeacherDashboard = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'John submitted his assignment', read: false },
    { id: 2, text: 'New question in Physics forum', read: false }
  ]);
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Professor Smith',
    bio: 'Mathematics and Computer Science Teacher',
    photo: null
  });

  return (
    <div className="dashboard teacher-dashboard">
      <header className="dashboard-header">
        <h2>DigiClass - Teacher Portal</h2>
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
          <ul>
            <li><Link to="/teacher">Home</Link></li>
            <li><Link to="/teacher/assignments">Assignments</Link></li>
            <li><Link to="/teacher/grading">Grading</Link></li>
            <li><Link to="/teacher/attendance">Attendance</Link></li>
            <li><Link to="/teacher/announcements">Announcements</Link></li>
            <li><Link to="/logout">Logout</Link></li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<TeacherHome />} />
            <Route path="/assignments" element={<AssignmentsManager />} />
            <Route path="/grading" element={<GradingTool />} />
            <Route path="/attendance" element={<AttendanceTracker />} />
            <Route path="/announcements" element={<AnnouncementsManager />} />
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

export default TeacherDashboard; 