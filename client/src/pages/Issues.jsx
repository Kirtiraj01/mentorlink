import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getIssues, createIssue, addIssueReply, updateIssueStatus, getIssueAnalytics, getIssueNotifications, markIssueNotificationRead } from '../api';
import { AlertCircle, Plus, X, Send, Clock, Search, Bell } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CATEGORIES = ['Academic Doubt','Attendance Issue','Placement Guidance','Project Problem','Mental Stress','Hostel/College Issue','Other'];
const PRIORITIES = ['Low','Medium','High'];
const STATUSES  = ['Pending','In Progress','Resolved','Escalated'];
const C = { pri:'#0f172a',sec:'#475569',mut:'#94a3b8',teal:'#24997A',border:'#eaecf0' };
const PIE_COLORS = ['#ef4444','#f59e0b','#22c55e','#6366f1','#ec4899','#14b8a6','#f97316'];

const pColor  = p => p==='High'?'#ef4444':p==='Medium'?'#f59e0b':'#22c55e';
const sChip   = s => s==='Resolved'?'chip-green':s==='Escalated'?'chip-red':s==='In Progress'?'chip-amber':'chip-gray';
const timeAgo = d => { const h=Math.floor((Date.now()-new Date(d))/3600000); return h<1?'just now':h<24?h+'h ago':Math.floor(h/24)+'d ago'; };

