import { motion } from 'framer-motion';
import { ChevronDown, Download } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { mockMentees } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import Heatmap from '../components/Heatmap';

const heatData = Array.from({length:84}, (_,i) => ({
  date: new Date(Date.now() - (83-i)*86400000).toISOString().split('T')[0],
  count: Math.floor(Math.random() * 5)
}));

const C = { pri: '#1e2139', sec: '#64748b', mut: '#94a3b8', teal: '#14b8a6', border: '#f1f2f6', bgLight: '#fafbfd', green: '#15803d' };

const radarData = [
  { subject: 'Health & Body', A: 85 },
  { subject: 'Career & W', A: 22 },
  { subject: 'i Dev', A: 76 },
  { subject: 'Leisure', A: 43 },
  { subject: 'Finance', A: 14 },
  { subject: 'Friends & S', A: 58 },
  { subject: 'Relati', A: 48 },
  { subject: 'Emotional', A: 17 },
];

const topicList = [
  { n: 1, label: 'Health & Body',      pct: 85, color: '#22c55e' },
  { n: 2, label: 'Career & Work',      pct: 22, color: '#9ca3af' },
  { n: 3, label: 'Relationships',      pct: 48, color: '#9ca3af' },
  { n: 4, label: 'Friends & Social',   pct: 96, color: '#22c55e' },
  { n: 5, label: 'Finance',            pct: 14, color: '#9ca3af' },
  { n: 6, label: 'Leisure',            pct: 43, color: '#9ca3af' },
  { n: 7, label: 'Personal Dev',       pct: 76, color: '#22c55e' },
  { n: 8, label: 'Emotional',          pct: 17, color: '#9ca3af' },
];

const pieData = [
  { name: 'Financial growth',           value: 58, color: '#14b8a6' },
  { name: 'The path to confidence',     value: 21, color: '#c4b5fd' },
  { name: 'Leadership',                 value: 12, color: '#8b5cf6' },
  { name: 'Work-Life balance',          value: 9,  color: '#ddd6fe' },
];

const CustomTT = ({ active, payload }) => {
  if (!active||!payload?.length) return null;
  return <div className="custom-tt"><div>{payload[0].name}: <b>{payload[0].value}%</b></div></div>;
};

export default function Progress() {
  const { user } = useAuth();

  return (
    <div>
      {/* Title row */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <h2 style={{ fontSize:22, fontWeight:800, color:C.pri, letterSpacing:'-0.025em' }}>Statistics and achievements</h2>
        <div style={{ display:'flex', gap:10 }}>
          <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} className="btn btn-outline" style={{ fontSize:12.5, gap:6 }}>
            📅 November, 2024 <ChevronDown size={13}/>
          </motion.button>
          <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} className="btn btn-outline" style={{ fontSize:12.5, gap:6 }}>
            <Download size={13}/> Export <ChevronDown size={13}/>
          </motion.button>
        </div>
      </div>

      {/* 3-column grid matching reference */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:20 }}>

        {/* LEFT — Popular topics (Radar) */}
        <motion.div className="card" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration: 0.4, delay:0.1, ease: [0.25, 0.46, 0.45, 0.94]}}>
          <div style={{ fontWeight:700, fontSize:14, color:C.pri, marginBottom:4, letterSpacing:'-0.01em' }}>Popular topics for reflection</div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
              <PolarGrid stroke={C.border} />
              <PolarAngleAxis dataKey="subject" tick={{ fill:C.mut, fontSize:10 }} />
              <Radar dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} strokeWidth={1.5} />
            </RadarChart>
          </ResponsiveContainer>
          <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:8 }}>
            {topicList.map(t => (
              <div key={t.n} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:11.5, color:C.pri, minWidth:130, fontWeight: 500 }}>{t.n} {t.label}</span>
                <span style={{ fontSize:11.5, fontWeight:700, color:t.color, marginLeft:'auto' }}>{t.pct}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CENTER — Activity by programs (Donut) */}
        <motion.div className="card" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration: 0.4, delay:0.15, ease: [0.25, 0.46, 0.45, 0.94]}}>
          <div style={{ fontWeight:700, fontSize:14, color:C.pri, marginBottom:2, letterSpacing:'-0.01em' }}>Activity by programs</div>
          <div style={{ fontSize:11, color:C.green, marginBottom:12, fontWeight: 500 }}>↑ 3.0% vs last month</div>

          <div style={{ display:'flex', justifyContent:'center', marginBottom:12 }}>
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={54} outerRadius={82} paddingAngle={2} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTT />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ position:'relative', textAlign:'center', marginTop:-100, marginBottom:80 }}>
            <div style={{ fontSize:22, fontWeight:800, color:C.pri, letterSpacing: '-0.02em' }}>4</div>
            <div style={{ fontSize:11, color:C.mut }}>Active programs</div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {pieData.map(d => (
              <motion.div key={d.name} whileHover={{ x: 2 }} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:d.color, flexShrink:0 }} />
                <span style={{ fontSize:12, color:C.pri, flex:1, fontWeight: 500 }}>{d.name}</span>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:13, fontWeight:700, color:C.pri }}>{d.value}%</div>
                  <div style={{ fontSize:10, color:C.mut }}>{d.value > 50 ? 'Highest' : d.value > 20 ? 'Moderate' : d.value > 10 ? 'Low' : 'Minimal'} activity</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT — Reflection frequency (Heatmap) */}
        <motion.div className="card" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration: 0.4, delay:0.2, ease: [0.25, 0.46, 0.45, 0.94]}}>
          <div style={{ fontWeight:700, fontSize:14, color:C.pri, marginBottom:2, letterSpacing:'-0.01em' }}>Reflection frequency</div>
          <div style={{ fontSize:11, color:C.green, marginBottom:4, fontWeight: 500 }}>↑ 2.2% vs last month</div>
          <div style={{ marginBottom:16 }}>
            <span style={{ fontSize:32, fontWeight:800, color:C.pri, letterSpacing: '-0.02em' }}>62</span>
            <span style={{ fontSize:13, color:C.sec, marginLeft:8 }}>Number of reflections</span>
          </div>
          <Heatmap data={heatData} purple />
        </motion.div>
      </div>

      {/* Mentee progress cards (admin/mentor) */}
      {user?.role !== 'mentee' && (
        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:0.4, delay:0.25}} style={{ marginTop:24 }}>
          <div style={{ fontWeight:700, fontSize:15, color:C.pri, marginBottom:16, letterSpacing:'-0.01em' }}>Mentee Progress</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
            {mockMentees.map((m, i) => (
              <motion.div key={m.id} className="card card-sm" whileHover={{ y:-2, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.pri, marginBottom:2, letterSpacing: '-0.01em' }}>{m.name}</div>
                <div style={{ fontSize:11, color:C.mut, marginBottom:10 }}>{m.goal}</div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ fontSize:11.5, color:C.teal, fontWeight:600 }}>{m.progress}%</span>
                  <span className={`chip ${m.riskStatus==='At Risk' ? 'chip-red' : 'chip-teal'}`} style={{ fontSize:10 }}>
                    {m.riskStatus}
                  </span>
                </div>
                <div className="progress-bar-track">
                  <motion.div className="progress-bar-fill" initial={{width:0}} whileInView={{width:`${m.progress}%`}} viewport={{once:true}} transition={{duration:1, delay:i*0.06+0.1}} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
