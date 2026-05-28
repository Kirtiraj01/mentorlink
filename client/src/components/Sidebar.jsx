import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, GraduationCap, CalendarDays,
  BarChart2, MessageSquare, UserCircle, Hexagon, AlertCircle
} from 'lucide-react';

const navItems = [
  { path: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard',  roles: ['admin','mentor','mentee'] },
  { path: '/mentors',    icon: Users,            label: 'Mentors',    roles: ['admin'] },
  { path: '/mentees',    icon: GraduationCap,    label: 'Mentees',    roles: ['admin','mentor'] },
  { path: '/sessions',   icon: CalendarDays,     label: 'Scheduling', roles: ['admin','mentor','mentee'] },
  { path: '/progress',   icon: BarChart2,        label: 'Metrics',    roles: ['admin','mentor','mentee'] },
  { path: '/feedback',   icon: MessageSquare,    label: 'Journal',    roles: ['admin','mentor','mentee'] },
  { path: '/issues',     icon: AlertCircle,      label: 'Issues',     roles: ['admin','mentor','mentee'] },
  { path: '/profile',    icon: UserCircle,       label: 'Profile',    roles: ['admin','mentor','mentee'] },
];

const roleMeta = [
  { key: 'mentee', letter: 'L', label: 'Mentee View', color: '#059669', activeBg: '#ecfdf5' },
  { key: 'mentor', letter: 'S', label: 'Mentor View', color: '#7c3aed', activeBg: '#f3f0ff' },
  { key: 'admin',  letter: 'A', label: 'Admin View',  color: '#db2777', activeBg: '#fdf2f8' },
];

export default function Sidebar() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || 'admin';
  const visibleNav = navItems.filter(n => n.roles.includes(role));

  const switchRole = async (r) => { 
    try {
      let res;
      if (r === 'admin') res = await login('admin@mentorlink.io', 'password123');
      else if (r === 'mentor') res = await login('sarah.chen@mentorlink.io', 'password123');
      else if (r === 'mentee') res = await login('liam.foster@student.io', 'password123');
      
      if (res && !res.success) {
        alert("Switch Role Failed: " + res.message);
      } else {
        window.location.href = '/dashboard'; 
      }
    } catch (error) {
      alert("Error switching role: " + error.message);
    }
  };

  return (
    <motion.aside
      className="sidebar"
      initial={{ x: -224 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
    >
      {/* Logo */}
      <div className="sidebar-logo">
        <motion.div
          className="sidebar-logo-icon"
          style={{ background: '#3b82f6', boxShadow: 'none', borderRadius: '12px' }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.15 }}
        >
          <Hexagon size={24} color="#ffffff" fill="#ffffff" />
        </motion.div>
        <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em' }}>
          MentorLink
        </span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {visibleNav.map((item, i) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <item.icon size={17} strokeWidth={1.8} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* SWITCH ROLE SECTION */}
      <div style={{ padding: '24px 16px', borderTop: '1px solid #f1f5f9', marginTop: 'auto' }}>
        <div className="sidebar-view-as-label" style={{ marginBottom: 12, textAlign: 'left', paddingLeft: 4 }}>Switch Role</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {roleMeta.map(r => {
            const isActive = role === r.key;
            return (
              <motion.div
                key={r.key}
                className="role-pill"
                onClick={() => switchRole(r.key)}
                style={{ 
                  background: isActive ? 'var(--primary-light)' : 'transparent',
                  color: isActive ? 'var(--primary-dark)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--primary-mid)' : '1px solid transparent',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer'
                }}
                whileHover={{ background: isActive ? 'var(--primary-light)' : '#f8fafc' }}
                whileTap={{ scale: 0.98 }}
              >
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: isActive ? 'var(--primary)' : '#cbd5e1',
                  flexShrink: 0
                }} />
                <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 500 }}>
                  {r.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.aside>
  );
}
