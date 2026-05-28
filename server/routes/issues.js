const express = require('express');
const router = express.Router();

// ═══════════════════════════════════════════════════════
//  In-memory store (mirrors existing project pattern)
// ═══════════════════════════════════════════════════════

/** @type {Issue[]} */
const issues = [
  {
    id: 'iss1',
    title: 'Unable to understand Sorting Algorithms',
    description: 'I am struggling with QuickSort and MergeSort concepts. My mentor explained it once but I still feel confused. Can we schedule a revision session?',
    category: 'Academic Doubt',
    priority: 'High',
    status: 'Pending',
    menteeId: 'me1',
    menteeName: 'Aman Singh',
    menteeAvatar: 'AS',
    mentorId: 'm1',
    mentorName: 'Rahul Sharma',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(), // 20h ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    attachment: null,
    escalatedTo: null,
    escalatedAt: null,
    replies: [],
    timeline: [
      { action: 'Issue Created', by: 'Aman Singh', at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString() }
    ]
  },
  {
    id: 'iss2',
    title: 'Attendance marked absent incorrectly on April 20',
    description: 'I was present in the morning session on April 20th but the system shows me as absent. This is affecting my attendance percentage. Please look into this.',
    category: 'Attendance Issue',
    priority: 'Medium',
    status: 'In Progress',
    menteeId: 'me2',
    menteeName: 'Riya Patel',
    menteeAvatar: 'RP',
    mentorId: 'm2',
    mentorName: 'Priya Verma',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(), // 50h ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    attachment: null,
    escalatedTo: null,
    escalatedAt: null,
    replies: [
      { id: 'r1', text: 'I have raised a request with the attendance coordinator. Will update you shortly.', by: 'Priya Verma', role: 'mentor', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() }
    ],
    timeline: [
      { action: 'Issue Created', by: 'Riya Patel', at: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString() },
      { action: 'Status changed to In Progress', by: 'Priya Verma', at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() }
    ]
  },
  {
    id: 'iss3',
    title: 'Need placement guidance for off-campus drives',
    description: 'My college placement cell is not providing guidance for off-campus opportunities. I need help with resume review, mock interviews, and identifying opportunities.',
    category: 'Placement Guidance',
    priority: 'High',
    status: 'Resolved',
    menteeId: 'me3',
    menteeName: 'Karan Mehta',
    menteeAvatar: 'KM',
    mentorId: 'm1',
    mentorName: 'Rahul Sharma',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 100).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    attachment: null,
    escalatedTo: null,
    escalatedAt: null,
    replies: [
      { id: 'r2', text: 'I have shared a list of top off-campus portals and will schedule a mock interview session this week.', by: 'Rahul Sharma', role: 'mentor', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString() },
      { id: 'r3', text: 'Thank you so much! The resources were very helpful.', by: 'Karan Mehta', role: 'mentee', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() }
    ],
    timeline: [
      { action: 'Issue Created', by: 'Karan Mehta', at: new Date(Date.now() - 1000 * 60 * 60 * 100).toISOString() },
      { action: 'Mentor replied', by: 'Rahul Sharma', at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString() },
      { action: 'Status changed to Resolved', by: 'Rahul Sharma', at: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString() }
    ]
  },
  {
    id: 'iss4',
    title: 'Feeling overwhelmed with exam pressure and anxiety',
    description: 'I have been experiencing a lot of stress and anxiety because of upcoming exams and placement season simultaneously. I am finding it hard to focus and sleep properly.',
    category: 'Mental Stress',
    priority: 'High',
    status: 'Escalated',
    menteeId: 'me6',
    menteeName: 'Pooja Nair',
    menteeAvatar: 'PN',
    mentorId: 'm2',
    mentorName: 'Priya Verma',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), // 28h ago — exceeded 24h threshold
    updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    attachment: null,
    escalatedTo: 'HOD / Admin',
    escalatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    replies: [],
    timeline: [
      { action: 'Issue Created', by: 'Pooja Nair', at: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString() },
      { action: 'Auto-escalated to HOD / Admin (24h High Priority threshold exceeded)', by: 'System', at: new Date(Date.now() - 1000 * 60 * 10).toISOString() }
    ]
  },
  {
    id: 'iss5',
    title: 'Hostel Wi-Fi affecting online sessions',
    description: 'The hostel internet speed is very poor in the evening hours, which keeps disconnecting during our video mentoring sessions. This is disrupting my learning.',
    category: 'Hostel/College Issue',
    priority: 'Low',
    status: 'Pending',
    menteeId: 'me7',
    menteeName: 'Rohan Sen',
    menteeAvatar: 'RS',
    mentorId: 'm5',
    mentorName: 'Vikram Desai',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
    attachment: null,
    escalatedTo: null,
    escalatedAt: null,
    replies: [],
    timeline: [
      { action: 'Issue Created', by: 'Rohan Sen', at: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString() }
    ]
  }
];

