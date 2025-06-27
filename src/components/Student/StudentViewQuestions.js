import React, { useState, useEffect } from 'react';
import { questionApi } from '../../services/api';
import { FaBook, FaFilter, FaSearch, FaCheck, FaPlus } from 'react-icons/fa';

const StudentViewQuestions = ({ subjectId }) => {
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [filters, setFilters] = useState({
    subjectId: subjectId || '',
    difficultyLevel: 'all',
    questionTypes: [],
    topic: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!subjectId) {
      const fetchSubjects = async () => {
        try {
          const data = await questionApi.getStudentSubjects();
          setSubjects(data);
          if (data.length > 0) {
            setFilters(prev => ({ ...prev, subjectId: data[0]._id }));
          }
        } catch (err) {
          setError('Failed to fetch subjects');
        }
      };
      fetchSubjects();
    }
  }, [subjectId]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!filters.subjectId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await questionApi.getStudentQuestions(filters);
        setQuestions(data);
      } catch (err) {
        setError('Failed to fetch questions');
      }
      setLoading(false);
    };
    fetchQuestions();
  }, [filters.subjectId, filters.difficultyLevel, filters.questionTypes, filters.topic]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev }));
  };

  const questionTypes = [
    { id: 'multiple_choice', name: 'Multiple Choice' },
    { id: 'short_answer', name: 'Short Answer' },
    { id: 'long_answer', name: 'Long Answer' },
    { id: 'true_false', name: 'True/False' },
    { id: 'fill_in_blank', name: 'Fill in the Blank' }
  ];

  const difficultyLevels = [
    { id: 'all', name: 'All Levels' },
    { id: 'easy', name: 'Easy' },
    { id: 'medium', name: 'Medium' },
    { id: 'hard', name: 'Hard' },
    { id: 'challenging', name: 'Challenging' }
  ];

  return (
    <div className="student-view-questions p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center"><FaBook className="mr-2" />View Questions</h2>
      <div className="filter-grid mb-4">
        {!subjectId && (
          <div className="filter-group">
            <label>Subject</label>
            <select
              value={filters.subjectId}
              onChange={e => handleFilterChange('subjectId', e.target.value)}
            >
              {subjects.map(subject => (
                <option key={subject._id} value={subject._id}>{subject.name}</option>
              ))}
            </select>
          </div>
        )}
        <div className="filter-group">
          <label>Difficulty Level</label>
          <select
            value={filters.difficultyLevel}
            onChange={e => handleFilterChange('difficultyLevel', e.target.value)}
          >
            {difficultyLevels.map(level => (
              <option key={level.id} value={level.id}>{level.name}</option>
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
                  onChange={() => {
                    setFilters(prev => {
                      const currentTypes = [...prev.questionTypes];
                      if (currentTypes.includes(type.id)) {
                        return { ...prev, questionTypes: currentTypes.filter(t => t !== type.id) };
                      } else {
                        return { ...prev, questionTypes: [...currentTypes, type.id] };
                      }
                    });
                  }}
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
              onChange={e => handleFilterChange('topic', e.target.value)}
              placeholder="Search by topic..."
            />
            <button className="search-btn" onClick={handleSearch}><FaSearch /></button>
          </div>
        </div>
      </div>
      <div className="questions-section">
        <div className="section-header mb-2">
          <h3 className="text-lg font-semibold flex items-center"><FaBook className="mr-2" />Available Questions</h3>
        </div>
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading questions...</p>
          </div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : questions.length > 0 ? (
          <div className="questions-list">
            {questions.map(question => (
              <div key={question._id} className="question-card mb-4 p-4 border rounded shadow">
                <div className="question-header flex items-center mb-2">
                  <span className="type-badge mr-2">
                    {question.type === 'multiple_choice' ? 'MCQ' :
                      question.type === 'short_answer' ? 'Short Answer' :
                      question.type === 'long_answer' ? 'Long Answer' :
                      question.type === 'true_false' ? 'True/False' : 'Fill in Blank'}
                  </span>
                  <span className={`difficulty-badge ${question.difficultyLevel} mr-2`}>
                    {question.difficultyLevel}
                  </span>
                  <span className="marks-badge">
                    {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
                  </span>
                </div>
                <div className="question-content mb-2">
                  <p>{question.text}</p>
                </div>
                {question.options && question.options.length > 0 && (
                  <div className="question-options mb-2">
                    <strong>Options:</strong>
                    <ul>
                      {question.options.map((opt, idx) => (
                        <li key={idx}>{String.fromCharCode(65 + idx)}. {opt}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {question.topic && (
                  <div className="question-topic text-sm text-gray-600">Topic: {question.topic}</div>
                )}
                {question.explanation && (
                  <div className="question-explanation text-sm mt-2"><strong>Explanation:</strong> {question.explanation}</div>
                )}
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
    </div>
  );
};

export default StudentViewQuestions; 