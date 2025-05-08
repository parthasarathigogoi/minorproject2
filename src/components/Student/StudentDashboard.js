import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useBranding } from '../../context/BrandingContext';
import { useExam } from '../../context/ExamContext';
import { useAuth } from '../../context/AuthContext';
import { FaUserGraduate, FaBookOpen, FaClipboardList, FaBook, FaFileAlt, FaCalendarAlt, FaClipboardCheck, FaPencilAlt, FaClock, FaLink, FaFileUpload, FaTasks, FaCheckCircle, FaFileDownload, FaExclamationTriangle, FaHome, FaChartBar, FaComments, FaUserCircle, FaCog, FaSignOutAlt, FaBell, FaGraduationCap, FaBrain } from 'react-icons/fa';
import '../../styles/StudentDashboard.css';
import '../../styles/PracticeTestBuilder.css';
import NotesViewer from '../common/NotesViewer';
import AssignmentManager from '../common/AssignmentManager';
import PracticeTestBuilder from './PracticeTestBuilder';

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

// Student Exam component
const ExamInterface = () => {
  const { loading, error, availableSubjects, fetchQuestions, saveExamResult } = useExam();
  
  const [examState, setExamState] = useState({
    isLoading: false,
    isStarted: false,
    isSubmitted: false,
    totalTime: 0,
    timeRemaining: 0,
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    examName: '',
    totalMarks: 0,
    earnedMarks: 0
  });
  
  const [examConfiguration, setExamConfiguration] = useState({
    subjects: [],
    duration: 60,
    questionCounts: {
      "2": 2,  // 2 marks questions
      "3": 2,  // 3 marks questions
      "4": 1,  // 4 marks questions
      "10": 0, // 10 marks questions
    }
  });
  
  const timer = useRef(null);
  
  const generateExam = useCallback(async () => {
    if (examConfiguration.subjects.length === 0) {
      alert("Please select at least one subject");
      return false;
    }
    
    // Check if user has selected any questions
    const totalQuestions = Object.values(examConfiguration.questionCounts).reduce((sum, count) => sum + count, 0);
    if (totalQuestions === 0) {
      alert("Please select at least one question");
      return false;
    }
    
    setExamState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Fetch questions from backend
      const result = await fetchQuestions({
        subjects: examConfiguration.subjects,
        questionCounts: examConfiguration.questionCounts
      });
      
      if (!result || !result.questions) {
        throw new Error("Failed to fetch questions");
      }
      
      // Combine questions from all mark categories
      let allQuestions = [];
      for (const markValue in result.questions) {
        allQuestions = [...allQuestions, ...result.questions[markValue]];
      }
      
      // If we don't have enough questions
      if (allQuestions.length === 0) {
        setExamState(prev => ({ ...prev, isLoading: false }));
        alert("No questions found matching your criteria. Try selecting different subjects or question types.");
        return false;
      }
      
      // Shuffle the final selection
      const shuffledFinal = [...allQuestions].sort(() => 0.5 - Math.random());
      
      // Calculate total marks
      const totalMarks = shuffledFinal.reduce((sum, q) => sum + q.marks, 0);
      
      setExamState(prev => ({
        ...prev,
        isLoading: false,
        questions: shuffledFinal,
        totalMarks,
        timeRemaining: examConfiguration.duration * 60,
        totalTime: examConfiguration.duration * 60,
        examName: `Custom Practice Exam - ${examConfiguration.subjects.join(", ")}`
      }));
      
      return true;
    } catch (err) {
      console.error("Error generating exam:", err);
      setExamState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: "Failed to create your practice test. Please try again later."
      }));
      return false;
    }
  }, [examConfiguration, fetchQuestions]);
  
  const startExam = async () => {
    // Validate and generate the exam
    const success = await generateExam();
    if (!success) return;
    
    setExamState(prev => ({
      ...prev,
      isStarted: true
    }));
    
    // Start timer
    timer.current = setInterval(() => {
      setExamState(prev => {
        if (prev.timeRemaining <= 1) {
          clearInterval(timer.current);
          // Auto-submit when time runs out
          return {
            ...prev,
            timeRemaining: 0,
            isSubmitted: true
          };
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        };
      });
    }, 1000);
  };
  
  const handleAnswer = (questionId, optionIndex) => {
    setExamState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: optionIndex
      }
    }));
  };
  
  const moveToQuestion = (index) => {
    setExamState(prev => ({
      ...prev,
      currentQuestionIndex: index
    }));
  };
  
  const submitExam = async () => {
    clearInterval(timer.current);
    
    // Calculate earned marks
    let earnedMarks = 0;
    examState.questions.forEach(question => {
      if (examState.answers[question.id] === question.correctAnswer) {
        earnedMarks += question.marks;
      }
    });
    
    setExamState(prev => ({
      ...prev,
      isSubmitted: true,
      earnedMarks
    }));
    
    // Save results to backend
    try {
      const examResult = {
        examName: examState.examName,
        totalMarks: examState.totalMarks,
        earnedMarks,
        duration: examState.totalTime,
        timeTaken: examState.totalTime - examState.timeRemaining,
        questions: examState.questions.map(q => ({
          id: q.id,
          marks: q.marks,
          type: q.type,
          correct: examState.answers[q.id] === q.correctAnswer
        })),
        submittedAt: new Date().toISOString()
      };
      
      await saveExamResult(examResult);
    } catch (err) {
      console.error("Error saving exam result:", err);
      // Continue showing results even if saving failed
    }
  };
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const calculateProgress = () => {
    const answeredCount = Object.keys(examState.answers).length;
    return Math.round((answeredCount / examState.questions.length) * 100);
  };
  
  const restartExam = () => {
    // Reset all configuration
    setExamConfiguration({
      subjects: [],
      duration: 60,
      questionCounts: {
        "2": 2,
        "3": 2,
        "4": 1,
        "10": 0,
      }
    });
    
    setExamState(prev => ({
      ...prev,
      isStarted: false,
      isSubmitted: false,
      currentQuestionIndex: 0,
      answers: {},
      questions: []
    }));
  };
  
  const handleSubjectChange = (subject) => {
    setExamConfiguration(prev => {
      const subjects = prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject];
      
      return {
        ...prev,
        subjects
      };
    });
  };
  
  const handleQuestionCountChange = (markValue, count) => {
    setExamConfiguration(prev => ({
      ...prev,
      questionCounts: {
        ...prev.questionCounts,
        [markValue]: parseInt(count, 10)
      }
    }));
  };
  
  const calculateTotalQuestions = () => {
    return Object.values(examConfiguration.questionCounts).reduce((sum, count) => sum + count, 0);
  };
  
  const calculateEstimatedMarks = () => {
    let total = 0;
    for (const markValue in examConfiguration.questionCounts) {
      total += parseInt(markValue, 10) * examConfiguration.questionCounts[markValue];
    }
    return total;
  };
  
  // Display main loading state
  if (loading && !examState.isStarted) {
    return (
      <div className="exam-loading">
        <h3>Loading Exam Builder...</h3>
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  // Display error state
  if (error && !examState.isStarted) {
    return (
      <div className="exam-error">
        <FaExclamationTriangle className="error-icon" />
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button className="retry-btn" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }
  
  // Display exam state loading
  if (examState.isLoading) {
    return (
      <div className="exam-loading">
        <h3>Preparing your personalized practice exam...</h3>
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  if (!examState.isStarted) {
    return (
      <div className="exam-interface">
        <div className="exam-setup-container">
          <h3>Custom Practice Exam Builder</h3>
          
          <div className="setup-section">
            <h4>1. Select Subjects</h4>
            <p className="setup-description">Choose one or more subjects for your practice exam</p>
            
            <div className="subject-selection">
              {availableSubjects.map(subject => (
                <div 
                  key={subject}
                  className={`subject-chip ${examConfiguration.subjects.includes(subject) ? 'selected' : ''}`}
                  onClick={() => handleSubjectChange(subject)}
                >
                  {subject}
                </div>
              ))}
            </div>
          </div>
          
          <div className="setup-section">
            <h4>2. Select Question Types</h4>
            <p className="setup-description">Choose how many questions you want for each mark value</p>
            
            <div className="question-type-grid">
              <div className="question-type-card">
                <div className="question-type-header">
                  <h5>2 Marks Questions</h5>
                  <span className="mark-badge">2</span>
                </div>
                <p>Short concept-based questions</p>
                <div className="question-count-control">
                  <button 
                    className="count-btn" 
                    onClick={() => handleQuestionCountChange("2", Math.max(0, examConfiguration.questionCounts["2"] - 1))}
                  >-</button>
                  <span className="count-display">{examConfiguration.questionCounts["2"]}</span>
                  <button 
                    className="count-btn" 
                    onClick={() => handleQuestionCountChange("2", examConfiguration.questionCounts["2"] + 1)}
                  >+</button>
                </div>
              </div>
              
              <div className="question-type-card">
                <div className="question-type-header">
                  <h5>3 Marks Questions</h5>
                  <span className="mark-badge">3</span>
                </div>
                <p>Moderate difficulty questions</p>
                <div className="question-count-control">
                  <button 
                    className="count-btn" 
                    onClick={() => handleQuestionCountChange("3", Math.max(0, examConfiguration.questionCounts["3"] - 1))}
                  >-</button>
                  <span className="count-display">{examConfiguration.questionCounts["3"]}</span>
                  <button 
                    className="count-btn" 
                    onClick={() => handleQuestionCountChange("3", examConfiguration.questionCounts["3"] + 1)}
                  >+</button>
                </div>
              </div>
              
              <div className="question-type-card">
                <div className="question-type-header">
                  <h5>4 Marks Questions</h5>
                  <span className="mark-badge">4</span>
                </div>
                <p>Complex application questions</p>
                <div className="question-count-control">
                  <button 
                    className="count-btn" 
                    onClick={() => handleQuestionCountChange("4", Math.max(0, examConfiguration.questionCounts["4"] - 1))}
                  >-</button>
                  <span className="count-display">{examConfiguration.questionCounts["4"]}</span>
                  <button 
                    className="count-btn" 
                    onClick={() => handleQuestionCountChange("4", examConfiguration.questionCounts["4"] + 1)}
                  >+</button>
                </div>
              </div>
              
              <div className="question-type-card">
                <div className="question-type-header">
                  <h5>10 Marks Questions</h5>
                  <span className="mark-badge">10</span>
                </div>
                <p>In-depth descriptive questions</p>
                <div className="question-count-control">
                  <button 
                    className="count-btn" 
                    onClick={() => handleQuestionCountChange("10", Math.max(0, examConfiguration.questionCounts["10"] - 1))}
                  >-</button>
                  <span className="count-display">{examConfiguration.questionCounts["10"]}</span>
                  <button 
                    className="count-btn" 
                    onClick={() => handleQuestionCountChange("10", examConfiguration.questionCounts["10"] + 1)}
                  >+</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="setup-section">
            <h4>3. Set Test Duration</h4>
            <p className="setup-description">How long do you want your practice test to be?</p>
            
            <div className="duration-selector">
              <input 
                type="range" 
                min="15" 
                max="180" 
                step="15" 
                value={examConfiguration.duration} 
                onChange={(e) => setExamConfiguration(prev => ({ ...prev, duration: parseInt(e.target.value, 10) }))}
                className="duration-slider"
              />
              <div className="duration-display">
                <span className="duration-value">{examConfiguration.duration} minutes</span>
                <div className="duration-labels">
                  <span>15m</span>
                  <span>1h</span>
                  <span>2h</span>
                  <span>3h</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="exam-summary">
            <div className="summary-item">
              <span className="summary-label">Selected Subjects:</span>
              <span className="summary-value">
                {examConfiguration.subjects.length > 0 
                  ? examConfiguration.subjects.join(", ") 
                  : "None selected"}
              </span>
            </div>
            
            <div className="summary-item">
              <span className="summary-label">Total Questions:</span>
              <span className="summary-value">{calculateTotalQuestions()}</span>
            </div>
            
            <div className="summary-item">
              <span className="summary-label">Total Marks:</span>
              <span className="summary-value">{calculateEstimatedMarks()}</span>
            </div>
            
            <div className="summary-item">
              <span className="summary-label">Test Duration:</span>
              <span className="summary-value">{examConfiguration.duration} minutes</span>
            </div>
          </div>
          
          <button 
            className="generate-exam-btn" 
            onClick={startExam}
            disabled={examConfiguration.subjects.length === 0 || calculateTotalQuestions() === 0 || loading}
          >
            {loading ? "Loading..." : "Generate Practice Test"}
          </button>
          
          <div className="exam-disclaimer">
            <p>Questions will be randomly selected from the teacher-uploaded question pool.</p>
            <p>This is a practice exam. Your results will not affect your grades.</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (examState.isSubmitted) {
    const percentage = Math.round((examState.earnedMarks / examState.totalMarks) * 100);
    let feedbackMessage;
    
    if (percentage >= 90) {
      feedbackMessage = "Excellent work! You've mastered this material.";
    } else if (percentage >= 70) {
      feedbackMessage = "Good job! You're well on your way to understanding the concepts.";
    } else if (percentage >= 50) {
      feedbackMessage = "You're making progress! Review the concepts you missed and try again.";
    } else {
      feedbackMessage = "Keep practicing! Focus on the fundamentals before moving forward.";
    }
    
    return (
      <div className="exam-interface">
        <div className="exam-results-container">
          <h3>Exam Results</h3>
          
          <div className="results-summary">
            <div className="result-score">
              <div className="score-circle" style={{ '--percentage': `${percentage}%` }}>
                <span className="score-value">{percentage}%</span>
              </div>
              <p className="score-text">Your Score</p>
            </div>
            
            <div className="result-details">
              <p><strong>Exam:</strong> {examState.examName}</p>
              <p><strong>Marks:</strong> {examState.earnedMarks} out of {examState.totalMarks}</p>
              <p><strong>Time Taken:</strong> {formatTime(examState.totalTime - examState.timeRemaining)} of {formatTime(examState.totalTime)}</p>
              <p><strong>Questions Answered:</strong> {Object.keys(examState.answers).length} of {examState.questions.length}</p>
            </div>
          </div>
          
          <div className="result-feedback">
            <h4>Feedback</h4>
            <p>{feedbackMessage}</p>
          </div>
          
          <div className="question-review">
            <h4>Question Review</h4>
            {examState.questions.map((question, index) => (
              <div 
                key={question.id} 
                className={`review-question ${examState.answers[question.id] === question.correctAnswer ? 'correct' : 'incorrect'}`}
              >
                <div className="question-number">Question {index + 1}</div>
                <p>{question.text}</p>
                {question.type === "multiple_choice" && (
                  <div className="option-list">
                    {question.options.map((option, idx) => (
                      <div 
                        key={idx} 
                        className={`option ${examState.answers[question.id] === idx ? 'selected' : ''} ${question.correctAnswer === idx ? 'correct' : ''}`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
                <div className="question-marks">Marks: {question.marks}</div>
              </div>
            ))}
          </div>
          
          <div className="results-actions">
            <button 
              className="restart-btn" 
              onClick={restartExam}
              disabled={loading}
            >
              Create New Practice Exam
            </button>
            <button className="review-btn">
              Download Result
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const currentQuestion = examState.questions[examState.currentQuestionIndex];
  
  return (
    <div className="exam-interface">
      <div className="exam-header">
        <h3>{examState.examName}</h3>
        <div className="exam-timer">
          <div className="timer-icon">⏱️</div>
          <div className="timer-display">
            {formatTime(examState.timeRemaining)}
          </div>
        </div>
      </div>
      
      <div className="exam-progress">
        <div className="progress-text">
          Progress: {Object.keys(examState.answers).length} / {examState.questions.length} questions answered
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
      </div>
      
      <div className="exam-content">
        <div className="question-container">
          <div className="question-header">
            <div className="question-number">
              Question {examState.currentQuestionIndex + 1} of {examState.questions.length}
            </div>
            <div className="question-marks">
              Marks: {currentQuestion.marks}
            </div>
          </div>
          
          <div className="question-text">
            {currentQuestion.text}
          </div>
          
          {currentQuestion.type === "multiple_choice" && (
            <div className="options-container">
              {currentQuestion.options.map((option, index) => (
                <div 
                  key={index}
                  className={`option ${examState.answers[currentQuestion.id] === index ? 'selected' : ''}`}
                  onClick={() => handleAnswer(currentQuestion.id, index)}
                >
                  <div className="option-marker">{String.fromCharCode(65 + index)}</div>
                  <div className="option-text">{option}</div>
                </div>
              ))}
            </div>
          )}
          
          {currentQuestion.type === "descriptive" && (
            <div className="descriptive-answer">
              <textarea 
                placeholder="Type your answer here..." 
                rows="6" 
                className="descriptive-input"
                onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                value={examState.answers[currentQuestion.id] || ''}
              ></textarea>
            </div>
          )}
        </div>
        
        <div className="question-navigation">
          <button 
            className="nav-btn"
            onClick={() => moveToQuestion(Math.max(0, examState.currentQuestionIndex - 1))}
            disabled={examState.currentQuestionIndex === 0}
          >
            Previous
          </button>
          
          <div className="question-indicators">
            {examState.questions.map((q, index) => (
              <div 
                key={index}
                className={`
                  question-indicator 
                  ${index === examState.currentQuestionIndex ? 'current' : ''}
                  ${examState.answers[q.id] !== undefined ? 'answered' : ''}
                `}
                onClick={() => moveToQuestion(index)}
              >
                {index + 1}
              </div>
            ))}
          </div>
          
          <button 
            className="nav-btn"
            onClick={() => moveToQuestion(Math.min(examState.questions.length - 1, examState.currentQuestionIndex + 1))}
            disabled={examState.currentQuestionIndex === examState.questions.length - 1}
          >
            Next
          </button>
        </div>
      </div>
      
      <div className="exam-actions">
        <button 
          className="submit-exam-btn"
          onClick={submitExam}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Exam"}
        </button>
      </div>
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
        <Route path="*" element={<StudentHome />} />
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