/** @type {Notification[]} */
const notifications = [
  { id: 'n1', userId: 'me1', type: 'issue_created', message: 'Your issue "Unable to understand Sorting Algorithms" has been submitted.', isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(), issueId: 'iss1' },
  { id: 'n2', userId: 'm2', type: 'issue_created', message: 'New issue from Riya Patel: "Attendance marked absent incorrectly on April 20"', isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(), issueId: 'iss2' },
  { id: 'n3', userId: 'me2', type: 'mentor_replied', message: 'Priya Verma replied to your issue "Attendance marked absent incorrectly".', isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), issueId: 'iss2' },
  { id: 'n4', userId: 'admin1', type: 'escalated', message: 'Issue escalated: "Feeling overwhelmed with exam pressure" — Pooja Nair (High Priority, no response 28h)', isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), issueId: 'iss4' },
  { id: 'n5', userId: 'me6', type: 'escalated', message: 'Your issue has been escalated to HOD/Admin for faster resolution.', isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), issueId: 'iss4' }
];

/** @type {EscalationLog[]} */
const escalationLogs = [
  {
    id: 'el1', issueId: 'iss4', issuePriority: 'High',
    menteeId: 'me6', menteeName: 'Pooja Nair',
    mentorId: 'm2', mentorName: 'Priya Verma',
    escalatedTo: 'HOD / Admin',
    reason: 'High priority issue not responded to within 24 hours',
    escalatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString()
  }
];

