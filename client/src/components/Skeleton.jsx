import { motion } from 'framer-motion';

export default function Skeleton({ width = '100%', height = 20, borderRadius = 8, style = {}, className = '' }) {
  return (
    <motion.div
      className={`skeleton-loader ${className}`}
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
        backgroundSize: '200% 100%',
        ...style
      }}
      animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
      transition={{ duration: 1.5, ease: 'linear', repeat: Infinity }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Skeleton width={40} height={40} borderRadius="50%" />
        <div>
          <Skeleton width={120} height={14} style={{ marginBottom: 6 }} />
          <Skeleton width={80} height={10} />
        </div>
      </div>
      <Skeleton width="100%" height={12} style={{ marginBottom: 8 }} />
      <Skeleton width="90%" height={12} style={{ marginBottom: 16 }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <Skeleton width={60} height={24} borderRadius={12} />
        <Skeleton width={60} height={24} borderRadius={12} />
      </div>
    </div>
  );
}
