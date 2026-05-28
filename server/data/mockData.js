// Mock data for MentorLink
const mentors = [
  {
    id: 'm1', name: 'Dr. Sarah Chen', avatar: 'SC', role: 'mentor',
    email: 'sarah.chen@mentorlink.io', expertise: ['Machine Learning', 'Data Science'],
    menteeCount: 5, rating: 4.9, sessions: 48, joinedDate: '2024-01-15',
    load: 'Optimal', bio: 'PhD in Computer Science. 10+ years in AI research.',
    badges: ['Top Mentor', 'Consistent', 'Engaged']
  },
  {
    id: 'm2', name: 'Prof. James Wilson', avatar: 'JW', role: 'mentor',
    email: 'james.wilson@mentorlink.io', expertise: ['Leadership', 'Product Management'],
    menteeCount: 8, rating: 4.7, sessions: 62, joinedDate: '2023-11-01',
    load: 'Overloaded', bio: 'Former VP Product at Google. Startup advisor.',
    badges: ['Overachiever', 'Streak Master']
  },
  {
    id: 'm3', name: 'Maya Rodriguez', avatar: 'MR', role: 'mentor',
    email: 'maya.rodriguez@mentorlink.io', expertise: ['UX Design', 'Frontend'],
    menteeCount: 3, rating: 4.8, sessions: 31, joinedDate: '2024-03-10',
    load: 'Light', bio: 'Senior UX Lead at Figma. Design systems expert.',
    badges: ['Consistent']
  },
  {
    id: 'm4', name: 'Alex Thompson', avatar: 'AT', role: 'mentor',
    email: 'alex.thompson@mentorlink.io', expertise: ['Backend', 'DevOps', 'Cloud'],
    menteeCount: 6, rating: 4.6, sessions: 55, joinedDate: '2023-09-20',
    load: 'Optimal', bio: 'Principal Engineer at AWS. Cloud architecture specialist.',
    badges: ['Engaged', 'Consistent']
  },
  {
    id: 'm5', name: 'Dr. Priya Patel', avatar: 'PP', role: 'mentor',
    email: 'priya.patel@mentorlink.io', expertise: ['Biotech', 'Research', 'Data'],
    menteeCount: 2, rating: 5.0, sessions: 24, joinedDate: '2024-06-01',
    load: 'Light', bio: 'Research Director at MIT. Interdisciplinary mentor.',
    badges: ['Top Mentor']
  }
];

