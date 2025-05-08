const mongoose = require('mongoose');

const TeacherSubjectSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  classSection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClassSection',
    required: true
  },
  // Optional field for additional information
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a teacher doesn't teach the same subject in the same class multiple times
TeacherSubjectSchema.index({ teacher: 1, subject: 1, classSection: 1 }, { unique: true });

// Pre-save middleware to update the updatedAt field
TeacherSubjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('TeacherSubject', TeacherSubjectSchema); 