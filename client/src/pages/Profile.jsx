import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { mockMentors, mockMentees } from '../data/mockData';
import ProgressRing from '../components/ProgressRing';
import Badge from '../components/Badge';
import LoadIndicator from '../components/LoadIndicator';
import { Mail, Target } from 'lucide-react';

const C = { pri: '#1e2139', sec: '#64748b', mut: '#94a3b8', teal: '#14b8a6', border: '#f1f2f6', bgLight: '#fafbfd' };

export default function Profile() {
  const { user } = useAuth();
  const role = user?.role || 'admin';

  const profileData = role === 'mentor'
    ? mockMentors.find(m => m.id === user.id) || mockMentors[0]
    : role === 'mentee'
    ? mockMentees.find(m => m.id === user.id) || mockMentees[0]
    : null;

  const accentColor = role === 'admin' ? '#db2777' : role === 'mentor' ? '#7c3aed' : '#14b8a6';
  const accentBg    = role === 'admin' ? '#fce7f3' : role === 'mentor' ? '#ede9fe' : '#e8faf8';

  const stats = role === 'admin'
    ? [{ label:'Total Mentors', value:5 }, { label:'Total Mentees', value:8 }, { label:'Sessions', value:12 }, { label:'At Risk', value:2 }]
    : role === 'mentor'
    ? [{ label:'Sessions', value:profileData?.sessions }, { label:'Mentees', value:profileData?.menteeCount }, { label:'Rating', value:`${profileData?.rating}★` }, { label:'Load', value:profileData?.load }]
    : [{ label:'Sessions', value:profileData?.sessions }, { label:'Progress', value:`${profileData?.progress}%` }, { label:'Score', value:profileData?.relationshipScore }, { label:'Status', value:profileData?.riskStatus }];

  return (
    <div>
      {/* Profile header */}
      <motion.div className="card" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{ duration: 0.5, ease: [0.25,0.46,0.45,0.94] }}
        style={{ marginBottom:24, background:`linear-gradient(145deg, white 60%, ${accentBg} 100%)`, position:'relative', overflow:'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.03)' }}>
        <div style={{ position:'absolute', top:-30, right:-30, width:150, height:150, borderRadius:'50%', background:`${accentBg}`, opacity:0.6 }} />
        <div style={{ display:'flex', alignItems:'center', gap:20, position:'relative' }}>
          {/* Avatar */}
          <div style={{ width:76, height:76, borderRadius:20, background:accentBg, border:`2px solid white`, boxShadow: `0 4px 12px ${accentColor}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:800, color:accentColor, flexShrink:0 }}>
            {user?.avatar}
          </div>
          <div style={{ flex:1 }}>
            <h2 style={{ fontSize:22, fontWeight:800, color:C.pri, marginBottom:4, letterSpacing:'-0.02em' }}>{user?.name}</h2>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <span className="chip" style={{ background:accentBg, color:accentColor, fontWeight: 600 }}>{role.charAt(0).toUpperCase()+role.slice(1)} Account</span>
              <span className="chip chip-green" style={{ fontWeight: 600 }}>● Active</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12.5, color:C.sec, fontWeight: 500 }}>
              <Mail size={14}/> {user?.email}
            </div>
            {profileData?.bio && <p style={{ fontSize:13, color:C.sec, marginTop:8, maxWidth:480, lineHeight:1.5 }}>{profileData.bio}</p>}
          </div>
          {role !== 'admin' && (
            <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring', stiffness: 200, delay: 0.2}}>
              <ProgressRing score={profileData?.relationshipScore || (profileData?.rating*20) || 80} size={96} strokeWidth={8} />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        {stats.map((s, i) => (
          <motion.div key={s.label} className="card card-sm" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.07, duration:0.4}}
            whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
            style={{ textAlign:'center', borderTop:`3px solid ${accentColor}` }}>
            <div style={{ fontSize:26, fontWeight:800, color:C.pri, letterSpacing:'-0.02em' }}>{s.value}</div>
            <div style={{ fontSize:12, color:C.sec, marginTop:4, fontWeight: 500 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Detail cards */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <motion.div className="card" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.4, delay:0.3}}>
          <div style={{ fontSize:14, fontWeight:700, color:C.pri, marginBottom:16, letterSpacing:'-0.01em' }}>
            {role==='mentor' ? '🎓 Expertise Areas' : role==='mentee' ? '🎯 Current Goal' : '⚙️ System Access'}
          </div>
          {role==='mentor' && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {profileData?.expertise?.map(e => <motion.span whileHover={{scale:1.05}} key={e} className="chip chip-teal" style={{ fontSize:12.5, padding:'6px 14px' }}>{e}</motion.span>)}
            </div>
          )}
          {role==='mentee' && (
            <div style={{ background:C.bgLight, border:`1px solid ${C.border}`, borderRadius:12, padding:18 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                <Target size={18} color={accentColor}/>
                <span style={{ fontSize:13.5, fontWeight:600, color:C.pri }}>{profileData?.goal}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontSize:12, color:C.sec, fontWeight: 500 }}>Completion</span>
                <span style={{ fontSize:12, color:accentColor, fontWeight:700 }}>{profileData?.progress}%</span>
              </div>
              <div className="progress-bar-track" style={{ height:6 }}>
                <motion.div className="progress-bar-fill" initial={{width:0}} whileInView={{width:`${profileData?.progress}%`}} viewport={{once:true}} transition={{duration:1.2}} style={{ height:'100%', background: accentColor }} />
              </div>
            </div>
          )}
          {role==='admin' && (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {['Full Platform Access','Risk Detection System','User Management','Advanced Analytics','Smart Recommendations'].map(f => (
                <div key={f} style={{ display:'flex', alignItems:'center', gap:10, fontSize:13, color:C.pri, fontWeight: 500 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:accentColor }} />{f}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div className="card" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.4, delay:0.4}}>
          <div style={{ fontSize:14, fontWeight:700, color:C.pri, marginBottom:16, letterSpacing:'-0.01em' }}>🏅 Achievements</div>
          {(profileData?.badges||[]).length > 0 ? (
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {profileData.badges.map(b => <Badge key={b} label={b}/>)}
            </div>
          ) : (
            <div style={{ color:C.mut, fontSize:13, textAlign:'center', padding:'24px 0', fontWeight: 500 }}>
              No badges yet — keep engaging! 🚀
            </div>
          )}
          {role==='mentor' && profileData && (
            <div style={{ marginTop:24 }}>
              <div style={{ fontSize:13, fontWeight:600, color:C.sec, marginBottom:12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Workload</div>
              <LoadIndicator load={profileData.load} showBar menteeCount={profileData.menteeCount} />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
