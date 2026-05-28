import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const accentMap = {
  teal: { color: '#14b8a6', bg: '#f0fdf4', border: '#ccfbf1', glow: 'rgba(20,184,166,0.1)', top: '#14b8a6' },
  purple: { color: '#8b5cf6', bg: '#f5f3ff', border: '#ede9fe', glow: 'rgba(139,92,246,0.1)', top: '#8b5cf6' },
  blue: { color: '#3b82f6', bg: '#eff6ff', border: '#dbeafe', glow: 'rgba(59,130,246,0.1)', top: '#3b82f6' },
  pink: { color: '#ec4899', bg: '#fdf2f8', border: '#fce7f3', glow: 'rgba(236,72,153,0.1)', top: '#ec4899' },
  amber: { color: '#f59e0b', bg: '#fffbeb', border: '#fef3c7', glow: 'rgba(245,158,11,0.1)', top: '#f59e0b' },
};

export default function StatCard({ title, value, subtitle, icon: Icon, accent = 'teal', trend, delay = 0 }) {
  const cfg = accentMap[accent] || accentMap.teal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      style={{
        background: 'white',
        border: `1px solid #f1f2f6`,
        borderTop: `2px solid ${cfg.top}`,
        borderRadius: 16,
        padding: '20px 24px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 4px 12px rgba(0,0,0,0.03)`,
        transition: 'all 0.2s ease',
        cursor: 'default'
      }}
      whileHover={{ y: -2, boxShadow: `0 8px 30px ${cfg.glow}` }}
    >
      {/* Background decoration */}
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: cfg.bg, filter: 'blur(20px)'
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
        <div>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500, marginBottom: 8, letterSpacing: '0.02em' }}>{title}</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#1e2139', lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
          {subtitle && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>{subtitle}</div>}
          {trend !== undefined && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
              {trend >= 0
                ? <TrendingUp size={13} color="#22c55e" />
                : <TrendingDown size={13} color="#ef4444" />}
              <span style={{ fontSize: 12, color: trend >= 0 ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                {Math.abs(trend)}% vs last month
              </span>
            </div>
          )}
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: cfg.bg, border: `1px solid ${cfg.color}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0
        }}>
          <Icon size={20} color={cfg.color} />
        </div>
      </div>
    </motion.div>
  );
}
