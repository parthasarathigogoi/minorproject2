const mongoose = require('mongoose');

const ExamResultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  examName: {
    type: String,
    required: true,
    trim: true
  },
  subjects: {
    type: [String],
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  earnedMarks: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  timeTaken: {
    type: Number, // in seconds
    required: true
  },
  questions: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    marks: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ['multiple_choice', 'descriptive'],
      required: true
    },
    correct: {
      type: Boolean,
      required: true
    },
    studentAnswer: mongoose.Schema.Types.Mixed
  }],
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for faster querying
ExamResultSchema.index({ student: 1, submittedAt: -1 });
ExamResultSchema.index({ subjects: 1 });

module.exports = mongoose.model('ExamResult', ExamResultSchema); 