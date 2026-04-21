import { motion, AnimatePresence } from 'motion/react';

/**
 * Reusable animated delete confirmation modal.
 * Props:
 *   open       — boolean
 *   onClose    — fn
 *   onConfirm  — async fn (handles the actual delete)
 *   title      — string  (e.g. "Delete Brand")
 *   message    — string  (e.g. '"Nike" will be permanently removed.')
 *   loading    — boolean
 */
export default function DeleteConfirmModal({ open, onClose, onConfirm, title = 'Confirm Delete', message = 'This action cannot be undone.', loading = false }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="del-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
            background: 'rgba(0,0,0,0.82)',
            backdropFilter: 'blur(18px)',
          }}
        >
          {/* Animated background orbs */}
          <motion.div
            animate={{ scale: [1, 1.18, 1], opacity: [0.06, 0.14, 0.06] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
              width: '520px', height: '260px',
              background: 'radial-gradient(ellipse, #ff3d10 0%, transparent 70%)',
              pointerEvents: 'none', borderRadius: '50%',
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.04, 0.09, 0.04] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            style={{
              position: 'absolute', bottom: '10%', right: '15%',
              width: '320px', height: '200px',
              background: 'radial-gradient(ellipse, #ff6b35 0%, transparent 70%)',
              pointerEvents: 'none', borderRadius: '50%',
            }}
          />

          {/* Floating particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -22, 0], opacity: [0.08, 0.35, 0.08], x: [0, i % 2 === 0 ? 12 : -12, 0] }}
              transition={{ duration: 3 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
              style={{
                position: 'absolute',
                left: `${12 + i * 18}%`, top: `${25 + (i % 3) * 20}%`,
                width: '4px', height: '4px',
                background: '#ff4500', borderRadius: '50%', pointerEvents: 'none',
              }}
            />
          ))}

          {/* Modal box */}
          <motion.div
            key="del-box"
            initial={{ opacity: 0, scale: 0.82, y: 52 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.82, y: 52 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'relative', zIndex: 1,
              width: '100%', maxWidth: '420px',
              background: 'linear-gradient(160deg,#0f0f0f 0%,#0a0a0a 100%)',
              border: '1px solid rgba(255,61,16,0.22)',
              borderRadius: '22px', overflow: 'hidden',
              boxShadow: '0 48px 96px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,61,16,0.08)',
            }}
          >
            {/* Top accent line */}
            <div style={{ height: '2px', background: 'linear-gradient(90deg,transparent,#ff3d10,transparent)' }} />

            {/* Body */}
            <div style={{ padding: '2rem 2rem 1.5rem', textAlign: 'center' }}>
              {/* Icon */}
              <motion.div
                animate={{ scale: [1, 1.12, 1], rotate: [0, -4, 4, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: '60px', height: '60px', borderRadius: '16px',
                  background: 'rgba(255,61,16,0.1)', border: '1px solid rgba(255,61,16,0.28)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.6rem', margin: '0 auto 1.25rem',
                  boxShadow: '0 0 28px rgba(255,61,16,0.18)',
                }}
              >🗑️</motion.div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#fff', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
                {title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.42)', margin: '0 0 0.35rem', lineHeight: 1.6 }}>
                {message}
              </p>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,61,16,0.65)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>
                This action cannot be undone
              </p>
            </div>

            {/* Footer */}
            <div style={{
              padding: '1rem 2rem 1.75rem',
              display: 'flex', gap: '0.75rem',
            }}>
              <motion.button
                whileHover={{ scale: 1.03, background: 'rgba(255,255,255,0.08)' }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                disabled={loading}
                style={{
                  flex: 1, padding: '0.8rem',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '11px', color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.85rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                }}
              >Cancel</motion.button>

              <motion.button
                whileHover={!loading ? { scale: 1.04, boxShadow: '0 10px 32px rgba(255,61,16,0.45)' } : {}}
                whileTap={!loading ? { scale: 0.96 } : {}}
                onClick={onConfirm}
                disabled={loading}
                style={{
                  flex: 1, padding: '0.8rem',
                  background: loading ? 'rgba(255,61,16,0.4)' : 'linear-gradient(135deg,#ff3d10 0%,#ff6b35 100%)',
                  border: 'none', borderRadius: '11px',
                  color: '#fff', fontSize: '0.85rem', fontWeight: 800,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                  boxShadow: loading ? 'none' : '0 4px 18px rgba(255,61,16,0.3)',
                  letterSpacing: '0.04em',
                }}
              >
                {loading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.85, repeat: Infinity, ease: 'linear' }}
                      style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }}
                    />
                    Deleting...
                  </>
                ) : (
                  <>🗑 Delete</>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
