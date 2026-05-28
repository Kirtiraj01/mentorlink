import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, X, Clock, CheckCircle, AlertCircle, XCircle, BookOpen } from 'lucide-react';
import { mockMentors, mockMentees } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { getSessions, createSession, getSyllabus } from '../api';
import EmptyState from '../components/EmptyState';

const HOURS = ['8AM','9AM','10AM','11AM','12PM','1PM','2PM','3PM','4PM','5PM'];
const DAYS_SHORT = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const statusCfg = {
  Completed: { chip: 'chip-teal',   icon: CheckCircle  },
  Upcoming:  { chip: 'chip-amber',  icon: AlertCircle  },
  Cancelled: { chip: 'chip-red',    icon: XCircle      },
};

const C = { pri: 'var(--text-primary)', sec: 'var(--text-secondary)', mut: '#94a3b8', teal: 'var(--primary)', border: 'var(--border)' };

/* ── Mini calendar for right panel ──────────────────── */
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function MiniCal() {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear]   = useState(new Date().getFullYear());
  const today = new Date();
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const days   = new Date(year, month + 1, 0).getDate();
  const cells  = [...Array(offset).fill(null), ...Array.from({length: days}, (_, i) => i + 1)];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: C.pri }}>{MONTHS[month]}, {year}</span>
        <div style={{ display: 'flex', gap: 2 }}>
          <button onClick={() => month === 0 ? (setMonth(11), setYear(y=>y-1)) : setMonth(m=>m-1)} style={{ background:'none',border:'none',cursor:'pointer',padding:4,color:C.sec,transition:'color 200ms' }}><ChevronLeft size={13}/></button>
          <button onClick={() => month === 11 ? (setMonth(0), setYear(y=>y+1)) : setMonth(m=>m+1)} style={{ background:'none',border:'none',cursor:'pointer',padding:4,color:C.sec,transition:'color 200ms' }}><ChevronRight size={13}/></button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, textAlign: 'center', marginBottom: 6 }}>
        {['M','T','W','T','F','S','S'].map((d,i) => <div key={i} style={{ fontSize: 9.5, fontWeight: 600, color: C.mut }}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, textAlign: 'center' }}>
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const isT = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          return <div key={i} className={`cal-day${isT ? ' today' : ''}`} style={{ fontSize: 11, width: 24, height: 24, ...(isT ? { background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' } : {}) }}>{d}</div>;
        })}
      </div>
    </div>
  );
}

