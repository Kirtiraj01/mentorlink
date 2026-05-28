import { motion } from 'framer-motion';

const cfg = {
  Light:      { color: '#15803d', bg: '#dcfce7', pct: 30 },
  Optimal:    { color: '#0d9488', bg: '#eefbf9', pct: 65 },
  Overloaded: { color: '#b91c1c', bg: '#fee2e2', pct: 95 },
};

export default function LoadIndicator({ load = 'Optimal', showBar, menteeCount }) {
  const c = cfg[load] || cfg.Optimal;
  return (
    <div>
      <span className="chip" style={{ background: c.bg, color: c.color }}>
        {load}
      </span>
      {showBar && (
        <div style={{ marginTop: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>Workload</span>
            {menteeCount !== undefined && (
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>{menteeCount} mentees</span>
            )}
          </div>
          <div style={{ background: '#f1f2f6', borderRadius: 99, height: 5, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${c.pct}%` }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ height: '100%', background: c.color, borderRadius: 99 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
