const express = require('express');
const router = express.Router();
const { mentors, mentees, sessions, feedbacks, heatmapData, monthlySessionTrend, recommendations } = require('../data/mockData');

router.get('/', (req, res) => {
  const totalMentors = mentors.length;
  const totalMentees = mentees.length;
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.status === 'Completed').length;
  const upcomingSessions = sessions.filter(s => s.status === 'Upcoming').length;
  const atRiskCount = mentees.filter(m => m.riskStatus === 'At Risk').length;
  const avgRelationshipScore = Math.round(mentees.reduce((sum, m) => sum + m.relationshipScore, 0) / mentees.length);
  const avgFeedback = (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1);

  // Load distribution
  const loadDistribution = {
    Light: mentors.filter(m => m.load === 'Light').length,
    Optimal: mentors.filter(m => m.load === 'Optimal').length,
    Overloaded: mentors.filter(m => m.load === 'Overloaded').length
  };

  // Feedback sentiment breakdown
  const sentimentBreakdown = {
    positive: feedbacks.filter(f => f.sentiment === 'positive').length,
    neutral: feedbacks.filter(f => f.sentiment === 'neutral').length,
    negative: feedbacks.filter(f => f.sentiment === 'negative').length
  };

  res.json({
    success: true,
    data: {
      stats: { totalMentors, totalMentees, totalSessions, completedSessions, upcomingSessions, atRiskCount, avgRelationshipScore, avgFeedback },
      loadDistribution,
      sentimentBreakdown,
      heatmapData,
      monthlySessionTrend,
      recommendations,
      recentFeedbacks: feedbacks.slice(0, 5),
      atRiskMentees: mentees.filter(m => m.riskStatus === 'At Risk')
    }
  });
});

module.exports = router;
