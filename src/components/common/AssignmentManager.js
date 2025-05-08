import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaCalendarAlt, FaBook, FaTasks, FaUserGraduate, FaCheck, FaHourglassHalf, FaExclamationTriangle, FaChalkboardTeacher, FaFileUpload, FaTrash, FaEdit, FaEye, FaUser, FaDownload } from 'react-icons/fa';
import '../../styles/AssignmentManager.css';

const AssignmentManager = ({ userRole }) => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [tabSelected, setTabSelected] = useState('upcoming');
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    classId: '',
    totalPoints: 100
  });

  // Mock data
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const mockClasses = [
        { id: 'c1', name: 'Mathematics 101', teacher: 'Prof. Smith' },
        { id: 'c2', name: 'Physics', teacher: 'Dr. Johnson' },
        { id: 'c3', name: 'Computer Science', teacher: 'Prof. Davis' },
      ];
      
      const mockAssignments = [
        {
          id: 'a1',
          title: 'Calculus Problem Set',
          description: 'Complete problems 1-20 from Chapter 3. Show all your work clearly.',
          classId: 'c1',
          className: 'Mathematics 101',
          dueDate: '2023-06-15',
          totalPoints: 100,
          status: 'pending',
          created: '2023-06-01',
          attachments: [
            { name: 'Calculus_Problems.pdf', size: '1.2 MB' }
          ],
          submissions: [
            { studentName: 'Alex Johnson', status: 'submitted', date: '2023-06-10', grade: null },
            { studentName: 'Emma Williams', status: 'pending', date: null, grade: null },
            { studentName: 'Michael Brown', status: 'submitted', date: '2023-06-11', grade: 85 }
          ]
        },
        {
          id: 'a2',
          title: 'Physics Lab Report',
          description: 'Write a comprehensive lab report on the electricity experiment. Include all measurements and observations.',
          classId: 'c2',
          className: 'Physics',
          dueDate: '2023-06-18',
          totalPoints: 150,
          status: 'pending',
          created: '2023-06-05',
          attachments: [
            { name: 'Lab_Instructions.pdf', size: '2.5 MB' },
            { name: 'Data_Sheet.xlsx', size: '450 KB' }
          ],
          submissions: [
            { studentName: 'Alex Johnson', status: 'pending', date: null, grade: null },
            { studentName: 'Emma Williams', status: 'submitted', date: '2023-06-12', grade: 142 },
            { studentName: 'Michael Brown', status: 'pending', date: null, grade: null }
          ]
        },
        {
          id: 'a3',
          title: 'Programming Assignment',
          description: 'Create a web application using React that implements the requirements specified in the attached document.',
          classId: 'c3',
          className: 'Computer Science',
          dueDate: '2023-06-20',
          totalPoints: 200,
          status: 'pending',
          created: '2023-06-08',
          attachments: [
            { name: 'Requirements.pdf', size: '1.8 MB' },
            { name: 'Starter_Code.zip', size: '5.2 MB' }
          ],
          submissions: [
            { studentName: 'Alex Johnson', status: 'submitted', date: '2023-06-11', grade: 180 },
            { studentName: 'Emma Williams', status: 'pending', date: null, grade: null },
            { studentName: 'Michael Brown', status: 'late', date: '2023-06-22', grade: 160 }
          ]
        },
        {
          id: 'a4',
          title: 'Algebra Quiz',
          description: 'Complete the online quiz on algebraic equations. You will have 45 minutes to finish once started.',
          classId: 'c1',
          className: 'Mathematics 101',
          dueDate: '2023-05-30',
          totalPoints: 50,
          status: 'completed',
          created: '2023-05-20',
          attachments: [
            { name: 'Study_Guide.pdf', size: '950 KB' }
          ],
          submissions: [
            { studentName: 'Alex Johnson', status: 'submitted', date: '2023-05-29', grade: 45 },
            { studentName: 'Emma Williams', status: 'submitted', date: '2023-05-30', grade: 48 },
            { studentName: 'Michael Brown', status: 'submitted', date: '2023-05-28', grade: 40 }
          ]
        },
      ];
      
      setClasses(mockClasses);
      setAssignments(mockAssignments);
      setIsLoading(false);
    }, 800);
  }, []);

  // Filter assignments based on selected tab and class
  const filteredAssignments = assignments.filter(assignment => {
    const classMatch = selectedClass === 'all' || assignment.classId === selectedClass;
    
    if (tabSelected === 'upcoming') {
      return classMatch && assignment.status === 'pending';
    } else if (tabSelected === 'completed') {
      return classMatch && assignment.status === 'completed';
    } else if (tabSelected === 'late') {
      return classMatch && assignment.status === 'late';
    }
    
    return classMatch;
  });

  // For students: find their own submissions
  const getMySubmission = (assignment) => {
    // In a real app, you would get the logged-in student name
    const studentName = 'Alex Johnson';
    return assignment.submissions.find(sub => sub.studentName === studentName);
  };

  // Handle creating a new assignment (for teachers)
  const handleCreateAssignment = () => {
    if (!newAssignment.title || !newAssignment.dueDate || !newAssignment.classId) {
      alert('Please fill in all required fields');
      return;
    }
    
    // In a real app, this would be an API call
    const newAssignmentObj = {
      id: `a${assignments.length + 1}`,
      ...newAssignment,
      className: classes.find(c => c.id === newAssignment.classId).name,
      status: 'pending',
      created: new Date().toISOString().slice(0, 10),
      attachments: [],
      submissions: []
    };
    
    setAssignments([...assignments, newAssignmentObj]);
    setShowCreateModal(false);
    setNewAssignment({
      title: '',
      description: '',
      dueDate: '',
      classId: '',
      totalPoints: 100
    });
  };

  // Format date for better display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge 
  const getStatusBadge = (status) => {
    switch(status) {
      case 'submitted':
        return <span className="status-badge submitted"><FaCheck /> Submitted</span>;
      case 'late':
        return <span className="status-badge late"><FaExclamationTriangle /> Late</span>;
      case 'pending':
        return <span className="status-badge pending"><FaHourglassHalf /> Pending</span>;
      case 'completed':
        return <span className="status-badge completed"><FaCheck /> Completed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="assignment-manager">
      <div className="assignments-header">
        <h2>Assignments</h2>
        
        <div className="filter-controls">
          <div className="class-filter">
            <label>Class:</label>
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="all">All Classes</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
          
          {userRole === 'teacher' && (
            <button 
              className="create-btn"
              onClick={() => setShowCreateModal(true)}
            >
              + Create Assignment
            </button>
          )}
        </div>
      </div>
      
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${tabSelected === 'upcoming' ? 'active' : ''}`}
          onClick={() => setTabSelected('upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={`tab-btn ${tabSelected === 'completed' ? 'active' : ''}`}
          onClick={() => setTabSelected('completed')}
        >
          Completed
        </button>
        {userRole === 'teacher' && (
          <button 
            className={`tab-btn ${tabSelected === 'all' ? 'active' : ''}`}
            onClick={() => setTabSelected('all')}
          >
            All Assignments
          </button>
        )}
        {userRole === 'student' && (
          <button 
            className={`tab-btn ${tabSelected === 'late' ? 'active' : ''}`}
            onClick={() => setTabSelected('late')}
          >
            Late
          </button>
        )}
      </div>
      
      <div className="assignments-content">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading assignments...</p>
          </div>
        ) : selectedAssignment ? (
          <div className="assignment-details">
            <div className="details-header">
              <button 
                className="back-btn"
                onClick={() => setSelectedAssignment(null)}
              >
                &larr; Back to assignments
              </button>
              
              {userRole === 'teacher' && (
                <div className="teacher-actions">
                  <button className="action-btn"><FaEdit /> Edit</button>
                  <button className="action-btn danger"><FaTrash /> Delete</button>
                </div>
              )}
            </div>
            
            <div className="assignment-info">
              <h3>{selectedAssignment.title}</h3>
              
              <div className="assignment-meta">
                <div className="meta-item">
                  <FaBook /> {selectedAssignment.className}
                </div>
                <div className="meta-item">
                  <FaCalendarAlt /> Due: {formatDate(selectedAssignment.dueDate)}
                </div>
                <div className="meta-item">
                  <FaTasks /> Points: {selectedAssignment.totalPoints}
                </div>
              </div>
              
              <div className="assignment-description">
                <h4>Instructions</h4>
                <p>{selectedAssignment.description}</p>
              </div>
              
              {selectedAssignment.attachments.length > 0 && (
                <div className="assignment-attachments">
                  <h4>Attachments</h4>
                  <div className="attachments-list">
                    {selectedAssignment.attachments.map((file, index) => (
                      <div key={index} className="attachment-item">
                        <FaFileAlt className="file-icon" />
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">{file.size}</span>
                        <button className="download-btn">
                          <FaDownload />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {userRole === 'student' && (
                <div className="submission-section">
                  <h4>Your Submission</h4>
                  
                  {getMySubmission(selectedAssignment) ? (
                    <div className="submission-info">
                      {getStatusBadge(getMySubmission(selectedAssignment).status)}
                      
                      {getMySubmission(selectedAssignment).date && (
                        <div className="submission-meta">
                          Submitted on: {formatDate(getMySubmission(selectedAssignment).date)}
                        </div>
                      )}
                      
                      {getMySubmission(selectedAssignment).grade !== null && (
                        <div className="grade-info">
                          <div className="grade-value">
                            {getMySubmission(selectedAssignment).grade} / {selectedAssignment.totalPoints}
                          </div>
                          <div className="grade-percentage">
                            {Math.round((getMySubmission(selectedAssignment).grade / selectedAssignment.totalPoints) * 100)}%
                          </div>
                        </div>
                      )}
                      
                      <div className="submission-actions">
                        <button className="action-btn">
                          <FaEye /> View Submission
                        </button>
                        {getMySubmission(selectedAssignment).status !== 'submitted' && (
                          <button 
                            className="action-btn primary"
                            onClick={() => setShowSubmitModal(true)}
                          >
                            <FaFileUpload /> Update Submission
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="no-submission">
                      <p>You haven't submitted this assignment yet.</p>
                      <button 
                        className="submit-btn"
                        onClick={() => setShowSubmitModal(true)}
                      >
                        <FaFileUpload /> Submit Assignment
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {userRole === 'teacher' && (
                <div className="student-submissions">
                  <h4>Student Submissions ({selectedAssignment.submissions.filter(s => s.status === 'submitted' || s.status === 'late').length}/{selectedAssignment.submissions.length})</h4>
                  
                  <div className="submissions-list">
                    {selectedAssignment.submissions.map((submission, index) => (
                      <div key={index} className="student-submission-item">
                        <div className="student-info">
                          <FaUser className="student-icon" />
                          <span className="student-name">{submission.studentName}</span>
                        </div>
                        
                        <div className="submission-status">
                          {getStatusBadge(submission.status)}
                        </div>
                        
                        {submission.date && (
                          <div className="submission-date">
                            {formatDate(submission.date)}
                          </div>
                        )}
                        
                        <div className="grade-section">
                          {submission.grade !== null ? (
                            <div className="grade-display">
                              {submission.grade}/{selectedAssignment.totalPoints}
                            </div>
                          ) : submission.status === 'submitted' || submission.status === 'late' ? (
                            <button className="grade-btn">Grade</button>
                          ) : (
                            <span className="not-submitted">Not submitted</span>
                          )}
                        </div>
                        
                        {(submission.status === 'submitted' || submission.status === 'late') && (
                          <button className="view-btn">
                            <FaEye /> View
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : filteredAssignments.length > 0 ? (
          <div className="assignments-list">
            {filteredAssignments.map(assignment => (
              <div 
                key={assignment.id} 
                className="assignment-card"
                onClick={() => setSelectedAssignment(assignment)}
              >
                <div className="assignment-header">
                  <h3>{assignment.title}</h3>
                  {userRole === 'student' && getStatusBadge(getMySubmission(assignment)?.status || 'pending')}
                </div>
                
                <div className="assignment-details">
                  <div className="detail-item">
                    <FaBook /> {assignment.className}
                  </div>
                  <div className="detail-item">
                    <FaCalendarAlt /> Due: {formatDate(assignment.dueDate)}
                  </div>
                  <div className="detail-item">
                    <FaTasks /> {assignment.totalPoints} pts
                  </div>
                </div>
                
                <div className="assignment-footer">
                  {userRole === 'teacher' ? (
                    <div className="teacher-stats">
                      <div className="submission-count">
                        <FaUserGraduate /> {assignment.submissions.filter(s => s.status === 'submitted' || s.status === 'late').length}/{assignment.submissions.length} Submitted
                      </div>
                      <div className="graded-count">
                        <FaChalkboardTeacher /> {assignment.submissions.filter(s => s.grade !== null).length}/{assignment.submissions.length} Graded
                      </div>
                    </div>
                  ) : (
                    <div className="student-action">
                      {getMySubmission(assignment)?.grade !== null ? (
                        <div className="grade-display">
                          Grade: {getMySubmission(assignment).grade}/{assignment.totalPoints}
                        </div>
                      ) : (
                        <button className="view-btn">
                          View Details
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-assignments">
            <div className="empty-icon">
              <FaTasks />
            </div>
            <p>No {tabSelected} assignments found.</p>
            {userRole === 'teacher' && (
              <button 
                className="create-btn"
                onClick={() => setShowCreateModal(true)}
              >
                + Create Assignment
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Create Assignment Modal (Teachers Only) */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Assignment</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Title*</label>
                <input 
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                  placeholder="Assignment title"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Class*</label>
                <select
                  value={newAssignment.classId}
                  onChange={(e) => setNewAssignment({...newAssignment, classId: e.target.value})}
                  required
                >
                  <option value="">Select a class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Due Date*</label>
                <input 
                  type="date"
                  value={newAssignment.dueDate}
                  onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Total Points</label>
                <input 
                  type="number"
                  value={newAssignment.totalPoints}
                  onChange={(e) => setNewAssignment({...newAssignment, totalPoints: parseInt(e.target.value)})}
                  min="1"
                  max="1000"
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                  rows="4"
                  placeholder="Provide detailed instructions for this assignment"
                />
              </div>
              
              <div className="form-group">
                <label>Attachments</label>
                <div className="file-upload">
                  <input 
                    type="file" 
                    multiple
                  />
                  <p className="help-text">Drag files here or click to browse (PDF, DOCX, XLSX, etc.)</p>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button 
                className="create-btn"
                onClick={handleCreateAssignment}
              >
                Create Assignment
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Submit Assignment Modal (Students Only) */}
      {showSubmitModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Submit Assignment</h3>
              <button 
                className="close-btn"
                onClick={() => setShowSubmitModal(false)}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="assignment-info-summary">
                <h4>{selectedAssignment.title}</h4>
                <div className="summary-details">
                  <span>{selectedAssignment.className}</span>
                  <span>•</span>
                  <span>Due: {formatDate(selectedAssignment.dueDate)}</span>
                </div>
              </div>
              
              <div className="form-group">
                <label>Your Files</label>
                <div className="file-upload">
                  <input 
                    type="file" 
                    multiple
                  />
                  <p className="help-text">Drag files here or click to browse</p>
                </div>
              </div>
              
              <div className="form-group">
                <label>Comments (Optional)</label>
                <textarea
                  rows="3"
                  placeholder="Add any comments about your submission"
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowSubmitModal(false)}
              >
                Cancel
              </button>
              <button 
                className="submit-btn"
                onClick={() => {
                  // In a real app, this would submit the assignment
                  // For now, just update the UI state
                  const updatedAssignments = assignments.map(a => {
                    if (a.id === selectedAssignment.id) {
                      const updatedSubmissions = a.submissions.map(s => {
                        if (s.studentName === 'Alex Johnson') {
                          return { ...s, status: 'submitted', date: new Date().toISOString().slice(0, 10) };
                        }
                        return s;
                      });
                      return { ...a, submissions: updatedSubmissions };
                    }
                    return a;
                  });
                  setAssignments(updatedAssignments);
                  setSelectedAssignment({
                    ...selectedAssignment,
                    submissions: selectedAssignment.submissions.map(s => {
                      if (s.studentName === 'Alex Johnson') {
                        return { ...s, status: 'submitted', date: new Date().toISOString().slice(0, 10) };
                      }
                      return s;
                    })
                  });
                  setShowSubmitModal(false);
                }}
              >
                Submit Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentManager; 