// Premium Admin Design System for YBEX
// Shared design tokens, animations, and utilities

import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════

export const TOKENS = {
  // Colors
  bg: '#050505',
  bgElevated: '#0a0a0a',
  bgCard: 'rgba(255,255,255,0.03)',
  bgCardHover: 'rgba(255,255,255,0.05)',
  
  accent: '#E4F141',      // Yellow/Lime
  accentOrange: '#FF3D10', // Orange/Red
  accentBlue: '#3b82f6',
  accentGreen: '#22c55e',
  accentPurple: '#a855f7',
  
  text: '#ffffff',
  textMuted: 'rgba(255,255,255,0.65)',
  textDimmed: 'rgba(255,255,255,0.45)',
  textSubtle: 'rgba(255,255,255,0.25)',
  
  border: 'rgba(255,255,255,0.06)',
  borderHover: 'rgba(255,255,255,0.12)',
  borderAccent: 'rgba(228,241,65,0.3)',
  
  // Gradients
  gradientPrimary: 'linear-gradient(135deg, #FF3D10 0%, #E4F141 100%)',
  gradientCard: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
  gradientGlow: (color) => `radial-gradient(circle at 50% 0%, ${color}15 0%, transparent 50%)`,
  
  // Shadows
  shadowSm: '0 2px 8px rgba(0,0,0,0.3)',
  shadowMd: '0 4px 20px rgba(0,0,0,0.4)',
  shadowLg: '0 8px 40px rgba(0,0,0,0.5)',
  shadowGlow: (color) => `0 0 30px ${color}30`,
  
  // Spacing
  space: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  
  // Border Radius
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    full: '9999px',
  },
  
  // Typography
  font: {
    sans: "'Inter', system-ui, -apple-system, sans-serif",
    display: "'Space Grotesk', 'Inter', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  
  // Transitions
  transition: {
    fast: '0.15s cubic-bezier(0.22, 1, 0.36, 1)',
    normal: '0.25s cubic-bezier(0.22, 1, 0.36, 1)',
    slow: '0.4s cubic-bezier(0.22, 1, 0.36, 1)',
    spring: { type: 'spring', stiffness: 400, damping: 30 },
  },
};

// ═══════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════

export const ANIMATIONS = {
  // Page transitions
  page: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  
  // Stagger container
  stagger: {
    container: {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.08,
          delayChildren: 0.1,
        },
      },
    },
    item: {
      hidden: { opacity: 0, y: 20, scale: 0.95 },
      show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      },
    },
  },
  
  // Card hover
  cardHover: {
    rest: { y: 0, scale: 1 },
    hover: { 
      y: -6, 
      scale: 1.02,
      transition: { type: 'spring', stiffness: 400, damping: 25 }
    },
  },
  
  // Button tap
  buttonTap: {
    scale: 0.96,
    transition: { duration: 0.1 },
  },
  
  // Fade in
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  },
  
  // Slide up
  slideUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    },
  },
  
  // Scale in
  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: 'backOut' }
    },
  },
};

// ═══════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════

