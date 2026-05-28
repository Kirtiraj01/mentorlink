import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreHorizontal, Search, Filter, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockMentees } from '../data/mockData';
import { getUsers, createMentor } from '../api';
import LoadIndicator from '../components/LoadIndicator';
import Badge from '../components/Badge';
import ProgressRing from '../components/ProgressRing';
import EmptyState from '../components/EmptyState';

const programIcons = ['🛡️','📊','☕','💲','❤️','⭐'];
const C = { pri: 'var(--text-primary)', sec: 'var(--text-secondary)', mut: '#94a3b8', teal: 'var(--primary)', border: 'var(--border)', bgLight: 'var(--bg-light)' };

function MentorCard({ mentor, i }) {
  const mentees = mockMentees.filter(m => m.mentorId === mentor.id);
  const avgScore = mentees.length ? Math.round(mentees.reduce((s, m) => s + m.relationshipScore, 0) / mentees.length) : 0;

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
      style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-2xl)', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ height: 60, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <span style={{ fontSize: 24, position: 'relative', zIndex: 1, marginTop: 10 }}>{programIcons[i % 6]}</span>
        {mentor.load === 'Overloaded' && (
          <div style={{ position: 'absolute', top: 12, right: 12, background: '#fee2e2', color: '#dc2626', fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: '12px' }}>Overloaded</div>
        )}
      </div>
      <div style={{ padding: '20px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.pri, letterSpacing: '-0.01em' }}>{mentor.name}</div>
          <MoreHorizontal size={16} color={C.mut} style={{ cursor: 'pointer' }} />
        </div>
        <div style={{ fontSize: 12, color: C.sec, marginBottom: 12, lineHeight: 1.4 }}>
          {mentor.expertise.join(', ')}
        </div>
        
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
          {[{ label: 'Mentees', val: mentor.menteeCount }, { label: 'Sessions', val: mentor.sessions }, { label: 'Rating', val: `${mentor.rating}★` }].map(s => (
            <div key={s.label} style={{ textAlign: 'center', background: '#f8fafc', borderRadius: 8, padding: '8px 0', border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.pri }}>{s.val}</div>
              <div style={{ fontSize: 9.5, color: C.mut, fontWeight: 600, letterSpacing: '0.02em', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700 }}>{avgScore}% avg score</span>
          <span style={{ fontSize: 11, color: C.mut, fontWeight: 500 }}>📅 Joined {mentor.joinedDate?.split('-')[0] || '2024'}</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${(mentor.rating / 5) * 100}%`, background: 'var(--primary)' }} />
        </div>
        
        <div style={{ marginTop: 14 }}>
          <LoadIndicator load={mentor.load} />
        </div>
        
        {mentor.badges?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
            {mentor.badges.map(b => <Badge key={b} label={b} />)}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Mentors() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMentor, setNewMentor] = useState({ name: '', email: '', expertise: '', load: 'Optimal' });

  useEffect(() => {
    getUsers('mentor').then(res => {
      setMentors(res.data.data);
      setLoading(false);
    });
  }, []);

  const handleAddMentor = async (e) => {
    e.preventDefault();
    const data = {
      ...newMentor,
      expertise: newMentor.expertise.split(',').map(s => s.trim())
    };
    const res = await createMentor(data);
    if (res.data.success) {
      setMentors([...mentors, res.data.data]);
      setShowAddModal(false);
      setNewMentor({ name: '', email: '', expertise: '', load: 'Optimal' });
    }
  };

  const filtered = mentors.filter(m => {
    const s = m.name.toLowerCase().includes(search.toLowerCase()) || m.expertise.join(' ').toLowerCase().includes(search.toLowerCase());
    const f = filter === 'All' || m.load === filter;
    return s && f;
  });

  const counts = { All: mentors.length, Light: mentors.filter(m => m.load === 'Light').length, Optimal: mentors.filter(m => m.load === 'Optimal').length, Overloaded: mentors.filter(m => m.load === 'Overloaded').length };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: C.mut }}>Loading mentors...</div>;

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25,0.46,0.45,0.94] }}
        >
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>Mentors</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4, margin: 0 }}>Discover and manage programs with expert mentors.</p>
        </motion.div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn" onClick={() => setShowAddModal(true)} style={{ background: 'var(--primary)', color: 'white', borderRadius: '12px' }}>
            <Plus size={14} /> Add Mentor
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        {['All','Light','Optimal','Overloaded'].map(f => (
          <button key={f} className={`filter-pill${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            {f} <span style={{ fontSize: 11, opacity: 0.7 }}>{counts[f]}</span>
          </button>
        ))}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={14} color={C.mut} strokeWidth={2} style={{ position: 'absolute', left: 10 }} />
            <input className="input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search mentors..." style={{ paddingLeft: 30, width: 220, borderRadius: '12px', border: '1px solid var(--border)' }} />
          </div>
          <button className="btn btn-outline" style={{ transition: 'all 0.2s', borderRadius: '12px' }}><Filter size={14} /> Filter</button>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState 
          icon="search" 
          title="No mentors found" 
          description="We couldn't find any mentors matching your search or filter criteria. Try adjusting them." 
          actionLabel="Clear Filters"
          onAction={() => { setSearch(''); setFilter('All'); }}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {filtered.map((mentor, i) => <MentorCard key={mentor.id} mentor={mentor} i={i} />)}
        </div>
      )}

      {/* Add Mentor Modal */}
      {showAddModal && createPortal(
        <AnimatePresence>
          <div className="overlay" style={{ zIndex: 9999 }}>
            <motion.div className="modal" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} style={{ maxWidth: 480, borderRadius: 'var(--radius-2xl)' }}>
              <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                <X size={20} />
              </button>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 24, letterSpacing: '-0.02em' }}>Add New Mentor</h3>
              <form onSubmit={handleAddMentor} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>Full Name</label>
                  <input required className="input" style={{ width: '100%', borderRadius: '10px' }} placeholder="e.g. Dr. Jane Smith" value={newMentor.name} onChange={e => setNewMentor({...newMentor, name: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>Email Address</label>
                  <input required type="email" className="input" style={{ width: '100%', borderRadius: '10px' }} placeholder="jane.smith@mentorlink.io" value={newMentor.email} onChange={e => setNewMentor({...newMentor, email: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>Expertise (comma separated)</label>
                  <input required className="input" style={{ width: '100%', borderRadius: '10px' }} placeholder="e.g. React, UX Design, Leadership" value={newMentor.expertise} onChange={e => setNewMentor({...newMentor, expertise: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>Initial Load</label>
                  <select className="input" style={{ width: '100%', borderRadius: '10px' }} value={newMentor.load} onChange={e => setNewMentor({...newMentor, load: e.target.value})}>
                    <option>Light</option>
                    <option>Optimal</option>
                    <option>Overloaded</option>
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                  <button type="button" className="btn btn-outline" style={{ borderRadius: '10px' }} onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn" style={{ background: 'var(--primary)', color: 'white', borderRadius: '10px' }}>Create Mentor</button>
                </div>
              </form>
            </motion.div>
          </div>
        </AnimatePresence>, document.body
      )}
    </div>
  );
}
