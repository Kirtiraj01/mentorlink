const express = require('express');
const router = express.Router();
const { mentors, mentees } = require('../data/mockData');

// GET all users (admin sees all, role-filtered by query param)
router.get('/', (req, res) => {
  const { role } = req.query;
  if (role === 'mentor') return res.json({ success: true, data: mentors });
  if (role === 'mentee') return res.json({ success: true, data: mentees });
  res.json({ success: true, data: { mentors, mentees } });
});

// POST new mentor
router.post('/mentors', (req, res) => {
  const newMentor = {
    id: `m${mentors.length + 1}-${Date.now()}`,
    role: 'mentor',
    menteeCount: 0,
    rating: 0,
    sessions: 0,
    badges: [],
    joinedDate: new Date().toISOString().split('T')[0],
    ...req.body
  };
  mentors.push(newMentor);
  res.status(201).json({ success: true, data: newMentor });
});

// POST new mentee
router.post('/mentees', (req, res) => {
  const newMentee = {
    id: `me${mentees.length + 1}-${Date.now()}`,
    role: 'mentee',
    sessions: 0,
    feedbackScore: 0,
    activityScore: 0,
    relationshipScore: 0,
    riskStatus: 'Healthy',
    badges: [],
    progress: 0,
    joinedDate: new Date().toISOString().split('T')[0],
    ...req.body
  };
  mentees.push(newMentee);
  res.status(201).json({ success: true, data: newMentee });
});

// GET single user
router.get('/:id', (req, res) => {
  const user = [...mentors, ...mentees].find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
});

module.exports = router;
