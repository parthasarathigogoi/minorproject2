const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  // File paths for uploaded materials
  files: [{
    name: String,
    path: String,
    fileType: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Teacher who created the note
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Subject this note is for
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  // Class/Section this note is for
  classSection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClassSection',
    required: true
  },
  // Topic or chapter this note belongs to
  topic: {
    type: String,
    trim: true
  },
  // Type of material (lecture notes, handout, etc.)
  materialType: {
    type: String,
    enum: ['lecture_notes', 'worksheet', 'reference', 'syllabus', 'other'],
    default: 'lecture_notes'
  },
  // Flag to indicate if the note is published to students
  isPublished: {
    type: Boolean,
    default: false
  },
  // Optional content in text format (can be HTML)
  content: {
    type: String
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

// Pre-save middleware to update the updatedAt field
NoteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create a text index for search functionality
NoteSchema.index({ title: 'text', description: 'text', topic: 'text', content: 'text' });

module.exports = mongoose.model('Note', NoteSchema); 