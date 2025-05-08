const express = require('express');
const router = express.Router();
const ExamResult = require('../models/ExamResult');
const auth = require('../middleware/auth');

// Save exam result
// POST /api/exams/results
router.post('/results', auth, async (req, res) => {
  try {
    const {
      examName,
      subjects,
      totalMarks,
      earnedMarks,
      duration,
      timeTaken,
      questions,
      submittedAt
    } = req.body;
    
    // Validate required fields
    if (!examName || !totalMarks || !earnedMarks || !questions) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Calculate percentage
    const percentage = (earnedMarks / totalMarks) * 100;
    
    // Create new exam result
    const examResult = new ExamResult({
      student: req.user.id,
      examName,
      subjects: subjects || [],
      totalMarks,
      earnedMarks,
      percentage,
      duration,
      timeTaken,
      questions,
      submittedAt: submittedAt || Date.now()
    });
    
    const savedResult = await examResult.save();
    
    res.status(201).json(savedResult);
  } catch (err) {
    console.error('Error saving exam result:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student's exam history
// GET /api/exams/history
router.get('/history', auth, async (req, res) => {
  try {
    const examResults = await ExamResult.find({ student: req.user.id })
      .sort({ submittedAt: -1 }) // Most recent first
      .select('-questions'); // Exclude detailed question data
    
    res.json(examResults);
  } catch (err) {
    console.error('Error fetching exam history:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific exam result by ID
// GET /api/exams/results/:id
router.get('/results/:id', auth, async (req, res) => {
  try {
    const examResult = await ExamResult.findById(req.params.id);
    
    // Check if result exists
    if (!examResult) {
      return res.status(404).json({ message: 'Exam result not found' });
    }
    
    // Check if user is the student who took the exam
    if (examResult.student.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(examResult);
  } catch (err) {
    console.error('Error fetching exam result:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student performance statistics
// GET /api/exams/stats
router.get('/stats', auth, async (req, res) => {
  try {
    // Aggregate exam results to get statistics
    const stats = await ExamResult.aggregate([
      { $match: { student: req.user.id } },
      { 
        $group: {
          _id: null,
          totalExams: { $sum: 1 },
          averageScore: { $avg: '$percentage' },
          totalTime: { $sum: '$timeTaken' },
          highestScore: { $max: '$percentage' },
          lowestScore: { $min: '$percentage' }
        }
      }
    ]);
    
    // If no exams found, return default stats
    if (stats.length === 0) {
      return res.json({
        totalExams: 0,
        averageScore: 0,
        totalTime: 0,
        highestScore: 0,
        lowestScore: 0
      });
    }
    
    // Get subject performance
    const subjectStats = await ExamResult.aggregate([
      { $match: { student: req.user.id } },
      { $unwind: '$subjects' },
      { 
        $group: {
          _id: '$subjects',
          averageScore: { $avg: '$percentage' },
          examCount: { $sum: 1 }
        }
      },
      { $sort: { averageScore: -1 } }
    ]);
    
    // Combine results
    const result = {
      ...stats[0],
      subjects: subjectStats
    };
    
    delete result._id; // Remove MongoDB _id
    
    res.json(result);
  } catch (err) {
    console.error('Error fetching exam statistics:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 