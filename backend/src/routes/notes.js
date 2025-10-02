const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Note = require('../models/note');
const auth = require('../middleware/auth');

// Create
router.post('/', auth, [
  body('title').notEmpty()
], async (req, res) => {
  const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const note = new Note({ user: req.user.id, ...req.body });
  await note.save();
  res.json(note);
});

// Read (list with simple search/filter)
router.get('/', auth, async (req, res) => {
  const { q, tag } = req.query;
  const filter = { user: req.user.id };
  if (q) filter.$or = [{ title: new RegExp(q, 'i') }, { content: new RegExp(q, 'i') }];
  if (tag) filter.tags = tag;
  const notes = await Note.find(filter).sort({ createdAt: -1 });
  res.json(notes);
});

// Read single
router.get('/:id', auth, async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
  if (!note) return res.status(404).json({ message: 'Not found' });
  res.json(note);
});

// Update
router.put('/:id', auth, async (req, res) => {
  const note = await Note.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, req.body, { new: true });
  if (!note) return res.status(404).json({ message: 'Not found' });
  res.json(note);
});

// Delete
router.delete('/:id', auth, async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!note) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;
