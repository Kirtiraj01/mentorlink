// Centralized mock data for frontend fallback & context
export const mockMentors = [
  { id: 'm1', name: 'Rahul Sharma', avatar: 'RS', role: 'mentor', email: 'rahul.sharma@gmail.com', expertise: ['Career Growth', 'Data Science'], menteeCount: 5, rating: 4.9, sessions: 48, load: 'Optimal', badges: ['Top Mentor', 'Consistent', 'Engaged'] },
  { id: 'm2', name: 'Priya Verma', avatar: 'PV', role: 'mentor', email: 'priya.verma@outlook.com', expertise: ['UPSC Preparation', 'Leadership'], menteeCount: 8, rating: 4.7, sessions: 62, load: 'Overloaded', badges: ['Overachiever', 'Streak Master'] },
  { id: 'm3', name: 'Ankit Gupta', avatar: 'AG', role: 'mentor', email: 'ankit.gupta@mentorlink.in', expertise: ['Placement Training', 'Frontend'], menteeCount: 3, rating: 4.8, sessions: 31, load: 'Light', badges: ['Consistent'] },
  { id: 'm4', name: 'Sneha Iyer', avatar: 'SI', role: 'mentor', email: 'sneha.iyer@gmail.com', expertise: ['Personal Development', 'Cloud'], menteeCount: 6, rating: 4.6, sessions: 55, load: 'Optimal', badges: ['Engaged', 'Consistent'] },
  { id: 'm5', name: 'Vikram Desai', avatar: 'VD', role: 'mentor', email: 'vikram.desai@mentorlink.in', expertise: ['MBA Preparation', 'Research'], menteeCount: 2, rating: 5.0, sessions: 24, load: 'Light', badges: ['Top Mentor'] }
];

export const mockMentees = [
  { id: 'me1', name: 'Aman Singh', avatar: 'AS', role: 'mentee', email: 'aman.singh@student.in', mentorId: 'm1', goal: 'Prepare for mock interview', lastSession: '2025-04-25', sessions: 18, relationshipScore: 78, riskStatus: 'Healthy', badges: ['Consistent', 'Fast Learner'], progress: 72 },
  { id: 'me2', name: 'Riya Patel', avatar: 'RP', role: 'mentee', email: 'riya.patel@student.in', mentorId: 'm2', goal: 'Revise DSA topics', lastSession: '2025-04-10', sessions: 24, relationshipScore: 88, riskStatus: 'Healthy', badges: ['Overachiever', 'Streak Master', 'Engaged'], progress: 85 },
  { id: 'me3', name: 'Karan Mehta', avatar: 'KM', role: 'mentee', email: 'karan.mehta@student.in', mentorId: 'm1', goal: 'Practice aptitude questions', lastSession: '2025-03-28', sessions: 6, relationshipScore: 31, riskStatus: 'At Risk', badges: [], progress: 25 },
  { id: 'me4', name: 'Neha Reddy', avatar: 'NR', role: 'mentee', email: 'neha.reddy@student.in', mentorId: 'm3', goal: 'UPSC Mains strategy', lastSession: '2025-04-22', sessions: 12, relationshipScore: 74, riskStatus: 'Healthy', badges: ['Consistent'], progress: 60 },
  { id: 'me5', name: 'Aditya Joshi', avatar: 'AJ', role: 'mentee', email: 'aditya.joshi@student.in', mentorId: 'm4', goal: 'Placement aptitude tests', lastSession: '2025-04-18', sessions: 9, relationshipScore: 58, riskStatus: 'Healthy', badges: ['Fast Learner'], progress: 48 },
  { id: 'me6', name: 'Pooja Nair', avatar: 'PN', role: 'mentee', email: 'pooja.nair@student.in', mentorId: 'm2', goal: 'English communication skills', lastSession: '2025-02-14', sessions: 4, relationshipScore: 22, riskStatus: 'At Risk', badges: [], progress: 18 },
  { id: 'me7', name: 'Rohan Sen', avatar: 'RS', role: 'mentee', email: 'rohan.sen@student.in', mentorId: 'm5', goal: 'MBA entrance strategy', lastSession: '2025-04-26', sessions: 7, relationshipScore: 82, riskStatus: 'Healthy', badges: ['Engaged'], progress: 55 },
  { id: 'me8', name: 'Kavya Rao', avatar: 'KR', role: 'mentee', email: 'kavya.rao@student.in', mentorId: 'm4', goal: 'Personality development', lastSession: '2025-04-20', sessions: 14, relationshipScore: 66, riskStatus: 'Healthy', badges: ['Consistent', 'Engaged'], progress: 63 }
];

