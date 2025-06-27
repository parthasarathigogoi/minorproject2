import React, { useState, useEffect } from 'react';
import { FaBook, FaChalkboardTeacher, FaFilePdf, FaChartBar, FaUsers, FaClipboardCheck } from 'react-icons/fa';
import '../../../styles/MySubjects.css';
import UploadQuestions from './UploadQuestions';

const MySubjects = ({ refreshKey }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadSubject, setUploadSubject] = useState(null);

  // Generate random colors for subjects
  const colors = ['#3563E9', '#00C853', '#FF6D00', '#6200EA', '#D50000', '#00BFA5'];

  const fetchSubjects = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/subjects/teacher', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setSubjects(data);
      } else {
        setError(data.message || 'Failed to fetch subjects');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubjects();
  }, [refreshKey]);

  if (loading) {
    return <div className="loading">Loading your subjects...</div>;
  }

  return (
    <div className="my-subjects-container">
      <div className="page-header">
        <h2>My Subjects</h2>
        <p>Manage your classroom subjects and resources</p>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {subjects.length > 0 ? (
        <div className="subjects-grid">
          {subjects.map((subject, index) => (
            <div className="subject-card" key={subject._id}>
              <div className="subject-color" style={{ backgroundColor: colors[index % colors.length] }}></div>
              <div className="subject-details">
                <h3>{subject.name}</h3>
                <div className="subject-meta">
                  <span><FaBook /> {subject.code}</span>
                  <span><FaUsers /> {subject.students?.length || 0} students</span>
                </div>
                <div className="subject-stats">
                  <div className="stat">
                    <FaFilePdf />
                    <span>0 Documents</span>
                  </div>
                  <div className="stat">
                    <FaClipboardCheck />
                    <span>0 Assignments</span>
                  </div>
                  <div className="stat">
                    <FaChartBar />
                    <span>0 Questions</span>
                  </div>
                </div>
                <div className="subject-actions">
                  <button className="subject-btn">Materials</button>
                  <button className="subject-btn">Questions</button>
                  <button className="subject-btn primary">Tests</button>
                  <button className="subject-btn" onClick={() => setUploadSubject(subject)}>Upload Questions</button>
                </div>
              </div>
            </div>
          ))}
          <div className="add-subject-card">
            <div className="add-icon">+</div>
            <p>Add New Subject</p>
          </div>
        </div>
      ) : (
        <div className="no-subjects">
          <div className="empty-state">
            <FaBook className="empty-icon" />
            <h3>No Subjects Found</h3>
            <p>Create a subject to get started.</p>
          </div>
        </div>
      )}
      {/* Upload Questions Modal */}
      {uploadSubject && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 900, width: '95%' }}>
            <div className="modal-header">
              <h3>Upload Questions for {uploadSubject.name}</h3>
              <button className="close-btn" onClick={() => setUploadSubject(null)}>×</button>
            </div>
            <div className="modal-body">
              <UploadQuestions subjectId={uploadSubject._id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySubjects; 