import { useContext, useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AuthContext } from '../../context/AuthContext';

/* ── colour tokens ── */
const C = {
  bg:       '#080808',
  header:   '#0e0e0e',
  nav:      '#0e0e0e',
  border:   'rgba(255,255,255,0.09)',
  orange:   '#FF3D10',
  yellow:   '#E4F141',
  white:    '#ffffff',
  muted:    'rgba(255,255,255,0.6)',
  dimmed:   'rgba(255,255,255,0.3)',
};

const NAV_TABS = [
  { label: 'Enquiries',        path: '/admin/enquiries',        icon: '📬' },
  { label: 'Manage Admins',    path: '/admin/users',            icon: '👥' },
  { label: 'About Page Team',  path: '/admin/about-team',       icon: '🧑‍💼' },
  { label: 'Hiring',           path: '/admin/hiring',           icon: '💼' },
  { label: 'Influencers',      path: '/admin/influencers',      icon: '🌟' },
  { label: 'Brands',           path: '/admin/brands',           icon: '🏷️' },
  { label: 'School Mentors',   path: '/admin/school-mentors',   icon: '🎓' },
  { label: 'Success Stories',  path: '/admin/success-stories',  icon: '🏆' },
  { label: 'Scholarship',      path: '/admin/scholarship',      icon: '🎖️' },
  { label: 'Activity Logs',    path: '/admin/activity-logs',    icon: '📊' },
  { label: 'Invoices',         path: '/admin/invoices',         icon: '🧾' },
  { label: 'YBEX Story',       path: '/admin/ybex-story',       icon: '📖' },
  { label: 'Portfolio',        path: '/admin/portfolio',        icon: '🗂️' },
  { label: 'Bin',              path: '/admin/bin',              icon: '🗑️' },
  { label: 'Website Settings', path: '/admin/website-settings', icon: '⚙️' },
];

