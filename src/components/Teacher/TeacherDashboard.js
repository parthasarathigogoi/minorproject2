import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { FaClipboardList, FaFileUpload, FaChalkboardTeacher, FaShareAlt, FaBook, FaClipboard, FaCalculator, FaFileAlt, FaRocket, FaUserCheck, FaBullhorn } from 'react-icons/fa';
import '../../styles/TeacherDashboard.css';
import NotesViewer from '../common/NotesViewer';
import AssignmentManager from '../common/AssignmentManager';

// Teacher-specific components
const TeacherHome = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  
  // Dummy data for subjects
  const subjects = [
    { id: 1, name: 'Mathematics 101', code: 'MATH101', students: 32, color: '#3563E9' },
    { id: 2, name: 'Physics', code: 'PHYS202', students: 28, color: '#00C853' },
    { id: 3, name: 'Computer Science', code: 'CS110', students: 25, color: '#FF6D00' },
  ];
  
  // Dummy data for recent documents
  const recentDocuments = [
    { id: 1, name: 'Calculus Quiz.pdf', type: 'Quiz', date: '2023-06-10', size: '1.2 MB' },
    { id: 2, name: 'Physics Homework.docx', type: 'Assignment', date: '2023-06-08', size: '850 KB' },
    { id: 3, name: 'Programming Lesson.pptx', type: 'Lesson', date: '2023-06-05', size: '4.6 MB' },
  ];
  
  // Dummy data for upcoming exams
  const upcomingExams = [
    { id: 1, name: 'Mid-term Exam', subject: 'Mathematics 101', date: '2023-06-20', status: 'Scheduled' },
    { id: 2, name: 'Physics Quiz', subject: 'Physics', date: '2023-06-15', status: 'Draft' },
  ];

  return (
    <div className="teacher-home">
      <section className="welcome-banner">
        <div className="welcome-text">
          <h2>Welcome, Professor Smith</h2>
          <p>Tuesday, June 13, 2023 | <span className="highlight">3 Classes Today</span></p>
        </div>
        <div className="quick-stats">
          <div className="stat-item">
            <div className="stat-value">3</div>
            <div className="stat-label">Classes</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">85</div>
            <div className="stat-label">Students</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">12</div>
            <div className="stat-label">Assignments</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">5</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
      </section>
      
      <section className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-cards">
          <div className="action-card" onClick={() => setShowUploadModal(true)}>
            <div className="card-icon upload">
              <FaFileUpload />
            </div>
            <h4>Upload Questions</h4>
            <p>Create questions with marks</p>
          </div>
          
          <div className="action-card" onClick={() => setShowAssignmentModal(true)}>
            <div className="card-icon assignment">
              <FaClipboardList />
            </div>
            <h4>Give Assignments</h4>
            <p>Create and distribute tasks</p>
          </div>
          
          <div className="action-card" onClick={() => setShowShareModal(true)}>
            <div className="card-icon share">
              <FaShareAlt />
            </div>
            <h4>Share Subject</h4>
            <p>Share code or link with students</p>
          </div>
          
          <div className="action-card" onClick={() => setShowExamModal(true)}>
            <div className="card-icon exam">
              <FaCalculator />
            </div>
            <h4>Start Practice Exam</h4>
            <p>Begin a timed practice session</p>
          </div>
        </div>
      </section>
      
      <div className="dashboard-grid">
        <section className="subjects-section">
          <div className="section-header">
            <h3>Your Subjects</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="subjects-list">
            {subjects.map(subject => (
              <div className="subject-card" key={subject.id}>
                <div className="subject-color" style={{ backgroundColor: subject.color }}></div>
                <div className="subject-details">
                  <h4>{subject.name}</h4>
                  <div className="subject-meta">
                    <span><FaBook /> {subject.code}</span>
                    <span><FaChalkboardTeacher /> {subject.students} students</span>
                  </div>
                  <div className="subject-actions">
                    <button className="subject-btn">Materials</button>
                    <button className="subject-btn">Grade</button>
                  </div>
                </div>
              </div>
            ))}
            <div className="add-subject-card">
              <div className="add-icon">+</div>
              <p>Add New Subject</p>
            </div>
          </div>
        </section>
        
        <section className="documents-section">
          <div className="section-header">
            <h3>Recent Documents</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="documents-list">
            {recentDocuments.map(doc => (
              <div className="document-item" key={doc.id}>
                <div className="document-icon">
                  <FaFileAlt />
                </div>
                <div className="document-details">
                  <h4>{doc.name}</h4>
                  <div className="document-meta">
                    <span>{doc.type}</span>
                    <span>•</span>
                    <span>{doc.date}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                  </div>
                </div>
                <div className="document-actions">
                  <button className="icon-btn"><FaShareAlt /></button>
                </div>
              </div>
            ))}
          </div>
          <button className="upload-btn">
            <FaFileUpload /> Upload New Document
          </button>
        </section>
        
        <section className="exams-section">
          <div className="section-header">
            <h3>Upcoming Exams</h3>
            <button className="new-exam-btn">+ New Exam</button>
          </div>
          <div className="exams-list">
            {upcomingExams.map(exam => (
              <div className="exam-card" key={exam.id}>
                <div className="exam-header">
                  <h4>{exam.name}</h4>
                  <span className={`exam-status ${exam.status.toLowerCase()}`}>
                    {exam.status}
                  </span>
                </div>
                <div className="exam-details">
                  <p><FaBook /> {exam.subject}</p>
                  <p><FaClipboard /> {exam.date}</p>
                </div>
                <div className="exam-actions">
                  <button className="exam-btn">Edit</button>
                  <button className="exam-btn primary">
                    {exam.status === 'Draft' ? 'Publish' : 'Start'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      
      {/* Upload Questions Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Upload Questions with Marks</h3>
              <button className="close-btn" onClick={() => setShowUploadModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Subject</label>
                <select>
                  <option value="">-- Select Subject --</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Question Type</label>
                <select>
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="short_answer">Short Answer</option>
                  <option value="essay">Essay</option>
                  <option value="true_false">True/False</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Question Text</label>
                <textarea placeholder="Enter your question here..."></textarea>
              </div>
              
              <div className="form-group">
                <label>Marks</label>
                <input type="number" min="1" defaultValue="1" />
              </div>
              
              <div className="form-group">
                <label>Upload Attachments (Optional)</label>
                <div className="file-upload">
                  <input type="file" id="question-attachment" />
                  <label htmlFor="question-attachment">
                    <FaFileUpload /> Choose Files
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowUploadModal(false)}>Cancel</button>
              <button className="save-btn">Save Question</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create Assignment</h3>
              <button className="close-btn" onClick={() => setShowAssignmentModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Title</label>
                <input type="text" placeholder="Assignment title" />
              </div>
              
              <div className="form-group">
                <label>Subject</label>
                <select>
                  <option value="">-- Select Subject --</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Instructions</label>
                <textarea placeholder="Enter instructions for students..."></textarea>
              </div>
              
              <div className="form-row">
                <div className="form-group half">
                  <label>Due Date</label>
                  <input type="date" />
                </div>
                
                <div className="form-group half">
                  <label>Total Points</label>
                  <input type="number" min="1" defaultValue="100" />
                </div>
              </div>
              
              <div className="form-group">
                <label>Attachments</label>
                <div className="file-upload">
                  <input type="file" id="assignment-attachment" multiple />
                  <label htmlFor="assignment-attachment">
                    <FaFileUpload /> Upload Files
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowAssignmentModal(false)}>Cancel</button>
              <button className="draft-btn">Save as Draft</button>
              <button className="save-btn">Publish Assignment</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Share Subject Modal */}
      {showShareModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Share Subject</h3>
              <button className="close-btn" onClick={() => setShowShareModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Select Subject</label>
                <select>
                  <option value="">-- Select Subject --</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="share-options">
                <div className="share-option">
                  <input type="radio" id="share-code" name="share-type" defaultChecked />
                  <label htmlFor="share-code">Share Class Code</label>
                </div>
                <div className="share-option">
                  <input type="radio" id="share-link" name="share-type" />
                  <label htmlFor="share-link">Share Join Link</label>
                </div>
              </div>
              
              <div className="share-code-display">
                <h4>Class Code</h4>
                <div className="code-container">
                  <span className="course-code">MATH101-ABC123</span>
                  <button className="copy-btn">Copy</button>
                </div>
                <p className="help-text">Share this code with your students. They can use it to join this class from their dashboard.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowShareModal(false)}>Close</button>
              <button className="email-btn">Email to Students</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Practice Exam Modal */}
      {showExamModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Start Practice Exam</h3>
              <button className="close-btn" onClick={() => setShowExamModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Exam Title</label>
                <input type="text" placeholder="Practice Exam Title" />
              </div>
              
              <div className="form-group">
                <label>Subject</label>
                <select>
                  <option value="">-- Select Subject --</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group half">
                  <label>Duration (minutes)</label>
                  <input type="number" min="5" defaultValue="60" />
                </div>
                
                <div className="form-group half">
                  <label>Total Points</label>
                  <input type="number" min="1" defaultValue="100" />
                </div>
              </div>
              
              <div className="form-group">
                <label>Question Source</label>
                <div className="exam-options">
                  <div className="exam-option">
                    <input type="radio" id="question-bank" name="question-source" defaultChecked />
                    <label htmlFor="question-bank">From Question Bank</label>
                  </div>
                  <div className="exam-option">
                    <input type="radio" id="upload-new" name="question-source" />
                    <label htmlFor="upload-new">Upload New Questions</label>
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label>Practice Mode Settings</label>
                <div className="checkbox-group">
                  <div className="checkbox-option">
                    <input type="checkbox" id="show-answers" defaultChecked />
                    <label htmlFor="show-answers">Show answers after submission</label>
                  </div>
                  <div className="checkbox-option">
                    <input type="checkbox" id="allow-retake" defaultChecked />
                    <label htmlFor="allow-retake">Allow multiple attempts</label>
                  </div>
                  <div className="checkbox-option">
                    <input type="checkbox" id="randomize" />
                    <label htmlFor="randomize">Randomize question order</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowExamModal(false)}>Cancel</button>
              <button className="save-btn">Create Practice Exam</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NotesManager = () => (
  <div className="teacher-view notes-manager-view">
    <NotesViewer userRole="teacher" />
  </div>
);

const AssignmentsManager = () => (
  <div className="teacher-view assignments-manager-view">
    <AssignmentManager userRole="teacher" />
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
  const [activeSection, setActiveSection] = useState('home');
  const { pathname } = useLocation();

  const renderContent = () => {
    return (
      <Routes>
        <Route index element={<TeacherHome />} />
        <Route path="assignments" element={<AssignmentsManager />} />
        <Route path="grading" element={<GradingTool />} />
        <Route path="attendance" element={<AttendanceTracker />} />
        <Route path="announcements" element={<AnnouncementsManager />} />
        <Route path="notes" element={<NotesManager />} />
        <Route path="*" element={<TeacherHome />} />
      </Routes>
    );
  };

  return (
    <div className="teacher-dashboard">
      <div className="teacher-sidebar">
        <div className="sidebar-header">
          <img src="https://via.placeholder.com/50" alt="Teacher" className="teacher-avatar" />
          <h3>Prof. Smith</h3>
          <p className="teacher-title">Mathematics</p>
        </div>

        <div className="sidebar-section">
          <div className="section-title">Teaching</div>
          <nav className="sidebar-nav">
            <Link to="/teacher" className={pathname === '/teacher' ? 'active' : ''}>
              <FaChalkboardTeacher /> Dashboard
            </Link>
            <Link to="/teacher/assignments" className={pathname.includes('/teacher/assignments') ? 'active' : ''}>
              <FaClipboardList /> Assignments
            </Link>
            <Link to="/teacher/notes" className={pathname.includes('/teacher/notes') ? 'active' : ''}>
              <FaFileAlt /> Notes & Materials
            </Link>
            <Link to="/teacher/grading" className={pathname.includes('/teacher/grading') ? 'active' : ''}>
              <FaCalculator /> Grading
            </Link>
            <Link to="/teacher/attendance" className={pathname.includes('/teacher/attendance') ? 'active' : ''}>
              <FaUserCheck /> Attendance
            </Link>
            <Link to="/teacher/announcements" className={pathname.includes('/teacher/announcements') ? 'active' : ''}>
              <FaBullhorn /> Announcements
            </Link>
          </nav>
        </div>
      </div>

      <div className="teacher-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default TeacherDashboard; 