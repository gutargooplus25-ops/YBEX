import { useContext, useState } from 'react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          padding: '0 1rem',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 200,
          backdropFilter: 'blur(20px)',
          gap: '0.75rem',
        }}
      >
        {/* Logo */}
        <Link to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <motion.div
            whileHover={{ scale: 1.08, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            animate={{ boxShadow: ['0 0 0px #ff4500', '0 0 16px #ff450055', '0 0 0px #ff4500'] }}
            transition={{ boxShadow: { duration: 3, repeat: Infinity }, scale: { duration: 0.2 } }}
            style={{
              width: '34px', height: '34px', background: '#ff4500',
              borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: '0.8rem', color: '#fff', flexShrink: 0,
            }}
          >YB</motion.div>
          <div className="admin-logo-text">
            <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
              YBEX <span style={{ color: '#ff4500' }}>COMMAND</span>
            </div>
            <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Dashboard
            </div>
          </div>
        </Link>

        {/* Right side — desktop */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="admin-header-right"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {/* Admin badge */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="admin-badge"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '10px', padding: '0.4rem 0.75rem',
              cursor: 'default',
            }}
          >
            <motion.div
              animate={{ boxShadow: ['0 0 0px #ff4500', '0 0 10px #ff450066', '0 0 0px #ff4500'] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: '26px', height: '26px', borderRadius: '50%',
                background: 'rgba(255,69,0,0.15)', border: '1px solid rgba(255,69,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', color: '#ff4500', fontWeight: 800, flexShrink: 0,
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </motion.div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ff4500', letterSpacing: '0.06em' }}>
                {user?.name?.toUpperCase() || 'ADMIN'}
              </div>
              <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Owner Admin
              </div>
            </div>
          </motion.div>

          {/* Live site */}
          <motion.a
            href="/"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="admin-live-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '10px', padding: '0.4rem 0.75rem',
              color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem', fontWeight: 600,
              textDecoration: 'none', whiteSpace: 'nowrap',
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
              width: '34px', height: '34px',
              background: 'rgba(255,69,0,0.1)',
              border: '1px solid rgba(255,69,0,0.3)',
              borderRadius: '10px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#ff4500', fontSize: '1rem', flexShrink: 0,
            }}
            title="Logout"
          >
            ⏻
          </motion.button>
        </motion.div>

        {/* Mobile hamburger */}
        <motion.button
          className="admin-hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          whileTap={{ scale: 0.9 }}
          style={{
            display: 'none',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            width: '36px', height: '36px',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#fff', fontSize: '1.1rem', flexShrink: 0,
          }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </motion.button>
      </motion.header>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              top: '64px', left: 0, right: 0,
              zIndex: 190,
              background: 'rgba(10,10,10,0.98)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
              padding: '1rem',
              display: 'flex', flexDirection: 'column', gap: '0.5rem',
              maxHeight: 'calc(100vh - 64px)',
              overflowY: 'auto',
            }}
          >
            {/* Admin info row */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              background: 'rgba(255,69,0,0.06)',
              border: '1px solid rgba(255,69,0,0.15)',
              borderRadius: '10px',
              marginBottom: '0.25rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  background: 'rgba(255,69,0,0.2)', border: '1px solid rgba(255,69,0,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', color: '#ff4500', fontWeight: 800,
                }}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ff4500' }}>{user?.name?.toUpperCase() || 'ADMIN'}</div>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)' }}>Owner Admin</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <a href="/" target="_blank" rel="noreferrer" style={{
                  padding: '0.35rem 0.7rem', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px',
                  color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', textDecoration: 'none',
                }}>🌐</a>
                <button onClick={handleLogout} style={{
                  padding: '0.35rem 0.7rem', background: 'rgba(255,69,0,0.1)',
                  border: '1px solid rgba(255,69,0,0.3)', borderRadius: '7px',
                  color: '#ff4500', fontSize: '0.72rem', cursor: 'pointer',
                }}>⏻ Logout</button>
              </div>
            </div>

            {/* Nav links */}
            {navTabs.map((tab, i) => (
              <motion.div
                key={tab.path}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <NavLink
                  to={tab.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '0.75rem 1rem',
                    background: isActive ? '#ff4500' : 'rgba(255,255,255,0.03)',
                    border: isActive ? '1px solid #ff4500' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '10px',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                    fontSize: '0.82rem', fontWeight: isActive ? 700 : 500,
                    textDecoration: 'none', letterSpacing: '0.04em',
                    boxShadow: isActive ? '0 4px 16px rgba(255,69,0,0.25)' : 'none',
                  })}
                >
                  <span style={{ fontSize: '1rem' }}>{tab.icon}</span>
                  {tab.label}
                </NavLink>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav Tabs — horizontal scroll bar (tablet/desktop) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="admin-nav-tabs"
        style={{
          background: 'rgba(12,12,12,0.95)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '0 1rem',
          overflowX: 'auto',
          backdropFilter: 'blur(10px)',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,69,0,0.3) transparent',
        }}
      >
        <div style={{ display: 'flex', gap: '0.1rem', minWidth: 'max-content' }}>
          {navTabs.map((tab, i) => (
            <motion.div
              key={tab.path}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.04 }}
            >
              <NavLink
                to={tab.path}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '0.8rem 1rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                  borderBottom: isActive ? '2px solid #ff4500' : '2px solid transparent',
                  transition: 'color 0.2s',
                  whiteSpace: 'nowrap',
                })}
              >
                <span style={{ fontSize: '0.8rem' }}>{tab.icon}</span>
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
          style={{ padding: '1.25rem', maxWidth: '1400px', margin: '0 auto' }}
        >
          {children}
        </motion.main>
      </AnimatePresence>

      <style>{`
        /* Mobile: <= 640px */
        @media (max-width: 640px) {
          .admin-logo-text { display: none !important; }
          .admin-header-right { display: none !important; }
          .admin-hamburger { display: flex !important; }
          .admin-nav-tabs { display: none !important; }
        }
        /* Tablet: 641px – 1024px */
        @media (min-width: 641px) and (max-width: 1024px) {
          .admin-badge { display: none !important; }
          .admin-hamburger { display: none !important; }
        }
        /* Desktop: > 1024px */
        @media (min-width: 1025px) {
          .admin-hamburger { display: none !important; }
        }
        /* Scrollbar styling for nav tabs */
        .admin-nav-tabs::-webkit-scrollbar { height: 3px; }
        .admin-nav-tabs::-webkit-scrollbar-track { background: transparent; }
        .admin-nav-tabs::-webkit-scrollbar-thumb { background: rgba(255,69,0,0.3); border-radius: 10px; }
      `}</style>
    </div>
  );
}
