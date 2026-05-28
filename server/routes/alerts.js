const express = require('express');
const router = express.Router();
const { mentees: allMentees } = require('../data/mockData');

// In-memory storage
let alerts = [];
let alertStatuses = [];

// Create Alert (Mentor broadcast)
router.post('/', (req, res) => {
  const { mentorId, title, message, dueDate, priority } = req.body;
  
  if (!mentorId || !title || !message) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const newAlert = {
    id: `alert_${Date.now()}`,
    mentorId,
    title,
    message,
    dueDate: dueDate || null,
    priority: priority || 'medium',
    createdAt: new Date().toISOString()
  };

  alerts.push(newAlert);

  // Assign to all mentees belonging to this mentor
  const myMentees = allMentees.filter(m => m.mentorId === mentorId);
  myMentees.forEach(mentee => {
    alertStatuses.push({
      alertId: newAlert.id,
      menteeId: mentee.id,
      isRead: false,
      isCompleted: false
    });
  });

  res.json({ success: true, data: newAlert });
});

// Get Alerts for Mentee
router.get('/mentee', (req, res) => {
  const { menteeId } = req.query;
  if (!menteeId) return res.status(400).json({ success: false, message: 'Missing menteeId' });

  const menteeAlertStatuses = alertStatuses.filter(as => as.menteeId === menteeId);
  
  // Join with actual alerts
  const menteeAlerts = menteeAlertStatuses.map(status => {
    const alert = alerts.find(a => a.id === status.alertId);
    return { ...alert, ...status };
  }).filter(a => a.id); // ensure alert exists

  // Sort by created descending
  menteeAlerts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({ success: true, data: menteeAlerts });
});

// Mark as Read
router.patch('/:id/read', (req, res) => {
  const { id } = req.params;
  const { menteeId } = req.body;
  
  const statusIndex = alertStatuses.findIndex(as => as.alertId === id && as.menteeId === menteeId);
  if (statusIndex > -1) {
    alertStatuses[statusIndex].isRead = true;
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: 'Alert status not found' });
  }
});

// Mark as Completed
router.patch('/:id/complete', (req, res) => {
  const { id } = req.params;
  const { menteeId } = req.body;
  
  const statusIndex = alertStatuses.findIndex(as => as.alertId === id && as.menteeId === menteeId);
  if (statusIndex > -1) {
    alertStatuses[statusIndex].isCompleted = true;
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: 'Alert status not found' });
  }
});

module.exports = router;
