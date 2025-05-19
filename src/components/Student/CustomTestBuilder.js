import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { questionApi, practiceTestApi } from '../../services/api';
import { 
  FaBook, FaFilter, FaSearch, FaCheck, FaPlus, 
  FaMinus, FaClock, FaRandom, FaArrowRight 
} from 'react-icons/fa';

const CustomTestBuilder = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // State for subjects and questions
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  
  // State for filters
  const [filters, setFilters] = useState({
    subjectId: '',
    difficultyLevel: 'all',
    questionTypes: [],
    topic: ''
  });
  
  // State for test configuration
  const [testConfig, setTestConfig] = useState({
    title: '',
    description: '',
    duration: 60,
    shuffleQuestions: false
  });
  
  // Fetch available subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await questionApi.getStudentSubjects();
        setSubjects(data);
        
        // If subjects are available, select the first one by default
        if (data.length > 0) {
          setFilters(prev => ({
            ...prev,
            subjectId: data[0]._id
          }));
        }
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setError('Failed to fetch subjects');
      }
    };
    
    fetchSubjects();
  }, []);
  
  // Fetch questions when filters change
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!filters.subjectId) return;
      
      try {
        setLoading(true);
        const data = await questionApi.getStudentQuestions(filters);
        setQuestions(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to fetch questions');
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, [filters.subjectId, filters.difficultyLevel, filters.questionTypes]);
  
  // Handle search by topic
  const handleSearch = () => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = await questionApi.getStudentQuestions(filters);
        setQuestions(data);
        setLoading(false);
      } catch (err) {
        console.error('Error searching questions:', err);
        setError('Failed to search questions');
        setLoading(false);
      }
    };
    
    fetchQuestions();
  };
  
  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle question type filter toggle
  const toggleQuestionType = (type) => {
    setFilters(prev => {
      const currentTypes = [...prev.questionTypes];
      
      if (currentTypes.includes(type)) {
        return {
          ...prev,
          questionTypes: currentTypes.filter(t => t !== type)
        };
      } else {
        return {
          ...prev,
          questionTypes: [...currentTypes, type]
        };
      }
    });
  };
  
  // Handle selecting/deselecting a question
  const toggleQuestionSelection = (question) => {
    setSelectedQuestions(prev => {
      const isSelected = prev.some(q => q._id === question._id);
      
      if (isSelected) {
        return prev.filter(q => q._id !== question._id);
      } else {
        return [...prev, question];
      }
    });
  };
  
  // Handle test config changes
  const handleConfigChange = (field, value) => {
    setTestConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Calculate total marks
  const totalMarks = selectedQuestions.reduce((sum, q) => sum + q.marks, 0);
  
  // Create and start the test
  const createTest = async () => {
    if (selectedQuestions.length === 0) {
      setError('Please select at least one question');
      return;
    }
    
    if (!testConfig.title) {
      setError('Please provide a title for your test');
      return;
    }
    
    try {
      setCreating(true);
      setError(null);
      
      const testData = {
        title: testConfig.title,
        description: testConfig.description,
        subjectId: filters.subjectId,
        questionIds: selectedQuestions.map(q => q._id),
        duration: testConfig.duration,
        shuffleQuestions: testConfig.shuffleQuestions
      };
      
      const createdTest = await practiceTestApi.createCustomTest(testData);
      
      // Navigate to the test page
      navigate(`/student/exam/practice/${createdTest._id}`);
    } catch (err) {
      console.error('Error creating test:', err);
      setError('Failed to create test. Please try again.');
      setCreating(false);
    }
  };
  
  // Question type options
  const questionTypes = [
    { id: 'multiple_choice', name: 'Multiple Choice' },
    { id: 'short_answer', name: 'Short Answer' },
    { id: 'long_answer', name: 'Long Answer' },
    { id: 'true_false', name: 'True/False' },
    { id: 'fill_in_blank', name: 'Fill in the Blank' }
  ];
  
  // Difficulty level options
  const difficultyLevels = [
    { id: 'all', name: 'All Levels' },
    { id: 'easy', name: 'Easy' },
    { id: 'medium', name: 'Medium' },
    { id: 'hard', name: 'Hard' },
    { id: 'challenging', name: 'Challenging' }
  ];
  
  return (
    <div className="custom-test-builder">
      <div className="builder-header">
        <h2>Custom Practice Test Builder</h2>
        <p className="builder-description">
          Create your own practice test by selecting questions from your teachers
        </p>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="builder-container">
        <div className="filter-section">
          <h3>
            <FaFilter className="section-icon" />
            Filter Questions
          </h3>
          
          <div className="filter-grid">
            <div className="filter-group">
              <label>Subject</label>
              <select 
                value={filters.subjectId} 
                onChange={(e) => handleFilterChange('subjectId', e.target.value)}
              >
                {subjects.map(subject => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Difficulty Level</label>
              <select 
                value={filters.difficultyLevel} 
                onChange={(e) => handleFilterChange('difficultyLevel', e.target.value)}
              >
                {difficultyLevels.map(level => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Question Types</label>
              <div className="checkbox-group">
                {questionTypes.map(type => (
                  <label key={type.id} className="checkbox-label">
                    <input 
                      type="checkbox"
                      checked={filters.questionTypes.includes(type.id)}
                      onChange={() => toggleQuestionType(type.id)}
                    />
                    {type.name}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="filter-group">
              <label>Topic Search</label>
              <div className="search-input">
                <input 
                  type="text"
                  value={filters.topic}
                  onChange={(e) => handleFilterChange('topic', e.target.value)}
                  placeholder="Search by topic..."
                />
                <button 
                  className="search-btn"
                  onClick={handleSearch}
                >
                  <FaSearch />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="questions-section">
          <div className="section-header">
            <h3>
              <FaBook className="section-icon" />
              Available Questions
            </h3>
            <div className="selection-summary">
              Selected: {selectedQuestions.length} questions | Total Marks: {totalMarks}
            </div>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading questions...</p>
            </div>
          ) : questions.length > 0 ? (
            <div className="questions-list">
              {questions.map(question => (
                <div 
                  key={question._id} 
                  className={`question-card ${selectedQuestions.some(q => q._id === question._id) ? 'selected' : ''}`}
                  onClick={() => toggleQuestionSelection(question)}
                >
                  <div className="question-header">
                    <div className="question-type-badge">
                      {question.type === 'multiple_choice' ? 'MCQ' : 
                       question.type === 'short_answer' ? 'Short Answer' :
                       question.type === 'long_answer' ? 'Long Answer' :
                       question.type === 'true_false' ? 'True/False' : 'Fill in Blank'}
                    </div>
                    <div className="question-marks">
                      {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
                    </div>
                    <div className={`difficulty-badge ${question.difficultyLevel}`}>
                      {question.difficultyLevel}
                    </div>
                  </div>
                  
                  <div className="question-content">
                    <p>{question.text}</p>
                  </div>
                  
                  <div className="question-footer">
                    <div className="question-topic">
                      Topic: {question.topic}
                    </div>
                    <div className="selection-indicator">
                      {selectedQuestions.some(q => q._id === question._id) ? (
                        <FaCheck className="selected-icon" />
                      ) : (
                        <FaPlus className="add-icon" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-questions">
              <div className="empty-state">
                <FaBook className="empty-icon" />
                <h4>No Questions Found</h4>
                <p>Try changing your filters or search criteria</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="test-config-section">
          <h3>Test Configuration</h3>
          
          <div className="config-form">
            <div className="form-group">
              <label>Test Title <span className="required">*</span></label>
              <input 
                type="text" 
                value={testConfig.title}
                onChange={(e) => handleConfigChange('title', e.target.value)}
                placeholder="Enter a title for your test"
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea 
                value={testConfig.description}
                onChange={(e) => handleConfigChange('description', e.target.value)}
                placeholder="Optional description for your test"
                className="form-control"
                rows={3}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Duration (minutes)</label>
                <div className="duration-control">
                  <button 
                    className="duration-btn"
                    onClick={() => handleConfigChange('duration', Math.max(15, testConfig.duration - 15))}
                  >
                    <FaMinus />
                  </button>
                  <input 
                    type="number" 
                    value={testConfig.duration}
                    onChange={(e) => handleConfigChange('duration', Math.max(15, parseInt(e.target.value) || 15))}
                    min="15"
                    className="form-control"
                  />
                  <button 
                    className="duration-btn"
                    onClick={() => handleConfigChange('duration', testConfig.duration + 15)}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
              
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={testConfig.shuffleQuestions}
                    onChange={(e) => handleConfigChange('shuffleQuestions', e.target.checked)}
                  />
                  <FaRandom className="shuffle-icon" />
                  Shuffle Questions
                </label>
              </div>
            </div>
          </div>
          
          <div className="test-summary">
            <div className="summary-item">
              <span className="summary-label">Selected Questions:</span>
              <span className="summary-value">{selectedQuestions.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Marks:</span>
              <span className="summary-value">{totalMarks}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Duration:</span>
              <span className="summary-value">{testConfig.duration} minutes</span>
            </div>
          </div>
          
          <button 
            className="create-test-btn"
            onClick={createTest}
            disabled={creating || selectedQuestions.length === 0 || !testConfig.title}
          >
            {creating ? 'Creating Test...' : 'Create and Start Test'} <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomTestBuilder; 