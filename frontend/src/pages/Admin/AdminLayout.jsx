import { useContext } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AuthContext } from '../../context/AuthContext';

const navTabs = [
  { label: 'Enquiries',         path: '/admin/enquiries',        icon: '📬' },
  { label: 'Manage Admins',     path: '/admin/users',            icon: '👥' },
  { label: 'About Page Team',   path: '/admin/about-team',       icon: '🧑‍💼' },
  { label: 'Hiring',            path: '/admin/hiring',           icon: '💼' },
  { label: 'Influencers',       path: '/admin/influencers',      icon: '🌟' },
  { label: 'Brands',            path: '/admin/brands',           icon: '🏷️' },
  { label: 'School Mentors',    path: '/admin/school-mentors',   icon: '🎓' },
  { label: 'Success Stories',   path: '/admin/success-stories',  icon: '🏆' },
  { label: 'Scholarship',       path: '/admin/scholarship',      icon: '🎖️' },
  { label: 'Activity Logs',     path: '/admin/activity-logs',    icon: '📊' },
  { label: 'Invoices',          path: '/admin/invoices',         icon: '🧾' },
  { label: 'YBEX Story',        path: '/admin/ybex-story',       icon: '📖' },
  { label: 'Portfolio',         path: '/admin/portfolio',        icon: '🗂️' },
  { label: 'Bin',               path: '/admin/bin',              icon: '🗑️' },
  { label: 'Website Settings',  path: '/admin/website-settings', icon: '⚙️' },
  { label: 'Suggestions',       path: '/admin/suggestions',      icon: '💡' },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080808',
      fontFamily: "'Inter', system-ui, sans-serif",
      color: '#fff',
    }}>
      {/* Top Header */}
      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: 'rgba(14,14,14,0.95)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '0 2rem',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Logo */}
        <Link to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <motion.div
            whileHover={{ scale: 1.08, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            animate={{ boxShadow: ['0 0 0px #ff4500', '0 0 16px #ff450055', '0 0 0px #ff4500'] }}
            transition={{ boxShadow: { duration: 3, repeat: Infinity }, scale: { duration: 0.2 } }}
            style={{
              width: '36px', height: '36px', background: '#ff4500',
              borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: '0.85rem', color: '#fff', flexShrink: 0,
            }}
          >YB</motion.div>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
              YBEX <span style={{ color: '#ff4500' }}>COMMAND</span> CENTER
            </div>
            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Secure Dashboard Management
            </div>
          </div>
        </Link>

        {/* Right side */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          {/* Admin badge */}
          <motion.div
            whileHover={{ scale: 1.02, borderColor: 'rgba(255,69,0,0.4)' }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '10px', padding: '0.45rem 0.9rem',
              cursor: 'default',
            }}
          >
            <motion.div
              animate={{ boxShadow: ['0 0 0px #ff4500', '0 0 10px #ff450066', '0 0 0px #ff4500'] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'rgba(255,69,0,0.15)', border: '1px solid rgba(255,69,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', color: '#ff4500', fontWeight: 800,
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </motion.div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ff4500', letterSpacing: '0.06em' }}>
                {user?.name?.toUpperCase() || 'ADMIN'}
              </div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Owner Admin
              </div>
            </div>
          </motion.div>

          {/* Live site */}
          <motion.a
            href="/"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.04, borderColor: 'rgba(255,255,255,0.3)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '10px', padding: '0.45rem 0.9rem',
              color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem', fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            🌐 Live Site
          </motion.a>

          {/* Logout */}
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.08, background: 'rgba(255,69,0,0.25)' }}
            whileTap={{ scale: 0.93 }}
            style={{
              width: '36px', height: '36px',
              background: 'rgba(255,69,0,0.1)',
              border: '1px solid rgba(255,69,0,0.3)',
              borderRadius: '10px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#ff4500', fontSize: '1rem',
            }}
            title="Logout"
          >
            ⏻
          </motion.button>
        </motion.div>
      </motion.header>

      {/* Nav Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={{
          background: 'rgba(12,12,12,0.95)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '0 2rem',
          overflowX: 'auto',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ display: 'flex', gap: '0.1rem', minWidth: 'max-content' }}>
          {navTabs.map((tab, i) => (
            <motion.div
              key={tab.path}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.07 }}
            >
              <NavLink
                to={tab.path}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '0.875rem 1.25rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                  borderBottom: isActive ? '2px solid #ff4500' : '2px solid transparent',
                  transition: 'color 0.2s',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                })}
              >
                <span style={{ fontSize: '0.85rem' }}>{tab.icon}</span>
                {tab.label}
              </NavLink>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Page Content */}
      <AnimatePresence mode="wait">
        <motion.main
          key={typeof window !== 'undefined' ? window.location.pathname : 'main'}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
