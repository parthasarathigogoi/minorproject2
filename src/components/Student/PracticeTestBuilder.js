import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBook, FaCalendarAlt, FaClipboardList, FaQuestionCircle, FaRandom, FaStopwatch, FaClock } from 'react-icons/fa';

const PracticeTestBuilder = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Enrolled subjects (would come from API in real implementation)
  const [enrolledSubjects, setEnrolledSubjects] = useState([
    { id: 1, name: 'Mathematics 101', code: 'MATH101' },
    { id: 2, name: 'Physics', code: 'PHYS202' },
    { id: 3, name: 'Computer Science', code: 'CS110' },
    { id: 4, name: 'Chemistry', code: 'CHEM101' },
    { id: 5, name: 'Biology', code: 'BIO202' },
  ]);

  // State for test configuration
  const [testConfig, setTestConfig] = useState({
    selectedSubjects: [],
    duration: 60, // minutes
    questionCounts: {
      '2': 2,  // 2 marks - easy questions
      '3': 2,  // 3 marks - medium questions
      '4': 1,  // 4 marks - hard questions
      '10': 0, // 10 marks - complex questions
    },
    mcqCount: 5
  });

  // Calculate total marks and questions
  const totalMarks = Object.entries(testConfig.questionCounts).reduce(
    (sum, [mark, count]) => sum + (parseInt(mark) * count), 0
  ) + testConfig.mcqCount;

  const totalQuestions = Object.values(testConfig.questionCounts).reduce(
    (sum, count) => sum + count, 0
  ) + testConfig.mcqCount;

  // Handle subject selection toggle
  const toggleSubject = (subjectId) => {
    setTestConfig(prev => {
      const isSelected = prev.selectedSubjects.includes(subjectId);
      
      return {
        ...prev,
        selectedSubjects: isSelected
          ? prev.selectedSubjects.filter(id => id !== subjectId)
          : [...prev.selectedSubjects, subjectId]
      };
    });
  };

  // Handle question count updates
  const updateQuestionCount = (markType, newCount) => {
    const count = Math.max(0, parseInt(newCount));
    setTestConfig(prev => ({
      ...prev,
      questionCounts: {
        ...prev.questionCounts,
        [markType]: count
      }
    }));
  };

  // Handle MCQ count update
  const updateMCQCount = (newCount) => {
    const count = Math.max(0, parseInt(newCount));
    setTestConfig(prev => ({
      ...prev,
      mcqCount: count
    }));
  };

  // Handle duration update
  const updateDuration = (newDuration) => {
    setTestConfig(prev => ({
      ...prev,
      duration: newDuration
    }));
  };

  // Generate test
  const generateTest = () => {
    if (testConfig.selectedSubjects.length === 0) {
      alert('Please select at least one subject');
      return;
    }

    if (totalQuestions === 0) {
      alert('Please select at least one question');
      return;
    }

    // In a real app, we would make an API call to generate the test
    // For now, we'll just navigate to a mock exam page
    console.log('Generating test with config:', testConfig);
    navigate('/student/exam/practice');
  };

  return (
    <div className="practice-test-builder">
      <div className="builder-header">
        <h2>Custom Practice Test Builder</h2>
        <p className="builder-description">
          Create your own practice test by selecting subjects and question types
        </p>
      </div>

      <div className="builder-container">
        {/* Step 1: Subject Selection */}
        <div className="builder-section">
          <div className="section-header">
            <FaBook className="section-icon" />
            <h3>Step 1: Select Subjects</h3>
          </div>
          <p className="section-description">
            Choose one or more subjects from which questions will be drawn
          </p>

          <div className="subject-grid">
            {enrolledSubjects.map(subject => (
              <div 
                key={subject.id}
                className={`subject-card ${testConfig.selectedSubjects.includes(subject.id) ? 'selected' : ''}`}
                onClick={() => toggleSubject(subject.id)}
              >
                <div className="subject-name">{subject.name}</div>
                <div className="subject-code">{subject.code}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Question Selection */}
        <div className="builder-section">
          <div className="section-header">
            <FaQuestionCircle className="section-icon" />
            <h3>Step 2: Select Question Types</h3>
          </div>
          <p className="section-description">
            Choose how many questions you want for each mark value
          </p>

          <div className="question-type-grid">
            <div className="question-card">
              <div className="question-header">
                <h4>2 Marks Questions</h4>
                <span className="marks-badge">2</span>
              </div>
              <p className="question-description">Basic concept questions (Easy)</p>
              <div className="question-counter">
                <button 
                  className="counter-btn minus"
                  onClick={() => updateQuestionCount('2', testConfig.questionCounts['2'] - 1)}
                  disabled={testConfig.questionCounts['2'] <= 0}
                >–</button>
                <span className="counter-value">{testConfig.questionCounts['2']}</span>
                <button 
                  className="counter-btn plus"
                  onClick={() => updateQuestionCount('2', testConfig.questionCounts['2'] + 1)}
                >+</button>
              </div>
            </div>

            <div className="question-card">
              <div className="question-header">
                <h4>3 Marks Questions</h4>
                <span className="marks-badge">3</span>
              </div>
              <p className="question-description">Moderate difficulty (Medium)</p>
              <div className="question-counter">
                <button 
                  className="counter-btn minus"
                  onClick={() => updateQuestionCount('3', testConfig.questionCounts['3'] - 1)}
                  disabled={testConfig.questionCounts['3'] <= 0}
                >–</button>
                <span className="counter-value">{testConfig.questionCounts['3']}</span>
                <button 
                  className="counter-btn plus"
                  onClick={() => updateQuestionCount('3', testConfig.questionCounts['3'] + 1)}
                >+</button>
              </div>
            </div>

            <div className="question-card">
              <div className="question-header">
                <h4>4 Marks Questions</h4>
                <span className="marks-badge">4</span>
              </div>
              <p className="question-description">Complex application questions (Hard)</p>
              <div className="question-counter">
                <button 
                  className="counter-btn minus"
                  onClick={() => updateQuestionCount('4', testConfig.questionCounts['4'] - 1)}
                  disabled={testConfig.questionCounts['4'] <= 0}
                >–</button>
                <span className="counter-value">{testConfig.questionCounts['4']}</span>
                <button 
                  className="counter-btn plus"
                  onClick={() => updateQuestionCount('4', testConfig.questionCounts['4'] + 1)}
                >+</button>
              </div>
            </div>

            <div className="question-card">
              <div className="question-header">
                <h4>10 Marks Questions</h4>
                <span className="marks-badge">10</span>
              </div>
              <p className="question-description">In-depth analytical questions (Expert)</p>
              <div className="question-counter">
                <button 
                  className="counter-btn minus"
                  onClick={() => updateQuestionCount('10', testConfig.questionCounts['10'] - 1)}
                  disabled={testConfig.questionCounts['10'] <= 0}
                >–</button>
                <span className="counter-value">{testConfig.questionCounts['10']}</span>
                <button 
                  className="counter-btn plus"
                  onClick={() => updateQuestionCount('10', testConfig.questionCounts['10'] + 1)}
                >+</button>
              </div>
            </div>

            <div className="question-card">
              <div className="question-header">
                <h4>Multiple Choice Questions</h4>
                <span className="marks-badge">MCQ</span>
              </div>
              <p className="question-description">Objective questions with options</p>
              <div className="question-counter">
                <button 
                  className="counter-btn minus"
                  onClick={() => updateMCQCount(testConfig.mcqCount - 1)}
                  disabled={testConfig.mcqCount <= 0}
                >–</button>
                <span className="counter-value">{testConfig.mcqCount}</span>
                <button 
                  className="counter-btn plus"
                  onClick={() => updateMCQCount(testConfig.mcqCount + 1)}
                >+</button>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Set Duration */}
        <div className="builder-section">
          <div className="section-header">
            <FaClock className="section-icon" />
            <h3>Step 3: Set Test Duration</h3>
          </div>
          <p className="section-description">
            Choose how much time you'll have to complete the test
          </p>

          <div className="duration-selector">
            <div className="duration-slider-container">
              <input
                type="range"
                min="15"
                max="180"
                step="15"
                value={testConfig.duration}
                onChange={(e) => updateDuration(parseInt(e.target.value))}
                className="duration-slider"
              />
              <div className="duration-markers">
                <span>15m</span>
                <span>30m</span>
                <span>1h</span>
                <span>2h</span>
                <span>3h</span>
              </div>
            </div>
            <div className="duration-display">
              <FaStopwatch className="duration-icon" />
              <span className="duration-value">{testConfig.duration} minutes</span>
            </div>
          </div>
        </div>

        {/* Test Summary */}
        <div className="test-summary">
          <h3>Test Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <div className="summary-label">Selected Subjects</div>
              <div className="summary-value">
                {testConfig.selectedSubjects.length > 0
                  ? testConfig.selectedSubjects.map(id => 
                      enrolledSubjects.find(sub => sub.id === id)?.name
                    ).join(", ")
                  : "None selected"}
              </div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Total Questions</div>
              <div className="summary-value">{totalQuestions}</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Total Marks</div>
              <div className="summary-value">{totalMarks}</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Duration</div>
              <div className="summary-value">{testConfig.duration} minutes</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Estimated Time per Question</div>
              <div className="summary-value">
                {totalQuestions > 0 
                  ? Math.round((testConfig.duration / totalQuestions) * 10) / 10 
                  : 0} minutes
              </div>
            </div>
          </div>
        </div>
        
        {/* Generate Button */}
        <button 
          className="generate-test-btn"
          onClick={generateTest}
          disabled={testConfig.selectedSubjects.length === 0 || totalQuestions === 0}
        >
          Generate Practice Test
        </button>

        <div className="test-disclaimer">
          <FaRandom className="disclaimer-icon" />
          <p>Questions will be randomly selected from the teacher-uploaded question pool for the selected subjects</p>
        </div>
      </div>
    </div>
  );
};

export default PracticeTestBuilder; 