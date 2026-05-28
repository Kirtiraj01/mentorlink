import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, MessageSquare, Target, Star, Award } from 'lucide-react';

const iconMap = { calendar: Calendar, message: MessageSquare, target: Target, star: Star, award: Award };
const dotColor = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' };

export default function RecommendationPanel({ recommendations = [] }) {
  const navigate = useNavigate();

  const handleRecClick = (type) => {
    switch (type) {
      case 'schedule': navigate('/sessions'); break;
      case 'followup': navigate('/issues'); break;
      case 'goal': navigate('/mentees'); break;
      case 'feedback': navigate('/feedback'); break;
      case 'celebrate': navigate('/mentees'); break;
      default: navigate('/dashboard');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {recommendations.map((rec, i) => {
        const Icon = iconMap[rec.icon] || Star;
        const dot = dotColor[rec.priority] || dotColor.low;
        return (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ x: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            onClick={() => handleRecClick(rec.type)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px',
              border: '1px solid #e5e7eb',
              borderRadius: 12, background: 'white',
              cursor: 'pointer',
              transition: 'background 200ms',
            }}
          >
            {/* Priority dot */}
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0 }} />

            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: '#f7f8fb',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={15} color="#64748b" strokeWidth={1.8} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1e2139', marginBottom: 1, letterSpacing: '-0.01em' }}>
                {rec.menteeName}
              </div>
              <div style={{
                fontSize: 11.5, color: '#64748b', lineHeight: 1.4,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {rec.message}
              </div>
            </div>

            <motion.div
              whileHover={{ x: 2 }}
              transition={{ duration: 0.15 }}
            >
              <ArrowRight size={14} color="#b8c0cc" strokeWidth={1.5} />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
