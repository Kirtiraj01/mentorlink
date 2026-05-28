import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MoreHorizontal, AlertTriangle, CheckCircle, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUsers, createMentee } from '../api';
import ProgressRing from '../components/ProgressRing';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';

const programIcons = ['🛡️','📊','☕','💲','❤️','⭐','🌿','🔬'];
const C = { pri: 'var(--text-primary)', sec: 'var(--text-secondary)', mut: '#94a3b8', teal: 'var(--primary)', border: 'var(--border)', bgLight: 'var(--bg-light)' };

function MenteeCard({ mentee, i, mentor }) {
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
      style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-2xl)', display: 'flex', flexDirection: 'column' }}
    >
      {/* Thumbnail */}
      <div style={{ height: 60, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <span style={{ fontSize: 24, position: 'relative', zIndex: 1, marginTop: 10 }}>{programIcons[i % 8]}</span>
        {mentee.riskStatus === 'At Risk' && (
          <div style={{ position: 'absolute', top: 12, right: 12 }}>
            <span style={{ background: '#fef2f2', color: '#ef4444', padding: '4px 8px', borderRadius: '12px', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={10} /> At Risk</span>
          </div>
        )}
        {mentee.riskStatus === 'Healthy' && (
          <div style={{ position: 'absolute', top: 12, right: 12 }}>
            <span style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 8px', borderRadius: '12px', fontSize: 10, fontWeight: 700 }}>🟢 Healthy</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '20px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.pri, letterSpacing: '-0.01em' }}>{mentee.name}</div>
          <MoreHorizontal size={16} color={C.mut} style={{ cursor: 'pointer' }} />
        </div>
        <div style={{ fontSize: 12, color: C.sec, marginBottom: 12, lineHeight: 1.4, flex: 1 }}>{mentee.goal}</div>
        
        {mentor && (
          <div style={{ fontSize: 11.5, color: C.mut, marginBottom: 16 }}>
            Mentor: <span style={{ color: C.pri, fontWeight: 600 }}>{mentor.name}</span>
          </div>
        )}

        {/* Progress + score */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, background: '#f8fafc', padding: '12px', borderRadius: '12px' }}>
          <div style={{ flex: 1, marginRight: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700 }}>{mentee.progress}% completed</span>
              <span style={{ fontSize: 11, color: C.mut, fontWeight: 500 }}>📅 {mentee.sessions * 3} days</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${mentee.progress}%`, background: 'var(--primary)' }} />
            </div>
          </div>
          <ProgressRing score={mentee.relationshipScore} size={48} strokeWidth={4.5} />
        </div>

        {/* Last session */}
        <div style={{ fontSize: 11.5, color: C.mut, marginBottom: 12, fontWeight: 500 }}>
          Last session: <span style={{ color: C.sec }}>{mentee.lastSession}</span>
        </div>

        {/* Badges */}
        {mentee.badges.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {mentee.badges.map(b => <Badge key={b} label={b} />)}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Mentees() {
  const { user } = useAuth();
  const [mentees, setMentees] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMentee, setNewMentee] = useState({ name: '', email: '', goal: '', mentorId: '' });

  useEffect(() => {
    Promise.all([getUsers('mentee'), getUsers('mentor')]).then(([menteesRes, mentorsRes]) => {
      setMentees(menteesRes.data.data);
      setMentors(mentorsRes.data.data);
      if (mentorsRes.data.data.length > 0) {
        setNewMentee(prev => ({ ...prev, mentorId: mentorsRes.data.data[0].id }));
      }
      setLoading(false);
    });
  }, []);

  const handleAddMentee = async (e) => {
    e.preventDefault();
    const res = await createMentee(newMentee);
    if (res.data.success) {
      setMentees([...mentees, res.data.data]);
      setShowAddModal(false);
      setNewMentee({ name: '', email: '', goal: '', mentorId: mentors[0]?.id || '' });
    }
  };

  const base = user?.role === 'mentor'
    ? mentees.filter(m => m.mentorId === user.id)
    : mentees;

  const filtered = base.filter(m => {
    const s = m.name.toLowerCase().includes(search.toLowerCase()) || m.goal.toLowerCase().includes(search.toLowerCase());
    const f = filter === 'All' || m.riskStatus === filter;
    return s && f;
  });

  const counts = { All: base.length, Healthy: base.filter(m => m.riskStatus === 'Healthy').length, 'At Risk': base.filter(m => m.riskStatus === 'At Risk').length };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: C.mut }}>Loading mentees...</div>;

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25,0.46,0.45,0.94] }}
        >
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>Mentees</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4, margin: 0 }}>Track progress and manage your assigned students.</p>
        </motion.div>
        <div style={{ display: 'flex', gap: 12 }}>
          {user?.role === 'admin' && (
            <button className="btn" onClick={() => setShowAddModal(true)} style={{ background: 'var(--primary)', color: 'white', borderRadius: '12px' }}>
              <Plus size={14} /> Add Mentee
            </button>
          )}
        </div>
      </div>

      {/* Filters & Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        {['All','Healthy','At Risk'].map(f => (
          <button key={f} className={`filter-pill${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            {f} <span style={{ fontSize: 11, opacity: 0.7 }}>{counts[f]}</span>
          </button>
        ))}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={14} color={C.mut} strokeWidth={2} style={{ position: 'absolute', left: 10 }} />
            <input className="input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search mentees..." style={{ paddingLeft: 30, width: 220, borderRadius: '12px', border: '1px solid var(--border)' }} />
          </div>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState 
          icon="search" 
          title="No mentees found" 
          description="We couldn't find any mentees matching your search or filter criteria. Try adjusting them." 
          actionLabel="Clear Filters"
          onAction={() => { setSearch(''); setFilter('All'); }}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {filtered.map((m, i) => (
            <MenteeCard key={m.id} mentee={m} i={i} mentor={mentors.find(mt => mt.id === m.mentorId)} />
          ))}
        </div>
      )}

      {/* Add Mentee Modal */}
      {showAddModal && createPortal(
        <AnimatePresence>
          <div className="overlay" style={{ zIndex: 9999 }}>
            <motion.div className="modal" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} style={{ maxWidth: 480, borderRadius: 'var(--radius-2xl)' }}>
              <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                <X size={20} />
              </button>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 24, letterSpacing: '-0.02em' }}>Add New Mentee</h3>
              <form onSubmit={handleAddMentee} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>Full Name</label>
                  <input required className="input" style={{ width: '100%', borderRadius: '10px' }} placeholder="e.g. John Doe" value={newMentee.name} onChange={e => setNewMentee({...newMentee, name: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>Email Address</label>
                  <input required type="email" className="input" style={{ width: '100%', borderRadius: '10px' }} placeholder="john.doe@student.io" value={newMentee.email} onChange={e => setNewMentee({...newMentee, email: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>Primary Goal</label>
                  <input required className="input" style={{ width: '100%', borderRadius: '10px' }} placeholder="e.g. Prepare for mock interviews" value={newMentee.goal} onChange={e => setNewMentee({...newMentee, goal: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>Assign Mentor</label>
                  <select required className="input" style={{ width: '100%', borderRadius: '10px' }} value={newMentee.mentorId} onChange={e => setNewMentee({...newMentee, mentorId: e.target.value})}>
                    {mentors.map(mentor => (
                      <option key={mentor.id} value={mentor.id}>{mentor.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                  <button type="button" className="btn btn-outline" style={{ borderRadius: '10px' }} onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn" style={{ background: 'var(--primary)', color: 'white', borderRadius: '10px' }}>Create Mentee</button>
                </div>
              </form>
            </motion.div>
          </div>
        </AnimatePresence>, document.body
      )}
    </div>
  );
}
