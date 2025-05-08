import React, { useState } from 'react';
import { FaUsers, FaSearch, FaUserGraduate, FaChartBar, FaEnvelope, FaUserCheck, FaUserTimes, FaFilter, FaSort, FaDownload, FaEye } from 'react-icons/fa';
import '../../../styles/Students.css';

const Students = ({ classSection, subjects }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [activeTab, setActiveTab] = useState('list');
  
  // Placeholder data
  const students = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      rollNumber: '10A01',
      performance: {
        attendance: 95,
        average: 87,
        submissions: 12,
        pending: 1
      }
    },
    {
      id: 2,
      name: 'Emily Johnson',
      email: 'emily.johnson@example.com',
      rollNumber: '10A02',
      performance: {
        attendance: 98,
        average: 92,
        submissions: 13,
        pending: 0
      }
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      rollNumber: '10A03',
      performance: {
        attendance: 85,
        average: 78,
        submissions: 10,
        pending: 3
      }
    },
    {
      id: 4,
      name: 'Sarah Davis',
      email: 'sarah.davis@example.com',
      rollNumber: '10A04',
      performance: {
        attendance: 92,
        average: 85,
        submissions: 12,
        pending: 1
      }
    },
    {
      id: 5,
      name: 'James Wilson',
      email: 'james.wilson@example.com',
      rollNumber: '10A05',
      performance: {
        attendance: 90,
        average: 81,
        submissions: 11,
        pending: 2
      }
    }
  ];
  
  // Filter and sort students
  const getFilteredAndSortedStudents = () => {
    return students
      .filter(student => {
        // Apply search filter
        if (searchTerm) {
          return student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true;
      })
      .filter(student => {
        // Apply performance filter
        if (filter === 'high_performers') {
          return student.performance.average >= 85;
        } else if (filter === 'at_risk') {
          return student.performance.average < 70 || student.performance.attendance < 80;
        } else if (filter === 'pending_submissions') {
          return student.performance.pending > 0;
        }
        return true;
      })
      .sort((a, b) => {
        // Apply sorting
        if (sortBy === 'name') {
          return sortOrder === 'asc' 
            ? a.name.localeCompare(b.name) 
            : b.name.localeCompare(a.name);
        } else if (sortBy === 'rollNumber') {
          return sortOrder === 'asc' 
            ? a.rollNumber.localeCompare(b.rollNumber) 
            : b.rollNumber.localeCompare(a.rollNumber);
        } else if (sortBy === 'performance') {
          return sortOrder === 'asc' 
            ? a.performance.average - b.performance.average 
            : b.performance.average - a.performance.average;
        } else if (sortBy === 'attendance') {
          return sortOrder === 'asc' 
            ? a.performance.attendance - b.performance.attendance 
            : b.performance.attendance - a.performance.attendance;
        }
        return 0;
      });
  };
  
  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="students-container">
      <div className="page-header">
        <h2>Students</h2>
        <p>View and manage students in your class</p>
      </div>
      
      <div className="student-tabs">
        <div 
          className={`tab ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          <FaUsers /> Student List
        </div>
        <div 
          className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          <FaChartBar /> Performance Overview
        </div>
      </div>
      
      <div className="student-controls">
        <div className="search-box">
          <FaSearch />
          <input 
            type="text" 
            placeholder="Search by name, email, or roll number..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-dropdown">
          <button className="filter-btn">
            <FaFilter /> Filter <span className="arrow">▼</span>
          </button>
          <div className="dropdown-content">
            <div 
              className={`dropdown-item ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Students
            </div>
            <div 
              className={`dropdown-item ${filter === 'high_performers' ? 'active' : ''}`}
              onClick={() => setFilter('high_performers')}
            >
              High Performers
            </div>
            <div 
              className={`dropdown-item ${filter === 'at_risk' ? 'active' : ''}`}
              onClick={() => setFilter('at_risk')}
            >
              At Risk
            </div>
            <div 
              className={`dropdown-item ${filter === 'pending_submissions' ? 'active' : ''}`}
              onClick={() => setFilter('pending_submissions')}
            >
              Pending Submissions
            </div>
          </div>
        </div>
        
        <button className="export-btn">
          <FaDownload /> Export
        </button>
      </div>
      
      {activeTab === 'list' ? (
        <div className="student-list">
          <table className="students-table">
            <thead>
              <tr>
                <th onClick={() => handleSortChange('name')}>
                  Student Name
                  <FaSort className="sort-icon" />
                </th>
                <th onClick={() => handleSortChange('rollNumber')}>
                  Roll Number
                  <FaSort className="sort-icon" />
                </th>
                <th>Email</th>
                <th onClick={() => handleSortChange('attendance')}>
                  Attendance
                  <FaSort className="sort-icon" />
                </th>
                <th onClick={() => handleSortChange('performance')}>
                  Average
                  <FaSort className="sort-icon" />
                </th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredAndSortedStudents().map(student => (
                <tr key={student.id}>
                  <td className="student-name">
                    <FaUserGraduate className="student-icon" />
                    {student.name}
                  </td>
                  <td>{student.rollNumber}</td>
                  <td>{student.email}</td>
                  <td>
                    <div className="progress-bar">
                      <div 
                        className="progress" 
                        style={{ 
                          width: `${student.performance.attendance}%`,
                          backgroundColor: student.performance.attendance >= 90 ? '#00C853' :
                                         student.performance.attendance >= 80 ? '#FFC107' : '#F44336'
                        }}
                      ></div>
                      <span>{student.performance.attendance}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="progress-bar">
                      <div 
                        className="progress" 
                        style={{ 
                          width: `${student.performance.average}%`,
                          backgroundColor: student.performance.average >= 85 ? '#00C853' :
                                         student.performance.average >= 70 ? '#FFC107' : '#F44336'
                        }}
                      ></div>
                      <span>{student.performance.average}%</span>
                    </div>
                  </td>
                  <td>
                    {student.performance.pending === 0 ? (
                      <span className="status-badge complete">
                        <FaUserCheck /> Complete
                      </span>
                    ) : (
                      <span className="status-badge pending">
                        <FaUserTimes /> {student.performance.pending} Pending
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view">
                        <FaEye />
                      </button>
                      <button className="action-btn email">
                        <FaEnvelope />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {getFilteredAndSortedStudents().length === 0 && (
            <div className="no-results">
              <h3>No students found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      ) : (
        <div className="performance-overview">
          <div className="performance-cards">
            <div className="performance-card">
              <div className="card-icon attendance">
                <FaUserCheck />
              </div>
              <div className="card-content">
                <h3>Average Attendance</h3>
                <div className="card-value">92%</div>
                <div className="card-trend positive">+2% from last month</div>
              </div>
            </div>
            
            <div className="performance-card">
              <div className="card-icon score">
                <FaChartBar />
              </div>
              <div className="card-content">
                <h3>Class Average</h3>
                <div className="card-value">84%</div>
                <div className="card-trend positive">+3% from last assessment</div>
              </div>
            </div>
            
            <div className="performance-card">
              <div className="card-icon submissions">
                <FaClipboardCheck />
              </div>
              <div className="card-content">
                <h3>Submission Rate</h3>
                <div className="card-value">88%</div>
                <div className="card-trend negative">-1% from last assignment</div>
              </div>
            </div>
            
            <div className="performance-card">
              <div className="card-icon at-risk">
                <FaUserTimes />
              </div>
              <div className="card-content">
                <h3>Students At Risk</h3>
                <div className="card-value">3 students</div>
                <div className="card-trend negative">+1 from last month</div>
              </div>
            </div>
          </div>
          
          <div className="performance-charts">
            <div className="chart-container">
              <h3>Grade Distribution</h3>
              <div className="placeholder-chart">
                <div className="chart-bar" style={{ height: '80%' }}><span>A</span></div>
                <div className="chart-bar" style={{ height: '60%' }}><span>B</span></div>
                <div className="chart-bar" style={{ height: '40%' }}><span>C</span></div>
                <div className="chart-bar" style={{ height: '25%' }}><span>D</span></div>
                <div className="chart-bar" style={{ height: '10%' }}><span>F</span></div>
              </div>
            </div>
            
            <div className="chart-container">
              <h3>Attendance Trend</h3>
              <div className="placeholder-line-chart">
                <div className="line-point" style={{ bottom: '80%', left: '10%' }}></div>
                <div className="line-point" style={{ bottom: '85%', left: '25%' }}></div>
                <div className="line-point" style={{ bottom: '75%', left: '40%' }}></div>
                <div className="line-point" style={{ bottom: '90%', left: '55%' }}></div>
                <div className="line-point" style={{ bottom: '85%', left: '70%' }}></div>
                <div className="line-point" style={{ bottom: '92%', left: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students; 