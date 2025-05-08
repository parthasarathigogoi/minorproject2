import React, { useState, useEffect } from 'react';
import { FaBook, FaChalkboardTeacher, FaFilePdf, FaChartBar, FaUsers, FaClipboardCheck } from 'react-icons/fa';
import '../../../styles/MySubjects.css';

const MySubjects = ({ classSection, subjects, subjectData }) => {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Generate random colors for subjects
  const colors = ['#3563E9', '#00C853', '#FF6D00', '#6200EA', '#D50000', '#00BFA5'];
  
  useEffect(() => {
    // Fetch selected subjects data
    const fetchSubjectData = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call to get subject details
        // Mock data for now
        const fetchedSubjects = subjects.map((subjectId, index) => {
          const subjectInfo = subjectData.find(s => s.id === subjectId) || { id: subjectId, name: `Subject ${index + 1}` };
          return {
            id: subjectInfo.id,
            name: subjectInfo.name,
            code: subjectInfo.id.toUpperCase(),
            students: Math.floor(Math.random() * 40) + 10,
            color: colors[index % colors.length],
            stats: {
              documents: Math.floor(Math.random() * 20),
              assignments: Math.floor(Math.random() * 10),
              tests: Math.floor(Math.random() * 5),
              questions: Math.floor(Math.random() * 100)
            }
          };
        });
        
        // Get class info
        // In a real app, this would be an API call
        const fetchedClassInfo = {
          name: "Class 10 - A", // Replace with actual class name from API
          totalStudents: Math.floor(Math.random() * 40) + 20,
          averageAttendance: Math.floor(Math.random() * 20) + 80,
          pendingAssignments: Math.floor(Math.random() * 10)
        };
        
        setSelectedSubjects(fetchedSubjects);
        setClassInfo(fetchedClassInfo);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching subject data:', error);
        setLoading(false);
      }
    };
    
    if (subjects.length > 0) {
      fetchSubjectData();
    } else {
      setLoading(false);
    }
  }, [subjects, subjectData, classSection, colors]);

  if (loading) {
    return <div className="loading">Loading your subjects...</div>;
  }

  return (
    <div className="my-subjects-container">
      <div className="page-header">
        <h2>My Subjects</h2>
        <p>Manage your classroom subjects and resources</p>
      </div>
      
      {classInfo && (
        <div className="class-overview">
          <div className="class-info">
            <h3><FaChalkboardTeacher /> {classInfo.name}</h3>
            <div className="class-stats">
              <div className="stat-item">
                <div className="stat-value">{classInfo.totalStudents}</div>
                <div className="stat-label">Students</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{classInfo.averageAttendance}%</div>
                <div className="stat-label">Attendance</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{classInfo.pendingAssignments}</div>
                <div className="stat-label">Pending</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {selectedSubjects.length > 0 ? (
        <div className="subjects-grid">
          {selectedSubjects.map(subject => (
            <div className="subject-card" key={subject.id}>
              <div className="subject-color" style={{ backgroundColor: subject.color }}></div>
              <div className="subject-details">
                <h3>{subject.name}</h3>
                <div className="subject-meta">
                  <span><FaBook /> {subject.code}</span>
                  <span><FaUsers /> {subject.students} students</span>
                </div>
                
                <div className="subject-stats">
                  <div className="stat">
                    <FaFilePdf />
                    <span>{subject.stats.documents} Documents</span>
                  </div>
                  <div className="stat">
                    <FaClipboardCheck />
                    <span>{subject.stats.assignments} Assignments</span>
                  </div>
                  <div className="stat">
                    <FaChartBar />
                    <span>{subject.stats.questions} Questions</span>
                  </div>
                </div>
                
                <div className="subject-actions">
                  <button className="subject-btn">Materials</button>
                  <button className="subject-btn">Questions</button>
                  <button className="subject-btn primary">Tests</button>
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
            <h3>No Subjects Selected</h3>
            <p>Please select the subjects you teach in this class/section.</p>
            <button className="add-subjects-btn">Add Subjects</button>
          </div>
        </div>
      )}
      
      {selectedSubjects.length > 0 && (
        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon document">
                <FaFilePdf />
              </div>
              <div className="activity-details">
                <h4>New notes uploaded</h4>
                <p>You uploaded "Chapter 5 - Trigonometry" to Mathematics</p>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon assignment">
                <FaClipboardCheck />
              </div>
              <div className="activity-details">
                <h4>Assignment submissions</h4>
                <p>5 new submissions for "Wave Optics Assignment" in Physics</p>
                <span className="activity-time">Yesterday</span>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon test">
                <FaChartBar />
              </div>
              <div className="activity-details">
                <h4>Test results available</h4>
                <p>Results for "Mid-term Practice Test" are ready to review</p>
                <span className="activity-time">2 days ago</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySubjects; 