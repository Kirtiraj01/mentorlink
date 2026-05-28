import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Settings, Bell, ChevronRight, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMenteeAlerts } from '../api';

export default function Navbar() {
  const { user } = useAuth();
  const [q, setQ] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user?.role === 'mentee') {
      getMenteeAlerts(user.id).then(r => {
        const unread = r.data?.data?.filter(a => !a.isRead).length || 0;
        setUnreadCount(unread);
      }).catch(() => {});
    }
  }, [user]);

  const initials = user?.avatar || 'ML';

  return (
    <motion.header
      className="topbar"
      style={{ borderBottom: 'none', background: 'transparent', padding: '20px 32px 0 32px', position: 'relative', zIndex: 30 }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Breadcrumbs - Reference Style */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 999, fontSize: 12.5, color: 'var(--text-secondary)', background: 'white', boxShadow: 'var(--shadow-xs)' }}>
         <span style={{ color: 'var(--text-muted)' }}>Workspace</span>
         <ChevronRight size={14} color="var(--text-faint)" />
         <span style={{ color: 'var(--text-muted)' }}>MentorLink</span>
         <ChevronRight size={14} color="var(--text-faint)" />
         <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Active</span>
      </div>

      {/* Right side controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 'auto' }}>
        {/* Search */}
        <div className="topbar-search" style={{ border: '1px solid var(--border)', background: 'white', boxShadow: 'var(--shadow-xs)', margin: 0 }}>
          <Search size={15} color="var(--text-muted)" strokeWidth={2} />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search..."
            style={{ color: 'var(--text-primary)' }}
          />
        </div>

        {/* Action Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 8 }}>
          <motion.button className="topbar-icon-btn" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
            <Bell size={18} strokeWidth={1.8} color="var(--text-secondary)" />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: 0, right: 0, background: 'var(--danger)', color: 'white', fontSize: 9, fontWeight: 800, padding: '0 4px', borderRadius: 10, border: '1.5px solid white' }}>
                {unreadCount}
              </span>
            )}
          </motion.button>
          
          <motion.button className="topbar-icon-btn" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
            <Sun size={18} strokeWidth={1.8} color="var(--text-secondary)" />
          </motion.button>

          <motion.button className="topbar-icon-btn" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
            <Settings size={18} strokeWidth={1.8} color="var(--text-secondary)" />
          </motion.button>
        </div>

        {/* Avatar */}
        <motion.div
          className="topbar-avatar"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, border: '1px solid var(--primary-mid)', cursor: 'pointer' }}
        >
          {initials}
        </motion.div>
      </div>
    </motion.header>
  );
}