// Premium Card Component
export function PremiumCard({ children, style = {}, onClick, className = '' }) {
  return (
    <motion.div
      className={className}
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={ANIMATIONS.cardHover}
      onClick={onClick}
      style={{
        background: TOKENS.gradientCard,
        border: `1px solid ${TOKENS.border}`,
        borderRadius: TOKENS.radius.xl,
        padding: TOKENS.space.lg,
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(20px)',
        ...style,
      }}
    >
      {/* Glow effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '60%',
        background: TOKENS.gradientGlow(TOKENS.accent),
        pointerEvents: 'none',
        opacity: 0.5,
      }} />
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </motion.div>
  );
}

// Premium Button
export function PremiumButton({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  style = {},
  icon = null,
}) {
  const variants = {
    primary: {
      background: `linear-gradient(135deg, ${TOKENS.accent}20 0%, ${TOKENS.accent}10 100%)`,
      border: `1px solid ${TOKENS.accent}40`,
      color: TOKENS.accent,
    },
    secondary: {
      background: 'rgba(255,255,255,0.05)',
      border: `1px solid ${TOKENS.border}`,
      color: TOKENS.textMuted,
    },
    danger: {
      background: 'rgba(239,68,68,0.15)',
      border: '1px solid rgba(239,68,68,0.3)',
      color: '#ef4444',
    },
    ghost: {
      background: 'transparent',
      border: 'none',
      color: TOKENS.textMuted,
    },
  };
  
  const sizes = {
    sm: { padding: '0.5rem 0.75rem', fontSize: '0.75rem' },
    md: { padding: '0.625rem 1rem', fontSize: '0.85rem' },
    lg: { padding: '0.875rem 1.5rem', fontSize: '0.9rem' },
  };
  
  const variantStyle = variants[variant];
  const sizeStyle = sizes[size];
  
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        borderRadius: TOKENS.radius.md,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: TOKENS.transition.fast,
        ...variantStyle,
        ...sizeStyle,
        ...style,
      }}
    >
      {icon && <span style={{ fontSize: '1.1em' }}>{icon}</span>}
      {children}
    </motion.button>
  );
}

// Premium Badge
export function PremiumBadge({ children, color = TOKENS.accent, size = 'md' }) {
  const sizes = {
    sm: { padding: '2px 8px', fontSize: '0.65rem' },
    md: { padding: '4px 12px', fontSize: '0.75rem' },
    lg: { padding: '6px 16px', fontSize: '0.85rem' },
  };
  
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      background: `${color}15`,
      border: `1px solid ${color}30`,
      borderRadius: TOKENS.radius.full,
      color,
      fontWeight: 700,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      ...sizes[size],
    }}>
      {children}
    </span>
  );
}

// Premium Input
export function PremiumInput({ 
  placeholder, 
  value, 
  onChange, 
  type = 'text',
  style = {},
  icon = null,
}) {
  return (
    <div style={{ position: 'relative' }}>
      {icon && (
        <span style={{
          position: 'absolute',
          left: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '1rem',
          opacity: 0.5,
        }}>
          {icon}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: icon ? '0.75rem 1rem 0.75rem 2.75rem' : '0.75rem 1rem',
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid ${TOKENS.border}`,
          borderRadius: TOKENS.radius.md,
          color: TOKENS.text,
          fontSize: '0.9rem',
          outline: 'none',
          transition: TOKENS.transition.fast,
          boxSizing: 'border-box',
          ...style,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = TOKENS.accent;
          e.target.style.background = 'rgba(255,255,255,0.08)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = TOKENS.border;
          e.target.style.background = 'rgba(255,255,255,0.05)';
        }}
      />
    </div>
  );
}

// Loading Skeleton
export function Skeleton({ width = '100%', height = '20px', style = {} }) {
  return (
    <motion.div
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      style={{
        width,
        height,
        background: 'rgba(255,255,255,0.08)',
        borderRadius: TOKENS.radius.sm,
        ...style,
      }}
    />
  );
}

// Page Header
export function PageHeader({ title, subtitle, icon, actions = null }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        marginBottom: TOKENS.space.xl,
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: TOKENS.space.md,
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: TOKENS.space.md,
            marginBottom: subtitle ? '8px' : 0,
          }}>
            {icon && (
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                style={{ fontSize: '1.75rem' }}
              >
                {icon}
              </motion.span>
            )}
            <h1 style={{
              fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
              fontWeight: 800,
              color: TOKENS.text,
              margin: 0,
              fontFamily: TOKENS.font.display,
              letterSpacing: '-0.02em',
            }}>
              {title}
            </h1>
          </div>
          {subtitle && (
            <p style={{
              fontSize: '0.9rem',
              color: TOKENS.textDimmed,
              margin: 0,
              marginLeft: icon ? '2.75rem' : 0,
            }}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div style={{ display: 'flex', gap: TOKENS.space.sm }}>
            {actions}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Stats Grid
export function StatsGrid({ children, columns = 4 }) {
  return (
    <motion.div
      variants={ANIMATIONS.stagger.container}
      initial="hidden"
      animate="show"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${columns === 4 ? '200px' : columns === 3 ? '250px' : '150px'}, 1fr))`,
        gap: TOKENS.space.md,
        marginBottom: TOKENS.space.xl,
      }}
    >
      {children}
    </motion.div>
  );
}

// Stat Card
export function StatCard({ label, value, icon, color = TOKENS.accent, trend = null }) {
  return (
    <motion.div
      variants={ANIMATIONS.stagger.item}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{
        background: TOKENS.gradientCard,
        border: `1px solid ${TOKENS.border}`,
        borderRadius: TOKENS.radius.lg,
        padding: TOKENS.space.lg,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        background: TOKENS.gradientGlow(color),
        pointerEvents: 'none',
      }} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: TOKENS.space.md,
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: TOKENS.radius.md,
            background: `${color}15`,
            border: `1px solid ${color}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
          }}>
            {icon}
          </div>
          {trend && (
            <span style={{
              fontSize: '0.75rem',
              color: trend > 0 ? TOKENS.accentGreen : '#ef4444',
              fontWeight: 600,
            }}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
        
        <div style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: TOKENS.text,
          lineHeight: 1,
          marginBottom: '4px',
          fontFamily: TOKENS.font.display,
        }}>
          {value}
        </div>
        <div style={{
          fontSize: '0.8rem',
          color: TOKENS.textDimmed,
          fontWeight: 500,
        }}>
          {label}
        </div>
      </div>
      
      {/* Bottom accent */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, ${color}, transparent)`,
          transformOrigin: 'left',
        }}
      />
    </motion.div>
  );
}

// Filter Tabs
export function FilterTabs({ options, value, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        display: 'flex',
        gap: '6px',
        marginBottom: TOKENS.space.lg,
        flexWrap: 'wrap',
        padding: '4px',
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${TOKENS.border}`,
        borderRadius: TOKENS.radius.lg,
        width: 'fit-content',
      }}
    >
      {options.map((option) => (
        <motion.button
          key={option.key}
          onClick={() => onChange(option.key)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            padding: '0.5rem 1rem',
            background: value === option.key
              ? `linear-gradient(135deg, ${TOKENS.accent} 0%, ${TOKENS.accent}dd 100%)`
              : 'transparent',
            border: 'none',
            borderRadius: TOKENS.radius.md,
            color: value === option.key ? TOKENS.bg : TOKENS.textMuted,
            fontSize: '0.8rem',
            fontWeight: value === option.key ? 700 : 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: TOKENS.transition.fast,
          }}
        >
          {option.icon && <span>{option.icon}</span>}
          {option.label}
        </motion.button>
      ))}
    </motion.div>
  );
}