/* ── Issue Card ── */
function IssueCard({ issue, onClick }) {
  return (
    <motion.div whileHover={{ y:-2, boxShadow:'0 8px 24px rgba(0,0,0,0.07)' }} onClick={()=>onClick(issue)}
      style={{ background:'white', border:'1px solid', borderColor:issue.priority==='High'&&issue.status==='Pending'?'#fecaca':C.border,
        borderLeft:'3px solid '+pColor(issue.priority), borderRadius:12, padding:'16px 20px', cursor:'pointer' }}>
      <div style={{ display:'flex', gap:6, marginBottom:8, flexWrap:'wrap' }}>
        <span className={'chip '+sChip(issue.status)} style={{ fontSize:10 }}>{issue.status}</span>
        <span style={{ fontSize:10, fontWeight:600, color:pColor(issue.priority), background:pColor(issue.priority)+'18', padding:'2px 8px', borderRadius:20 }}>{issue.priority}</span>
        <span className='chip chip-gray' style={{ fontSize:10 }}>{issue.category}</span>
        {issue.status==='Escalated' && <span style={{ fontSize:10, color:'#ef4444', fontWeight:700 }}>⚠ ESCALATED</span>}
      </div>
      <div style={{ fontSize:14, fontWeight:700, color:C.pri, marginBottom:4 }}>{issue.title}</div>
      <div style={{ fontSize:12, color:C.sec, lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{issue.description}</div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <div style={{ width:22, height:22, borderRadius:'50%', background:'#e8faf8', color:C.teal, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800 }}>{issue.menteeAvatar}</div>
          <span style={{ fontSize:11, color:C.sec }}>{issue.menteeName}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:11, color:C.mut }}><Clock size={10} style={{ display:'inline', marginRight:3 }}/>{timeAgo(issue.createdAt)}</span>
          {issue.replies.length>0 && <span style={{ fontSize:11, color:C.teal }}>{issue.replies.length} reply</span>}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Issue Detail Modal ── */
function IssueModal({ issue, onClose, user, onStatusChange, onReply }) {
  const [reply, setReply] = useState('');
  const [newStatus, setNewStatus] = useState(issue.status);
  const [saving, setSaving] = useState(false);

  const doReply = async () => {
    if (!reply.trim()) return;
    setSaving(true);
    await onReply(issue.id, reply);
    setReply('');
    setSaving(false);
  };

  return createPortal(
    <motion.div className='overlay' initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={onClose}>
      <motion.div initial={{ scale:0.95, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95 }} onClick={e=>e.stopPropagation()}
        style={{ background:'white', borderRadius:20, padding:28, width:'94%', maxWidth:640, maxHeight:'88vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
          <div>
            <div style={{ display:'flex', gap:8, marginBottom:8 }}>
              <span className={'chip '+sChip(issue.status)} style={{ fontSize:10 }}>{issue.status}</span>
              <span style={{ fontSize:10, fontWeight:600, color:pColor(issue.priority), background:pColor(issue.priority)+'18', padding:'2px 8px', borderRadius:20 }}>{issue.priority} Priority</span>
              <span className='chip chip-gray' style={{ fontSize:10 }}>{issue.category}</span>
            </div>
            <h3 style={{ fontSize:17, fontWeight:800, color:C.pri, margin:0 }}>{issue.title}</h3>
            <div style={{ fontSize:12, color:C.mut, marginTop:4 }}>{issue.menteeName} • {timeAgo(issue.createdAt)}</div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:C.mut }}><X size={18}/></button>
        </div>

        <div style={{ background:'#f8fafc', borderRadius:10, padding:'12px 16px', marginBottom:18, fontSize:13, color:C.sec, lineHeight:1.7 }}>{issue.description}</div>

        {issue.status==='Escalated' && (
          <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:10, padding:'10px 14px', marginBottom:18, fontSize:12, color:'#991b1b', fontWeight:500 }}>
            ⚠ Escalated to: {issue.escalatedTo} {issue.escalatedAt && '• '+timeAgo(issue.escalatedAt)}
          </div>
        )}

        {(user.role==='mentor'||user.role==='admin') && (
          <div style={{ display:'flex', gap:8, marginBottom:18 }}>
            <select value={newStatus} onChange={e=>setNewStatus(e.target.value)} className='input' style={{ flex:1 }}>
              {STATUSES.map(s=><option key={s}>{s}</option>)}
            </select>
            <button onClick={()=>onStatusChange(issue.id,newStatus)} className='btn btn-teal' style={{ padding:'8px 16px', fontSize:12 }}>Update</button>
          </div>
        )}

        {issue.replies.length>0 && (
          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.mut, marginBottom:10, textTransform:'uppercase', letterSpacing:'0.05em' }}>Replies ({issue.replies.length})</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {issue.replies.map(r=>(
                <div key={r.id} style={{ padding:'10px 14px', borderRadius:10, background:r.role==='mentor'?'#e8faf8':'#f8fafc', border:'1px solid', borderColor:r.role==='mentor'?'#ccf3ef':C.border }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                    <span style={{ fontSize:12, fontWeight:700, color:r.role==='mentor'?C.teal:C.pri }}>{r.by}</span>
                    <span style={{ fontSize:10, color:C.mut }}>{timeAgo(r.createdAt)}</span>
                  </div>
                  <div style={{ fontSize:13, color:C.sec }}>{r.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display:'flex', gap:8, marginBottom:20 }}>
          <textarea value={reply} onChange={e=>setReply(e.target.value)} className='input' rows={2}
            placeholder='Write a reply...' style={{ flex:1, resize:'none', fontSize:13 }} />
          <button onClick={doReply} disabled={saving||!reply.trim()} className='btn btn-teal' style={{ alignSelf:'flex-end', padding:'10px 14px' }}>
            <Send size={14}/>
          </button>
        </div>

        <div style={{ borderTop:'1px solid '+C.border, paddingTop:14 }}>
          <div style={{ fontSize:11, fontWeight:600, color:C.mut, marginBottom:10, textTransform:'uppercase', letterSpacing:'0.05em' }}>Timeline</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {issue.timeline.map((t,i)=>(
              <div key={i} style={{ display:'flex', gap:10 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:C.teal, flexShrink:0, marginTop:4 }}/>
                <div>
                  <div style={{ fontSize:12, color:C.pri, fontWeight:500 }}>{t.action}</div>
                  <div style={{ fontSize:11, color:C.mut }}>{t.by} • {timeAgo(t.at)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

/* ── Create Issue Modal ── */
function CreateModal({ onClose, user, onCreated }) {
  const [form, setForm] = useState({ title:'', description:'', category:'Academic Doubt', priority:'Medium' });
  const [saving, setSaving] = useState(false);
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const submit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await onCreated({ ...form, menteeId:user.id, menteeName:user.name,
        menteeAvatar:(user.avatar||user.name?.slice(0,2)||'??').toUpperCase(),
        mentorId:user.mentorId||'m1', mentorName:'Assigned Mentor' });
      onClose();
    } finally { setSaving(false); }
  };

  return createPortal(
    <motion.div className='overlay' initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={onClose}>
      <motion.div initial={{ scale:0.95, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95 }} onClick={e=>e.stopPropagation()}
        style={{ background:'white', borderRadius:20, padding:28, width:'94%', maxWidth:520, boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
          <h3 style={{ fontSize:17, fontWeight:800, color:C.pri, margin:0 }}>Report an Issue</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:C.mut }}><X size={18}/></button>
        </div>
        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <label style={{ fontSize:12, color:C.sec, display:'block', marginBottom:5, fontWeight:500 }}>Title *</label>
            <input className='input' required value={form.title} onChange={f('title')} placeholder='Brief summary of your issue...'/>
          </div>
          <div>
            <label style={{ fontSize:12, color:C.sec, display:'block', marginBottom:5, fontWeight:500 }}>Description *</label>
            <textarea className='input' required rows={3} value={form.description} onChange={f('description')}
              placeholder='Describe in detail what the issue is...' style={{ resize:'vertical' }}/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={{ fontSize:12, color:C.sec, display:'block', marginBottom:5, fontWeight:500 }}>Category *</label>
              <select className='input' value={form.category} onChange={f('category')}>
                {CATEGORIES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:12, color:C.sec, display:'block', marginBottom:5, fontWeight:500 }}>Priority *</label>
              <select className='input' value={form.priority} onChange={f('priority')}>
                {PRIORITIES.map(p=><option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div style={{ background:'#fff7ed', border:'1px solid #fed7aa', borderRadius:10, padding:'10px 14px', fontSize:12, color:'#92400e' }}>
            ⏰ Auto-escalation thresholds — High: 24h • Medium: 48h • Low: 72h (no mentor response)
          </div>
          <button type='submit' disabled={saving} className='btn btn-teal' style={{ justifyContent:'center', marginTop:4 }}>
            {saving ? 'Submitting...' : 'Submit Issue'}
          </button>
        </form>
      </motion.div>
    </motion.div>,
    document.body
  );
}

/* ── Admin Analytics ── */
function Analytics({ data }) {
  if (!data) return <div style={{ textAlign:'center', padding:40, color:C.mut }}>Loading...</div>;
  const { total,pending,inProgress,resolved,escalated,avgResponseHours,mostCommonCategory,categoryBreakdown,statusTrend } = data;
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14, marginBottom:24 }}>
        {[{l:'Total',v:total,c:'#6366f1'},{l:'Pending',v:pending,c:'#f59e0b'},{l:'In Progress',v:inProgress,c:'#3b82f6'},{l:'Resolved',v:resolved,c:'#22c55e'},{l:'Escalated',v:escalated,c:'#ef4444'}].map(s=>(
          <div key={s.l} style={{ background:'white', border:'1px solid '+C.border, borderTop:'2px solid '+s.c, borderRadius:12, padding:'16px 18px' }}>
            <div style={{ fontSize:11, color:C.sec, marginBottom:6 }}>{s.l} Issues</div>
            <div style={{ fontSize:28, fontWeight:800, color:C.pri }}>{s.v}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, marginBottom:22 }}>
        <div className='card'><div style={{ fontSize:12, color:C.sec, marginBottom:6 }}>Avg Response Time</div><div style={{ fontSize:30, fontWeight:800, color:C.teal }}>{avgResponseHours}h</div></div>
        <div className='card'><div style={{ fontSize:12, color:C.sec, marginBottom:6 }}>Top Category</div><div style={{ fontSize:14, fontWeight:700, color:'#6366f1', marginTop:8 }}>{mostCommonCategory}</div></div>
        <div className='card'><div style={{ fontSize:12, color:C.sec, marginBottom:6 }}>Escalation Rate</div><div style={{ fontSize:30, fontWeight:800, color:'#ef4444' }}>{total>0?Math.round(escalated/total*100):0}%</div></div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <div className='card'>
          <div style={{ fontSize:13, fontWeight:700, color:C.pri, marginBottom:14 }}>Issues by Category</div>
          <ResponsiveContainer width='100%' height={180}>
            <BarChart data={categoryBreakdown} layout='vertical' barSize={12}>
              <XAxis type='number' hide/><YAxis type='category' dataKey='name' tick={{ fontSize:11, fill:C.sec }} width={130}/>
              <Tooltip contentStyle={{ borderRadius:8, fontSize:12 }}/>
              <Bar dataKey='count' radius={[0,4,4,0]}>{(categoryBreakdown||[]).map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className='card'>
          <div style={{ fontSize:13, fontWeight:700, color:C.pri, marginBottom:14 }}>Weekly Trend</div>
          <ResponsiveContainer width='100%' height={180}>
            <BarChart data={statusTrend} barSize={12} barGap={4}>
              <XAxis dataKey='day' tick={{ fontSize:11, fill:C.mut }} axisLine={false} tickLine={false}/><YAxis hide/>
              <Tooltip contentStyle={{ borderRadius:8, fontSize:12 }}/>
              <Bar dataKey='created' name='Created' fill='#e0e7ff' radius={[3,3,0,0]}/>
              <Bar dataKey='resolved' name='Resolved' fill={C.teal} radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function Issues() {
  const { user } = useAuth();
  const role = user?.role || 'mentee';
  const [issues, setIssues] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [activeTab, setActiveTab] = useState(role==='admin'?'analytics':'issues');
  const [loading, setLoading] = useState(true);

  const params = role==='mentee'?{ menteeId:user.id }:role==='mentor'?{ mentorId:user.id }:{};

  const fetchAll = async () => {
    try { const r = await getIssues(params); setIssues(r.data?.data||[]); } catch { setIssues([]); }
    try { const r = await getIssueNotifications(user.id); setNotifications(r.data?.data||[]); } catch {}
    if (role==='admin') { try { const r = await getIssueAnalytics(); setAnalytics(r.data?.data); } catch {} }
  };

  useEffect(() => { setLoading(true); fetchAll().finally(()=>setLoading(false)); const iv=setInterval(fetchAll,15000); return ()=>clearInterval(iv); }, [user.id]);

  const handleCreate  = async data => { try { await createIssue(data); await fetchAll(); } catch {} };

  const handleReply = async (id, text) => {
    try {
      await addIssueReply(id, { text, by:user.name, role, userId:user.id });
      await fetchAll();
      const upd = (await getIssues(params)).data?.data||[];
      setIssues(upd); setSelected(upd.find(i=>i.id===id)||null);
    } catch {}
  };

  const handleStatus = async (id, status) => {
    try {
      await updateIssueStatus(id, status, user.name);
      await fetchAll();
      const upd = (await getIssues(params)).data?.data||[];
      setIssues(upd); setSelected(upd.find(i=>i.id===id)||null);
    } catch {}
  };

  const markRead = async id => { try { await markIssueNotificationRead(id); await fetchAll(); } catch {} };
  const unread = notifications.filter(n=>!n.isRead).length;

  const filtered = issues.filter(i => {
    const ms = !search || i.title.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase());
    return ms && (filterStatus==='All'||i.status===filterStatus) && (filterPriority==='All'||i.priority===filterPriority);
  });

  const tabs = role==='admin' ? ['analytics','issues','notifications'] : ['issues','notifications'];

  return (
    <div className='page-content page-enter'>
      {/* Page Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:32 }}>
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25,0.46,0.45,0.94] }}
        >
          <h1 style={{ fontSize:24, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.02em', margin:0 }}>
            {role==='mentee'?'My Issues':role==='mentor'?'Student Issues':'Issue Management'}
          </h1>
          <p style={{ fontSize:14, color:'var(--text-secondary)', marginTop:4, margin:0 }}>
            {role==='mentee'?'Report problems · track resolution status':role==='mentor'?'Manage and resolve student grievances':'Monitor, analyze and oversee all platform issues'}
          </p>
        </motion.div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          {unread>0 && (
            <button onClick={()=>setActiveTab('notifications')} style={{ position:'relative', background:'none', border:'none', cursor:'pointer', padding:8 }}>
              <Bell size={20} color={C.sec}/>
              <span style={{ position:'absolute', top:2, right:2, background:'#ef4444', color:'white', fontSize:9, fontWeight:700, padding:'1px 4px', borderRadius:10, minWidth:16, textAlign:'center' }}>{unread}</span>
            </button>
          )}
          {role==='mentee' && <button className='btn' style={{ background: 'var(--primary)', color: 'white', borderRadius: '12px' }} onClick={()=>setShowCreate(true)}><Plus size={15}/> Report Issue</button>}
        </div>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:22, flexWrap:'wrap' }}>
        {tabs.map(t=>(
          <button key={t} onClick={()=>setActiveTab(t)} className={'filter-pill'+(activeTab===t?' active':'')}
            style={{ textTransform:'capitalize', position:'relative' }}>
            {t}
            {t==='notifications'&&unread>0 && <span style={{ position:'absolute', top:-4, right:-4, background:'#ef4444', color:'white', fontSize:9, fontWeight:700, padding:'1px 4px', borderRadius:10 }}>{unread}</span>}
          </button>
        ))}
      </div>

      {activeTab==='analytics' && <Analytics data={analytics}/>}

      {activeTab==='notifications' && (
        <div className='card' style={{ maxWidth:580 }}>
          <div style={{ fontSize:14, fontWeight:700, color:C.pri, marginBottom:14 }}>Notifications</div>
          {notifications.length===0
            ? <div style={{ textAlign:'center', padding:24, color:C.mut, fontSize:13 }}>No notifications yet.</div>
            : notifications.map(n=>(
              <div key={n.id} style={{ padding:'12px 0', borderBottom:'1px solid '+C.border, display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
                <div>
                  <div style={{ fontSize:13, color:n.isRead?C.sec:C.pri, fontWeight:n.isRead?400:600 }}>{n.message}</div>
                  <div style={{ fontSize:11, color:C.mut, marginTop:2 }}>{timeAgo(n.createdAt)}</div>
                </div>
                {!n.isRead && (
                  <button onClick={()=>markRead(n.id)} style={{ fontSize:10, padding:'3px 8px', borderRadius:6, border:'1px solid '+C.border, background:'white', cursor:'pointer', flexShrink:0 }}>✓</button>
                )}
              </div>
            ))
          }
        </div>
      )}

      {activeTab==='issues' && (
        <>
          <div style={{ display:'flex', gap:10, marginBottom:18, flexWrap:'wrap', alignItems:'center' }}>
            <div className='topbar-search' style={{ flex:'1 1 200px', maxWidth:340, margin:0 }}>
              <Search size={14} color={C.mut}/>
              <input placeholder='Search issues...' value={search} onChange={e=>setSearch(e.target.value)}
                style={{ background:'none', border:'none', outline:'none', fontSize:13, width:'100%' }}/>
            </div>
            {['All',...STATUSES].map(s=>(
              <button key={s} onClick={()=>setFilterStatus(s)} className={'filter-pill'+(filterStatus===s?' active':'')} style={{ fontSize:12 }}>{s}</button>
            ))}
            <select value={filterPriority} onChange={e=>setFilterPriority(e.target.value)} className='input' style={{ width:'auto', fontSize:12, padding:'6px 12px' }}>
              <option value='All'>All Priority</option>
              {PRIORITIES.map(p=><option key={p}>{p}</option>)}
            </select>
          </div>

          {loading
            ? <div style={{ textAlign:'center', padding:40, color:C.mut }}>Loading issues...</div>
            : filtered.length===0
            ? (
              <div style={{ textAlign:'center', padding:'60px 24px' }}>
                <AlertCircle size={40} color={C.mut} style={{ margin:'0 auto 12px', display:'block' }}/>
                <div style={{ fontSize:15, fontWeight:600, color:C.sec, marginBottom:6 }}>No issues found</div>
                <div style={{ fontSize:13, color:C.mut }}>
                  {role==='mentee' ? "You haven't reported any issues yet." : 'No issues match your current filters.'}
                </div>
                {role==='mentee' && <button className='btn btn-teal' style={{ marginTop:16 }} onClick={()=>setShowCreate(true)}><Plus size={14}/> Report Issue</button>}
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:14 }}>
                {filtered.map(issue=><IssueCard key={issue.id} issue={issue} onClick={setSelected}/>)}
              </div>
            )
          }
        </>
      )}

      <AnimatePresence>
        {selected && (
          <IssueModal issue={selected} onClose={()=>setSelected(null)} user={user}
            onStatusChange={handleStatus} onReply={handleReply}/>
        )}
        {showCreate && <CreateModal onClose={()=>setShowCreate(false)} user={user} onCreated={handleCreate}/>}
      </AnimatePresence>
    </div>
  );
}