// ═══════════════════════════════════════════════════════
//  Helper: generate ID
// ═══════════════════════════════════════════════════════
const uid = (prefix) => `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// ═══════════════════════════════════════════════════════
//  Auto-Escalation thresholds (milliseconds)
// ═══════════════════════════════════════════════════════
const ESCALATION_THRESHOLDS = {
  High:   24 * 60 * 60 * 1000,  // 24 hours
  Medium: 48 * 60 * 60 * 1000,  // 48 hours
  Low:    72 * 60 * 60 * 1000,  // 72 hours
};

/**
 * Check a single issue and escalate if threshold exceeded.
 * Returns true if escalation was triggered.
 */
function checkAndEscalate(issue) {
  if (issue.status === 'Resolved' || issue.status === 'Escalated') return false;
  if (issue.replies.some(r => r.role === 'mentor')) return false; // mentor already responded

  const threshold = ESCALATION_THRESHOLDS[issue.priority];
  if (!threshold) return false;

  const age = Date.now() - new Date(issue.createdAt).getTime();
  if (age < threshold) return false;

  // Perform escalation
  issue.status = 'Escalated';
  issue.escalatedTo = 'HOD / Admin';
  issue.escalatedAt = new Date().toISOString();
  issue.updatedAt = new Date().toISOString();

  const timelineEntry = {
    action: `Auto-escalated to HOD / Admin (${issue.priority} Priority threshold exceeded)`,
    by: 'System',
    at: new Date().toISOString()
  };
  issue.timeline.push(timelineEntry);

  // Escalation log
  escalationLogs.push({
    id: uid('el'),
    issueId: issue.id,
    issuePriority: issue.priority,
    menteeId: issue.menteeId,
    menteeName: issue.menteeName,
    mentorId: issue.mentorId,
    mentorName: issue.mentorName,
    escalatedTo: 'HOD / Admin',
    reason: `${issue.priority} priority issue not responded to within ${issue.priority === 'High' ? '24' : issue.priority === 'Medium' ? '48' : '72'} hours`,
    escalatedAt: new Date().toISOString()
  });

  // Notify admin
  notifications.push({
    id: uid('n'), userId: 'admin1', type: 'escalated',
    message: `Issue escalated: "${issue.title}" — ${issue.menteeName} (${issue.priority} Priority)`,
    isRead: false, createdAt: new Date().toISOString(), issueId: issue.id
  });

  // Notify mentee
  notifications.push({
    id: uid('n'), userId: issue.menteeId, type: 'escalated',
    message: `Your issue "${issue.title}" has been escalated to HOD/Admin for faster resolution.`,
    isRead: false, createdAt: new Date().toISOString(), issueId: issue.id
  });

  console.log(`[AutoEscalation] Escalated issue "${issue.id}" (${issue.priority})`);
  return true;
}

// ═══════════════════════════════════════════════════════
//  Cron: run escalation check every 30 minutes
// ═══════════════════════════════════════════════════════
setInterval(() => {
  console.log('[AutoEscalation] Running scheduled check...');
  let count = 0;
  issues.forEach(issue => { if (checkAndEscalate(issue)) count++; });
  if (count > 0) console.log(`[AutoEscalation] Escalated ${count} issue(s)`);
}, 30 * 60 * 1000);


// ═══════════════════════════════════════════════════════
//  ROUTES
// ═══════════════════════════════════════════════════════

// ── GET /api/issues ── list issues (role-filtered)
router.get('/', (req, res) => {
  const { menteeId, mentorId, status, priority, category, search } = req.query;
  let result = [...issues];

  if (menteeId)  result = result.filter(i => i.menteeId === menteeId);
  if (mentorId)  result = result.filter(i => i.mentorId === mentorId);
  if (status)    result = result.filter(i => i.status === status);
  if (priority)  result = result.filter(i => i.priority === priority);
  if (category)  result = result.filter(i => i.category === category);
  if (search)    result = result.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.description.toLowerCase().includes(search.toLowerCase())
  );

  // Sort newest first
  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ success: true, data: result });
});

// ── GET /api/issues/analytics ── admin analytics
router.get('/analytics', (req, res) => {
  const total     = issues.length;
  const pending   = issues.filter(i => i.status === 'Pending').length;
  const inProgress = issues.filter(i => i.status === 'In Progress').length;
  const resolved  = issues.filter(i => i.status === 'Resolved').length;
  const escalated = issues.filter(i => i.status === 'Escalated').length;

  // Average response time for replied issues (hours)
  const repliedIssues = issues.filter(i => i.replies.length > 0);
  const avgResponseMs = repliedIssues.length
    ? repliedIssues.reduce((sum, i) => {
        const firstReply = i.replies[0];
        return sum + (new Date(firstReply.createdAt) - new Date(i.createdAt));
      }, 0) / repliedIssues.length
    : 0;
  const avgResponseHours = Math.round(avgResponseMs / (1000 * 60 * 60) * 10) / 10;

  // Category breakdown
  const categoryMap = {};
  issues.forEach(i => { categoryMap[i.category] = (categoryMap[i.category] || 0) + 1; });
  const categoryBreakdown = Object.entries(categoryMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  const mostCommonCategory = categoryBreakdown[0]?.name || 'N/A';

  // Priority breakdown
  const priorityBreakdown = [
    { name: 'High',   count: issues.filter(i => i.priority === 'High').length },
    { name: 'Medium', count: issues.filter(i => i.priority === 'Medium').length },
    { name: 'Low',    count: issues.filter(i => i.priority === 'Low').length },
  ];

  // Status trend (last 7 days mock)
  const statusTrend = [
    { day: 'Mon', created: 2, resolved: 1 },
    { day: 'Tue', created: 3, resolved: 2 },
    { day: 'Wed', created: 1, resolved: 1 },
    { day: 'Thu', created: 4, resolved: 2 },
    { day: 'Fri', created: 2, resolved: 3 },
    { day: 'Sat', created: 1, resolved: 1 },
    { day: 'Sun', created: 2, resolved: 0 },
  ];

  res.json({
    success: true,
    data: {
      total, pending, inProgress, resolved, escalated,
      avgResponseHours, mostCommonCategory,
      categoryBreakdown, priorityBreakdown, statusTrend,
      escalationLogs
    }
  });
});

// ── GET /api/issues/notifications ── user notifications
router.get('/notifications', (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ success: false, message: 'userId required' });
  const userNotifs = notifications
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ success: true, data: userNotifs });
});

// ── PATCH /api/issues/notifications/:id/read
router.patch('/notifications/:id/read', (req, res) => {
  const n = notifications.find(n => n.id === req.params.id);
  if (!n) return res.status(404).json({ success: false, message: 'Notification not found' });
  n.isRead = true;
  res.json({ success: true, data: n });
});

// ── PATCH /api/issues/notifications/read-all
router.patch('/notifications/read-all', (req, res) => {
  const { userId } = req.body;
  notifications.filter(n => n.userId === userId).forEach(n => { n.isRead = true; });
  res.json({ success: true });
});

// ── GET /api/issues/:id ── single issue
router.get('/:id', (req, res) => {
  const issue = issues.find(i => i.id === req.params.id);
  if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });
  res.json({ success: true, data: issue });
});

// ── POST /api/issues ── create issue
router.post('/', (req, res) => {
  const { title, description, category, priority, menteeId, menteeName, menteeAvatar, mentorId, mentorName, attachment } = req.body;

  if (!title || !description || !category || !priority || !menteeId || !mentorId) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const issue = {
    id: uid('iss'),
    title, description, category, priority,
    status: 'Pending',
    menteeId, menteeName: menteeName || 'Unknown',
    menteeAvatar: menteeAvatar || '?',
    mentorId, mentorName: mentorName || 'Unknown',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    attachment: attachment || null,
    escalatedTo: null,
    escalatedAt: null,
    replies: [],
    timeline: [
      { action: 'Issue Created', by: menteeName || 'Mentee', at: new Date().toISOString() }
    ]
  };

  issues.push(issue);

  // Notify mentee (confirmation)
  notifications.push({
    id: uid('n'), userId: menteeId, type: 'issue_created',
    message: `Your issue "${title}" has been submitted successfully.`,
    isRead: false, createdAt: new Date().toISOString(), issueId: issue.id
  });

  // Notify mentor
  notifications.push({
    id: uid('n'), userId: mentorId, type: 'issue_created',
    message: `New issue from ${menteeName}: "${title}"`,
    isRead: false, createdAt: new Date().toISOString(), issueId: issue.id
  });

  res.status(201).json({ success: true, data: issue });
});

// ── POST /api/issues/:id/reply ── add a reply
router.post('/:id/reply', (req, res) => {
  const issue = issues.find(i => i.id === req.params.id);
  if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });

  const { text, by, role, userId } = req.body;
  if (!text || !by || !role) return res.status(400).json({ success: false, message: 'text, by, and role are required' });

  const reply = {
    id: uid('rep'),
    text, by, role,
    createdAt: new Date().toISOString()
  };

  issue.replies.push(reply);
  issue.updatedAt = new Date().toISOString();

  // Auto-move to In Progress when mentor first replies
  if (role === 'mentor' && issue.status === 'Pending') {
    issue.status = 'In Progress';
    issue.timeline.push({ action: 'Status changed to In Progress', by, at: new Date().toISOString() });
  }

  issue.timeline.push({ action: `${role === 'mentor' ? 'Mentor' : 'Mentee'} replied`, by, at: new Date().toISOString() });

  // Notify the other party
  const notifyUserId = role === 'mentor' ? issue.menteeId : issue.mentorId;
  const notifyMsg = role === 'mentor'
    ? `${by} replied to your issue "${issue.title}"`
    : `${by} added a comment on issue "${issue.title}"`;

  notifications.push({
    id: uid('n'), userId: notifyUserId, type: 'mentor_replied',
    message: notifyMsg, isRead: false, createdAt: new Date().toISOString(), issueId: issue.id
  });

  res.json({ success: true, data: { reply, issue } });
});

// ── PATCH /api/issues/:id/status ── change status
router.patch('/:id/status', (req, res) => {
  const issue = issues.find(i => i.id === req.params.id);
  if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });

  const { status, by } = req.body;
  const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Escalated'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  issue.status = status;
  issue.updatedAt = new Date().toISOString();
  issue.timeline.push({ action: `Status changed to ${status}`, by: by || 'System', at: new Date().toISOString() });

  // If resolved — notify mentee
  if (status === 'Resolved') {
    notifications.push({
      id: uid('n'), userId: issue.menteeId, type: 'resolved',
      message: `Your issue "${issue.title}" has been marked as Resolved.`,
      isRead: false, createdAt: new Date().toISOString(), issueId: issue.id
    });
  }

  // If escalated manually
  if (status === 'Escalated') {
    issue.escalatedTo = 'HOD / Admin';
    issue.escalatedAt = new Date().toISOString();
    escalationLogs.push({
      id: uid('el'), issueId: issue.id, issuePriority: issue.priority,
      menteeId: issue.menteeId, menteeName: issue.menteeName,
      mentorId: issue.mentorId, mentorName: issue.mentorName,
      escalatedTo: 'HOD / Admin', reason: 'Manually escalated by mentor',
      escalatedAt: new Date().toISOString()
    });
    notifications.push({
      id: uid('n'), userId: 'admin1', type: 'escalated',
      message: `Issue manually escalated: "${issue.title}" — ${issue.menteeName}`,
      isRead: false, createdAt: new Date().toISOString(), issueId: issue.id
    });
  }

  res.json({ success: true, data: issue });
});

// ── POST /api/issues/escalate-check ── manual trigger for escalation check
router.post('/escalate-check', (req, res) => {
  let count = 0;
  issues.forEach(issue => { if (checkAndEscalate(issue)) count++; });
  res.json({ success: true, escalated: count });
});

// ── GET /api/issues/escalation-logs ── get escalation logs (admin)
router.get('/logs/escalation', (req, res) => {
  res.json({ success: true, data: [...escalationLogs].reverse() });
});

module.exports = router;
module.exports.issuesStore = issues;
module.exports.notificationsStore = notifications;
