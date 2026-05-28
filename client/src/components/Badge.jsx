import { motion } from 'framer-motion';

const cfg = {
  'Top Mentor':    { chip: 'chip-amber', icon: '🏆' },
  'Consistent':    { chip: 'chip-teal',  icon: '🔥' },
  'Engaged':       { chip: 'chip-purple',icon: '⚡' },
  'Overachiever':  { chip: 'chip-pink',  icon: '🚀' },
  'Streak Master': { chip: 'chip-blue',  icon: '🎯' },
  'Fast Learner':  { chip: 'chip-green', icon: '📈' },
};

export default function Badge({ label }) {
  const c = cfg[label] || { chip: 'chip-gray', icon: '🏅' };
  return (
    <motion.span
      className={`chip ${c.chip}`}
      whileHover={{ scale: 1.06, y: -1 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.15 }}
      style={{ cursor: 'default' }}
    >
      <span style={{ fontSize: 10 }}>{c.icon}</span>
      {label}
    </motion.span>
  );
}
