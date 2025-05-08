import React, { useState, useEffect } from 'react';
import { FaBook, FaChalkboardTeacher, FaArrowRight } from 'react-icons/fa';
import '../../styles/ClassSectionSelector.css';

const ClassSectionSelector = ({ 
  classSections, 
  subjectsByClass, 
  onClassSectionChange, 
  onSubjectSelection,
  initialClassSection = '',
  initialSubjects = []
}) => {
  const [selectedClassSection, setSelectedClassSection] = useState(initialClassSection);
  const [selectedSubjects, setSelectedSubjects] = useState(initialSubjects);
  const [showSubjectSelector, setShowSubjectSelector] = useState(!!initialClassSection);
  const [step, setStep] = useState(initialClassSection ? 2 : 1);

  useEffect(() => {
    if (initialClassSection) {
      setSelectedClassSection(initialClassSection);
      setShowSubjectSelector(true);
      setStep(2);
    }
    
    if (initialSubjects.length > 0) {
      setSelectedSubjects(initialSubjects);
    }
  }, [initialClassSection, initialSubjects]);

  // Handle class/section selection
  const handleClassSectionChange = (e) => {
    const classId = e.target.value;
    setSelectedClassSection(classId);
    setSelectedSubjects([]);
    setShowSubjectSelector(classId !== '');
    
    if (classId) {
      setStep(2);
    } else {
      setStep(1);
    }
  };
  
  // Handle subject selection/deselection
  const handleSubjectChange = (subjectId) => {
    setSelectedSubjects(prev => {
      if (prev.includes(subjectId)) {
        return prev.filter(id => id !== subjectId);
      } else {
        return [...prev, subjectId];
      }
    });
  };
  
  // Get available subjects for selected class
  const availableSubjects = selectedClassSection ? subjectsByClass[selectedClassSection] || [] : [];
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (step === 1 && selectedClassSection) {
      setStep(2);
      return;
    }
    
    if (step === 2 && selectedSubjects.length > 0) {
      onClassSectionChange(selectedClassSection);
      onSubjectSelection(selectedSubjects);
    }
  };

  return (
    <div className="class-section-selector">
      <div className="selector-header">
        <h2>Set Up Your Teaching Environment</h2>
        <p>Select your class/section and the subjects you teach to get started</p>
      </div>
      
      <div className="selector-steps">
        <div className={`step ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-text">Select Class/Section</div>
        </div>
        <div className="step-connector"></div>
        <div className={`step ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-text">Select Subjects</div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="selector-form">
        {step === 1 && (
          <div className="step-content">
            <div className="selector-group">
              <label>Select Class/Section <span className="required">*</span></label>
              <select 
                value={selectedClassSection} 
                onChange={handleClassSectionChange}
                className="class-selector"
                required
              >
                <option value="">-- Select Class/Section --</option>
                {classSections.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
            
            <div className="class-section-cards">
              {classSections.map(cls => (
                <div 
                  key={cls.id}
                  className={`class-section-card ${selectedClassSection === cls.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedClassSection(cls.id);
                    setShowSubjectSelector(true);
                    setStep(2);
                  }}
                >
                  <div className="card-icon">
                    <FaChalkboardTeacher />
                  </div>
                  <h3>{cls.name}</h3>
                  <div className="card-subjects-count">
                    {subjectsByClass[cls.id]?.length || 0} subjects available
                  </div>
                </div>
              ))}
            </div>
            
            <div className="step-navigation">
              <button 
                type="button" 
                className="next-btn"
                disabled={!selectedClassSection}
                onClick={() => setStep(2)}
              >
                Next <FaArrowRight />
              </button>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="step-content">
            <div className="selected-class-banner">
              <FaChalkboardTeacher />
              <span>Selected: {classSections.find(c => c.id === selectedClassSection)?.name}</span>
              <button 
                type="button" 
                className="change-btn"
                onClick={() => setStep(1)}
              >
                Change
              </button>
            </div>
            
            <div className="selector-group">
              <label>Select Subjects You Teach <span className="required">*</span></label>
              <div className="subject-selector-chips">
                {availableSubjects.length > 0 ? (
                  availableSubjects.map(subject => (
                    <div 
                      key={subject.id}
                      className={`subject-selector-chip ${selectedSubjects.includes(subject.id) ? 'selected' : ''}`}
                      onClick={() => handleSubjectChange(subject.id)}
                    >
                      <div className="chip-icon"><FaBook /></div>
                      {subject.name}
                    </div>
                  ))
                ) : (
                  <p className="no-subjects">No subjects available for this class/section</p>
                )}
              </div>
              
              {selectedSubjects.length > 0 && (
                <div className="selected-count">
                  {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''} selected
                </div>
              )}
            </div>
            
            <div className="step-navigation">
              <button 
                type="button" 
                className="back-btn"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={selectedSubjects.length === 0}
              >
                Start Teaching
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ClassSectionSelector; 