// Empty State
export function EmptyState({ icon = '📭', title, subtitle, action = null }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        padding: TOKENS.space['2xl'],
        textAlign: 'center',
        color: TOKENS.textDimmed,
      }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ fontSize: '4rem', marginBottom: TOKENS.space.md, opacity: 0.5 }}
      >
        {icon}
      </motion.div>
      <div style={{
        fontSize: '1.1rem',
        fontWeight: 700,
        color: TOKENS.text,
        marginBottom: '8px',
      }}>
        {title}
      </div>
      <div style={{ fontSize: '0.9rem', marginBottom: action ? TOKENS.space.md : 0 }}>
        {subtitle}
      </div>
      {action}
    </motion.div>
  );
}

// Error State
export function ErrorState({ message, onRetry = null }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        padding: TOKENS.space.xl,
        textAlign: 'center',
        color: '#ef4444',
        background: 'rgba(239,68,68,0.05)',
        border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: TOKENS.radius.lg,
      }}
    >
      <div style={{ fontSize: '2rem', marginBottom: TOKENS.space.sm }}>⚠️</div>
      <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: onRetry ? TOKENS.space.md : 0 }}>
        {message}
      </div>
      {onRetry && (
        <PremiumButton variant="secondary" onClick={onRetry} icon="🔄">
          Try Again
        </PremiumButton>
      )}
    </motion.div>
  );
}

export default TOKENS;
