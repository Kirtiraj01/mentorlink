const express = require('express');
const router = express.Router();

let syllabuses = [];
let topics = [];
let progress = []; // { topicId, menteeId, isCompleted }

// Initial mock data for Demo
const mockSyllabusId = `syl_${Date.now()}`;
syllabuses.push({ id: mockSyllabusId, mentorId: 'm1', title: 'Web Development Track' });
const t1 = `t_${Date.now()}_1`;
const t2 = `t_${Date.now()}_2`;
const t3 = `t_${Date.now()}_3`;
topics.push({ id: t1, syllabusId: mockSyllabusId, title: 'HTML & CSS Basics', description: 'Learn the fundamentals of web design.', order: 1 });
topics.push({ id: t2, syllabusId: mockSyllabusId, title: 'JavaScript Essentials', description: 'Variables, loops, functions, and DOM manipulation.', order: 2 });
topics.push({ id: t3, syllabusId: mockSyllabusId, title: 'React Integration', description: 'Component state, props, and hooks.', order: 3 });
progress.push({ topicId: t1, menteeId: 'me1', isCompleted: true });

// Create Syllabus
router.post('/syllabus', (req, res) => {
  const { mentorId, title } = req.body;
  const newSyllabus = { id: `syl_${Date.now()}`, mentorId, title };
  syllabuses.push(newSyllabus);
  res.json({ success: true, data: newSyllabus });
});

// Get Syllabus & Topics (with optional mentee progress)
router.get('/syllabus', (req, res) => {
  const { mentorId, menteeId } = req.query;
  // If mentee, find their mentor's syllabus. For demo, just fetch all and match.
  // In our mock, mentee 'me1' has mentor 'm1'.
  const targetMentorId = mentorId || 'm1';
  const syls = syllabuses.filter(s => s.mentorId === targetMentorId);

  const result = syls.map(s => {
    const sylTopics = topics.filter(t => t.syllabusId === s.id).sort((a,b) => a.order - b.order);
    
    // Attach mentee progress if requested
    const topicsWithProgress = sylTopics.map(t => {
      const isCompleted = menteeId 
        ? progress.some(p => p.topicId === t.id && p.menteeId === menteeId && p.isCompleted)
        : false;
      return { ...t, isCompleted };
    });

    return { ...s, topics: topicsWithProgress };
  });

  res.json({ success: true, data: result });
});

// Add Topic
router.post('/topic', (req, res) => {
  const { syllabusId, title, description, order } = req.body;
  const newTopic = { id: `t_${Date.now()}`, syllabusId, title, description, order };
  topics.push(newTopic);
  res.json({ success: true, data: newTopic });
});

// Get Topics (Internal use or simple fetch)
router.get('/topics', (req, res) => {
  const { syllabusId } = req.query;
  const filtered = topics.filter(t => t.syllabusId === syllabusId).sort((a,b) => a.order - b.order);
  res.json({ success: true, data: filtered });
});

// Mark Topic Complete
router.patch('/topic/:id/complete', (req, res) => {
  const { id } = req.params;
  const { menteeId } = req.body;
  
  const existing = progress.find(p => p.topicId === id && p.menteeId === menteeId);
  if (existing) {
    existing.isCompleted = true;
  } else {
    progress.push({ topicId: id, menteeId, isCompleted: true });
  }
  
  res.json({ success: true });
});

module.exports = router;
