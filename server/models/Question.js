const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['multiple_choice', 'short_answer', 'long_answer', 'true_false', 'fill_in_blank'],
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
  marks: {
    type: Number,
    required: true,
    min: 1
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String
  },
  options: {
    type: [String],
    required: function() {
      return this.type === 'multiple_choice' || this.type === 'true_false';
    }
  },
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  difficultyLevel: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'challenging'],
    default: 'medium'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  explanation: {
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

// Pre-save middleware to update the updatedAt field
QuestionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create a text index for search functionality
QuestionSchema.index({ text: 'text', topic: 'text' });

module.exports = mongoose.model('Question', QuestionSchema); 