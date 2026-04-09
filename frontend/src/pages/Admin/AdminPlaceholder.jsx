import { motion } from 'motion/react';
import AdminLayout from './AdminLayout';

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 6 + 4,
  delay: Math.random() * 4,
}));

const GRID_LINES = Array.from({ length: 8 }, (_, i) => i);

export default function AdminPlaceholder({ title, icon, description }) {
  return (
    <AdminLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{ marginBottom: '2rem' }}
      >
        <h1 style={{
          fontSize: '1.4rem', fontWeight: 900, color: '#fff',
          marginBottom: '0.2rem', letterSpacing: '-0.02em',
        }}>
          {title}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>
          {description || 'Manage and review entries below.'}
        </p>
      </motion.div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.07)',
          minHeight: '480px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
        }}
      >
        {/* Animated grid background */}
        <div style={{
          position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
        }}>
          {/* Horizontal grid lines */}
          {GRID_LINES.map((i) => (
            <motion.div
              key={`h-${i}`}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.06, duration: 0.8, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: 0, right: 0,
                top: `${(i + 1) * 12}%`,
                height: '1px',
                background: 'rgba(255,255,255,0.03)',
                transformOrigin: 'left',
              }}
            />
          ))}
          {/* Vertical grid lines */}
          {GRID_LINES.map((i) => (
            <motion.div
              key={`v-${i}`}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.8, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: 0, bottom: 0,
                left: `${(i + 1) * 12}%`,
                width: '1px',
                background: 'rgba(255,255,255,0.03)',
                transformOrigin: 'top',
              }}
            />
          ))}

          {/* Big radial glow center */}
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.07, 0.14, 0.07],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '600px', height: '400px',
              background: 'radial-gradient(ellipse, #ff4500 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          />

          {/* Secondary glow top-right */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.04, 0.09, 0.04],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            style={{
              position: 'absolute',
              top: '-10%', right: '-5%',
              width: '350px', height: '350px',
              background: 'radial-gradient(circle, #ff6b35 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          />

          {/* Secondary glow bottom-left */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.03, 0.07, 0.03],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            style={{
              position: 'absolute',
              bottom: '-10%', left: '-5%',
              width: '300px', height: '300px',
              background: 'radial-gradient(circle, #ff4500 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          />

          {/* Floating particles */}
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              animate={{
                y: [0, -30, 0],
                x: [0, p.id % 2 === 0 ? 12 : -12, 0],
                opacity: [0.08, 0.35, 0.08],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: p.delay,
              }}
              style={{
                position: 'absolute',
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: '#ff4500',
                borderRadius: '50%',
              }}
            />
          ))}

          {/* Scanning line */}
          <motion.div
            animate={{ top: ['-2%', '102%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
            style={{
              position: 'absolute',
              left: 0, right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,69,0,0.5), transparent)',
              boxShadow: '0 0 12px rgba(255,69,0,0.4)',
            }}
          />
        </div>

        {/* Center content */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '3rem 2rem' }}>
          {/* Icon with orbit ring */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
            {/* Orbit ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '110px', height: '110px',
                border: '1px dashed rgba(255,69,0,0.3)',
                borderRadius: '50%',
              }}
            />
            {/* Orbit dot */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                top: '50%', left: '50%',
                width: '110px', height: '110px',
                marginTop: '-55px', marginLeft: '-55px',
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0, left: '50%',
                transform: 'translateX(-50%)',
                width: '7px', height: '7px',
                background: '#ff4500',
                borderRadius: '50%',
                boxShadow: '0 0 8px #ff4500',
              }} />
            </motion.div>

            {/* Icon box */}
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 0px rgba(255,69,0,0)',
                  '0 0 30px rgba(255,69,0,0.4)',
                  '0 0 0px rgba(255,69,0,0)',
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{
                width: '80px', height: '80px',
                background: 'rgba(255,69,0,0.1)',
                border: '1px solid rgba(255,69,0,0.35)',
                borderRadius: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.2rem',
              }}
            >
              <motion.span
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {icon}
              </motion.span>
            </motion.div>
          </div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            style={{
              fontSize: '1.5rem', fontWeight: 900, color: '#fff',
              letterSpacing: '-0.02em', marginBottom: '0.6rem',
            }}
          >
            {title}
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)',
              maxWidth: '340px', margin: '0 auto 2rem',
              lineHeight: 1.65,
            }}
          >
            This section is currently under construction.<br />
            Content and features will appear here soon.
          </motion.div>

          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                width: '7px', height: '7px',
                borderRadius: '50%',
                background: '#ff4500',
                boxShadow: '0 0 8px #ff4500',
              }}
            />
            <span style={{
              fontSize: '0.72rem', fontWeight: 800,
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>
              Coming Soon
            </span>
          </motion.div>

          {/* Animated progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{
              marginTop: '2.5rem',
              width: '260px',
              margin: '2.5rem auto 0',
            }}
          >
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginBottom: '0.4rem',
            }}>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Build Progress
              </span>
              <span style={{ fontSize: '0.65rem', color: '#ff4500', fontWeight: 700 }}>
                In Dev
              </span>
            </div>
            <div style={{
              height: '3px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '10px',
              overflow: 'hidden',
            }}>
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '45%' }}
                transition={{ delay: 0.9, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #ff4500, #ff6b35)',
                  borderRadius: '10px',
                  boxShadow: '0 0 8px rgba(255,69,0,0.5)',
                }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