const mentees = [
  {
    id: 'me1', name: 'Liam Foster', avatar: 'LF', role: 'mentee',
    email: 'liam.foster@student.io', mentorId: 'm1',
    goal: 'Become an ML Engineer', joinedDate: '2024-02-01',
    lastSession: '2025-04-25', sessions: 18, feedbackScore: 4.5,
    activityScore: 82, relationshipScore: 78, riskStatus: 'Healthy',
    badges: ['Consistent', 'Fast Learner'], progress: 72
  },
  {
    id: 'me2', name: 'Aisha Malik', avatar: 'AM', role: 'mentee',
    email: 'aisha.malik@student.io', mentorId: 'm2',
    goal: 'Launch a startup', joinedDate: '2024-01-10',
    lastSession: '2025-04-10', sessions: 24, feedbackScore: 4.8,
    activityScore: 91, relationshipScore: 88, riskStatus: 'Healthy',
    badges: ['Overachiever', 'Streak Master', 'Engaged'], progress: 85
  },
  {
    id: 'me3', name: 'Carlos Reyes', avatar: 'CR', role: 'mentee',
    email: 'carlos.reyes@student.io', mentorId: 'm1',
    goal: 'Build a data pipeline', joinedDate: '2024-04-20',
    lastSession: '2025-03-28', sessions: 6, feedbackScore: 3.2,
    activityScore: 28, relationshipScore: 31, riskStatus: 'At Risk',
    badges: [], progress: 25
  },
  {
    id: 'me4', name: 'Zoe Kim', avatar: 'ZK', role: 'mentee',
    email: 'zoe.kim@student.io', mentorId: 'm3',
    goal: 'Get a UX design job', joinedDate: '2024-03-15',
    lastSession: '2025-04-22', sessions: 12, feedbackScore: 4.6,
    activityScore: 76, relationshipScore: 74, riskStatus: 'Healthy',
    badges: ['Consistent'], progress: 60
  },
  {
    id: 'me5', name: 'Omar Hassan', avatar: 'OH', role: 'mentee',
    email: 'omar.hassan@student.io', mentorId: 'm4',
    goal: 'Migrate to cloud architecture', joinedDate: '2024-05-01',
    lastSession: '2025-04-18', sessions: 9, feedbackScore: 4.1,
    activityScore: 55, relationshipScore: 58, riskStatus: 'Healthy',
    badges: ['Fast Learner'], progress: 48
  },
  {
    id: 'me6', name: 'Nina Patel', avatar: 'NP', role: 'mentee',
    email: 'nina.patel@student.io', mentorId: 'm2',
    goal: 'Build product roadmap skills', joinedDate: '2024-01-25',
    lastSession: '2025-02-14', sessions: 4, feedbackScore: 2.8,
    activityScore: 15, relationshipScore: 22, riskStatus: 'At Risk',
    badges: [], progress: 18
  },
  {
    id: 'me7', name: 'Ethan Brooks', avatar: 'EB', role: 'mentee',
    email: 'ethan.brooks@student.io', mentorId: 'm5',
    goal: 'Research bioinformatics', joinedDate: '2024-06-10',
    lastSession: '2025-04-26', sessions: 7, feedbackScore: 4.9,
    activityScore: 88, relationshipScore: 82, riskStatus: 'Healthy',
    badges: ['Engaged'], progress: 55
  },
  {
    id: 'me8', name: 'Sophie Turner', avatar: 'ST', role: 'mentee',
    email: 'sophie.turner@student.io', mentorId: 'm4',
    goal: 'Master DevOps pipeline', joinedDate: '2024-02-28',
    lastSession: '2025-04-20', sessions: 14, feedbackScore: 4.3,
    activityScore: 68, relationshipScore: 66, riskStatus: 'Healthy',
    badges: ['Consistent', 'Engaged'], progress: 63
  }
];

const sessions = [
  { id: 's1', mentorId: 'm1', menteeId: 'me1', title: 'Deep Learning Fundamentals', date: '2025-04-25', duration: 60, status: 'Completed', feedback: 5, notes: 'Covered neural network architectures.' },
  { id: 's2', mentorId: 'm2', menteeId: 'me2', title: 'Startup Pitch Preparation', date: '2025-04-24', duration: 90, status: 'Completed', feedback: 5, notes: 'Refined investor deck.' },
  { id: 's3', mentorId: 'm3', menteeId: 'me4', title: 'Portfolio Review', date: '2025-04-23', duration: 45, status: 'Completed', feedback: 4, notes: 'Reviewed 3 case studies.' },
  { id: 's4', mentorId: 'm4', menteeId: 'me5', title: 'Kubernetes Basics', date: '2025-04-22', duration: 60, status: 'Completed', feedback: 4, notes: 'Hands-on cluster setup.' },
  { id: 's5', mentorId: 'm1', menteeId: 'me3', title: 'Data Pipeline Design', date: '2025-03-28', duration: 60, status: 'Completed', feedback: 3, notes: 'Struggled with ETL concepts.' },
  { id: 's6', mentorId: 'm5', menteeId: 'me7', title: 'Genomics Research Methods', date: '2025-04-26', duration: 75, status: 'Completed', feedback: 5, notes: 'Excellent session on bioinformatics.' },
  { id: 's7', mentorId: 'm4', menteeId: 'me8', title: 'CI/CD Pipeline Workshop', date: '2025-04-20', duration: 60, status: 'Completed', feedback: 4, notes: 'Built GitHub Actions workflow.' },
  { id: 's8', mentorId: 'm1', menteeId: 'me1', title: 'Model Evaluation Techniques', date: '2025-05-05', duration: 60, status: 'Upcoming', feedback: null, notes: '' },
  { id: 's9', mentorId: 'm2', menteeId: 'me6', title: 'Career Path Planning', date: '2025-03-01', duration: 45, status: 'Completed', feedback: 3, notes: 'Discussed roadmap options.' },
  { id: 's10', mentorId: 'm2', menteeId: 'me2', title: 'Go-to-Market Strategy', date: '2025-05-08', duration: 90, status: 'Upcoming', feedback: null, notes: '' },
  { id: 's11', mentorId: 'm3', menteeId: 'me4', title: 'Design System Workshop', date: '2025-05-10', duration: 60, status: 'Upcoming', feedback: null, notes: '' },
  { id: 's12', mentorId: 'm1', menteeId: 'me3', title: 'Python Performance', date: '2025-02-10', duration: 45, status: 'Cancelled', feedback: null, notes: 'Mentee no-show.' }
];

