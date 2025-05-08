const express = require('express');
const router = express.Router();
const TeacherSubject = require('../models/TeacherSubject');
const ClassSection = require('../models/ClassSection');
const Subject = require('../models/Subject');
const { authMiddleware, teacherAuthMiddleware } = require('../middleware/authMiddleware');

// Get all teacher-subject associations (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const teacherSubjects = await TeacherSubject.find({})
      .populate('teacher', 'fullName email')
      .populate('subject')
      .populate('classSection')
      .sort({ createdAt: -1 });
    
    res.status(200).json(teacherSubjects);
  } catch (error) {
    console.error('Error fetching teacher-subject associations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get teacher-subject associations for the current teacher
router.get('/mine', teacherAuthMiddleware, async (req, res) => {
  try {
    const teacherSubjects = await TeacherSubject.find({ teacher: req.user._id })
      .populate('subject')
      .populate('classSection')
      .sort({ createdAt: -1 });
    
    res.status(200).json(teacherSubjects);
  } catch (error) {
    console.error('Error fetching teacher-subject associations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get teacher-subject associations for a specific class
router.get('/class/:classSectionId', teacherAuthMiddleware, async (req, res) => {
  try {
    const teacherSubjects = await TeacherSubject.find({ 
      teacher: req.user._id,
      classSection: req.params.classSectionId 
    })
      .populate('subject')
      .populate('classSection')
      .sort({ createdAt: -1 });
    
    res.status(200).json(teacherSubjects);
  } catch (error) {
    console.error('Error fetching teacher-subject associations for class:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a teacher-subject association (admin or self-assignment for teachers)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { teacher, subject, classSection, notes } = req.body;
    
    // If not admin, only allow self-assignment
    if (req.user.role !== 'admin' && req.user._id.toString() !== teacher) {
      return res.status(403).json({ message: 'You can only assign subjects to yourself' });
    }
    
    // Check if association already exists
    const existingAssociation = await TeacherSubject.findOne({
      teacher,
      subject,
      classSection
    });
    
    if (existingAssociation) {
      return res.status(400).json({ message: 'This subject is already assigned to this teacher in this class' });
    }
    
    // Check if class and subject exist
    const classExists = await ClassSection.findById(classSection);
    const subjectExists = await Subject.findById(subject);
    
    if (!classExists || !subjectExists) {
      return res.status(404).json({ message: 'Class or subject not found' });
    }
    
    const newTeacherSubject = new TeacherSubject({
      teacher: teacher || req.user._id,
      subject,
      classSection,
      notes
    });
    
    const savedTeacherSubject = await newTeacherSubject.save();
    
    // Add subject to class if not already there
    if (!classExists.subjects.includes(subject)) {
      await ClassSection.findByIdAndUpdate(
        classSection,
        { $addToSet: { subjects: subject } }
      );
    }
    
    // Add teacher to class if not already there
    if (!classExists.teachers.includes(teacher || req.user._id)) {
      await ClassSection.findByIdAndUpdate(
        classSection,
        { $addToSet: { teachers: teacher || req.user._id } }
      );
    }
    
    res.status(201).json(savedTeacherSubject);
  } catch (error) {
    console.error('Error creating teacher-subject association:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a teacher-subject association
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { notes } = req.body;
    
    const teacherSubject = await TeacherSubject.findById(req.params.id);
    
    if (!teacherSubject) {
      return res.status(404).json({ message: 'Teacher-subject association not found' });
    }
    
    // Only admin or the assigned teacher can update
    if (req.user.role !== 'admin' && req.user._id.toString() !== teacherSubject.teacher.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    teacherSubject.notes = notes;
    teacherSubject.updatedAt = Date.now();
    
    const updatedTeacherSubject = await teacherSubject.save();
    
    res.status(200).json(updatedTeacherSubject);
  } catch (error) {
    console.error('Error updating teacher-subject association:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a teacher-subject association
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const teacherSubject = await TeacherSubject.findById(req.params.id);
    
    if (!teacherSubject) {
      return res.status(404).json({ message: 'Teacher-subject association not found' });
    }
    
    // Only admin or the assigned teacher can delete
    if (req.user.role !== 'admin' && req.user._id.toString() !== teacherSubject.teacher.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    await TeacherSubject.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Teacher-subject association deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher-subject association:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 