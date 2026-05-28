import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getAnalytics } from '../api';
import { mockMentees, mockSessions, mockRecommendations, mockAnalytics } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChevronLeft, ChevronRight, MoreHorizontal, Pencil, AlertTriangle } from 'lucide-react';
import RecommendationPanel from '../components/RecommendationPanel';
import ProgressRing from '../components/ProgressRing';
import Badge from '../components/Badge';
import Skeleton, { SkeletonCard } from '../components/Skeleton';
import { createAlert, getMenteeAlerts, markAlertRead, markAlertCompleted, getSyllabus, createSyllabus, createTopic, markTopicCompleted } from '../api';
import { AnimatePresence } from 'framer-motion';
import { X, Send, Flag, Clock, BookOpen, PlusCircle, CheckCircle } from 'lucide-react';

/* shared colors — single source */
const C = { pri: '#1e2139', sec: '#64748b', mut: '#94a3b8', faint: '#b8c0cc', teal: 'var(--primary)', purple: '#8b5cf6', green: '#15803d', border: '#f1f2f6' };

/* ── Mini Calendar ──────────────────────────────────── */
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function MiniCalendar() {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year,  setYear]  = useState(new Date().getFullYear());
  const today = new Date();

  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Adjust so Mon=0
  const offset = (firstDay + 6) % 7;

  const dots = { 2: ['var(--primary)'], 9: ['#8b5cf6'], 14: ['#ef4444'], 16: ['var(--primary)','#8b5cf6'], 22: ['#8b5cf6','#ef4444'], 26: ['var(--primary)'] };

  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: C.pri, letterSpacing: '-0.01em' }}>{MONTHS[month]}, {year}</span>
        <div style={{ display: 'flex', gap: 2 }}>
          <button onClick={() => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: C.sec, borderRadius: 8, transition: 'color 200ms' }}>
            <ChevronLeft size={15} />
          </button>
          <button onClick={() => { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#6b7280', borderRadius: 6 }}>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
      {/* Day headers */}
      <div className="cal-grid" style={{ marginBottom: 6 }}>
        {DAYS.map(d => <div key={d} style={{ fontSize: 10, fontWeight: 600, color: C.mut, textAlign: 'center' }}>{d}</div>)}
      </div>
      {/* Cells */}
      <div className="cal-grid">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const hasDots = dots[d];
          return (
            <div key={i} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className={`cal-day${isToday ? ' today' : ''}`} style={{ fontSize: 12, width: 26, height: 26 }}>
                {d}
              </div>
              {hasDots && (
                <div style={{ display: 'flex', gap: 2, marginTop: 1 }}>
                  {hasDots.map((c, ci) => <div key={ci} style={{ width: 4, height: 4, borderRadius: '50%', background: c }} />)}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
        {[{ c: 'var(--primary)', label: 'Tasks' }, { c: '#8b5cf6', label: 'Assessments' }, { c: '#ef4444', label: 'Personal' }, { c: '#22c55e', label: 'Tips' }].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: l.c }} />
            <span style={{ fontSize: 10, color: C.sec, fontWeight: 500 }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Program Card (mini) ─────────────────────────────── */
const programIcons = {
  'The path to confidence': '🛡️',
  'Leadership': '📊',
  'Work-Life Balance': '☕',
  'Financial growth': '💲',
  'Relationships': '❤️',
  'Spiritual growth': '⭐',
};

function ProgramCardMini({ name, desc, progress, days, icon }) {
  return (
    <motion.div className="program-card" style={{ marginBottom: 14 }}
      whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
      transition={{ duration: 0.2 }}>
      <div className="program-thumb" style={{ height: 110 }}>
        <span style={{ fontSize: 30, position: 'relative', zIndex: 1 }}>{icon}</span>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: C.pri, letterSpacing: '-0.01em' }}>{name}</div>
          <MoreHorizontal size={14} color="#9ca3af" />
        </div>
        <div style={{ fontSize: 11.5, color: C.sec, marginBottom: 12, lineHeight: 1.5 }}>{desc}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600 }}>{progress}% completed</span>
          <span style={{ fontSize: 11, color: C.mut }}>📅 {days} days</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </motion.div>
  );
}

/* ── Recent Entry Card ───────────────────────────────── */
function EntryCard({ type, tags, title, desc, date, onAction }) {
  return (
    <div style={{ padding: '16px 0', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        {tags.map(t => (
          <span key={t.label} className={`chip ${t.chip}`}>{t.icon && <span>{t.icon}</span>}{t.label}</span>
        ))}
        {onAction && (
          <button style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600, fontFamily: 'Inter, sans-serif', transition: 'opacity 200ms' }}>
            <Pencil size={11} /> {onAction}
          </button>
        )}
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: C.pri, marginBottom: 4, letterSpacing: '-0.01em' }}>{title}</div>
      <div style={{ fontSize: 12, color: C.sec, lineHeight: 1.6 }}>{desc}</div>
    </div>
  );
}

