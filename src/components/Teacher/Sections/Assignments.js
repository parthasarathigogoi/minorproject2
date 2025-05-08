import React, { useState } from 'react';
import { FaUpload, FaFileAlt, FaCalendarAlt, FaUsers, FaCheckCircle, FaTrash, FaEye, FaEdit, FaPlus } from 'react-icons/fa';
import '../../../styles/Assignments.css';

const Assignments = ({ classSection, subjects }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Placeholder data
  const assignments = [
    {
      id: 1,
      title: 'Chapter 3 - Algebra Problems',
      description: 'Solve the attached practice problems from Chapter 3.',
      subject: 'math10',
      subjectName: 'Mathematics',
      dueDate: '2023-09-15',
      totalPoints: 50,
      files: [
        { name: 'algebra_problems.pdf', type: 'pdf', size: '1.2 MB' }
      ],
      status: 'active',
      submissionsCount: 18,
      totalStudents: 32
    },
    {
      id: 2,
      title: 'Physics Lab Report',
      description: 'Complete the lab report for the pendulum experiment.',
      subject: 'physics10',
      subjectName: 'Physics',
      dueDate: '2023-09-18',
      totalPoints: 100,
      files: [
        { name: 'lab_report_template.docx', type: 'docx', size: '520 KB' },
        { name: 'experiment_data.xlsx', type: 'xlsx', size: '340 KB' }
      ],
      status: 'active',
      submissionsCount: 12,
      totalStudents: 32
    },
    {
      id: 3,
      title: 'Programming Exercise - Arrays',
      description: 'Complete the coding exercises on arrays and submit your solution.',
      subject: 'cs10',
      subjectName: 'Computer Science',
      dueDate: '2023-09-10',
      totalPoints: 80,
      files: [
        { name: 'arrays_exercises.pdf', type: 'pdf', size: '890 KB' }
      ],
      status: 'closed',
      submissionsCount: 30,
      totalStudents: 32
    }
  ];
  
  return (
    <div className="assignments-container">
      <div className="page-header">
        <h2>Assignments</h2>
        <p>Create and manage assignments for your subjects</p>
        <button 
          className="create-btn"
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus /> Create New Assignment
        </button>
      </div>
      
      <div className="assignments-list">
        {assignments.map(assignment => (
          <div key={assignment.id} className="assignment-card">
            <div className="assignment-header">
              <h3>{assignment.title}</h3>
              <div className={`status-badge ${assignment.status}`}>
                {assignment.status === 'active' ? 'Active' : 'Closed'}
              </div>
            </div>
            
            <div className="assignment-details">
              <p>{assignment.description}</p>
              
              <div className="assignment-meta">
                <div className="meta-item">
                  <FaFileAlt />
                  <span>Subject: {assignment.subjectName}</span>
                </div>
                <div className="meta-item">
                  <FaCalendarAlt />
                  <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="meta-item">
                  <FaUsers />
                  <span>Submissions: {assignment.submissionsCount}/{assignment.totalStudents}</span>
                </div>
              </div>
              
              <div className="assignment-files">
                <h4>Files:</h4>
                <div className="files-list">
                  {assignment.files.map((file, index) => (
                    <div key={index} className="file-item">
                      <div className="file-icon">
                        <FaFileAlt />
                      </div>
                      <div className="file-details">
                        <div className="file-name">{file.name}</div>
                        <div className="file-meta">{file.size}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="assignment-actions">
              <button className="action-btn view">
                <FaEye /> View Submissions
              </button>
              <button className="action-btn edit">
                <FaEdit /> Edit
              </button>
              <button className="action-btn delete">
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Assignment</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Title <span className="required">*</span></label>
                <input type="text" placeholder="Assignment title" className="form-control" />
              </div>
              
              <div className="form-group">
                <label>Subject <span className="required">*</span></label>
                <select className="form-control">
                  <option value="">-- Select Subject --</option>
                  {/* Subject options would go here */}
                </select>
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  placeholder="Enter assignment instructions..." 
                  className="form-control" 
                  rows={4}
                ></textarea>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Due Date <span className="required">*</span></label>
                  <input type="date" className="form-control" />
                </div>
                
                <div className="form-group">
                  <label>Total Points <span className="required">*</span></label>
                  <input type="number" min="1" defaultValue={100} className="form-control" />
                </div>
              </div>
              
              <div className="form-group">
                <label>Files</label>
                <div className="file-upload">
                  <input type="file" id="assignment-files" multiple />
                  <label htmlFor="assignment-files" className="upload-btn">
                    <FaUpload /> Upload Files
                  </label>
                </div>
                <div className="upload-note">
                  Upload PDF, Word, Excel, or other relevant files
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="save-btn">
                <FaCheckCircle /> Create Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments; 