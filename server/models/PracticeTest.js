const mongoose = require('mongoose');

const PracticeTestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  // Teacher who created the test
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Subject this test is for
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  // Class/Section this test is for
  classSection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClassSection',
    required: true
  },
  // Duration in minutes
  duration: {
    type: Number,
    required: true,
    min: 5
  },
  // Total marks/points for the test
  totalMarks: {
    type: Number,
    required: true,
    min: 1
  },
  // Test configuration - question distribution
  questionDistribution: [{
    questionType: {
      type: String,
      enum: ['multiple_choice', 'short_answer', 'long_answer', 'true_false', 'fill_in_blank'],
      required: true
    },
    marksPerQuestion: {
      type: Number,
      required: true,
      min: 1
    },
    numberOfQuestions: {
      type: Number,
      required: true,
      min: 1
    },
    difficultyLevel: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'challenging', 'mixed'],
      default: 'mixed'
    },
    topics: [String] // Optional specific topics to include
  }],
  // Actual questions for the test
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  // Test settings
  settings: {
    shuffleQuestions: {
      type: Boolean,
      default: false
    },
    showAnswersAfterSubmission: {
      type: Boolean,
      default: true
    },
    allowMultipleAttempts: {
      type: Boolean,
      default: true
    },
    passingPercentage: {
      type: Number,
      default: 40,
      min: 0,
      max: 100
    }
  },
  // Scheduled date and time for the test (optional)
  scheduledFor: {
    type: Date
  },
  // Flag to indicate if the test is published to students
  isPublished: {
    type: Boolean,
    default: false
  },
  // Flag to indicate if the test is active
  isActive: {
    type: Boolean,
    default: false
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
PracticeTestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('PracticeTest', PracticeTestSchema); 