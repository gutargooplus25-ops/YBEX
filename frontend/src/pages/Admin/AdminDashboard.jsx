import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import AdminLayout from './AdminLayout';
import axiosInstance from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value == null) return;
    let start = 0;
    const end = parseInt(value);
    if (start === end) { setDisplay(end); return; }
    const duration = 1000;
    const step = Math.ceil(duration / end) || 20;
    const timer = setInterval(() => {
      start += 1;
      setDisplay(start);
      if (start >= end) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display}</span>;
}

const StatCard = ({ label, value, icon, color, to, delay = 0 }) => (
  <motion.div
    variants={cardVariants}
    whileHover={{ y: -8, boxShadow: `0 25px 60px ${color}25` }}
    whileTap={{ scale: 0.97 }}
    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
  >
    <Link to={to} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        border: `1px solid ${color}25`,
        borderRadius: '20px',
        padding: '1.75rem',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
      }}>
        {/* Glow corner */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '100px', height: '100px',
          background: `radial-gradient(circle at top right, ${color}20 0%, transparent 60%)`,
          pointerEvents: 'none',
        }} />
        
        {/* Animated gradient border */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: 0,
            borderRadius: '20px',
            padding: '1px',
            background: `linear-gradient(135deg, ${color}40, transparent, ${color}20)`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <motion.span
            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay }}
            style={{ fontSize: '1.8rem', filter: `drop-shadow(0 0 20px ${color}50)` }}
          >{icon}</motion.span>
          <motion.span 
            whileHover={{ scale: 1.05 }}
            style={{
              background: `linear-gradient(135deg, ${color}20, ${color}08)`, 
              color, fontSize: '0.65rem', fontWeight: 800,
              padding: '0.25rem 0.7rem', borderRadius: '20px', letterSpacing: '0.1em',
              border: `1px solid ${color}35`,
              textTransform: 'uppercase',
            }}>View All →</motion.span>
        </div>
        <div style={{ 
          fontSize: '2.75rem', 
          fontWeight: 800, 
          color: '#fff', 
          lineHeight: 1, 
          marginBottom: '0.5rem',
          fontFamily: "'Space Grotesk', sans-serif",
          letterSpacing: '-0.02em',
        }}>
          <AnimatedNumber value={value} />
        </div>
        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500, letterSpacing: '0.02em' }}>{label}</div>

        {/* Bottom accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 + delay }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '2px', background: `linear-gradient(90deg, ${color}, transparent)`,
            transformOrigin: 'left',
          }}
        />
      </div>
    </Link>
  </motion.div>
);

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/admin/stats')
      .then((res) => setStats(res.data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Enquiries', value: stats?.totalContacts, icon: '📬', color: '#ff4500', to: '/admin/enquiries' },
    { label: 'Unread Enquiries', value: stats?.unreadContacts, icon: '🔔', color: '#ff6b35', to: '/admin/enquiries' },
    { label: 'Total Users', value: stats?.totalUsers, icon: '👥', color: '#4ade80', to: '/admin/users' },
    { label: 'Suggestions', value: stats?.totalSuggestions, icon: '💡', color: '#60a5fa', to: '/admin/suggestions' },
    { label: 'Pending', value: stats?.pendingSuggestions, icon: '⏳', color: '#facc15', to: '/admin/suggestions' },
  ];

  const quickActions = [
    { label: 'View All Enquiries', to: '/admin/enquiries', color: '#ff4500', icon: '📬' },
    { label: 'Manage Users', to: '/admin/users', color: '#4ade80', icon: '👥' },
    { label: 'Review Suggestions', to: '/admin/suggestions', color: '#60a5fa', icon: '💡' },
  ];

  return (
    <AdminLayout>
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: '2.5rem' }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.4rem' }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            style={{ fontSize: '1.5rem' }}
          >👋</motion.div>
          <h1 style={{ fontSize: 'clamp(1.1rem, 4vw, 1.6rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
            Welcome back, <span style={{ color: '#ff4500' }}>{user?.name || 'Admin'}</span>
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem', marginLeft: '2.5rem' }}
        >
          Here's your command center overview.
        </motion.p>
      </motion.div>

      {/* Stats grid */}
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
              style={{
                height: '130px', borderRadius: '16px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="adm-dashboard-grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {statCards.map((card, i) => (
            <StatCard key={card.label} {...card} delay={i * 0.15} />
          ))}
        </motion.div>
      )}

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        style={{ marginTop: '3rem' }}
      >
        <motion.h2
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.65 }}
          style={{
            fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)',
            marginBottom: '1rem', letterSpacing: '0.12em', textTransform: 'uppercase',
          }}
        >
          Quick Actions
        </motion.h2>
        <div className="adm-quick-actions" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {quickActions.map((item, i) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.08 }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link to={item.to} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '0.65rem 1.25rem',
                background: `${item.color}12`,
                border: `1px solid ${item.color}30`,
                borderRadius: '10px',
                color: item.color,
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}>
                <span>{item.icon}</span>
                {item.label} →
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Activity indicator */}
      <motion.div
        className="adm-status-banner"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{
          marginTop: '3rem',
          padding: '1.25rem 1.5rem',
          background: 'rgba(255,69,0,0.04)',
          border: '1px solid rgba(255,69,0,0.12)',
          borderRadius: '12px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff4500', flexShrink: 0 }}
        />
        <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>
          System online · All services operational · YBEX Command Center v1.0
        </span>
      </motion.div>

      <style>{`
        @media (max-width: 640px) {
          .adm-quick-actions > div {
            width: 100%;
          }
          .adm-quick-actions a {
            width: 100%;
            justify-content: center;
          }
          .adm-status-banner {
            padding: 1rem !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
