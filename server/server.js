const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes
const examRoutes = require('./routes/examRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const questionRoutes = require('./routes/questionRoutes');
const authRoutes = require('./routes/authRoutes');
const classSectionRoutes = require('./routes/classSectionRoutes');
const teacherSubjectRoutes = require('./routes/teacherSubjectRoutes');
// Routes we've added placeholders for
const assignmentRoutes = require('./routes/assignmentRoutes');
const noteRoutes = require('./routes/noteRoutes');
const practiceTestRoutes = require('./routes/practiceTestRoutes');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digiclassroom', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB:', err));

// API routes
app.use('/api/exams', examRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/class-sections', classSectionRoutes);
app.use('/api/teacher-subjects', teacherSubjectRoutes);
// Route handlers for our placeholders
app.use('/api/assignments', assignmentRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/practice-tests', practiceTestRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('DigiClassroom API is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; 