/* ── Week view ───────────────────────────────────────── */
function WeekView({ sessions }) {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  const weekDays = Array.from({length: 5}, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  // Mock events placed in grid based on actual sessions if possible, or fallback
  const events = sessions.map((s, i) => {
    // try to map session date to a day 1-5 (Mon-Fri)
    const sDate = new Date(s.date);
    const dayIndex = sDate.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    const dayNum = dayIndex === 0 || dayIndex === 6 ? 1 : dayIndex; // fallback to mon if weekend
    const hourNum = 9 + (i % 6); // Mock hour mapping
    return { 
      id: s.id,
      day: dayNum, 
      hour: hourNum, 
      title: s.title, 
      duration: s.duration / 60, 
      color: s.status === 'Completed' ? 'event-teal' : 'event-purple' 
    };
  });

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Hour column */}
      <div style={{ width: 52, flexShrink: 0 }}>
        <div style={{ height: 40 }} />
        {HOURS.map(h => (
          <div key={h} style={{ height: 56, display: 'flex', alignItems: 'flex-start', paddingTop: 4 }}>
            <span style={{ fontSize: 11, color: C.mut, paddingRight: 8 }}>{h}</span>
          </div>
        ))}
      </div>

      {/* Day columns */}
      {weekDays.map((d, di) => {
        const isToday = d.toDateString() === today.toDateString();
        const dayEvents = events.filter(e => e.day === di + 1);
        return (
          <div key={di} style={{ flex: 1, borderLeft: `1px solid ${C.border}`, position: 'relative' }}>
            {/* Header */}
            <div style={{ height: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 10.5, color: C.mut }}>{DAYS_SHORT[di]}</span>
              <span style={{ fontSize: 14, fontWeight: isToday ? 700 : 500, color: isToday ? 'var(--primary)' : C.pri }}>{d.getDate()}</span>
            </div>
            {/* Hour rows */}
            {HOURS.map((_, hi) => (
              <div key={hi} style={{ height: 56, borderBottom: `1px solid ${C.border}` }} />
            ))}
            {/* Events */}
            {dayEvents.map((ev) => (
              <div
                key={ev.id}
                className={`event-block ${ev.color}`}
                style={{
                  position: 'absolute',
                  top: 40 + (ev.hour - 8) * 56,
                  left: 4, right: 4,
                  height: Math.max(ev.duration * 56 - 6, 40), // ensure min height
                  zIndex: 2,
                  borderRadius: 'var(--radius-md)',
                  padding: '6px 8px',
                  background: ev.color === 'event-teal' ? 'var(--primary-light)' : '#f3e8ff',
                  borderLeft: `3px solid ${ev.color === 'event-teal' ? 'var(--primary)' : '#8b5cf6'}`,
                  color: ev.color === 'event-teal' ? 'var(--primary-dark)' : '#581c87',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 11, marginBottom: 2, letterSpacing: '-0.01em', lineHeight: 1.2 }}>{ev.title}</div>
                <div style={{ fontSize: 9.5, opacity: 0.8 }}>{ev.hour}AM</div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default function Sessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ mentorId: 'm1', menteeId: 'me1', topicId: '', title: '', date: '', duration: 60, notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('All');
  const [syllabus, setSyllabus] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await getSessions();
        if (res.data?.success) {
          setSessions(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load sessions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();

    if (user?.role !== 'mentee') {
      getSyllabus({ mentorId: user?.id || 'm1' }).then(r => {
        if (r.data?.data?.length > 0) setSyllabus(r.data.data[0]);
      }).catch(()=>{});
    }
  }, [user]);

  const base = user?.role === 'mentor' ? sessions.filter(s => s.mentorId === user.id)
    : user?.role === 'mentee' ? sessions.filter(s => s.menteeId === user.id)
    : sessions;
  const filtered = filter === 'All' ? base : base.filter(s => s.status === filter);
  const counts = { All: base.length, Upcoming: base.filter(s=>s.status==='Upcoming').length, Completed: base.filter(s=>s.status==='Completed').length, Cancelled: base.filter(s=>s.status==='Cancelled').length };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await createSession(form);
      setSessions(p => [...p, res.data?.data || { ...form, id: `s${Date.now()}`, status: 'Upcoming', feedback: null }]);
    } catch {
      setSessions(p => [...p, { ...form, id: `s${Date.now()}`, status: 'Upcoming', feedback: null }]);
    }
    setShowModal(false); setSubmitting(false);
    setForm({ mentorId:'m1', menteeId:'me1', topicId:'', title:'', date:'', duration:60, notes:'' });
  };

  const getMentor = id => mockMentors.find(m => m.id === id);
  const getMentee = id => mockMentees.find(m => m.id === id);

  // Calculate current week label
  const today = new Date();
  const mon = new Date(today); mon.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
  const weekLabel = `${mon.toLocaleDateString('en-US',{month:'short',day:'numeric'})} – ${sun.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}`;

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25,0.46,0.45,0.94] }}
        >
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>Sessions</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4, margin: 0 }}>Manage your mentoring schedule and upcoming sessions.</p>
        </motion.div>
        <div style={{ display: 'flex', gap: 12 }}>
           {user?.role !== 'mentee' && (
             <button className="btn" onClick={() => setShowModal(true)} style={{ background: 'var(--primary)', color: 'white', borderRadius: '12px' }}>
               <Plus size={14} /> Schedule Session
             </button>
           )}
        </div>
      </div>

      {/* Two-pane layout: left=calendar, right=mini-cal+filters */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20 }}>

        {/* LEFT — Week calendar view */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 620, borderRadius: 'var(--radius-xl)' }}>
          {/* Toolbar */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{ background:'none',border:'none',cursor:'pointer',padding:6,color:C.sec,borderRadius:8,transition:'background 200ms' }}><ChevronLeft size={16}/></button>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.pri, minWidth: 140, letterSpacing: '-0.01em' }}>{weekLabel}</div>
            <button style={{ background:'none',border:'none',cursor:'pointer',padding:6,color:C.sec,borderRadius:8,transition:'background 200ms' }}><ChevronRight size={16}/></button>
            <button className="btn btn-outline" style={{ fontSize: 12, padding: '6px 14px', borderRadius: '8px' }}>Week ▾</button>
            <button className="btn btn-outline" style={{ fontSize: 12, padding: '6px 14px', borderRadius: '8px' }}>Show today</button>
          </div>
          {/* Week grid */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <WeekView sessions={filtered} />
          </div>
        </div>

        {/* RIGHT panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Mini calendar */}
          <div className="card" style={{ borderRadius: 'var(--radius-xl)' }}>
            <MiniCal />
          </div>

          {/* Active programs filter */}
          <div className="card" style={{ borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: C.pri }}>Session status</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['All','Upcoming','Completed','Cancelled'].map(f => (
                <label key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '5px 0' }}>
                  <input type="radio" checked={filter === f} onChange={() => setFilter(f)} style={{ accentColor: 'var(--primary)' }} />
                  <span style={{ fontSize: 12.5, color: C.pri }}>{f}</span>
                  <span style={{ fontSize: 11, color: C.mut, marginLeft: 'auto' }}>({counts[f] || 0})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Session list */}
          <div className="card" style={{ flex: 1, maxHeight: 320, overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.pri, marginBottom: 12 }}>Upcoming list</div>
            <div style={{ overflowY: 'auto', maxHeight: 260 }}>
              {loading ? (
                <div style={{ padding: 20, textAlign: 'center', color: C.mut, fontSize: 12 }}>Loading sessions...</div>
              ) : filtered.length === 0 ? (
                <EmptyState 
                  icon="calendar" 
                  title="No sessions found" 
                  description="There are no scheduled sessions matching this criteria." 
                />
              ) : (
                filtered.slice(0, 6).map((s, i) => {
                  const cfg = statusCfg[s.status] || statusCfg.Upcoming;
                  const SIcon = cfg.icon;
                  return (
                    <motion.div key={s.id}
                      initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      whileHover={{ x: 2, background: 'var(--bg-light)' }}
                      style={{ display: 'flex', gap: 10, padding: '10px 8px', borderBottom: `1px solid ${C.border}`, borderRadius: 8, cursor: 'pointer' }}
                    >
                      <SIcon size={14} color={s.status==='Completed'?'var(--primary)':s.status==='Upcoming'?'#f59e0b':'#ef4444'} style={{ flexShrink:0, marginTop:1 }} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.pri, overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap', letterSpacing: '-0.01em' }}>{s.title}</div>
                        {s.topicId && <div style={{ fontSize: 10, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}><BookOpen size={10} /> Syllabus Topic</div>}
                        <div style={{ fontSize: 10.5, color: C.mut, marginTop: 2 }}>{s.date} · {s.duration}min</div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && createPortal(
        <AnimatePresence>
          <motion.div className="overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setShowModal(false)} style={{ zIndex: 9999 }}>
            <motion.div className="modal" initial={{scale:0.9,y:20}} animate={{scale:1,y:0}} exit={{scale:0.9}} onClick={e=>e.stopPropagation()} style={{ borderRadius: 'var(--radius-2xl)', maxWidth: 500 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
                <h3 style={{ fontSize:17, fontWeight:800, color:'var(--text-primary)', letterSpacing: '-0.02em' }}>Schedule New Session</h3>
                <button onClick={() => setShowModal(false)} style={{ background:'none',border:'none',cursor:'pointer',color:'#9ca3af' }}><X size={18}/></button>
              </div>
              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight: 600, color:'var(--text-secondary)', display:'block', marginBottom:5 }}>Session Title</label>
                  <input className="input" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Deep Learning Review" required style={{ borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight: 600, color:'var(--text-secondary)', display:'block', marginBottom:5 }}>Syllabus Topic (Optional)</label>
                  <select className="input" value={form.topicId} onChange={e=>setForm(p=>({...p,topicId:e.target.value}))} style={{ borderRadius: '8px' }}>
                    <option value="">-- Independent Session --</option>
                    {syllabus?.topics?.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                  </select>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div>
                    <label style={{ fontSize:12, fontWeight: 600, color:'var(--text-secondary)', display:'block', marginBottom:5 }}>Mentor</label>
                    <select className="input" value={form.mentorId} onChange={e=>setForm(p=>({...p,mentorId:e.target.value}))} style={{ borderRadius: '8px' }}>
                      {mockMentors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:12, fontWeight: 600, color:'var(--text-secondary)', display:'block', marginBottom:5 }}>Mentee</label>
                    <select className="input" value={form.menteeId} onChange={e=>setForm(p=>({...p,menteeId:e.target.value}))} style={{ borderRadius: '8px' }}>
                      {mockMentees.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:12, fontWeight: 600, color:'var(--text-secondary)', display:'block', marginBottom:5 }}>Date</label>
                    <input type="date" className="input" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} required style={{ borderRadius: '8px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize:12, fontWeight: 600, color:'var(--text-secondary)', display:'block', marginBottom:5 }}>Duration (min)</label>
                    <input type="number" className="input" value={form.duration} onChange={e=>setForm(p=>({...p,duration:+e.target.value}))} min={15} max={180} style={{ borderRadius: '8px' }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight: 600, color:'var(--text-secondary)', display:'block', marginBottom:5 }}>Notes</label>
                  <textarea className="input" value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} rows={3} placeholder="Session agenda..." style={{ resize:'vertical', borderRadius: '8px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                  <button type="submit" className="btn" disabled={submitting} style={{ background: 'var(--primary)', color: 'white', borderRadius: '10px' }}>
                    {submitting ? 'Scheduling...' : '+ Schedule Session'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </AnimatePresence>, document.body
      )}
    </div>
  );
}
