const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const auth = require('../middleware/auth');
const generateCode = require('../utils/generateCode');
const { authMiddleware } = require('../middleware/authMiddleware');

// Get all subjects that the student is enrolled in
// GET /api/subjects/student
router.get('/student', auth, async (req, res) => {
  try {
    // Ensure we use the correct user ID type for querying
    const studentId = req.user._id || req.user.id;
    // Find subjects where the student ID is in the students array
    const subjects = await Subject.find({
      students: studentId
    }).populate('teacher', 'fullName email').populate('students', 'fullName email');
    res.json(subjects);
  } catch (err) {
    console.error('Error fetching student subjects:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all subjects that the teacher teaches
// GET /api/subjects/teacher
router.get('/teacher', auth, async (req, res) => {
  try {
    // Check if user is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Find subjects where the teacher ID is in the teacher field
    const subjects = await Subject.find({
      teacher: req.user.id
    });
    
    res.json(subjects);
  } catch (err) {
    console.error('Error fetching teacher subjects:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new subject (admin only)
// POST /api/subjects
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create subjects' });
    }
    
    const { name, code, description } = req.body;
    
    // Check if subject with name or code already exists
    let subject = await Subject.findOne({ $or: [{ name }, { code }] });
    if (subject) {
      return res.status(400).json({ message: 'Subject with this name or code already exists' });
    }
    
    // Create new subject
    subject = new Subject({
      name,
      code,
      description
    });
    
    await subject.save();
    
    res.status(201).json(subject);
  } catch (err) {
    console.error('Error creating subject:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a teacher to a subject (admin only)
// PUT /api/subjects/:id/teachers
router.put('/:id/teachers', auth, async (req, res) => {
  try {
    // Check if user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update subject teachers' });
    }
    
    const { teacherId } = req.body;
    
    if (!teacherId) {
      return res.status(400).json({ message: 'Teacher ID is required' });
    }
    
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    // Check if teacher is already assigned
    if (subject.teachers.includes(teacherId)) {
      return res.status(400).json({ message: 'Teacher is already assigned to this subject' });
    }
    
    // Add teacher to subject
    subject.teachers.push(teacherId);
    await subject.save();
    
    res.json(subject);
  } catch (err) {
    console.error('Error adding teacher to subject:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Enroll a student in a subject
// POST /api/subjects/:id/enroll
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    // Check if student is already enrolled
    if (subject.students.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are already enrolled in this subject' });
    }
    
    // Add student to subject
    subject.students.push(req.user.id);
    await subject.save();
    
    res.json({ message: 'Successfully enrolled in the subject' });
  } catch (err) {
    console.error('Error enrolling in subject:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all subjects (admin only)
// GET /api/subjects
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can view all subjects' });
    }
    
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    console.error('Error fetching subjects:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Teacher creates a subject
router.post('/create', auth, async (req, res) => {
  console.log('POST /api/subjects/create request received');
  try {
    if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Only teachers can create subjects' });
    const { name } = req.body;
    let code;
    let exists = true;
    // Ensure unique code
    while (exists) {
      code = generateCode();
      exists = await Subject.findOne({ code });
    }
    const subject = new Subject({
      name,
      code,
      teacher: req.user.id,
      students: []
    });
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.name) {
      // Duplicate subject name
      return res.status(400).json({ message: 'A subject with this name already exists.' });
    }
    console.error('Error creating subject:', err);
    res.status(500).json({ message: 'Error creating subject', error: err.message });
  }
});

// Student joins a subject by code
router.post('/join', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ message: 'Only students can join subjects' });
    const { code } = req.body;
    const subject = await Subject.findOne({ code });
    if (!subject) {
      return res.status(404).json({ message: 'Invalid subject code' });
    }
    if (subject.students.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already joined this subject' });
    }
    subject.students.push(req.user.id);
    await subject.save();
    res.status(200).json({ message: 'Joined subject successfully', subject });
  } catch (err) {
    res.status(500).json({ message: 'Error joining subject', error: err.message });
  }
});

module.exports = router; 