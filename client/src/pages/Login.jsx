import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Zap, ArrowRight, Lock, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setLoading(true);
    setError('');
    const result = await login(demoEmail, 'password123');
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #f0fdf9 0%, #f7f5ff 40%, #eef6ff 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 32,
    }}>
      <motion.div
        initial={{ opacity:0, y:24 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration: 0.55, ease: [0.25,0.46,0.45,0.94] }}
        style={{ width:'100%', maxWidth:820 }}
      >
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:44 }}>
          <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:240,delay:0.2}}
            style={{ display:'inline-flex', alignItems:'center', gap:12, marginBottom:18 }}>
            <div style={{ width:48,height:48,borderRadius:14,background:'#1e2139',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 6px 24px rgba(28,31,60,0.2)' }}>
              <Zap size={24} color="#14b8a6" fill="#14b8a6" />
            </div>
            <div style={{ textAlign:'left' }}>
              <div style={{ fontSize:26,fontWeight:800,color:'#1e2139',letterSpacing:'-0.03em' }}>MentorLink</div>
              <div style={{ fontSize:12,color:'#94a3b8',fontWeight:500,letterSpacing:'0.01em' }}>AI-Powered Intelligence System</div>
            </div>
          </motion.div>

          <h2 style={{ fontSize:28,fontWeight:800,color:'#1e2139',marginBottom:10,letterSpacing:'-0.03em',lineHeight:1.2 }}>
            Welcome back to MentorLink
          </h2>
          <p style={{ color:'#64748b',fontSize:14,fontWeight:400 }}>
            Enter your credentials to access your dashboard
          </p>
        </div>

        {/* Login Form */}
        <div style={{ background: 'white', padding: 40, borderRadius: 24, boxShadow: '0 10px 40px rgba(0,0,0,0.08)', maxWidth: 420, margin: '0 auto' }}>
          {error && (
            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: 8, fontSize: 14, marginBottom: 20, textAlign: 'center', fontWeight: 500 }}>
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 8, fontWeight: 600 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  required 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. admin@mentorlink.io" 
                  style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 15, outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }} 
                />
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 8, fontWeight: 600 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  required 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="password123" 
                  style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 15, outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }} 
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading || !email || !password}
              style={{
                marginTop: 10,
                background: (email && password) ? '#14b8a6' : '#e2e8f0',
                color: (email && password) ? 'white' : '#94a3b8',
                border: 'none', borderRadius: 12,
                padding: '14px 20px', fontSize: 15, fontWeight: 700,
                cursor: (email && password) ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                transition: 'all 0.2s',
                boxShadow: (email && password) ? '0 4px 20px rgba(20, 184, 166, 0.4)' : 'none',
              }}
              whileHover={(email && password && !loading) ? { scale: 1.02, background: '#0d9488' } : {}}
              whileTap={(email && password && !loading) ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <>
                  <div style={{ width:16,height:16,border:'2.5px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} />
                  Signing in...
                </>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </motion.button>
          </form>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', marginBottom: 12, fontWeight: 500 }}>
              Or use a quick demo account
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              <button 
                onClick={(e) => { e.preventDefault(); handleQuickLogin('admin@mentorlink.io'); }}
                style={{ padding: '10px 4px', background: '#fdf2f8', color: '#db2777', border: '1px solid #fce7f3', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
                onMouseOver={e => e.currentTarget.style.background = '#fce7f3'}
                onMouseOut={e => e.currentTarget.style.background = '#fdf2f8'}
              >
                <span>👑</span> Admin
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); handleQuickLogin('sarah.chen@mentorlink.io'); }}
                style={{ padding: '10px 4px', background: '#f3f0ff', color: '#7c3aed', border: '1px solid #ede9fe', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
                onMouseOver={e => e.currentTarget.style.background = '#ede9fe'}
                onMouseOut={e => e.currentTarget.style.background = '#f3f0ff'}
              >
                <span>🧑‍🏫</span> Mentor
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); handleQuickLogin('liam.foster@student.io'); }}
                style={{ padding: '10px 4px', background: '#ecfdf5', color: '#059669', border: '1px solid #d1fae5', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
                onMouseOver={e => e.currentTarget.style.background = '#d1fae5'}
                onMouseOut={e => e.currentTarget.style.background = '#ecfdf5'}
              >
                <span>🎓</span> Mentee
              </button>
            </div>
            <div style={{ marginTop: 12, textAlign: 'center', fontSize: 11, color: '#cbd5e1' }}>Password for all: <strong style={{color:'#94a3b8'}}>password123</strong></div>
          </div>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </motion.div>
    </div>
  );
}
