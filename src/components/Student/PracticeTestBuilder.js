import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBook, FaCalendarAlt, FaClipboardList, FaQuestionCircle, FaRandom, FaStopwatch, FaClock, FaPlay, FaExclamationTriangle } from 'react-icons/fa';
import { practiceTestApi } from '../../services/api';

const PracticeTestBuilder = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [availableTests, setAvailableTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch available practice tests
  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        setError(null);
        const tests = await practiceTestApi.getAllTests();
        setAvailableTests(tests);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching practice tests:', err);
        setError('Failed to fetch practice tests. Please try again later.');
        setLoading(false);
      }
    };

    fetchTests();
  }, [retryCount]);

  // Start a practice test
  const startTest = (testId) => {
    navigate(`/student/exam/practice/${testId}`);
  };

  // Retry loading tests
  const handleRetry = () => {
    setRetryCount(prevCount => prevCount + 1);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading available practice tests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <FaExclamationTriangle className="error-icon" />
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button className="retry-btn" onClick={handleRetry}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="practice-test-builder">
      <div className="builder-header">
        <h2>Available Practice Tests</h2>
        <p className="builder-description">
          Select a practice test to start practicing
        </p>
      </div>

      <div className="tests-grid">
        {availableTests.length > 0 ? (
          availableTests.map(test => (
            <div key={test._id} className="test-card">
              <div className="test-header">
                <h3>{test.title}</h3>
                <div className="test-subject">
                  <FaBook />
                  <span>{test.subject.name}</span>
                </div>
              </div>

              <div className="test-details">
                <div className="detail-item">
                  <FaClock />
                  <span>Duration: {test.duration} minutes</span>
                </div>
                <div className="detail-item">
                  <FaClipboardList />
                  <span>Total Marks: {test.totalMarks}</span>
                </div>
                <div className="detail-item">
                  <FaQuestionCircle />
                  <span>Questions: {test.questions ? test.questions.length : 0}</span>
                </div>
              </div>

              <p className="test-description">{test.description}</p>

              <div className="test-settings">
                {test.settings && test.settings.shuffleQuestions && (
                  <div className="setting-badge">
                    <FaRandom /> Shuffled Questions
                  </div>
                )}
                {test.settings && test.settings.showAnswersAfterSubmission && (
                  <div className="setting-badge">
                    <FaClipboardList /> Shows Answers
                  </div>
                )}
                {test.settings && test.settings.allowMultipleAttempts && (
                  <div className="setting-badge">
                    <FaPlay /> Multiple Attempts
                  </div>
                )}
              </div>

              <button 
                className="start-test-btn"
                onClick={() => startTest(test._id)}
              >
                Start Test
              </button>
            </div>
          ))
        ) : (
          <div className="no-tests">
            <div className="empty-state">
              <FaClipboardList className="empty-icon" />
              <h3>No Practice Tests Available</h3>
              <p>There are no practice tests available for your class at the moment.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeTestBuilder; 