export const mockSessions = [
  { id: 's1', mentorId: 'm1', menteeId: 'me1', title: 'Mock Interview Practice', date: '2025-04-25', duration: 60, status: 'Completed', feedback: 5 },
  { id: 's2', mentorId: 'm2', menteeId: 'me2', title: 'DSA Array & Strings', date: '2025-04-24', duration: 90, status: 'Completed', feedback: 5 },
  { id: 's3', mentorId: 'm3', menteeId: 'me4', title: 'Aptitude Problem Solving', date: '2025-04-23', duration: 45, status: 'Completed', feedback: 4 },
  { id: 's4', mentorId: 'm4', menteeId: 'me5', title: 'UPSC General Studies', date: '2025-04-22', duration: 60, status: 'Completed', feedback: 4 },
  { id: 's5', mentorId: 'm1', menteeId: 'me3', title: 'Placement Coding Round', date: '2025-03-28', duration: 60, status: 'Completed', feedback: 3 },
  { id: 's6', mentorId: 'm5', menteeId: 'me7', title: 'Quantitative Aptitude', date: '2025-04-26', duration: 75, status: 'Completed', feedback: 5 },
  { id: 's7', mentorId: 'm4', menteeId: 'me8', title: 'English Communication', date: '2025-04-20', duration: 60, status: 'Completed', feedback: 4 },
  { id: 's8', mentorId: 'm1', menteeId: 'me1', title: 'Mock Interview Part 2', date: '2025-05-05', duration: 60, status: 'Upcoming', feedback: null },
  { id: 's10', mentorId: 'm2', menteeId: 'me2', title: 'DSA Linked Lists', date: '2025-05-08', duration: 90, status: 'Upcoming', feedback: null },
  { id: 's11', mentorId: 'm3', menteeId: 'me4', title: 'Resume Review', date: '2025-05-10', duration: 60, status: 'Upcoming', feedback: null }
];

export const mockFeedbacks = [
  { id: 'f1', menteeId: 'me1', mentorId: 'm1', menteeName: 'Aman Singh', mentorName: 'Rahul Sharma', rating: 5, comment: 'Extremely helpful. Rahul sir explained complex DSA concepts simply.', date: '2025-04-25', sentiment: 'positive' },
  { id: 'f2', menteeId: 'me2', mentorId: 'm2', menteeName: 'Riya Patel', mentorName: 'Priya Verma', rating: 5, comment: 'Priya ma\'am helped me completely rethink my interview strategy. Game changer!', date: '2025-04-24', sentiment: 'positive' },
  { id: 'f3', menteeId: 'me4', mentorId: 'm3', menteeName: 'Neha Reddy', mentorName: 'Ankit Gupta', rating: 4, comment: 'Great feedback on my resume. Clear action items provided.', date: '2025-04-23', sentiment: 'positive' },
  { id: 'f4', menteeId: 'me3', mentorId: 'm1', menteeName: 'Karan Mehta', mentorName: 'Rahul Sharma', rating: 3, comment: 'Session was okay but I felt lost at times during the aptitude section.', date: '2025-03-28', sentiment: 'neutral' },
  { id: 'f5', menteeId: 'me7', mentorId: 'm5', menteeName: 'Rohan Sen', mentorName: 'Vikram Desai', rating: 5, comment: 'Vikram sir is an amazing mentor. So much to learn about MBA prep!', date: '2025-04-26', sentiment: 'positive' },
  { id: 'f6', menteeId: 'me8', mentorId: 'm4', menteeName: 'Kavya Rao', mentorName: 'Sneha Iyer', rating: 4, comment: 'Hands-on approach was really effective for communication skills.', date: '2025-04-20', sentiment: 'positive' }
];

export const mockRecommendations = [
  { id: 'r1', type: 'schedule', menteeId: 'me3', menteeName: 'Karan Mehta', message: 'Schedule a session — inactive for 30+ days', priority: 'high', icon: 'calendar' },
  { id: 'r2', type: 'followup', menteeId: 'me6', menteeName: 'Pooja Nair', message: 'Send a follow-up — low engagement score', priority: 'high', icon: 'message' },
  { id: 'r3', type: 'goal', menteeId: 'me5', menteeName: 'Aditya Joshi', message: 'Assign a new goal — progress stalled at 48%', priority: 'medium', icon: 'target' },
  { id: 'r4', type: 'feedback', menteeId: 'me4', menteeName: 'Neha Reddy', message: 'Request feedback after last session', priority: 'low', icon: 'star' },
  { id: 'r5', type: 'celebrate', menteeId: 'me2', menteeName: 'Riya Patel', message: 'Celebrate milestone — 24 sessions completed!', priority: 'low', icon: 'award' }
];

export const mockAnalytics = {
  stats: { totalMentors: 5, totalMentees: 8, totalSessions: 12, completedSessions: 8, upcomingSessions: 3, atRiskCount: 2, avgRelationshipScore: 62, avgFeedback: '4.3' },
  monthlySessionTrend: [
    { month: 'Nov', sessions: 18, completed: 15 },
    { month: 'Dec', sessions: 22, completed: 19 },
    { month: 'Jan', sessions: 30, completed: 26 },
    { month: 'Feb', sessions: 27, completed: 22 },
    { month: 'Mar', sessions: 35, completed: 30 },
    { month: 'Apr', sessions: 42, completed: 38 }
  ],
  loadDistribution: { Light: 2, Optimal: 2, Overloaded: 1 },
  sentimentBreakdown: { positive: 5, neutral: 2, negative: 0 }
};

export const roleProfiles = {
  admin: { id: 'admin1', name: 'Admin', email: 'admin@mentorlink.in', role: 'admin', avatar: 'A' },
  mentor: { id: 'm1', name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', role: 'mentor', avatar: 'RS' },
  mentee: { id: 'me1', name: 'Aman Singh', email: 'aman.singh@student.in', role: 'mentee', avatar: 'AS', mentorId: 'm1' }
};
