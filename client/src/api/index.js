import axios from 'axios';
import { mockAnalytics, mockMentors, mockMentees, mockSessions, mockFeedbacks } from '../data/mockData';

const api = axios.create({ baseURL: '/api', timeout: 5000 });

const withFallback = async (fn, fallback) => {
  try { return await fn(); }
  catch { return { data: { success: true, data: fallback } }; }
};

export const getAnalytics = () => withFallback(() => api.get('/analytics'), mockAnalytics);
export const getUsers = (role) => withFallback(() => api.get('/users', { params: { role } }), role === 'mentor' ? mockMentors : role === 'mentee' ? mockMentees : { mentors: mockMentors, mentees: mockMentees });
export const createMentor = (data) => api.post('/users/mentors', data);
export const createMentee = (data) => api.post('/users/mentees', data);
export const getSessions = (params) => withFallback(() => api.get('/sessions', { params }), mockSessions);
export const createSession = (data) => api.post('/sessions', data);
export const getFeedbacks = () => Promise.resolve({ data: { success: true, data: mockFeedbacks } });
export const login = (email, password) => api.post('/auth/login', { email, password });

// Alerts API
export const createAlert = (data) => api.post('/alerts', data);
export const getMenteeAlerts = (menteeId) => api.get('/alerts/mentee', { params: { menteeId } });
export const markAlertRead = (id, menteeId) => api.patch(`/alerts/${id}/read`, { menteeId });
export const markAlertCompleted = (id, menteeId) => api.patch(`/alerts/${id}/complete`, { menteeId });

// Syllabus API
export const createSyllabus = (data) => api.post('/syllabus', data);
export const getSyllabus = (params) => api.get('/syllabus', { params });
export const createTopic = (data) => api.post('/topic', data);
export const markTopicCompleted = (id, menteeId) => api.patch(`/topic/${id}/complete`, { menteeId });

// ── Issue Reporting & Auto-Escalation API ──────────────────────────────────
export const getIssues = (params) => api.get('/issues', { params });
export const getIssueById = (id) => api.get(`/issues/${id}`);
export const createIssue = (data) => api.post('/issues', data);
export const addIssueReply = (id, data) => api.post(`/issues/${id}/reply`, data);
export const updateIssueStatus = (id, status, by) => api.patch(`/issues/${id}/status`, { status, by });
export const getIssueAnalytics = () => api.get('/issues/analytics');
export const getEscalationLogs = () => api.get('/issues/logs/escalation');

// ── Issue Notifications API ────────────────────────────────────────────────
export const getIssueNotifications = (userId) => api.get('/issues/notifications', { params: { userId } });
export const markIssueNotificationRead = (id) => api.patch(`/issues/notifications/${id}/read`);
export const markAllIssueNotificationsRead = (userId) => api.patch('/issues/notifications/read-all', { userId });
