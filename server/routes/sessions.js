const express = require('express');
const router = express.Router();
const { sessions } = require('../data/mockData');

let sessionStore = [...sessions];

// GET all sessions (filter by mentorId or menteeId)
router.get('/', (req, res) => {
  const { mentorId, menteeId, status } = req.query;
  let filtered = [...sessionStore];
  if (mentorId) filtered = filtered.filter(s => s.mentorId === mentorId);
  if (menteeId) filtered = filtered.filter(s => s.menteeId === menteeId);
  if (status) filtered = filtered.filter(s => s.status === status);
  res.json({ success: true, data: filtered });
});

// POST create session
router.post('/', (req, res) => {
  const { mentorId, menteeId, title, date, duration, notes } = req.body;
  if (!mentorId || !menteeId || !title || !date) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  const newSession = {
    id: `s${sessionStore.length + 1}`,
    mentorId, menteeId, title, date,
    duration: duration || 60,
    status: 'Upcoming',
    feedback: null,
    notes: notes || ''
  };
  sessionStore.push(newSession);
  res.status(201).json({ success: true, data: newSession });
});

// PATCH update session status
router.patch('/:id', (req, res) => {
  const idx = sessionStore.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Session not found' });
  sessionStore[idx] = { ...sessionStore[idx], ...req.body };
  res.json({ success: true, data: sessionStore[idx] });
});

module.exports = router;
