const express = require('express');
const router = express.Router();
const ClassSection = require('../models/ClassSection');
const TeacherSubject = require('../models/TeacherSubject');
const { authMiddleware, teacherAuthMiddleware } = require('../middleware/authMiddleware');

// Get all class sections (admin and teachers only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const classSections = await ClassSection.find({})
      .populate('teachers', 'fullName email')
      .sort({ createdAt: -1 });
    
    res.status(200).json(classSections);
  } catch (error) {
    console.error('Error fetching class sections:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a specific class section by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const classSection = await ClassSection.findById(req.params.id)
      .populate('teachers', 'fullName email')
      .populate('subjects');
    
    if (!classSection) {
      return res.status(404).json({ message: 'Class section not found' });
    }
    
    res.status(200).json(classSection);
  } catch (error) {
    console.error('Error fetching class section:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new class section (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only administrators can create class sections' });
    }
    
    const { name, description, classLevel, section, academicPeriod, teachers, subjects } = req.body;
    
    const newClassSection = new ClassSection({
      name,
      description,
      classLevel,
      section,
      academicPeriod,
      teachers: teachers || [],
      subjects: subjects || []
    });
    
    const savedClassSection = await newClassSection.save();
    res.status(201).json(savedClassSection);
  } catch (error) {
    console.error('Error creating class section:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a class section (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only administrators can update class sections' });
    }
    
    const { name, description, classLevel, section, academicPeriod, teachers, subjects } = req.body;
    
    const updatedClassSection = await ClassSection.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        classLevel,
        section,
        academicPeriod,
        teachers,
        subjects
      },
      { new: true }
    );
    
    if (!updatedClassSection) {
      return res.status(404).json({ message: 'Class section not found' });
    }
    
    res.status(200).json(updatedClassSection);
  } catch (error) {
    console.error('Error updating class section:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a class section (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only administrators can delete class sections' });
    }
    
    const deletedClassSection = await ClassSection.findByIdAndDelete(req.params.id);
    
    if (!deletedClassSection) {
      return res.status(404).json({ message: 'Class section not found' });
    }
    
    // Also delete all teacher-subject associations for this class section
    await TeacherSubject.deleteMany({ classSection: req.params.id });
    
    res.status(200).json({ message: 'Class section deleted successfully' });
  } catch (error) {
    console.error('Error deleting class section:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all class sections for the current teacher
router.get('/teacher/mine', teacherAuthMiddleware, async (req, res) => {
  try {
    // Find all teacher-subject associations for this teacher
    const teacherSubjects = await TeacherSubject.find({ teacher: req.user._id })
      .populate('classSection')
      .populate('subject');
    
    // Extract unique class sections
    const classSectionMap = new Map();
    teacherSubjects.forEach(ts => {
      if (ts.classSection && !classSectionMap.has(ts.classSection._id.toString())) {
        classSectionMap.set(ts.classSection._id.toString(), ts.classSection);
      }
    });
    
    const teacherClassSections = Array.from(classSectionMap.values());
    
    res.status(200).json(teacherClassSections);
  } catch (error) {
    console.error('Error fetching teacher class sections:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 