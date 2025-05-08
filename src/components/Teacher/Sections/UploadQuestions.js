import React, { useState, useEffect } from 'react';
import { FaUpload, FaPlus, FaTrash, FaCheckCircle, FaImage, FaFilter, FaEye, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import '../../../styles/UploadQuestions.css';

const UploadQuestions = ({ classSection, subjects }) => {
  const [question, setQuestion] = useState({
    text: '',
    type: 'multiple_choice',
    subject: '',
    marks: 1,
    topic: '',
    options: ['', ''],
    correctAnswer: '',
    difficultyLevel: 'medium',
    explanation: '',
    image: null
  });
  
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    subject: 'all',
    difficulty: 'all',
    marks: 'all'
  });
  
  // Mock API call to get subject details
  useEffect(() => {
    const fetchSubjectDetails = async () => {
      try {
        // In a real app, this would be an API call
        // Mock data for now
        const subjectDetails = subjects.map(subjectId => ({
          id: subjectId,
          name: subjectId.charAt(0).toUpperCase() + subjectId.slice(1).replace(/[0-9]+/, ' '),
          topics: [
            'Chapter 1 - Introduction',
            'Chapter 2 - Fundamentals',
            'Chapter 3 - Advanced Concepts',
            'Chapter 4 - Applications',
            'Chapter 5 - Case Studies'
          ]
        }));
        
        setSubjectOptions(subjectDetails);
        
        // Set default subject if available
        if (subjectDetails.length > 0 && !question.subject) {
          setQuestion(prev => ({
            ...prev,
            subject: subjectDetails[0].id
          }));
          
          // Set topics for the selected subject
          setTopics(subjectDetails[0].topics || []);
        }
      } catch (error) {
        console.error('Error fetching subject details:', error);
      }
    };
    
    if (subjects.length > 0) {
      fetchSubjectDetails();
    }
  }, [subjects, question.subject]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestion(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update topics when subject changes
    if (name === 'subject') {
      const selectedSubject = subjectOptions.find(s => s.id === value);
      setTopics(selectedSubject?.topics || []);
    }
  };
  
  // Handle option changes
  const handleOptionChange = (index, value) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    setQuestion(prev => ({
      ...prev,
      options: newOptions
    }));
  };
  
  // Add new option
  const addOption = () => {
    setQuestion(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };
  
  // Remove an option
  const removeOption = (index) => {
    if (question.options.length <= 2) return; // Minimum 2 options
    
    const newOptions = question.options.filter((_, i) => i !== index);
    setQuestion(prev => ({
      ...prev,
      options: newOptions,
      correctAnswer: prev.correctAnswer === index.toString() ? '' : 
        (parseInt(prev.correctAnswer) > index ? (parseInt(prev.correctAnswer) - 1).toString() : prev.correctAnswer)
    }));
  };
  
  // Handle file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setQuestion(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Reset form
  const resetForm = () => {
    setQuestion({
      text: '',
      type: 'multiple_choice',
      subject: subjectOptions.length > 0 ? subjectOptions[0].id : '',
      marks: 1,
      topic: '',
      options: ['', ''],
      correctAnswer: '',
      difficultyLevel: 'medium',
      explanation: '',
      image: null
    });
    setPreviewMode(false);
  };
  
  // Save question
  const saveQuestion = () => {
    // Validate question data
    if (!question.text || !question.subject || !question.topic) {
      alert('Please fill all required fields');
      return;
    }
    
    if (question.type === 'multiple_choice' && !question.correctAnswer) {
      alert('Please select the correct answer for multiple choice question');
      return;
    }
    
    // Generate unique ID
    const newQuestion = {
      ...question,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    // In a real app, this would be an API call to save the question
    setSavedQuestions(prev => [newQuestion, ...prev]);
    
    // Reset form for next question
    resetForm();
    
    // Show success message
    alert('Question saved successfully!');
  };
  
  // Apply filters to questions
  const getFilteredQuestions = () => {
    return savedQuestions.filter(q => {
      if (filters.type !== 'all' && q.type !== filters.type) return false;
      if (filters.subject !== 'all' && q.subject !== filters.subject) return false;
      if (filters.difficulty !== 'all' && q.difficultyLevel !== filters.difficulty) return false;
      if (filters.marks !== 'all' && q.marks !== parseInt(filters.marks)) return false;
      return true;
    });
  };
  
  // Update filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="upload-questions-container">
      <div className="page-header">
        <h2>Upload Questions</h2>
        <p>Create and manage questions for assignments and tests</p>
      </div>
      
      <div className="question-form-container">
        <div className="form-tabs">
          <div 
            className={`tab ${!previewMode ? 'active' : ''}`}
            onClick={() => setPreviewMode(false)}
          >
            Edit Question
          </div>
          <div 
            className={`tab ${previewMode ? 'active' : ''}`}
            onClick={() => setPreviewMode(true)}
          >
            Preview
          </div>
        </div>
        
        {!previewMode ? (
          <div className="question-form">
            <div className="form-group">
              <label>Question Type <span className="required">*</span></label>
              <select 
                name="type" 
                value={question.type} 
                onChange={handleChange}
                className="form-control"
              >
                <option value="multiple_choice">Multiple Choice (MCQ)</option>
                <option value="short_answer">Short Answer (2-3 Marks)</option>
                <option value="long_answer">Long Answer (4-10 Marks)</option>
                <option value="true_false">True/False</option>
                <option value="fill_in_blank">Fill in the Blank</option>
              </select>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Subject <span className="required">*</span></label>
                <select 
                  name="subject" 
                  value={question.subject} 
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">-- Select Subject --</option>
                  {subjectOptions.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Topic/Chapter <span className="required">*</span></label>
                <select 
                  name="topic" 
                  value={question.topic} 
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">-- Select Topic --</option>
                  {topics.map((topic, index) => (
                    <option key={index} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Marks <span className="required">*</span></label>
                <select 
                  name="marks" 
                  value={question.marks} 
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="1">1 Mark</option>
                  <option value="2">2 Marks</option>
                  <option value="3">3 Marks</option>
                  <option value="4">4 Marks</option>
                  <option value="5">5 Marks</option>
                  <option value="10">10 Marks</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Difficulty Level</label>
                <select 
                  name="difficultyLevel" 
                  value={question.difficultyLevel} 
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="challenging">Challenging</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>Question Text <span className="required">*</span></label>
              <textarea 
                name="text" 
                value={question.text} 
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your question here..."
                rows={4}
              ></textarea>
            </div>
            
            <div className="form-group">
              <label>Question Image (Optional)</label>
              <div className="image-upload">
                <input 
                  type="file" 
                  accept="image/*" 
                  id="question-image" 
                  onChange={handleImageUpload}
                  className="file-input"
                />
                <label htmlFor="question-image" className="file-label">
                  <FaImage /> {question.image ? 'Change Image' : 'Add Image'}
                </label>
                {question.image && (
                  <div className="image-preview">
                    <img src={question.image} alt="Question" />
                    <button 
                      type="button" 
                      className="remove-image"
                      onClick={() => setQuestion(prev => ({ ...prev, image: null }))}
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {(question.type === 'multiple_choice' || question.type === 'true_false') && (
              <div className="form-group">
                <label>Options <span className="required">*</span></label>
                {question.type === 'true_false' ? (
                  <div className="true-false-options">
                    <div className="option-row">
                      <input 
                        type="radio" 
                        id="option-true" 
                        name="correctAnswer"
                        value="0"
                        checked={question.correctAnswer === "0"}
                        onChange={handleChange}
                      />
                      <label htmlFor="option-true">True</label>
                    </div>
                    <div className="option-row">
                      <input 
                        type="radio" 
                        id="option-false" 
                        name="correctAnswer"
                        value="1"
                        checked={question.correctAnswer === "1"}
                        onChange={handleChange}
                      />
                      <label htmlFor="option-false">False</label>
                    </div>
                  </div>
                ) : (
                  <div className="options-container">
                    {question.options.map((option, index) => (
                      <div key={index} className="option-row">
                        <input 
                          type="radio" 
                          id={`option-${index}`} 
                          name="correctAnswer"
                          value={index}
                          checked={question.correctAnswer === index.toString()}
                          onChange={handleChange}
                        />
                        <input 
                          type="text" 
                          value={option} 
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="form-control option-input"
                        />
                        <button 
                          type="button" 
                          className="remove-option"
                          onClick={() => removeOption(index)}
                          disabled={question.options.length <= 2}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      className="add-option-btn"
                      onClick={addOption}
                    >
                      <FaPlus /> Add Option
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <div className="form-group">
              <label>Explanation (Optional)</label>
              <textarea 
                name="explanation" 
                value={question.explanation} 
                onChange={handleChange}
                className="form-control"
                placeholder="Provide an explanation or solution for this question..."
                rows={3}
              ></textarea>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={resetForm}
              >
                Reset
              </button>
              <button 
                type="button" 
                className="preview-btn"
                onClick={() => setPreviewMode(true)}
              >
                <FaEye /> Preview
              </button>
              <button 
                type="button" 
                className="save-btn"
                onClick={saveQuestion}
              >
                <FaCheckCircle /> Save Question
              </button>
            </div>
          </div>
        ) : (
          <div className="question-preview">
            <div className="preview-header">
              <span className={`difficulty-badge ${question.difficultyLevel}`}>
                {question.difficultyLevel.charAt(0).toUpperCase() + question.difficultyLevel.slice(1)}
              </span>
              <span className="marks-badge">{question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}</span>
            </div>
            
            <div className="preview-subject">
              {subjectOptions.find(s => s.id === question.subject)?.name || ''} • {question.topic}
            </div>
            
            <div className="preview-question-text">
              {question.text}
            </div>
            
            {question.image && (
              <div className="preview-image">
                <img src={question.image} alt="Question" />
              </div>
            )}
            
            {question.type === 'multiple_choice' && (
              <div className="preview-options">
                {question.options.map((option, index) => (
                  <div 
                    key={index} 
                    className={`preview-option ${question.correctAnswer === index.toString() ? 'correct' : ''}`}
                  >
                    <span className="option-label">{String.fromCharCode(65 + index)}.</span>
                    <span className="option-text">{option}</span>
                  </div>
                ))}
              </div>
            )}
            
            {question.type === 'true_false' && (
              <div className="preview-options">
                <div className={`preview-option ${question.correctAnswer === "0" ? 'correct' : ''}`}>
                  <span className="option-label">A.</span>
                  <span className="option-text">True</span>
                </div>
                <div className={`preview-option ${question.correctAnswer === "1" ? 'correct' : ''}`}>
                  <span className="option-label">B.</span>
                  <span className="option-text">False</span>
                </div>
              </div>
            )}
            
            {question.explanation && (
              <div className="preview-explanation">
                <h4>Explanation:</h4>
                <p>{question.explanation}</p>
              </div>
            )}
            
            <div className="preview-actions">
              <button 
                type="button" 
                className="back-to-edit-btn"
                onClick={() => setPreviewMode(false)}
              >
                Back to Edit
              </button>
              <button 
                type="button" 
                className="save-btn"
                onClick={saveQuestion}
              >
                <FaCheckCircle /> Save Question
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="saved-questions-section">
        <div className="section-header">
          <h3>Saved Questions ({savedQuestions.length})</h3>
          <button 
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filters {showFilters ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        
        {showFilters && (
          <div className="filters-container">
            <div className="filter-group">
              <label>Type:</label>
              <select 
                name="type" 
                value={filters.type} 
                onChange={handleFilterChange}
              >
                <option value="all">All Types</option>
                <option value="multiple_choice">Multiple Choice</option>
                <option value="short_answer">Short Answer</option>
                <option value="long_answer">Long Answer</option>
                <option value="true_false">True/False</option>
                <option value="fill_in_blank">Fill in the Blank</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Subject:</label>
              <select 
                name="subject" 
                value={filters.subject} 
                onChange={handleFilterChange}
              >
                <option value="all">All Subjects</option>
                {subjectOptions.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Difficulty:</label>
              <select 
                name="difficulty" 
                value={filters.difficulty} 
                onChange={handleFilterChange}
              >
                <option value="all">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="challenging">Challenging</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Marks:</label>
              <select 
                name="marks" 
                value={filters.marks} 
                onChange={handleFilterChange}
              >
                <option value="all">All Marks</option>
                <option value="1">1 Mark</option>
                <option value="2">2 Marks</option>
                <option value="3">3 Marks</option>
                <option value="4">4 Marks</option>
                <option value="5">5 Marks</option>
                <option value="10">10 Marks</option>
              </select>
            </div>
          </div>
        )}
        
        {getFilteredQuestions().length > 0 ? (
          <div className="questions-list">
            {getFilteredQuestions().map(q => (
              <div key={q.id} className="question-item">
                <div className="question-header">
                  <div className="question-meta">
                    <span className={`type-badge ${q.type}`}>
                      {q.type === 'multiple_choice' ? 'MCQ' : 
                       q.type === 'short_answer' ? 'Short Answer' :
                       q.type === 'long_answer' ? 'Long Answer' :
                       q.type === 'true_false' ? 'True/False' : 'Fill Blank'}
                    </span>
                    <span className={`difficulty-badge ${q.difficultyLevel}`}>
                      {q.difficultyLevel.charAt(0).toUpperCase() + q.difficultyLevel.slice(1)}
                    </span>
                    <span className="marks-badge">
                      {q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}
                    </span>
                  </div>
                  <div className="question-actions">
                    <button className="action-btn edit">Edit</button>
                    <button className="action-btn delete">Delete</button>
                  </div>
                </div>
                
                <div className="question-text">
                  {q.text}
                </div>
                
                <div className="question-footer">
                  <span className="subject-topic">
                    {subjectOptions.find(s => s.id === q.subject)?.name || ''} • {q.topic}
                  </span>
                  <span className="created-at">
                    {new Date(q.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-questions">
            <div className="empty-state">
              <FaUpload className="empty-icon" />
              <h3>No Questions Saved</h3>
              <p>Create and save questions to view them here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadQuestions; 