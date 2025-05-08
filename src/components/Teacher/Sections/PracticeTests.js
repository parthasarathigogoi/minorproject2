import React, { useState } from 'react';
import { FaPlus, FaPlay, FaEye, FaEdit, FaTrash, FaCalendarAlt, FaBook, FaClock, FaClipboard, FaRandom, FaCheck, FaTimes, FaChartBar } from 'react-icons/fa';
import '../../../styles/PracticeTests.css';

const PracticeTests = ({ classSection, subjects }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [testType, setTestType] = useState('pattern');
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // Placeholder data for test types
  const questionTypes = [
    { id: 'multiple_choice', name: 'Multiple Choice Questions (MCQ)', description: '1 Mark each' },
    { id: 'short_answer', name: 'Short Answer Questions', description: '2-3 Marks each' },
    { id: 'long_answer', name: 'Long Answer Questions', description: '4-10 Marks each' },
    { id: 'true_false', name: 'True/False Questions', description: '1 Mark each' }
  ];
  
  // Placeholder data for practice tests
  const practiceTests = [
    {
      id: 1,
      title: 'Mid-Term Practice Test - Mathematics',
      subject: 'math10',
      subjectName: 'Mathematics',
      description: 'Practice test covering Chapters 1-5 for mid-term preparation.',
      duration: 60,
      totalMarks: 50,
      scheduledFor: '2023-09-20T09:00:00',
      status: 'scheduled',
      questionDistribution: [
        { type: 'multiple_choice', count: 20, marks: 1 },
        { type: 'short_answer', count: 5, marks: 3 },
        { type: 'long_answer', count: 2, marks: 5 }
      ],
      settings: {
        shuffleQuestions: true,
        showAnswers: true,
        allowMultipleAttempts: true
      }
    },
    {
      id: 2,
      title: 'Physics Weekly Quiz',
      subject: 'physics10',
      subjectName: 'Physics',
      description: 'Weekly quiz on Newton\'s laws of motion.',
      duration: 30,
      totalMarks: 20,
      scheduledFor: '2023-09-15T14:00:00',
      status: 'scheduled',
      questionDistribution: [
        { type: 'multiple_choice', count: 10, marks: 1 },
        { type: 'short_answer', count: 5, marks: 2 }
      ],
      settings: {
        shuffleQuestions: true,
        showAnswers: true,
        allowMultipleAttempts: true
      }
    },
    {
      id: 3,
      title: 'Programming Concepts Quiz',
      subject: 'cs10',
      subjectName: 'Computer Science',
      description: 'Test your understanding of basic programming concepts.',
      duration: 45,
      totalMarks: 30,
      scheduledFor: '2023-09-05T10:00:00',
      status: 'completed',
      questionDistribution: [
        { type: 'multiple_choice', count: 15, marks: 1 },
        { type: 'short_answer', count: 5, marks: 3 }
      ],
      settings: {
        shuffleQuestions: true,
        showAnswers: true,
        allowMultipleAttempts: false
      },
      stats: {
        participants: 28,
        averageScore: 24.5,
        highestScore: 30,
        lowestScore: 18
      }
    }
  ];
  
  // Get filtered tests based on active tab
  const getFilteredTests = () => {
    const currentDate = new Date();
    
    if (activeTab === 'upcoming') {
      return practiceTests.filter(test => {
        const testDate = new Date(test.scheduledFor);
        return testDate > currentDate && test.status !== 'completed';
      });
    } else if (activeTab === 'completed') {
      return practiceTests.filter(test => test.status === 'completed');
    }
    
    return practiceTests;
  };
  
  // Handle question distribution change
  const [questionDistribution, setQuestionDistribution] = useState([
    { type: 'multiple_choice', count: 10, marks: 1 },
    { type: 'short_answer', count: 5, marks: 2 },
    { type: 'long_answer', count: 2, marks: 5 }
  ]);
  
  const handleDistributionChange = (index, field, value) => {
    const newDistribution = [...questionDistribution];
    newDistribution[index][field] = field === 'count' || field === 'marks' ? parseInt(value) : value;
    setQuestionDistribution(newDistribution);
  };
  
  const addQuestionType = () => {
    setQuestionDistribution([...questionDistribution, { type: 'multiple_choice', count: 5, marks: 1 }]);
  };
  
  const removeQuestionType = (index) => {
    if (questionDistribution.length <= 1) return;
    const newDistribution = questionDistribution.filter((_, i) => i !== index);
    setQuestionDistribution(newDistribution);
  };
  
  // Calculate total marks
  const calculateTotalMarks = () => {
    return questionDistribution.reduce((total, item) => {
      return total + (item.count * item.marks);
    }, 0);
  };

  return (
    <div className="practice-tests-container">
      <div className="page-header">
        <h2>Practice Tests</h2>
        <p>Create and manage practice tests for your students</p>
        <button 
          className="create-btn"
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus /> Create New Test
        </button>
      </div>
      
      <div className="tests-tabs">
        <div 
          className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Tests
        </div>
        <div 
          className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed Tests
        </div>
      </div>
      
      <div className="tests-list">
        {getFilteredTests().length > 0 ? (
          getFilteredTests().map(test => (
            <div key={test.id} className="test-card">
              <div className="test-header">
                <h3>{test.title}</h3>
                <div className={`status-badge ${test.status}`}>
                  {test.status === 'scheduled' ? 'Scheduled' : 
                   test.status === 'active' ? 'Active' : 'Completed'}
                </div>
              </div>
              
              <div className="test-details">
                <div className="test-info">
                  <div className="info-item">
                    <FaBook />
                    <span>Subject: {test.subjectName}</span>
                  </div>
                  <div className="info-item">
                    <FaClock />
                    <span>Duration: {test.duration} minutes</span>
                  </div>
                  <div className="info-item">
                    <FaClipboard />
                    <span>Total Marks: {test.totalMarks}</span>
                  </div>
                  <div className="info-item">
                    <FaCalendarAlt />
                    <span>
                      {test.status === 'completed' ? 'Conducted on: ' : 'Scheduled for: '}
                      {new Date(test.scheduledFor).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <p className="test-description">{test.description}</p>
                
                <div className="question-distribution">
                  <h4>Question Distribution:</h4>
                  <div className="distribution-list">
                    {test.questionDistribution.map((item, index) => (
                      <div key={index} className="distribution-item">
                        <span className="question-type">
                          {item.type === 'multiple_choice' ? 'MCQs' : 
                           item.type === 'short_answer' ? 'Short Answer' :
                           item.type === 'long_answer' ? 'Long Answer' : 'True/False'}
                        </span>
                        <span className="question-count">{item.count} questions</span>
                        <span className="question-marks">({item.marks} {item.marks === 1 ? 'mark' : 'marks'} each)</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="test-settings">
                  <div className={`setting-item ${test.settings.shuffleQuestions ? 'active' : 'inactive'}`}>
                    <FaRandom />
                    <span>Shuffle Questions</span>
                    {test.settings.shuffleQuestions ? <FaCheck /> : <FaTimes />}
                  </div>
                  <div className={`setting-item ${test.settings.showAnswers ? 'active' : 'inactive'}`}>
                    <FaEye />
                    <span>Show Answers After Submission</span>
                    {test.settings.showAnswers ? <FaCheck /> : <FaTimes />}
                  </div>
                  <div className={`setting-item ${test.settings.allowMultipleAttempts ? 'active' : 'inactive'}`}>
                    <FaPlay />
                    <span>Allow Multiple Attempts</span>
                    {test.settings.allowMultipleAttempts ? <FaCheck /> : <FaTimes />}
                  </div>
                </div>
                
                {test.status === 'completed' && test.stats && (
                  <div className="test-statistics">
                    <h4>Results Summary:</h4>
                    <div className="statistics-grid">
                      <div className="statistic-item">
                        <div className="statistic-value">{test.stats.participants}</div>
                        <div className="statistic-label">Participants</div>
                      </div>
                      <div className="statistic-item">
                        <div className="statistic-value">{test.stats.averageScore}/{test.totalMarks}</div>
                        <div className="statistic-label">Average Score</div>
                      </div>
                      <div className="statistic-item">
                        <div className="statistic-value">{test.stats.highestScore}</div>
                        <div className="statistic-label">Highest Score</div>
                      </div>
                      <div className="statistic-item">
                        <div className="statistic-value">{test.stats.lowestScore}</div>
                        <div className="statistic-label">Lowest Score</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="test-actions">
                {test.status === 'completed' ? (
                  <>
                    <button className="action-btn view">
                      <FaChartBar /> View Results
                    </button>
                    <button className="action-btn duplicate">
                      <FaPlus /> Create Similar
                    </button>
                  </>
                ) : (
                  <>
                    <button className="action-btn view">
                      <FaEye /> Preview
                    </button>
                    <button className="action-btn edit">
                      <FaEdit /> Edit
                    </button>
                    <button className="action-btn delete">
                      <FaTrash /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-tests">
            <div className="empty-state">
              <FaClipboard className="empty-icon" />
              <h3>No {activeTab} Tests</h3>
              <p>Create a new practice test to get started.</p>
              <button 
                className="create-now-btn"
                onClick={() => setShowAddModal(true)}
              >
                Create Test Now
              </button>
            </div>
          </div>
        )}
      </div>
      
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content test-modal">
            <div className="modal-header">
              <h3>Create New Practice Test</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="test-creation-tabs">
                <div 
                  className={`creation-tab ${testType === 'pattern' ? 'active' : ''}`}
                  onClick={() => setTestType('pattern')}
                >
                  Create from Pattern
                </div>
                <div 
                  className={`creation-tab ${testType === 'manual' ? 'active' : ''}`}
                  onClick={() => setTestType('manual')}
                >
                  Select Questions Manually
                </div>
              </div>
              
              <div className="form-group">
                <label>Test Title <span className="required">*</span></label>
                <input type="text" placeholder="Enter test title" className="form-control" />
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
                  <label>Duration (minutes) <span className="required">*</span></label>
                  <input type="number" min="5" defaultValue="60" className="form-control" />
                </div>
              </div>
              
              <div className="form-group">
                <label>Test Description</label>
                <textarea 
                  placeholder="Enter a description of the test..." 
                  className="form-control" 
                  rows={2}
                ></textarea>
              </div>
              
              {testType === 'pattern' && (
                <div className="question-pattern-section">
                  <h4>Question Distribution <span className="required">*</span></h4>
                  <p className="help-text">Define the types and number of questions to include in the test.</p>
                  
                  {questionDistribution.map((item, index) => (
                    <div key={index} className="distribution-row">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Question Type</label>
                          <select 
                            value={item.type}
                            onChange={(e) => handleDistributionChange(index, 'type', e.target.value)}
                            className="form-control"
                          >
                            {questionTypes.map(type => (
                              <option key={type.id} value={type.id}>
                                {type.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="form-group small">
                          <label>Number</label>
                          <input 
                            type="number" 
                            min="1" 
                            value={item.count}
                            onChange={(e) => handleDistributionChange(index, 'count', e.target.value)}
                            className="form-control"
                          />
                        </div>
                        
                        <div className="form-group small">
                          <label>Marks Each</label>
                          <input 
                            type="number" 
                            min="1" 
                            value={item.marks}
                            onChange={(e) => handleDistributionChange(index, 'marks', e.target.value)}
                            className="form-control"
                          />
                        </div>
                        
                        <div className="form-group action">
                          <button 
                            type="button" 
                            className="remove-btn"
                            onClick={() => removeQuestionType(index)}
                            disabled={questionDistribution.length <= 1}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="distribution-actions">
                    <button 
                      type="button" 
                      className="add-type-btn"
                      onClick={addQuestionType}
                    >
                      <FaPlus /> Add Question Type
                    </button>
                  </div>
                  
                  <div className="total-marks">
                    Total Marks: <span>{calculateTotalMarks()}</span>
                  </div>
                </div>
              )}
              
              {testType === 'manual' && (
                <div className="question-selection-section">
                  <h4>Select Questions <span className="required">*</span></h4>
                  <p className="help-text">Search and select specific questions to include in the test.</p>
                  
                  <div className="search-filters">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Topic/Chapter</label>
                        <select className="form-control">
                          <option value="">All Topics</option>
                          <option>Chapter 1 - Introduction</option>
                          <option>Chapter 2 - Fundamentals</option>
                          <option>Chapter 3 - Advanced Concepts</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label>Question Type</label>
                        <select className="form-control">
                          <option value="">All Types</option>
                          {questionTypes.map(type => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Difficulty</label>
                        <select className="form-control">
                          <option value="">All Difficulties</option>
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                          <option value="challenging">Challenging</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label>Marks</label>
                        <select className="form-control">
                          <option value="">All Marks</option>
                          <option value="1">1 Mark</option>
                          <option value="2">2 Marks</option>
                          <option value="3">3 Marks</option>
                          <option value="5">5 Marks</option>
                          <option value="10">10 Marks</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="question-selection-placeholder">
                    <p>No questions available with the selected filters.</p>
                  </div>
                </div>
              )}
              
              <div className="form-group">
                <h4>Test Settings</h4>
                <div className="settings-group">
                  <div className="checkbox-option">
                    <input type="checkbox" id="shuffle-questions" defaultChecked />
                    <label htmlFor="shuffle-questions">Shuffle question order</label>
                  </div>
                  <div className="checkbox-option">
                    <input type="checkbox" id="show-answers" defaultChecked />
                    <label htmlFor="show-answers">Show answers after submission</label>
                  </div>
                  <div className="checkbox-option">
                    <input type="checkbox" id="allow-attempts" defaultChecked />
                    <label htmlFor="allow-attempts">Allow multiple attempts</label>
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <h4>Schedule Test (Optional)</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date</label>
                    <input type="date" className="form-control" />
                  </div>
                  
                  <div className="form-group">
                    <label>Time</label>
                    <input type="time" className="form-control" />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="save-btn">
                Create Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeTests; 