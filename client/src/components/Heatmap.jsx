import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WEEKS = 12, DAYS = 7;
const DAY_LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function Heatmap({ data = [] }) {
  const [tip, setTip] = useState(null);
  const cells = [...Array(WEEKS * DAYS)].map((_, i) => data[i] || { date: '', count: 0 });

  const getClass = c => {
    if (c === 0) return 'heat-0';
    if (c === 1) return 'heat-1';
    if (c === 2) return 'heat-2';
    if (c === 3) return 'heat-3';
    return 'heat-4';
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
        {/* Day labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 0 }}>
          {DAY_LABELS.map((d, i) => (
            <div key={d} style={{
              height: 12, fontSize: 9, color: '#b8c0cc', fontWeight: 500,
              display: 'flex', alignItems: 'center', marginBottom: 3,
            }}>
              {i % 2 === 0 ? d : ''}
            </div>
          ))}
        </div>
        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${WEEKS}, 12px)`,
          gridTemplateRows: `repeat(${DAYS}, 12px)`,
          gap: 3,
        }}>
          {cells.map((cell, idx) => (
            <motion.div
              key={idx}
              className={`heat-cell ${getClass(cell.count)}`}
              whileHover={{ scale: 1.4 }}
              transition={{ duration: 0.12 }}
              onMouseEnter={e => setTip({ x: e.clientX, y: e.clientY, date: cell.date, count: cell.count })}
              onMouseLeave={() => setTip(null)}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 12, justifyContent: 'flex-end' }}>
        <span style={{ fontSize: 10, color: '#b8c0cc', fontWeight: 500 }}>Less</span>
        {[0,1,2,3,4].map(l => (
          <div key={l} className={`heat-cell heat-${l}`} style={{ width: 10, height: 10 }} />
        ))}
        <span style={{ fontSize: 10, color: '#b8c0cc', fontWeight: 500 }}>More</span>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'fixed', top: tip.y - 48, left: tip.x - 34,
              background: '#1e2139', color: 'white',
              borderRadius: 10, padding: '6px 10px', fontSize: 11,
              pointerEvents: 'none', zIndex: 200, whiteSpace: 'nowrap',
              boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
              lineHeight: 1.5,
            }}
          >
            <div style={{ fontWeight: 400 }}>{tip.date || '—'}</div>
            <div style={{ color: '#5eead4', fontWeight: 600 }}>{tip.count} activities</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
