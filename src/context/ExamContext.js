import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import API from '../services/api';

// Create context
const ExamContext = createContext();

// Provider component
export const ExamProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [examHistory, setExamHistory] = useState([]);
  
  // Fetch available subjects when component mounts
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const subjects = await API.getStudentSubjects();
        setAvailableSubjects(subjects);
        setError(null);
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setError('Failed to load your subjects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubjects();
  }, []);
  
  // Fetch exam history
  const fetchExamHistory = useCallback(async () => {
    try {
      setLoading(true);
      const history = await API.getExamHistory();
      setExamHistory(history);
      setError(null);
    } catch (err) {
      console.error('Error fetching exam history:', err);
      setError('Failed to load your exam history. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch questions based on filters
  const fetchQuestions = useCallback(async (filters) => {
    try {
      setLoading(true);
      setError(null);
      const result = await API.getQuestionsByFilters(filters);
      return result;
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions. Please try again later.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Save exam result
  const saveExamResult = useCallback(async (examResult) => {
    try {
      setLoading(true);
      setError(null);
      const savedResult = await API.saveExamResult(examResult);
      
      // Refresh exam history
      fetchExamHistory();
      
      return savedResult;
    } catch (err) {
      console.error('Error saving exam result:', err);
      setError('Failed to save your exam result. Please try again later.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchExamHistory]);
  
  return (
    <ExamContext.Provider 
      value={{ 
        loading,
        error,
        availableSubjects,
        examHistory,
        fetchQuestions,
        saveExamResult,
        fetchExamHistory
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

// Custom hook to use the exam context
export const useExam = () => useContext(ExamContext);

export default ExamContext; 