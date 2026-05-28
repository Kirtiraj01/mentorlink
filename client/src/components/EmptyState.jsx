import { motion } from 'framer-motion';
import { SearchX, FolderOpen, CalendarX2 } from 'lucide-react';

const ICONS = {
  search: SearchX,
  folder: FolderOpen,
  calendar: CalendarX2
};

export default function EmptyState({ 
  icon = 'folder', 
  title = 'No items found', 
  description = 'There is nothing to display here right now.', 
  actionLabel, 
  onAction 
}) {
  const Icon = ICONS[icon] || ICONS.folder;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        background: '#fafbfc',
        border: '1px dashed #e2e8f0',
        borderRadius: 16,
        margin: '16px 0'
      }}
    >
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: '#f1f5f9', color: '#94a3b8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 16
      }}>
        <Icon size={28} strokeWidth={1.5} />
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e2139', marginBottom: 6 }}>{title}</h3>
      <p style={{ fontSize: 13, color: '#64748b', maxWidth: 300, lineHeight: 1.5, marginBottom: actionLabel ? 20 : 0 }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <motion.button
          whileHover={{ y: -1, boxShadow: '0 4px 12px rgba(20,184,166,0.15)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onAction}
          style={{
            background: '#14b8a6', color: 'white', border: 'none',
            padding: '8px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', transition: 'background 0.2s'
          }}
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}
