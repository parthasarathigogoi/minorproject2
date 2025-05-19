const express = require('express');
const router = express.Router();

// GET all notes
router.get('/', (req, res) => {
  res.json({ message: 'Note routes placeholder - GET all notes' });
});

// GET note by ID
router.get('/:id', (req, res) => {
  res.json({ message: `Note routes placeholder - GET note with ID: ${req.params.id}` });
});

// POST new note
router.post('/', (req, res) => {
  res.json({ message: 'Note routes placeholder - POST new note', data: req.body });
});

// PUT update note
router.put('/:id', (req, res) => {
  res.json({ message: `Note routes placeholder - PUT update note with ID: ${req.params.id}`, data: req.body });
});

// DELETE note
router.delete('/:id', (req, res) => {
  res.json({ message: `Note routes placeholder - DELETE note with ID: ${req.params.id}` });
});

module.exports = router; 