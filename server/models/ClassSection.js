const mongoose = require('mongoose');

const ClassSectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  // This could be "Class 10", "Semester 3", etc.
  classLevel: {
    type: String,
    required: true,
    trim: true
  },
  // This could be "A", "B", "Science", "CSE", etc.
  section: {
    type: String,
    required: true,
    trim: true
  },
  // Academic year or semester
  academicPeriod: {
    type: String,
    required: true,
    trim: true
  },
  // Teachers assigned to this class/section
  teachers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Students enrolled in this class/section
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Subjects taught in this class/section
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update the updatedAt field
ClassSectionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ClassSection', ClassSectionSchema); 