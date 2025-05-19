import React, { useState, useRef, useCallback } from 'react';
import { useExam } from '../../context/ExamContext';
import { FaExclamationTriangle } from 'react-icons/fa';

const ExamInterface = () => {
  const { loading, error, availableSubjects, fetchQuestions, saveExamResult } = useExam();
  
  const [examState, setExamState] = useState({
    isLoading: false,
    isStarted: false,
    isSubmitted: false,
    totalTime: 0,
    timeRemaining: 0,
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    examName: '',
    totalMarks: 0,
    earnedMarks: 0
  });
  
  const [examConfiguration, setExamConfiguration] = useState({
    subjects: [],
    duration: 60,
    questionCounts: {
      "2": 2,  // 2 marks questions
      "3": 2,  // 3 marks questions
      "4": 1,  // 4 marks questions
      "10": 0, // 10 marks questions
    }
  });
  
  const timer = useRef(null);
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Display main loading state
  if (loading && !examState.isStarted) {
    return (
      <div className="exam-loading">
        <h3>Loading Exam Interface...</h3>
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  // Display error state
  if (error && !examState.isStarted) {
    return (
      <div className="exam-error">
        <FaExclamationTriangle className="error-icon" />
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button className="retry-btn" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="exam-interface">
      <div className="exam-placeholder">
        <h2>Exam Interface</h2>
        <p>Select an exam to start or create a practice test.</p>
      </div>
    </div>
  );
};

export default ExamInterface; 