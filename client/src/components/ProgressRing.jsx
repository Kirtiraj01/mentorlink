/* Animated SVG progress ring — premium polish */
import { motion } from 'framer-motion';

const getColor = s => s >= 70 ? '#14b8a6' : s >= 40 ? '#f59e0b' : '#ef4444';
const getTrack = s => s >= 70 ? '#eefbf9' : s >= 40 ? '#fef3c7' : '#fee2e2';

export default function ProgressRing({ score = 0, size = 100, strokeWidth = 8, label }) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = getColor(score);
  const track = getTrack(score);

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: 'relative', width: size, height: size,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={track} strokeWidth={strokeWidth}
        />
        {/* Fill */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{
          fontSize: size > 80 ? 20 : size > 50 ? 14 : 12,
          fontWeight: 800, color: '#1e2139',
          lineHeight: 1, letterSpacing: '-0.02em',
        }}>
          {score}
        </div>
        {(label || size > 70) && (
          <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 2, fontWeight: 500, letterSpacing: '0.02em' }}>
            {label || 'score'}
          </div>
        )}
      </div>
    </motion.div>
  );
}
