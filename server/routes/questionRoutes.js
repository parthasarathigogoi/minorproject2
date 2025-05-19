const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const TeacherSubject = require('../models/TeacherSubject');
const { authMiddleware, teacherAuthMiddleware } = require('../middleware/authMiddleware');
const auth = require('../middleware/auth');
const { isTeacher, isStudent } = require('../middleware/roleCheck');

// Get all questions (with filters)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { subject, classSection, type, difficultyLevel, topic, marks, search } = req.query;
    const query = {};
    
    // Apply filters if provided
    if (subject) query.subject = subject;
    if (classSection) query.classSection = classSection;
    if (type) query.type = type;
    if (difficultyLevel) query.difficultyLevel = difficultyLevel;
    if (topic) query.topic = topic;
    if (marks) query.marks = marks;
    
    // Text search if provided
    if (search) {
      query.$text = { $search: search };
    }
    
    // If user is teacher, only show questions they created
    if (req.user.role === 'teacher') {
      query.createdBy = req.user._id;
    }
    
    const questions = await Question.find(query)
      .populate('subject', 'name code')
      .populate('classSection', 'name classLevel section')
      .populate('createdBy', 'fullName')
      .sort({ createdAt: -1 });
    
    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a specific question by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('subject', 'name code')
      .populate('classSection', 'name classLevel section')
      .populate('createdBy', 'fullName');
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // If user is teacher and not the creator, don't allow access
    if (req.user.role === 'teacher' && question.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    res.status(200).json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new question (teachers only)
router.post('/', teacherAuthMiddleware, async (req, res) => {
  try {
    const { 
      text, type, subject, classSection, marks, topic, 
      options, correctAnswer, difficultyLevel, explanation, image
    } = req.body;
    
    // Verify that teacher teaches this subject in this class
    const teacherSubject = await TeacherSubject.findOne({
      teacher: req.user._id,
      subject,
      classSection
    });
    
    if (!teacherSubject) {
      return res.status(403).json({ 
        message: 'You are not authorized to create questions for this subject in this class' 
      });
    }
    
    const newQuestion = new Question({
      text,
      type,
      subject,
      classSection,
      marks,
      topic,
      options: options || [],
      correctAnswer,
      difficultyLevel: difficultyLevel || 'medium',
      explanation: explanation || '',
      image: image || '',
      createdBy: req.user._id
    });
    
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a question
router.put('/:id', teacherAuthMiddleware, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Only creator can update
    if (question.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update questions you created' });
    }
    
    const { 
      text, type, marks, topic, options, 
      correctAnswer, difficultyLevel, explanation, image
    } = req.body;
    
    // Update fields
    if (text) question.text = text;
    if (type) question.type = type;
    if (marks) question.marks = marks;
    if (topic) question.topic = topic;
    if (options) question.options = options;
    if (correctAnswer !== undefined) question.correctAnswer = correctAnswer;
    if (difficultyLevel) question.difficultyLevel = difficultyLevel;
    if (explanation !== undefined) question.explanation = explanation;
    if (image !== undefined) question.image = image;
    
    question.updatedAt = Date.now();
    
    const updatedQuestion = await question.save();
    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a question
router.delete('/:id', teacherAuthMiddleware, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Only creator can delete
    if (question.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete questions you created' });
    }
    
    await Question.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get questions by subject and class
router.get('/filter/subject-class', teacherAuthMiddleware, async (req, res) => {
  try {
    const { subject, classSection } = req.query;
    
    if (!subject || !classSection) {
      return res.status(400).json({ message: 'Subject and classSection are required' });
    }
    
    // Verify that teacher teaches this subject in this class
    const teacherSubject = await TeacherSubject.findOne({
      teacher: req.user._id,
      subject,
      classSection
    });
    
    if (!teacherSubject) {
      return res.status(403).json({ 
        message: 'You are not authorized to access questions for this subject in this class' 
      });
    }
    
    const questions = await Question.find({ 
      subject, 
      classSection,
      createdBy: req.user._id
    })
      .populate('subject', 'name code')
      .populate('classSection', 'name classLevel section')
      .sort({ createdAt: -1 });
    
    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions by subject and class:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all questions (admin/teacher only)
router.get('/', auth, async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('subject', 'name code')
      .populate('classSection', 'name')
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions', error: error.message });
  }
});

// Get questions by subject and filters for students
router.post('/student/filter', [auth, isStudent], async (req, res) => {
  try {
    const { 
      subjectId, 
      difficultyLevel, 
      questionTypes, 
      topic,
      limit 
    } = req.body;
    
    // Build query
    const query = {
      classSection: req.user.classSection
    };
    
    // Add subject filter if provided
    if (subjectId) {
      query.subject = subjectId;
    }
    
    // Add difficulty filter if provided
    if (difficultyLevel && difficultyLevel !== 'all') {
      query.difficultyLevel = difficultyLevel;
    }
    
    // Add question type filter if provided
    if (questionTypes && questionTypes.length > 0) {
      query.type = { $in: questionTypes };
    }
    
    // Add topic filter if provided
    if (topic) {
      query.topic = { $regex: topic, $options: 'i' };
    }
    
    // Fetch questions based on query
    const questions = await Question.find(query)
      .populate('subject', 'name code')
      .limit(limit || 100)
      .sort({ createdAt: -1 });
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching questions', 
      error: error.message 
    });
  }
});

// Get question by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('subject', 'name code')
      .populate('classSection', 'name')
      .populate('createdBy', 'fullName');
      
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching question', error: error.message });
  }
});

// Create new question (teacher only)
router.post('/', [auth, isTeacher], async (req, res) => {
  try {
    const questionData = {
      ...req.body,
      createdBy: req.user._id
    };
    
    const question = new Question(questionData);
    await question.save();
    
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Error creating question', error: error.message });
  }
});

// Update question (teacher only)
router.put('/:id', [auth, isTeacher], async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Check if teacher owns this question
    if (question.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied to this question' });
    }
    
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: 'Error updating question', error: error.message });
  }
});

// Delete question (teacher only)
router.delete('/:id', [auth, isTeacher], async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Check if teacher owns this question
    if (question.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied to this question' });
    }
    
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting question', error: error.message });
  }
});

module.exports = router; 