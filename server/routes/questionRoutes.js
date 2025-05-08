const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const auth = require('../middleware/auth');

// Get questions for practice test based on filters
// POST /api/questions/practice
router.post('/practice', auth, async (req, res) => {
  try {
    const { subjects, questionCounts } = req.body;
    
    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ message: 'At least one subject is required' });
    }
    
    if (!questionCounts || typeof questionCounts !== 'object') {
      return res.status(400).json({ message: 'Question counts object is required' });
    }
    
    // Initialize result object
    const result = {
      questions: {}
    };
    
    // Process each mark value
    for (const markValue in questionCounts) {
      const count = questionCounts[markValue];
      
      if (count > 0) {
        // Find questions matching criteria
        const questionsWithMark = await Question.aggregate([
          {
            $match: {
              subject: { $in: subjects },
              marks: parseInt(markValue, 10)
            }
          },
          { $sample: { size: count } } // Random selection
        ]);
        
        // Add to result
        result.questions[markValue] = questionsWithMark;
      }
    }
    
    res.json(result);
  } catch (err) {
    console.error('Error fetching practice questions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new question (teacher only)
// POST /api/questions
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can create questions' });
    }
    
    const {
      text,
      type,
      subject,
      marks,
      options,
      correctAnswer,
      difficultyLevel
    } = req.body;
    
    // Validate question data
    if (!text || !type || !subject || !marks) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Validate multiple choice questions have options
    if (type === 'multiple_choice' && (!options || !Array.isArray(options) || options.length === 0)) {
      return res.status(400).json({ message: 'Multiple choice questions must have options' });
    }
    
    // Create new question
    const newQuestion = new Question({
      text,
      type,
      subject,
      marks,
      options: type === 'multiple_choice' ? options : undefined,
      correctAnswer,
      difficultyLevel: difficultyLevel || 'medium',
      createdBy: req.user.id
    });
    
    const savedQuestion = await newQuestion.save();
    
    res.status(201).json(savedQuestion);
  } catch (err) {
    console.error('Error creating question:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all questions for a subject (teacher only)
// GET /api/questions/subject/:subjectName
router.get('/subject/:subjectName', auth, async (req, res) => {
  try {
    // Check if user is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can view all questions' });
    }
    
    const questions = await Question.find({ 
      subject: req.params.subjectName,
      createdBy: req.user.id
    });
    
    res.json(questions);
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a question (teacher only, must be question creator)
// PUT /api/questions/:id
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if user is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can update questions' });
    }
    
    const question = await Question.findById(req.params.id);
    
    // Check if question exists
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Check if user is the creator of the question
    if (question.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own questions' });
    }
    
    // Update question fields
    const updateData = req.body;
    
    // Update the question
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    
    res.json(updatedQuestion);
  } catch (err) {
    console.error('Error updating question:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a question (teacher only, must be question creator)
// DELETE /api/questions/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can delete questions' });
    }
    
    const question = await Question.findById(req.params.id);
    
    // Check if question exists
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Check if user is the creator of the question
    if (question.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own questions' });
    }
    
    await Question.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    console.error('Error deleting question:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 