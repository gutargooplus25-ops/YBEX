import { useContext, useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { TOKENS, ANIMATIONS } from './AdminDesignSystem';

// Use design system tokens
const C = TOKENS;

const NAV_TABS = [
  { label: 'Enquiries',        path: '/admin/enquiries',        icon: '📬', hoverColor: '#3b82f6' },
  { label: 'Manage Admins',    path: '/admin/users',            icon: '👥', hoverColor: '#22c55e' },
  { label: 'About Page Team',  path: '/admin/about-team',       icon: '🧑‍💼', hoverColor: '#a855f7' },
  { label: 'Hiring',           path: '/admin/hiring',           icon: '💼', hoverColor: '#f97316' },
  { label: 'Influencers',      path: '/admin/influencers',      icon: '🌟', hoverColor: '#ec4899' },
  { label: 'Brands',           path: '/admin/brands',           icon: '🏷️', hoverColor: '#14b8a6' },
  { label: 'School Mentors',   path: '/admin/school-mentors',   icon: '🎓', hoverColor: '#8b5cf6' },
  { label: 'Success Stories',  path: '/admin/success-stories',  icon: '🏆', hoverColor: '#f59e0b' },
  { label: 'Scholarship',      path: '/admin/scholarship',      icon: '🎖️', hoverColor: '#06b6d4' },
  { label: 'Activity Logs',    path: '/admin/activity-logs',    icon: '📊', hoverColor: '#6366f1' },
  { label: 'Invoices',         path: '/admin/invoices',         icon: '🧾', hoverColor: '#3b82f6' },
  { label: 'YBEX Story',       path: '/admin/ybex-story',       icon: '📖', hoverColor: '#84cc16' },
  { label: 'Portfolio',        path: '/admin/portfolio',        icon: '🗂️', hoverColor: '#3b82f6' },
  { label: 'Bin',              path: '/admin/bin',              icon: '🗑️', hoverColor: '#ef4444' },
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        
        body:has(.ybex-admin-shell) { 
          background: ${C.bg} !important; 
          font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
        }
        body:has(.ybex-admin-shell)::before { display: none !important; }
        body:has(.ybex-admin-shell) .site-header { display: none !important; }

        .adm-tab { 
          transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          font-weight: 500;
          letter-spacing: 0.04em;
          position: relative;
          overflow: hidden;
        }
        .adm-tab::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--hover-color, #3b82f6) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: 0;
        }
        .adm-tab:hover::before {
          opacity: 0.15;
        }
        .adm-tab:hover { 
          color: var(--hover-color, #3b82f6) !important;
          transform: translateY(-2px);
          text-shadow: 0 0 20px var(--hover-color, #3b82f6);
        }
        .adm-tab span {
          transition: transform 0.3s ease, filter 0.3s ease;
          position: relative;
          z-index: 1;
        }
        .adm-tab:hover span {
          transform: scale(1.2) rotate(-5deg);
          filter: drop-shadow(0 0 8px var(--hover-color, #3b82f6));
        }
        .adm-tab[data-active="true"] {
          font-weight: 700 !important;
        }

        .adm-nav::-webkit-scrollbar { height: 3px; }
        .adm-nav::-webkit-scrollbar-track { background: transparent; }
        .adm-nav::-webkit-scrollbar-thumb { 
          background: linear-gradient(90deg, ${C.accentOrange}, ${C.accent}); 
          border-radius: 4px; 
        }

        .adm-hdr-btn { 
          transition: all 0.2s ease;
          font-weight: 500;
        }
        .adm-hdr-btn:hover { 
          background: rgba(228,241,65,0.1) !important; 
          border-color: rgba(228,241,65,0.3) !important; 
          color: ${C.accent} !important;
          transform: translateY(-1px);
        }

        .adm-logout { transition: all 0.2s ease; }
        .adm-logout:hover { 
          background: rgba(255,61,16,0.3) !important; 
          border-color: rgba(255,61,16,0.7) !important; 
          color: #fff !important;
          transform: scale(1.05);
        }
        
        .adm-header {
          background: linear-gradient(180deg, ${C.bgElevated} 0%, rgba(10,10,10,0.98) 100%) !important;
          box-shadow: 0 4px 30px rgba(0,0,0,0.4) !important;
        }
        
        .adm-nav {
          background: ${C.bgElevated} !important;
        }
        
        .adm-logo-text {
          font-family: 'Space Grotesk', sans-serif;
        }

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

      <div className="ybex-admin-shell" style={{ minHeight: '100vh', background: C.bg, fontFamily: C.font.sans, color: C.text }}>

        {/* ══════════ HEADER ══════════ */}
        <header className="adm-header" style={{
          background: C.bgElevated,
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
                width: '34px', height: '34px', background: C.accent,
                borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: '0.82rem', color: '#000', flexShrink: 0,
                boxShadow: `0 0 0 0 ${C.accent}`,
              }}
              animate={{ boxShadow: [`0 0 0px ${C.accent}00`, `0 0 14px ${C.accent}55`, `0 0 0px ${C.accent}00`] }}
              transition={{ boxShadow: { duration: 3, repeat: Infinity }, scale: { duration: 0.15 } }}
            >YB</motion.div>

            <div className="adm-logo-text">
              <div style={{ fontSize: '1rem', fontWeight: 900, color: C.text, letterSpacing: '0.02em', lineHeight: 1.1, fontFamily: C.font.display }}>
                YBEX <span style={{ color: C.accent }}>COMMAND</span> CENTER
              </div>
              <div style={{ fontSize: '0.52rem', color: C.textDimmed, letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: '2px' }}>
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
                background: `${C.accent}18`, border: `1px solid ${C.accent}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.68rem', color: C.accent, fontWeight: 900, flexShrink: 0,
              }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: C.accent, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {user?.name?.toUpperCase() || 'ADMIN'}
                </div>
                <div style={{ fontSize: '0.52rem', color: C.textDimmed, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
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
                color: C.textMuted, fontSize: '0.7rem', fontWeight: 600,
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
                background: `${C.accentOrange}12`, border: `1px solid ${C.accentOrange}35`,
                borderRadius: '10px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: C.accentOrange, fontSize: '1rem', flexShrink: 0,
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
              cursor: 'pointer', color: C.text, fontSize: '1rem', flexShrink: 0,
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.9rem', background: `${C.accent}08`, border: `1px solid ${C.accent}18`, borderRadius: '10px', marginBottom: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: `${C.accent}20`, border: `1px solid ${C.accent}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: C.accent, fontWeight: 800 }}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: C.accent }}>{user?.name?.toUpperCase() || 'ADMIN'}</div>
                    <div style={{ fontSize: '0.58rem', color: C.textDimmed }}>Owner Admin</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <a href="/" target="_blank" rel="noreferrer" style={{ padding: '0.3rem 0.6rem', background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, borderRadius: '6px', color: C.textMuted, fontSize: '0.7rem', textDecoration: 'none' }}>🌐</a>
                  <button onClick={handleLogout} style={{ padding: '0.3rem 0.6rem', background: `${C.accentOrange}12`, border: `1px solid ${C.accentOrange}35`, borderRadius: '6px', color: C.accentOrange, fontSize: '0.7rem', cursor: 'pointer' }}>⏻</button>
                </div>
              </div>
              {NAV_TABS.map((tab) => (
                <NavLink key={tab.path} to={tab.path} onClick={() => setMobileOpen(false)}
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: '9px',
                    padding: '0.65rem 0.9rem',
                    background: isActive ? C.accentOrange : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? C.accentOrange : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: '9px', color: isActive ? C.text : C.textMuted,
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
            background: C.bgElevated,
            borderBottom: `1px solid ${C.border}`,
            overflowX: 'auto',
            position: 'sticky', top: '64px', zIndex: 200,
            scrollbarWidth: 'thin',
            scrollbarColor: `${C.accent}33 transparent`,
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
                    color: isActive ? C.text : C.textMuted,
                    background: isActive ? `${C.accentOrange}18` : 'transparent',
                    borderBottom: isActive ? `2px solid ${C.accentOrange}` : '2px solid transparent',
                    borderTop: '2px solid transparent',
                    position: 'relative',
                    '--hover-color': tab.hoverColor,
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
                          background: C.accentOrange,
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