const feedbacks = [
  { id: 'f1', sessionId: 's1', menteeId: 'me1', mentorId: 'm1', rating: 5, comment: 'Extremely helpful. Sarah explains complex concepts simply.', date: '2025-04-25', sentiment: 'positive' },
  { id: 'f2', sessionId: 's2', menteeId: 'me2', mentorId: 'm2', rating: 5, comment: 'James helped me completely rethink my pitch. Game changer!', date: '2025-04-24', sentiment: 'positive' },
  { id: 'f3', sessionId: 's3', menteeId: 'me4', mentorId: 'm3', rating: 4, comment: 'Great feedback on my portfolio. Clear action items.', date: '2025-04-23', sentiment: 'positive' },
  { id: 'f4', sessionId: 's5', menteeId: 'me3', mentorId: 'm1', rating: 3, comment: 'Session was okay but I felt lost at times.', date: '2025-03-28', sentiment: 'neutral' },
  { id: 'f5', sessionId: 's6', menteeId: 'me7', mentorId: 'm5', rating: 5, comment: 'Dr. Patel is an amazing researcher. So much to learn!', date: '2025-04-26', sentiment: 'positive' },
  { id: 'f6', sessionId: 's7', menteeId: 'me8', mentorId: 'm4', rating: 4, comment: 'Hands-on approach was really effective.', date: '2025-04-20', sentiment: 'positive' },
  { id: 'f7', sessionId: 's9', menteeId: 'me6', mentorId: 'm2', rating: 3, comment: 'Not sure the direction matches my goals.', date: '2025-03-01', sentiment: 'neutral' },
  { id: 'f8', sessionId: 's4', menteeId: 'me5', mentorId: 'm4', rating: 4, comment: 'Alex is patient and thorough. Good session.', date: '2025-04-22', sentiment: 'positive' }
];

// Generate heatmap data - 84 days of activity
const generateHeatmapData = () => {
  const data = [];
  const now = new Date('2025-04-28');
  for (let i = 83; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    // Simulate realistic activity
    let count = 0;
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const rand = Math.random();
      if (rand < 0.15) count = 0;
      else if (rand < 0.4) count = 1;
      else if (rand < 0.65) count = 2;
      else if (rand < 0.85) count = 3;
      else count = 4;
    }
    data.push({ date: date.toISOString().split('T')[0], count });
  }
  return data;
};

const heatmapData = generateHeatmapData();

const monthlySessionTrend = [
  { month: 'Nov', sessions: 18, completed: 15 },
  { month: 'Dec', sessions: 22, completed: 19 },
  { month: 'Jan', sessions: 30, completed: 26 },
  { month: 'Feb', sessions: 27, completed: 22 },
  { month: 'Mar', sessions: 35, completed: 30 },
  { month: 'Apr', sessions: 42, completed: 38 }
];

const recommendations = [
  { id: 'r1', type: 'schedule', menteeId: 'me3', menteeName: 'Carlos Reyes', message: 'Schedule a session — inactive for 30+ days', priority: 'high', icon: 'calendar' },
  { id: 'r2', type: 'followup', menteeId: 'me6', menteeName: 'Nina Patel', message: 'Send a follow-up — low engagement score', priority: 'high', icon: 'message' },
  { id: 'r3', type: 'goal', menteeId: 'me5', menteeName: 'Omar Hassan', message: 'Assign a new goal — progress stalled at 48%', priority: 'medium', icon: 'target' },
  { id: 'r4', type: 'feedback', menteeId: 'me4', menteeName: 'Zoe Kim', message: 'Request feedback — no response after last session', priority: 'low', icon: 'star' },
  { id: 'r5', type: 'celebrate', menteeId: 'me2', menteeName: 'Aisha Malik', message: 'Celebrate milestone — 24 sessions completed!', priority: 'low', icon: 'award' }
];

module.exports = { mentors, mentees, sessions, feedbacks, heatmapData, monthlySessionTrend, recommendations };
