const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api', require('./routes/syllabus'));
app.use('/api/issues', require('./routes/issues')); // Issue Reporting & Escalation System

const { mentors, mentees } = require('./data/mockData');

// Mock auth endpoint with email and password
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (password !== 'password123') {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const adminProfile = { id: 'admin1', name: 'Admin User', email: 'admin@mentorlink.io', role: 'admin', avatar: 'AU' };
  
  if (email === adminProfile.email) {
    return res.json({ success: true, user: adminProfile, token: `mock-token-admin-${Date.now()}` });
  }

  let user = mentors.find(m => m.email === email);
  if (!user) {
    user = mentees.find(m => m.email === email);
  }

  if (user) {
    res.json({ success: true, user, token: `mock-token-${user.role}-${Date.now()}` });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.get('/', (req, res) => res.json({ message: 'MentorLink API v1.0', status: 'running' }));

app.listen(PORT, () => console.log(`✅ MentorLink API running on http://localhost:${PORT}`));
