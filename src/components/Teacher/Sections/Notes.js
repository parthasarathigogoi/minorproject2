import React, { useState } from 'react';
import { FaUpload, FaFileAlt, FaFilePdf, FaFileWord, FaFilePowerpoint, FaFileExcel, FaPlus, FaEdit, FaTrash, FaEye, FaShareAlt, FaFilter, FaBook } from 'react-icons/fa';
import '../../../styles/Notes.css';

const Notes = ({ classSection, subjects }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Placeholder data
  const notes = [
    {
      id: 1,
      title: 'Chapter 3: Trigonometry Concepts',
      description: 'Notes covering all trigonometry concepts from Chapter 3.',
      subject: 'math10',
      subjectName: 'Mathematics',
      topic: 'Chapter 3 - Trigonometry',
      materialType: 'lecture_notes',
      files: [
        { name: 'trigonometry_notes.pdf', type: 'pdf', size: '2.3 MB' }
      ],
      createdAt: '2023-09-01'
    },
    {
      id: 2,
      title: 'Newton\'s Laws of Motion',
      description: 'Lecture notes and examples on Newton\'s laws of motion.',
      subject: 'physics10',
      subjectName: 'Physics',
      topic: 'Chapter 2 - Laws of Motion',
      materialType: 'lecture_notes',
      files: [
        { name: 'newtons_laws.pdf', type: 'pdf', size: '1.8 MB' },
        { name: 'motion_examples.pptx', type: 'pptx', size: '4.2 MB' }
      ],
      createdAt: '2023-08-25'
    },
    {
      id: 3,
      title: 'Programming Fundamentals',
      description: 'Introduction to programming concepts and syntax.',
      subject: 'cs10',
      subjectName: 'Computer Science',
      topic: 'Chapter 1 - Introduction',
      materialType: 'reference',
      files: [
        { name: 'programming_basics.pdf', type: 'pdf', size: '3.1 MB' },
        { name: 'code_examples.zip', type: 'zip', size: '1.5 MB' }
      ],
      createdAt: '2023-08-18'
    },
    {
      id: 4,
      title: 'Worksheet: Algebraic Equations',
      description: 'Practice worksheet for solving algebraic equations.',
      subject: 'math10',
      subjectName: 'Mathematics',
      topic: 'Chapter 4 - Algebra',
      materialType: 'worksheet',
      files: [
        { name: 'algebra_worksheet.pdf', type: 'pdf', size: '520 KB' },
        { name: 'solutions.pdf', type: 'pdf', size: '610 KB' }
      ],
      createdAt: '2023-08-10'
    }
  ];
  
  // Get file icon based on file type
  const getFileIcon = (fileType) => {
    switch(fileType.toLowerCase()) {
      case 'pdf':
        return <FaFilePdf />;
      case 'docx':
      case 'doc':
        return <FaFileWord />;
      case 'pptx':
      case 'ppt':
        return <FaFilePowerpoint />;
      case 'xlsx':
      case 'xls':
        return <FaFileExcel />;
      default:
        return <FaFileAlt />;
    }
  };
  
  // Filter notes by selected filter
  const getFilteredNotes = () => {
    if (activeFilter === 'all') {
      return notes;
    } else {
      return notes.filter(note => note.subject === activeFilter);
    }
  };

  return (
    <div className="notes-container">
      <div className="page-header">
        <h2>Notes & Materials</h2>
        <p>Upload and manage study materials for your subjects</p>
        <button 
          className="create-btn"
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus /> Upload New Material
        </button>
      </div>
      
      <div className="filter-bar">
        <button 
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Materials
        </button>
        {subjects.map(subject => (
          <button 
            key={subject}
            className={`filter-btn ${activeFilter === subject ? 'active' : ''}`}
            onClick={() => setActiveFilter(subject)}
          >
            {subject.charAt(0).toUpperCase() + subject.slice(1).replace(/[0-9]+/, '')}
          </button>
        ))}
      </div>
      
      <div className="materials-layout">
        <div className="materials-list">
          {getFilteredNotes().length > 0 ? (
            getFilteredNotes().map(note => (
              <div key={note.id} className="material-card">
                <div className="material-header">
                  <div className="material-subject">
                    <FaBook /> {note.subjectName}
                  </div>
                  <div className="material-type">
                    {note.materialType === 'lecture_notes' ? 'Lecture Notes' :
                     note.materialType === 'worksheet' ? 'Worksheet' :
                     note.materialType === 'reference' ? 'Reference' :
                     note.materialType === 'syllabus' ? 'Syllabus' : 'Other'}
                  </div>
                </div>
                
                <div className="material-content">
                  <h3>{note.title}</h3>
                  <p className="material-description">{note.description}</p>
                  <div className="material-topic">{note.topic}</div>
                  
                  <div className="material-files">
                    {note.files.map((file, index) => (
                      <div key={index} className="file-item">
                        <div className="file-icon">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="file-details">
                          <div className="file-name">{file.name}</div>
                          <div className="file-meta">{file.size}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="material-footer">
                  <div className="created-date">
                    Uploaded: {new Date(note.createdAt).toLocaleDateString()}
                  </div>
                  <div className="material-actions">
                    <button className="action-btn view">
                      <FaEye />
                    </button>
                    <button className="action-btn share">
                      <FaShareAlt />
                    </button>
                    <button className="action-btn edit">
                      <FaEdit />
                    </button>
                    <button className="action-btn delete">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-materials">
              <div className="empty-state">
                <FaUpload className="empty-icon" />
                <h3>No Materials Found</h3>
                <p>Upload study materials to get started.</p>
                <button 
                  className="upload-now-btn"
                  onClick={() => setShowAddModal(true)}
                >
                  Upload Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Upload Study Material</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Title <span className="required">*</span></label>
                <input type="text" placeholder="Material title" className="form-control" />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Subject <span className="required">*</span></label>
                  <select className="form-control">
                    <option value="">-- Select Subject --</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>
                        {subject.charAt(0).toUpperCase() + subject.slice(1).replace(/[0-9]+/, '')}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Material Type <span className="required">*</span></label>
                  <select className="form-control">
                    <option value="lecture_notes">Lecture Notes</option>
                    <option value="worksheet">Worksheet</option>
                    <option value="reference">Reference Material</option>
                    <option value="syllabus">Syllabus</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Topic/Chapter <span className="required">*</span></label>
                <input type="text" placeholder="e.g. Chapter 3 - Functions" className="form-control" />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  placeholder="Enter a description of this material..." 
                  className="form-control" 
                  rows={3}
                ></textarea>
              </div>
              
              <div className="form-group">
                <label>Files <span className="required">*</span></label>
                <div className="file-upload">
                  <input type="file" id="material-files" multiple />
                  <label htmlFor="material-files" className="upload-btn">
                    <FaUpload /> Upload Files
                  </label>
                </div>
                <div className="upload-note">
                  Upload PDF, Word, PowerPoint, or other relevant files
                </div>
              </div>
              
              <div className="form-group">
                <div className="checkbox-option">
                  <input type="checkbox" id="publish-immediately" defaultChecked />
                  <label htmlFor="publish-immediately">Publish immediately to students</label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="save-btn">
                Upload Material
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes; 