/* ── smooth page wrapper — fades content only, no layout shift ── */
function PageTransition({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default function AdminLayout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  /* auto-scroll active tab into view */
  useEffect(() => {
    const active = navRef.current?.querySelector('[data-active="true"]');
    if (active) active.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
  });

  return (
    <>
      <style>{`
        body:has(.ybex-admin-shell) { background: ${C.bg} !important; }
        body:has(.ybex-admin-shell)::before { display: none !important; }
        body:has(.ybex-admin-shell) .site-header { display: none !important; }

        .adm-tab { transition: color 0.15s, background 0.15s; }
        .adm-tab:hover { color: ${C.white} !important; background: rgba(255,255,255,0.07) !important; }

        .adm-nav::-webkit-scrollbar { height: 2px; }
        .adm-nav::-webkit-scrollbar-track { background: transparent; }
        .adm-nav::-webkit-scrollbar-thumb { background: rgba(228,241,65,0.3); border-radius: 4px; }

        .adm-hdr-btn { transition: background 0.15s, border-color 0.15s; }
        .adm-hdr-btn:hover { background: rgba(255,255,255,0.09) !important; border-color: rgba(255,255,255,0.15) !important; }

        .adm-logout:hover { background: rgba(255,61,16,0.25) !important; border-color: rgba(255,61,16,0.6) !important; color: #fff !important; }

        @media (max-width: 640px) {
          .adm-logo-text  { display: none !important; }
          .adm-right      { display: none !important; }
          .adm-hamburger  { display: flex !important; }
          .adm-nav        { display: none !important; }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .adm-badge      { display: none !important; }
          .adm-hamburger  { display: none !important; }
        }
        @media (min-width: 1025px) {
          .adm-hamburger  { display: none !important; }
        }
      `}</style>

      <div className="ybex-admin-shell" style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', system-ui, sans-serif", color: C.white }}>

        {/* ══════════ HEADER ══════════ */}
        <header className="adm-header" style={{
          background: C.header,
          borderBottom: `1px solid ${C.border}`,
          height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 1.5rem',
          position: 'sticky', top: 0, zIndex: 300,
          gap: '1rem',
        }}>

          {/* Logo */}
          <Link to="/admin/enquiries" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
            <motion.div
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
              style={{
                width: '34px', height: '34px', background: C.yellow,
                borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: '0.82rem', color: '#000', flexShrink: 0,
                boxShadow: `0 0 0 0 ${C.yellow}`,
              }}
              animate={{ boxShadow: [`0 0 0px ${C.yellow}00`, `0 0 14px ${C.yellow}55`, `0 0 0px ${C.yellow}00`] }}
              transition={{ boxShadow: { duration: 3, repeat: Infinity }, scale: { duration: 0.15 } }}
            >YB</motion.div>

            <div className="adm-logo-text">
              <div style={{ fontSize: '1rem', fontWeight: 900, color: C.white, letterSpacing: '0.02em', lineHeight: 1.1 }}>
                YBEX <span style={{ color: C.yellow }}>COMMAND</span> CENTER
              </div>
              <div style={{ fontSize: '0.52rem', color: C.dimmed, letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: '2px' }}>
                Secure Dashboard Management
              </div>
            </div>
          </Link>

          {/* Right — desktop */}
          <div className="adm-right" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

            {/* Admin badge */}
            <div className="adm-badge adm-hdr-btn" style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`,
              borderRadius: '10px', padding: '0.38rem 0.85rem', cursor: 'default',
            }}>
              <div style={{
                width: '26px', height: '26px', borderRadius: '50%',
                background: `${C.yellow}18`, border: `1px solid ${C.yellow}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.68rem', color: C.yellow, fontWeight: 900, flexShrink: 0,
              }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: C.yellow, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {user?.name?.toUpperCase() || 'ADMIN'}
                </div>
                <div style={{ fontSize: '0.52rem', color: C.dimmed, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Owner Admin
                </div>
              </div>
            </div>

            {/* Live site */}
            <motion.a
              href="/" target="_blank" rel="noreferrer"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="adm-hdr-btn"
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`,
                borderRadius: '10px', padding: '0.38rem 0.85rem',
                color: C.muted, fontSize: '0.7rem', fontWeight: 600,
                textDecoration: 'none', whiteSpace: 'nowrap',
              }}
            >🌐 Live Site</motion.a>

            {/* Logout */}
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.93 }}
              className="adm-logout"
              style={{
                width: '34px', height: '34px',
                background: `${C.orange}12`, border: `1px solid ${C.orange}35`,
                borderRadius: '10px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: C.orange, fontSize: '1rem', flexShrink: 0,
              }}
              title="Logout"
            >⏻</motion.button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="adm-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none', background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${C.border}`, borderRadius: '8px',
              width: '36px', height: '36px',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: C.white, fontSize: '1rem', flexShrink: 0,
            }}
          >{mobileOpen ? '✕' : '☰'}</button>
        </header>

        {/* ══════════ MOBILE MENU ══════════ */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
              style={{
                position: 'fixed', top: '64px', left: 0, right: 0, zIndex: 290,
                background: 'rgba(10,10,10,0.98)', borderBottom: `1px solid ${C.border}`,
                backdropFilter: 'blur(20px)', padding: '1rem',
                display: 'flex', flexDirection: 'column', gap: '0.4rem',
                maxHeight: 'calc(100vh - 64px)', overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.9rem', background: `${C.yellow}08`, border: `1px solid ${C.yellow}18`, borderRadius: '10px', marginBottom: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: `${C.yellow}20`, border: `1px solid ${C.yellow}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: C.yellow, fontWeight: 800 }}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: C.yellow }}>{user?.name?.toUpperCase() || 'ADMIN'}</div>
                    <div style={{ fontSize: '0.58rem', color: C.dimmed }}>Owner Admin</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <a href="/" target="_blank" rel="noreferrer" style={{ padding: '0.3rem 0.6rem', background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, borderRadius: '6px', color: C.muted, fontSize: '0.7rem', textDecoration: 'none' }}>🌐</a>
                  <button onClick={handleLogout} style={{ padding: '0.3rem 0.6rem', background: `${C.orange}12`, border: `1px solid ${C.orange}35`, borderRadius: '6px', color: C.orange, fontSize: '0.7rem', cursor: 'pointer' }}>⏻</button>
                </div>
              </div>
              {NAV_TABS.map((tab) => (
                <NavLink key={tab.path} to={tab.path} onClick={() => setMobileOpen(false)}
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: '9px',
                    padding: '0.65rem 0.9rem',
                    background: isActive ? C.orange : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? C.orange : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: '9px', color: isActive ? C.white : C.muted,
                    fontSize: '0.8rem', fontWeight: isActive ? 700 : 500,
                    textDecoration: 'none', letterSpacing: '0.04em',
                  })}
                >
                  <span>{tab.icon}</span>{tab.label}
                </NavLink>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══════════ NAV TABS ══════════ */}
        <div
          ref={navRef}
          className="adm-nav"
          style={{
            background: C.nav,
            borderBottom: `1px solid ${C.border}`,
            overflowX: 'auto',
            position: 'sticky', top: '64px', zIndex: 200,
            scrollbarWidth: 'thin',
            scrollbarColor: `${C.yellow}33 transparent`,
          }}
        >
          <div style={{ display: 'flex', minWidth: 'max-content' }}>
            {NAV_TABS.map((tab) => (
              <NavLink
                key={tab.path}
                to={tab.path}
                className="adm-tab"
                data-active={undefined}
                style={({ isActive }) => {
                  return {
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '0 1rem', height: '44px',
                    fontSize: '0.7rem', fontWeight: isActive ? 700 : 500,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    textDecoration: 'none', whiteSpace: 'nowrap',
                    color: isActive ? C.white : C.muted,
                    background: isActive ? `${C.orange}18` : 'transparent',
                    borderBottom: isActive ? `2px solid ${C.orange}` : '2px solid transparent',
                    borderTop: '2px solid transparent',
                    position: 'relative',
                  };
                }}
              >
                {({ isActive }) => (
                  <>
                    <span style={{ fontSize: '0.78rem', lineHeight: 1 }}>{tab.icon}</span>
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
                          background: C.orange,
                        }}
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* ══════════ PAGE CONTENT ══════════ */}
        <main className="adm-main" style={{ padding: 'clamp(1rem, 2vw, 1.5rem)', maxWidth: '1400px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          <PageTransition>
            {children}
          </PageTransition>
        </main>

      </div>
    </>
  );
}
