const express = require('express');
const router = express.Router();
const PracticeTest = require('../models/PracticeTest');
const Question = require('../models/Question');
const auth = require('../middleware/auth');
const { isTeacher, isStudent } = require('../middleware/roleCheck');

// GET all practice tests (filtered by role)
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    
    // If student, only show published tests for their class/section
    if (req.user.role === 'student') {
      query = {
        isPublished: true,
        classSection: req.user.classSection,
        isActive: true
      };
    }
    // If teacher, show tests they created
    else if (req.user.role === 'teacher') {
      query = { createdBy: req.user._id };
    }

    const tests = await PracticeTest.find(query)
      .populate('subject', 'name code')
      .populate('classSection', 'name')
      .sort({ createdAt: -1 });

    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching practice tests', error: error.message });
  }
});

// GET practice test by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const test = await PracticeTest.findById(req.params.id)
      .populate('subject', 'name code')
      .populate('classSection', 'name')
      .populate('questions');

    if (!test) {
      return res.status(404).json({ message: 'Practice test not found' });
    }

    // Check if student has access to this test
    if (req.user.role === 'student') {
      if (!test.isPublished || !test.isActive || test.classSection.toString() !== req.user.classSection.toString()) {
        return res.status(403).json({ message: 'Access denied to this practice test' });
      }
    }
    // Check if teacher owns this test
    else if (req.user.role === 'teacher' && test.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied to this practice test' });
    }

    res.json(test);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching practice test', error: error.message });
  }
});

// POST new practice test (teacher only)
router.post('/', [auth, isTeacher], async (req, res) => {
  try {
    const testData = {
      ...req.body,
      createdBy: req.user._id
    };

    const test = new PracticeTest(testData);
    await test.save();

    res.status(201).json(test);
  } catch (error) {
    res.status(500).json({ message: 'Error creating practice test', error: error.message });
  }
});

// POST create custom test from selected questions (student)
router.post('/custom', [auth, isStudent], async (req, res) => {
  try {
    const { 
      title, 
      description, 
      subjectId, 
      questionIds,
      duration,
      shuffleQuestions
    } = req.body;
    
    // Validate required fields
    if (!title || !subjectId || !questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Fetch the questions to ensure they exist and are accessible to the student
    const questions = await Question.find({
      _id: { $in: questionIds },
      classSection: req.user.classSection,
      subject: subjectId
    });
    
    // Check if all questions were found
    if (questions.length !== questionIds.length) {
      return res.status(400).json({ 
        message: 'Some questions were not found or are not accessible' 
      });
    }
    
    // Calculate total marks
    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    
    // Create the practice test
    const testData = {
      title,
      description: description || `Custom test created by ${req.user.fullName}`,
      createdBy: req.user._id,
      subject: subjectId,
      classSection: req.user.classSection,
      duration: duration || 60, // Default 60 minutes
      totalMarks,
      questions: questionIds,
      isPublished: true,
      isActive: true,
      isCustomTest: true, // Flag to mark as custom student test
      settings: {
        shuffleQuestions: shuffleQuestions || false,
        showAnswersAfterSubmission: true,
        allowMultipleAttempts: true,
        passingPercentage: 40
      }
    };
    
    const test = new PracticeTest(testData);
    await test.save();
    
    // Return the created test with populated fields
    const populatedTest = await PracticeTest.findById(test._id)
      .populate('subject', 'name code')
      .populate('classSection', 'name')
      .populate('questions');
    
    res.status(201).json(populatedTest);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating custom practice test', 
      error: error.message 
    });
  }
});

// PUT update practice test (teacher only)
router.put('/:id', [auth, isTeacher], async (req, res) => {
  try {
    const test = await PracticeTest.findById(req.params.id);
    
    if (!test) {
      return res.status(404).json({ message: 'Practice test not found' });
    }

    // Check if teacher owns this test
    if (test.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied to this practice test' });
    }

    const updatedTest = await PracticeTest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedTest);
  } catch (error) {
    res.status(500).json({ message: 'Error updating practice test', error: error.message });
  }
});

// DELETE practice test (teacher only)
router.delete('/:id', [auth, isTeacher], async (req, res) => {
  try {
    const test = await PracticeTest.findById(req.params.id);
    
    if (!test) {
      return res.status(404).json({ message: 'Practice test not found' });
    }

    // Check if teacher owns this test
    if (test.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied to this practice test' });
    }

    await test.remove();
    res.json({ message: 'Practice test deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting practice test', error: error.message });
  }
});

// Publish/unpublish practice test (teacher only)
router.patch('/:id/publish', [auth, isTeacher], async (req, res) => {
  try {
    const test = await PracticeTest.findById(req.params.id);
    
    if (!test) {
      return res.status(404).json({ message: 'Practice test not found' });
    }

    // Check if teacher owns this test
    if (test.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied to this practice test' });
    }

    test.isPublished = !test.isPublished;
    await test.save();

    res.json({ 
      message: test.isPublished ? 'Practice test published successfully' : 'Practice test unpublished successfully',
      isPublished: test.isPublished 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating practice test status', error: error.message });
  }
});

module.exports = router; 