/* ── Metrics chart tooltip ───────────────────────────── */
function CustomTT({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tt">
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.fill === '#8b5cf6' ? '#a78bfa' : '#5eead4' }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
}

/* ── Admin Dashboard ─────────────────────────────────── */
function AdminDashboard({ analytics }) {
  const { stats, monthlySessionTrend, recommendations, atRiskMentees } = analytics;
  const trend = monthlySessionTrend || [];

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25,0.46,0.45,0.94] }}
        >
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>Overview</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4, margin: 0 }}>Welcome back, Admin! Here's what's happening.</p>
        </motion.div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-outline" style={{ borderRadius: '12px' }}>Download Report</button>
          <button className="btn" style={{ background: 'var(--primary)', color: 'white', borderRadius: '12px' }}>+ New Program</button>
        </div>
      </div>

      <div style={{ background: '#dcfce7', color: '#166534', padding: '12px 16px', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, fontSize: 13, fontWeight: 500 }}>
        <CheckCircle size={16} color="#166534" />
        <span>{stats?.atRiskCount || 2} mentees successfully moved out of "At Risk" status this week.</span>
      </div>

      {/* 3-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 260px', gap: 24 }}>

        {/* LEFT — Programs */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span className="section-title">Active Mentees</span>
            <button style={{ fontSize: 12, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'Inter, sans-serif', transition: 'opacity 200ms' }}>View all</button>
          </div>
          {mockMentees.filter(m => m.riskStatus === 'Healthy').slice(0, 3).map(m => (
            <ProgramCardMini
              key={m.id}
              name={m.name}
              desc={m.goal}
              progress={m.progress}
              days={m.sessions * 3}
              icon={['🛡️','📊','☕','💲','❤️','⭐','🌿','🔬'][mockMentees.indexOf(m) % 8]}
            />
          ))}
          {/* At risk */}
          {(atRiskMentees || mockMentees.filter(m => m.riskStatus === 'At Risk')).slice(0,1).map(m => (
            <div key={m.id} style={{ border: '1px solid #fecaca', borderRadius: 10, padding: '12px 14px', background: '#fff5f5', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <AlertTriangle size={13} color="#ef4444" />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1a1d3c' }}>{m.name}</span>
                <span className="chip chip-red pulse-red" style={{ marginLeft: 'auto', fontSize: 10 }}>⚠️ At Risk</span>
              </div>
              <div style={{ fontSize: 11.5, color: '#6b7280' }}>Score: {m.relationshipScore} · Last session: {m.lastSession}</div>
            </div>
          ))}
        </div>

        {/* CENTER — Entries + Metrics */}
        <div>
          {/* Recent entries */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="section-title" style={{ marginBottom: 2 }}>Recent entries & tips</div>
            <EntryCard
              tags={[{ label: 'Journal', chip: 'chip-purple', icon: '📓' }, { label: 'Placement Prep', chip: 'chip-gray' }]}
              title="Focusing on DSA problem solving daily"
              desc="Today I spent 2 hours solving array manipulation questions on LeetCode. It helped me understand..."
              onAction="Continue reflection"
            />
            <EntryCard
              tags={[{ label: 'Tip', chip: 'chip-teal', icon: '💡' }, { label: 'Interview Strategy', chip: 'chip-gray' }]}
              title="Effective placement strategy"
              desc="Focus on core subjects like DBMS and OS before technical interviews. Consistent practice is key."
            />
          </div>

          {/* Metrics chart */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span className="section-title">Coaching process metrics</span>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>Last 6 months</span>
            </div>
            {/* Stat row - Reference Style */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Active programs', val: stats?.totalMentors || 5, emoji: '🔥' },
                { label: 'Total sessions', val: stats?.totalSessions || 12, emoji: '📅' },
                { label: 'Avg feedback', val: stats?.avgFeedback || '4.3', emoji: '⭐' },
              ].map(s => (
                <div key={s.label} className="card" style={{ padding: '20px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: 6, borderRadius: 'var(--radius-xl)' }}>
                  <div style={{ fontSize: 24 }}>{s.emoji}</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1, marginTop: 4 }}>{s.val}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={trend} barSize={12} barGap={4}>
                <XAxis dataKey="month" tick={{ fill: 'var(--text-faint)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTT />} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="sessions" name="Sessions" fill="var(--border)" radius={[4,4,0,0]} />
                <Bar dataKey="completed" name="Completed" fill="var(--teal)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT — Calendar + Recommendations */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1d3c', marginBottom: 14 }}>Scheduling</div>
            <MiniCalendar />
          </div>
          <div className="card">
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1d3c', marginBottom: 12 }}>🤖 Smart Recommendations</div>
            <RecommendationPanel recommendations={(recommendations || mockRecommendations).slice(0, 3)} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Mentor Dashboard ────────────────────────────────── */
function MentorDashboard({ analytics }) {
  const { user } = useAuth();
  const { stats, recommendations } = analytics;
  const myMentees = mockMentees.filter(m => m.mentorId === 'm1');
  const [showModal, setShowModal] = useState(false);
  const [alertForm, setAlertForm] = useState({ title: '', message: '', dueDate: '', priority: 'medium' });
  const [submitting, setSubmitting] = useState(false);

  // Syllabus State
  const [syllabus, setSyllabus] = useState(null);
  const [topicForm, setTopicForm] = useState({ title: '', description: '' });

  useEffect(() => {
    getSyllabus({ mentorId: user.id }).then(r => {
      if (r.data?.data?.length > 0) {
        setSyllabus(r.data.data[0]);
      }
    }).catch(() => {});
  }, [user.id]);

  const handleCreateSyllabus = async () => {
    const res = await createSyllabus({ mentorId: user.id, title: 'Web Development Track' });
    setSyllabus({ ...res.data.data, topics: [] });
  };

  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!syllabus) return;
    const order = syllabus.topics ? syllabus.topics.length + 1 : 1;
    const res = await createTopic({ syllabusId: syllabus.id, ...topicForm, order });
    setSyllabus(p => ({ ...p, topics: [...(p.topics || []), res.data.data] }));
    setTopicForm({ title: '', description: '' });
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await createAlert({ mentorId: user.id, ...alertForm });
    setShowModal(false);
    setSubmitting(false);
    setAlertForm({ title: '', message: '', dueDate: '', priority: 'medium' });
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4, margin: 0 }}>Welcome, {user?.name || 'Cameron'}! Here are your active students.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn" onClick={() => setShowModal(true)} style={{ background: 'var(--primary)', color: 'white', borderRadius: '12px' }}>
            <Send size={14} /> Broadcast Alert
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 260px', gap: 20 }}>
        {/* LEFT — My mentees */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <span className="section-title">My Mentees</span>
          </div>
          {myMentees.map((m, i) => (
            <ProgramCardMini key={m.id} name={m.name} desc={m.goal} progress={m.progress} days={m.sessions * 3}
              icon={['🛡️','📊','☕'][i % 3]} />
          ))}
        </div>

        {/* CENTER */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="section-title" style={{ marginBottom: 14 }}>Mentee Progress</div>
            {myMentees.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div className="avatar" style={{ width: 36, height: 36, fontSize: 13, background: 'var(--primary-light)', color: 'var(--primary-dark)', border: '1px solid var(--primary-mid)' }}>{m.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1d3c', marginBottom: 2 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 6 }}>{m.goal}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600 }}>{m.progress}% completed</span>
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>{m.sessions} sessions</span>
                  </div>
                  <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${m.progress}%` }} /></div>
                </div>
                <ProgressRing score={m.relationshipScore} size={52} strokeWidth={5} />
              </div>
            ))}
          </div>
          <div className="card">
            <div className="section-title" style={{ marginBottom: 12 }}>🤖 Recommendations</div>
            <RecommendationPanel recommendations={(recommendations || mockRecommendations).slice(0, 3)} />
          </div>
          {/* Syllabus Builder */}
          <div className="card" style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><BookOpen size={14} color={'var(--primary)'} /> Mentorship Syllabus</span>
              {!syllabus && <button onClick={handleCreateSyllabus} className="btn btn-outline" style={{ fontSize: 11, padding: '4px 10px' }}>Create Syllabus</button>}
            </div>
            {syllabus ? (
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.pri, marginBottom: 10 }}>{syllabus.title}</div>
                {syllabus.topics && syllabus.topics.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                    {syllabus.topics.map((t, i) => (
                      <div key={t.id} style={{ display: 'flex', gap: 10, background: C.bgLight, padding: '10px 12px', borderRadius: 8, border: `1px solid ${C.border}` }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: 700, color: C.pri }}>{t.title}</div>
                          <div style={{ fontSize: 11, color: C.sec, marginTop: 2 }}>{t.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 11, color: C.mut, marginBottom: 14, fontStyle: 'italic' }}>No topics added yet.</div>
                )}
                <form onSubmit={handleAddTopic} style={{ display: 'flex', flexDirection: 'column', gap: 8, borderTop: `1px dashed ${C.border}`, paddingTop: 12 }}>
                  <input className="input" value={topicForm.title} onChange={e=>setTopicForm(p=>({...p,title:e.target.value}))} placeholder="New topic title (e.g. Intro to React)" required style={{ fontSize: 12, padding: '8px 12px' }} />
                  <input className="input" value={topicForm.description} onChange={e=>setTopicForm(p=>({...p,description:e.target.value}))} placeholder="Brief description..." required style={{ fontSize: 12, padding: '8px 12px' }} />
                  <button type="submit" className="btn btn-dark" style={{ fontSize: 11, padding: '6px 0', justifyContent: 'center' }}><PlusCircle size={12} /> Add Topic</button>
                </form>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '10px 0', color: C.mut, fontSize: 12 }}>Create a structured learning roadmap for your mentees.</div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1d3c', marginBottom: 14 }}>Scheduling</div>
            <MiniCalendar />
          </div>
          {/* Stats */}
          <div className="card">
            {[{ label: 'Sessions', val: stats.completedSessions }, { label: 'Mentees', val: myMentees.length }, { label: 'Avg Rating', val: `${stats.avgFeedback}★` }].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f1f5' }}>
                <span style={{ fontSize: 12.5, color: '#6b7280' }}>{s.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1d3c' }}>{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Broadcast Alert Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setShowModal(false)}>
            <motion.div className="modal" initial={{scale:0.9,y:20}} animate={{scale:1,y:0}} exit={{scale:0.9}} onClick={e=>e.stopPropagation()}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
                <h3 style={{ fontSize:17, fontWeight:700, color:'#1a1d3c' }}>Broadcast Alert to All Mentees</h3>
                <button onClick={() => setShowModal(false)} style={{ background:'none',border:'none',cursor:'pointer',color:'#9ca3af' }}><X size={18}/></button>
              </div>
              <form onSubmit={handleBroadcast} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div>
                  <label style={{ fontSize:12, color:'#6b7280', display:'block', marginBottom:5 }}>Alert Title</label>
                  <input className="input" value={alertForm.title} onChange={e=>setAlertForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Please complete your weekly journal" required />
                </div>
                <div>
                  <label style={{ fontSize:12, color:'#6b7280', display:'block', marginBottom:5 }}>Message</label>
                  <textarea className="input" value={alertForm.message} onChange={e=>setAlertForm(p=>({...p,message:e.target.value}))} rows={3} placeholder="Add more details here..." required style={{ resize:'vertical' }} />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div>
                    <label style={{ fontSize:12, color:'#6b7280', display:'block', marginBottom:5 }}><Clock size={12} style={{ display: 'inline', marginBottom: -2 }} /> Due Date (Optional)</label>
                    <input type="date" className="input" value={alertForm.dueDate} onChange={e=>setAlertForm(p=>({...p,dueDate:e.target.value}))} />
                  </div>
                  <div>
                    <label style={{ fontSize:12, color:'#6b7280', display:'block', marginBottom:5 }}><Flag size={12} style={{ display: 'inline', marginBottom: -2 }} /> Priority</label>
                    <select className="input" value={alertForm.priority} onChange={e=>setAlertForm(p=>({...p,priority:e.target.value}))}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-dark" disabled={submitting} style={{ marginTop:4, width: '100%', justifyContent: 'center' }}>
                  {submitting ? 'Sending...' : 'Send to All Mentees'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Mentee Dashboard ────────────────────────────────── */
function MenteeDashboard({ analytics }) {
  const { user } = useAuth();
  const me = mockMentees[0];
  const mySessions = mockSessions.filter(s => s.menteeId === 'me1').slice(0, 3);
  const [alerts, setAlerts] = useState([]);
  const [syllabus, setSyllabus] = useState(null);
  const [newAlertBanner, setNewAlertBanner] = useState(null); // popup banner state
  const prevAlertCountRef = useRef(0);

  // Fetch alerts once on mount and then poll every 5 seconds
  const fetchAlerts = async () => {
    try {
      const r = await getMenteeAlerts(user.id);
      const fetched = r.data?.data || [];
      setAlerts(fetched);

      // Check if new unread alerts arrived
      const unreadCount = fetched.filter(a => !a.isRead).length;
      if (unreadCount > prevAlertCountRef.current && prevAlertCountRef.current !== undefined) {
        const newest = fetched.find(a => !a.isRead);
        if (newest) setNewAlertBanner(newest);
      }
      prevAlertCountRef.current = unreadCount;
    } catch {}
  };

  useEffect(() => {
    fetchAlerts();
    getSyllabus({ mentorId: me.mentorId, menteeId: user.id }).then(r => {
      if (r.data?.data?.length > 0) setSyllabus(r.data.data[0]);
    }).catch(()=>{});

    // Poll every 5 seconds for new alerts
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, [user.id, me.mentorId]);

  const handleCompleteTopic = async (topicId) => {
    await markTopicCompleted(topicId, user.id);
    setSyllabus(p => ({
      ...p,
      topics: p.topics.map(t => t.id === topicId ? { ...t, isCompleted: true } : t)
    }));
  };

  const handleRead = async (id) => {
    await markAlertRead(id, user.id);
    setAlerts(p => p.map(a => a.id === id ? { ...a, isRead: true } : a));
    if (newAlertBanner?.id === id) setNewAlertBanner(null);
  };

  const handleComplete = async (id) => {
    await markAlertCompleted(id, user.id);
    setAlerts(p => p.map(a => a.id === id ? { ...a, isCompleted: true } : a));
    if (newAlertBanner?.id === id) setNewAlertBanner(null);
  };

  return (
    <div>
      {/* Live Alert Banner Popup */}
      <AnimatePresence>
        {newAlertBanner && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{
              position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
              zIndex: 9999, width: '90%', maxWidth: 560,
              background: 'linear-gradient(135deg, #1e2139 0%, #252847 100%)',
              borderRadius: 16, padding: '16px 20px',
              boxShadow: '0 8px 40px rgba(20,184,166,0.25), 0 2px 12px rgba(0,0,0,0.2)',
              border: '1px solid rgba(20,184,166,0.3)',
              display: 'flex', alignItems: 'flex-start', gap: 14
            }}
          >
            {/* Icon */}
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
              <span style={{ fontSize: 18 }}>{newAlertBanner.priority === 'high' ? '🚨' : newAlertBanner.priority === 'medium' ? '📢' : '📬'}</span>
            </div>
            {/* Content */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>New Alert from Your Mentor</span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: newAlertBanner.priority === 'high' ? '#fef2f2' : newAlertBanner.priority === 'medium' ? '#fffbeb' : '#f0fdf4', color: newAlertBanner.priority === 'high' ? '#ef4444' : newAlertBanner.priority === 'medium' ? '#f59e0b' : '#22c55e', fontWeight: 700 }}>
                  {newAlertBanner.priority?.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 4 }}>{newAlertBanner.title}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{newAlertBanner.message}</div>
              {newAlertBanner.dueDate && <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>⏰ Due: {newAlertBanner.dueDate}</div>}
            </div>
            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
              <button onClick={() => handleRead(newAlertBanner.id)} style={{ fontSize: 11, padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>Mark Read</button>
              <button onClick={() => setNewAlertBanner(null)} style={{ fontSize: 11, padding: '6px 12px', borderRadius: 8, border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer', fontWeight: 500 }}>Dismiss</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4, margin: 0 }}>Welcome back, {user?.name?.split(' ')[0] || 'Mentee'}! Keep up the great work.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {alerts.filter(a => !a.isRead).length > 0 && (
            <motion.button
              onClick={() => setNewAlertBanner(alerts.find(a => !a.isRead))}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '12px', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#92400e' }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
            >
              <span>🔔</span> {alerts.filter(a => !a.isRead).length} New Alert{alerts.filter(a => !a.isRead).length > 1 ? 's' : ''}
            </motion.button>
          )}
          <button className="btn" style={{ background: 'var(--primary)', color: 'white', borderRadius: '12px' }}>
            + Book Session
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 260px', gap: 20 }}>
        {/* LEFT */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <span className="section-title">Syllabus Progress</span>
          </div>
          {syllabus ? (
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.pri, marginBottom: 10 }}>{syllabus.title}</div>
              {syllabus.topics && syllabus.topics.length > 0 ? (() => {
                const completedCount = syllabus.topics.filter(t => t.isCompleted).length;
                const progressPct = Math.round((completedCount / syllabus.topics.length) * 100);
                
                return (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600 }}>{progressPct}% completed</span>
                      <span style={{ fontSize: 11, color: C.mut }}>{completedCount} / {syllabus.topics.length} topics</span>
                    </div>
                    <div className="progress-bar-track" style={{ marginBottom: 16 }}>
                      <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {syllabus.topics.map((t, i) => {
                        const isActive = !t.isCompleted && (i === 0 || syllabus.topics[i-1].isCompleted);
                        return (
                          <div key={t.id} style={{ display: 'flex', gap: 10, opacity: t.isCompleted ? 0.6 : 1, transition: 'all 0.2s', borderLeft: isActive ? `3px solid ${'var(--primary)'}` : '3px solid transparent', paddingLeft: isActive ? 6 : 0 }}>
                            <div style={{ width: 22, height: 22, borderRadius: '50%', background: t.isCompleted ? C.green : isActive ? '#ccf3ef' : C.border, color: t.isCompleted ? 'white' : isActive ? 'var(--primary)' : C.mut, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, flexShrink: 0 }}>
                              {t.isCompleted ? <CheckCircle size={12} strokeWidth={3} /> : i + 1}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 12.5, fontWeight: 700, color: isActive ? C.pri : C.sec }}>{t.title}</div>
                              <div style={{ fontSize: 11, color: C.mut, marginTop: 2 }}>{t.description}</div>
                              {isActive && (
                                <button onClick={() => handleCompleteTopic(t.id)} style={{ marginTop: 8, fontSize: 10, padding: '4px 10px', borderRadius: 6, border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: 600 }}>Mark Completed</button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })() : (
                <div style={{ fontSize: 11, color: C.mut, fontStyle: 'italic' }}>No topics found in this syllabus.</div>
              )}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.sec, marginBottom: 6 }}>No Active Syllabus</div>
              <div style={{ fontSize: 11, color: C.mut }}>Your mentor hasn't assigned a roadmap yet.</div>
            </div>
          )}
        </div>

        {/* CENTER */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="section-title" style={{ marginBottom: 2 }}>Recent entries & tips</div>
            <EntryCard
              tags={[{ label: 'Journal', chip: 'chip-purple', icon: '📓' }, { label: 'Placement Prep', chip: 'chip-gray' }]}
              title="Focusing on DSA problem solving daily"
              desc="Today I spent 2 hours solving array manipulation questions on LeetCode. It helped me understand..."
              onAction="Continue reflection"
            />
            <EntryCard
              tags={[{ label: 'Tip', chip: 'chip-teal', icon: '💡' }, { label: 'Interview Strategy', chip: 'chip-gray' }]}
              title="Effective placement strategy"
              desc="Focus on core subjects like DBMS and OS before technical interviews. Consistent practice is key."
            />
          </div>

          {/* Coaching metrics */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span className="section-title">Coaching process metrics</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ChevronLeft size={14} color="#9ca3af" style={{ cursor: 'pointer' }} />
                <span style={{ fontSize: 12, color: '#6b7280' }}>Last 6 months</span>
                <ChevronRight size={14} color="#9ca3af" style={{ cursor: 'pointer' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
              {[{ label: 'Active programs', val: 8, emoji: '🚀' }, { label: 'Number of journals', val: 62, emoji: '📝' }, { label: 'Coaching tips', val: 70, emoji: '💡' }].map(s => (
                <div key={s.label} className="card" style={{ padding: '20px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: 6, borderRadius: 'var(--radius-xl)' }}>
                  <div style={{ fontSize: 24 }}>{s.emoji}</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1, marginTop: 4 }}>{s.val}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={[{m:'Oct 1',s:6,c:4},{m:'Oct 5',s:8,c:7},{m:'Oct 10',s:5,c:5},{m:'Oct 15',s:10,c:9},{m:'Oct 20',s:7,c:6},{m:'Oct 25',s:9,c:8},{m:'Oct 31',s:11,c:10}]} barSize={12} barGap={3}>
                <XAxis dataKey="m" tick={{ fill: 'var(--text-faint)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTT />} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="s" name="Sessions" fill="var(--border)" radius={[3,3,0,0]} />
                <Bar dataKey="c" name="Completed" fill="var(--teal)" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          {/* Alerts Panel */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1d3c' }}>Important Alerts</span>
              {alerts.filter(a => !a.isRead).length > 0 && (
                <span style={{ background: '#ef4444', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 10 }}>
                  {alerts.filter(a => !a.isRead).length} New
                </span>
              )}
            </div>
            {alerts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '16px 0', color: '#94a3b8', fontSize: 12 }}>
                No active alerts right now.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {alerts.map(a => {
                  const pColor = a.priority === 'high' ? '#ef4444' : a.priority === 'medium' ? '#f59e0b' : 'var(--primary)';
                  const isOverdue = a.dueDate && new Date(a.dueDate) < new Date();
                  return (
                    <motion.div key={a.id} style={{ padding: 12, border: `1px solid ${a.isRead ? C.border : pColor+'40'}`, borderRadius: 10, background: a.isRead ? '#fcfcfd' : '#fff' }} whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: pColor }} />
                          <span style={{ fontSize: 12, fontWeight: 700, color: C.pri }}>{a.title}</span>
                        </div>
                        {isOverdue && !a.isCompleted && <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 700 }}>Overdue</span>}
                      </div>
                      <div style={{ fontSize: 11, color: C.sec, marginBottom: 8 }}>{a.message}</div>
                      {a.dueDate && <div style={{ fontSize: 10, color: C.mut, marginBottom: 8 }}><Clock size={10} style={{ display: 'inline', marginBottom: -2 }} /> Due: {a.dueDate}</div>}
                      <div style={{ display: 'flex', gap: 6 }}>
                        {!a.isRead && <button onClick={() => handleRead(a.id)} style={{ fontSize: 10, padding: '4px 8px', borderRadius: 6, border: `1px solid ${C.border}`, background: 'white', cursor: 'pointer', flex: 1, color: C.pri, fontWeight: 600 }}>Mark Read</button>}
                        {!a.isCompleted && <button onClick={() => handleComplete(a.id)} style={{ fontSize: 10, padding: '4px 8px', borderRadius: 6, border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', flex: 1, fontWeight: 600 }}>Mark Done</button>}
                        {a.isCompleted && <span style={{ fontSize: 10, color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><Flag size={10} /> Completed</span>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1d3c', marginBottom: 14 }}>Scheduling</div>
            <MiniCalendar />
          </div>
          <div className="card">
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1d3c', marginBottom: 10 }}>My Progress</div>
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <ProgressRing score={me.relationshipScore} size={90} strokeWidth={8} />
            </div>
            {me.badges.map(b => (
              <div key={b} style={{ marginBottom: 6 }}><Badge label={b} /></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main export ─────────────────────────────────────── */
export default function Dashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    getAnalytics().then(r => setAnalytics(r.data?.data || r.data)).catch(() => setAnalytics(mockAnalytics));
  }, []);

  const role = user?.role || 'admin';

  if (!analytics) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <Skeleton width={240} height={28} borderRadius={10} />
          <Skeleton width={200} height={36} borderRadius={20} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 260px', gap: 20 }}>
          <div>
            <Skeleton width={140} height={20} style={{ marginBottom: 14 }} />
            <SkeletonCard />
            <div style={{ height: 16 }} />
            <SkeletonCard />
          </div>
          <div>
            <Skeleton width={180} height={20} style={{ marginBottom: 14 }} />
            <SkeletonCard />
            <div style={{ height: 16 }} />
            <SkeletonCard />
          </div>
          <div>
            <Skeleton width={120} height={20} style={{ marginBottom: 14 }} />
            <SkeletonCard />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      {role === 'admin'  && <AdminDashboard  analytics={analytics} />}
      {role === 'mentor' && <MentorDashboard analytics={analytics} />}
      {role === 'mentee' && <MenteeDashboard analytics={analytics} />}
    </div>
  );
}
