import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MoreHorizontal, Plus, Send, Smile } from 'lucide-react';
import { getFeedbacks } from '../api';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';

/* ── Left panel — reflection history ────────────────── */
const reflections = [
  { id: 1, date: 'Today', title: 'New page', preview: '...', tags: [], active: true },
  { id: 2, date: 'Fri 29', title: 'From chaos to plan', preview: 'The time management assignment was a real eye-opener. Planning the day brings more...', tags: [{ label: 'Personal development', chip: 'chip-teal' }] },
  { id: 3, date: 'Wed 27', title: 'A challenge that changed my thinking', preview: 'During the last exercise, I realized how much my beliefs limit me.', tags: [{ label: 'Planning', chip: 'chip-purple' }, { label: 'Motivation', chip: 'chip-orange' }] },
  { id: 4, date: 'Nov 23', title: 'The power of support', preview: 'After the coaching chat, I realized how important the support of other people is...', tags: [{ label: 'Work-life balance', chip: 'chip-blue' }], extra: '+3' },
];

const C = { pri: 'var(--text-primary)', sec: 'var(--text-secondary)', mut: '#94a3b8', border: 'var(--border)', bgLight: 'var(--bg-light)', bgHover: '#f5f6f8' };

export default function Feedback() {
  const { user } = useAuth();
  const [selected, setSelected] = useState(reflections[0]);
  const [search, setSearch] = useState('');
  const [reply, setReply] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeedbacks().then(res => {
      let data = res.data?.data || [];
      if (user?.role === 'mentee') {
        data = data.filter(f => f.menteeId === user.id);
      } else if (user?.role === 'mentor') {
        data = data.filter(f => f.mentorId === user.id);
      }
      setFeedbacks(data);
      setLoading(false);
    });
  }, [user]);

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25,0.46,0.45,0.94] }}
        >
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>Journal & Feedback</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4, margin: 0 }}>Reflect on your progress and share feedback.</p>
        </motion.div>
      </div>

      <div style={{ display:'flex', gap:0, background:'white', borderRadius: 'var(--radius-2xl)', border:`1px solid ${C.border}`, overflow:'hidden', minHeight:620, boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        {/* ── LEFT PANEL ── */}
        <div style={{ width:320, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', flexShrink:0 }}>
          {/* Header */}
          <div style={{ padding:'20px 18px 14px', borderBottom:`1px solid ${C.border}` }}>
            <div style={{ fontSize:16, fontWeight:800, color:C.pri, marginBottom:16, letterSpacing:'-0.01em' }}>History of reflection</div>
            <div style={{ display:'flex', alignItems:'center', gap:8, background:C.bgLight, border:`1px solid ${C.border}`, borderRadius:10, padding:'8px 12px', transition:'all 200ms' }}>
              <Search size={14} color={C.mut} />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search" style={{ background:'none', border:'none', outline:'none', fontSize:13, color:C.pri, flex:1, fontFamily:'Inter,sans-serif' }} />
            </div>
          </div>

          {/* List */}
          <div style={{ flex:1, overflowY:'auto', padding:'12px 10px' }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.mut, padding:'8px 8px 6px', letterSpacing:'0.04em' }}>Last 7 days</div>
            {reflections.map(r => (
              <motion.div
                key={r.id}
                onClick={() => setSelected(r)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding:'14px 14px', borderRadius:12, cursor:'pointer', marginBottom:6,
                  border:`1.5px solid ${selected?.id===r.id ? 'var(--primary)' : 'transparent'}`,
                  background: selected?.id===r.id ? 'var(--primary-light)' : 'transparent',
                  transition:'background 0.15s, border-color 0.15s'
                }}
                onMouseEnter={e => !selected || selected.id !== r.id ? e.currentTarget.style.background = C.bgHover : null}
                onMouseLeave={e => !selected || selected.id !== r.id ? e.currentTarget.style.background = 'transparent' : null}
              >
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                  <span style={{ fontSize:11, color:C.mut, display:'flex', alignItems:'center', gap:5, fontWeight: 500 }}>
                    📅 {r.date}
                  </span>
                  <MoreHorizontal size={14} color={C.mut} />
                </div>
                <div style={{ fontSize:13.5, fontWeight:800, color:C.pri, marginBottom:r.preview !== '...' ? 4 : 0, letterSpacing:'-0.01em' }}>{r.title}</div>
                {r.preview !== '...' && (
                  <div style={{ fontSize:11.5, color:C.sec, lineHeight:1.5, marginBottom:r.tags?.length ? 10 : 0, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                    {r.preview}
                  </div>
                )}
                {r.tags?.length > 0 && (
                  <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                    {r.tags.map(t => <span key={t.label} className={`chip ${t.chip}`} style={{ fontSize:10 }}>{t.label}</span>)}
                    {r.extra && <span className="chip chip-gray" style={{ fontSize:10 }}>{r.extra}</span>}
                  </div>
                )}
              </motion.div>
            ))}

            <div style={{ fontSize:11, fontWeight:600, color:C.mut, padding:'16px 8px 6px', letterSpacing:'0.04em' }}>Last 30 days</div>
            {loading ? (
              <div style={{ padding: 12, textAlign: 'center', color: C.mut, fontSize: 12 }}>Loading...</div>
            ) : feedbacks.slice(0,2).map((fb, i) => (
              <motion.div key={fb.id} style={{ padding:'14px 14px', borderRadius:12, marginBottom:6, border:`1px solid ${C.border}`, cursor:'pointer' }}
                whileHover={{ scale: 1.01, background: C.bgHover }}
                whileTap={{ scale: 0.98 }}
              >
                <div style={{ fontSize:13, fontWeight:600, color:C.pri, marginBottom:4, letterSpacing:'-0.01em' }}>{fb.comment.slice(0,40)}...</div>
                <div style={{ fontSize:11.5, color:C.sec }}>{fb.menteeName} → {fb.mentorName}</div>
              </motion.div>
            ))}
          </div>

          {/* New button */}
          <div style={{ padding:'12px 12px', borderTop:'1px solid #e8eaed' }}>
            <button className="btn" style={{ width:'100%', justifyContent:'center', borderRadius:10, background: 'var(--primary)', color: 'white' }}>
              <Plus size={14} /> New reflection
            </button>
          </div>
        </div>

        {/* ── RIGHT PANEL — Editor / Comments ── */}
        <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
          {/* Editor toolbar */}
          <div style={{ padding:'20px 24px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontSize:20, fontWeight:800, color:C.pri, letterSpacing:'-0.02em' }}>{selected?.title || 'New page'}</div>
            </div>
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <span style={{ fontSize:11, color:C.mut, fontWeight: 500 }}>Edited {new Date().toLocaleDateString('en-US',{month:'short',day:'2-digit'})}</span>
              <button style={{ background:'none',border:'none',cursor:'pointer',color:C.sec }}><MoreHorizontal size={18}/></button>
            </div>
          </div>

          {/* Metadata */}
          <div style={{ padding:'20px 24px', borderBottom:`1px solid ${C.border}` }}>
            {[
              { icon:'⏰', label:'Created', val:'April 29, 2025 12:00AM' },
              { icon:'😊', label:'Emotional tone', val:'—' },
              { icon:'🏷️', label:'Tags', val:null },
            ].map(row => (
              <div key={row.label} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                <span style={{ fontSize:12.5, color:C.mut, minWidth: 140, fontWeight: 500 }}>{row.icon} {row.label}</span>
                {row.val !== null ? (
                  <span style={{ fontSize:13, color:C.pri, fontWeight: 500 }}>{row.val}</span>
                ) : (
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <input value={tagInput} onChange={e=>setTagInput(e.target.value)} placeholder="Add tag..." className="input" style={{ width:180, padding:'6px 12px', fontSize:12.5, borderRadius: '8px' }} />
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn" style={{ padding:'6px 16px', fontSize:12.5, borderRadius:8, background: 'var(--primary-dark)', color: 'white' }}>Add</motion.button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Comments/feedback area */}
          <div style={{ flex:1, padding:'24px 24px', overflowY:'auto' }}>
            <div style={{ fontSize:15, fontWeight:800, color:C.pri, marginBottom:6, letterSpacing:'-0.01em' }}>Comments & suggestions</div>
            <div style={{ fontSize:11, color:C.mut, marginBottom:20, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Today</div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 20, color: C.mut, fontSize: 13 }}>Loading comments...</div>
            ) : feedbacks.length === 0 ? (
              <EmptyState icon="message" title="No feedback yet" description="Feedback from your sessions will appear here." />
            ) : (
              feedbacks.slice(0, 3).map((fb, i) => (
                <motion.div key={fb.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.08, duration: 0.4, ease: [0.25,0.46,0.45,0.94]}}
                  style={{ marginBottom:24 }}>
                  <div style={{ display:'flex', gap:14 }}>
                    <div className="avatar" style={{ width:36,height:36,fontSize:13,background:'var(--primary-light)',color:'var(--primary-dark)',border:`1px solid ${C.border}`,flexShrink:0 }}>
                      {fb.menteeName?.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                        <span style={{ fontSize:13.5, fontWeight:800, color:C.pri, letterSpacing:'-0.01em' }}>{fb.menteeName}</span>
                        <span style={{ fontSize:11, color:C.mut, fontWeight: 500 }}>3 hours ago</span>
                      </div>
                      <div style={{ fontSize:11.5, color:C.mut, marginBottom:8 }}>
                        Task: {fb.sessionId}
                      </div>
                      <div style={{ fontSize:13, color:C.pri, lineHeight:1.6, background:C.bgLight, border:`1px solid ${C.border}`, borderRadius:12, padding:'14px 16px', marginBottom:8 }}>
                        {fb.comment}
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <span style={{ fontSize:12, color:'#f59e0b', letterSpacing: '2px' }}>{'★'.repeat(fb.rating)}</span>
                        <span className={`chip ${fb.sentiment==='positive'?'chip-green':fb.sentiment==='neutral'?'chip-amber':'chip-red'}`} style={{ fontSize:10 }}>
                          {fb.sentiment}
                        </span>
                      </div>
                      {/* Reply */}
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:12, borderTop:`1px solid ${C.border}`, paddingTop:12 }}>
                        <input placeholder="Reply..." style={{ flex:1, background:'none', border:'none', outline:'none', fontSize:13, color:C.pri, fontFamily:'Inter,sans-serif' }} />
                        <motion.button whileHover={{scale:1.1}} style={{ background:'none',border:'none',cursor:'pointer' }}><Smile size={16} color={C.mut} /></motion.button>
                        <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} style={{ width:32,height:32,borderRadius:'50%',background:'var(--primary)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>
                          <Send size={14} color="white" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Bottom input */}
          <div style={{ padding:'16px 24px', borderTop:`1px solid ${C.border}`, background:'white', display:'flex', alignItems:'center', gap:12 }}>
            <motion.button whileHover={{scale:1.1}} style={{ background:'none',border:'none',cursor:'pointer',color:C.mut,fontSize:18 }}>🎤</motion.button>
            <input value={reply} onChange={e=>setReply(e.target.value)} placeholder="Ask me anything..." style={{ flex:1,background:'none',border:'none',outline:'none',fontSize:13.5,color:C.pri,fontFamily:'Inter,sans-serif' }} />
            <motion.button whileHover={{scale:1.1}} style={{ background:'none',border:'none',cursor:'pointer',color:C.mut }}><Smile size={18}/></motion.button>
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} className="btn" style={{ background: 'var(--primary)', color: 'white', borderRadius:10, padding:'10px 20px', gap: 8 }}>
              <Send size={14}/> Send
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
