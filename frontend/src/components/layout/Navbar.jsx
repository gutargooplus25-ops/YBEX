import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { navItems } from '../../content/siteData';
import { useTheme } from '../../context/ThemeContext';

// Magnetic button effect component
function MagneticLink({ children, to, className, isActive, onClick }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    x.set(distanceX * 0.15);
    y.set(distanceY * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={to} className={className} onClick={onClick}>
        {children}
        {isActive && (
          <motion.div
            layoutId="navUnderline"
            className="nav-underline"
            style={{
              position: 'absolute',
              bottom: '-4px',
              left: '0',
              right: '0',
              height: '2px',
              background: 'linear-gradient(90deg, #a78bfa, #7c3aed)',
              borderRadius: '2px',
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </Link>
    </motion.div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Don't render on admin pages
  if (location.pathname.startsWith('/admin')) return null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  // Prevent body scroll when menu open on mobile
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        .site-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 900;
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          height: auto;
          min-height: 60px;
          display: flex;
          justify-content: center;
          padding: 12px 20px 0;
          background: transparent !important;
          border: none !important;
          backdrop-filter: none !important;
        }
        .site-header .container {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 0;
        }
        .nav-shell {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          height: 56px;
          gap: 20px;
          border-radius: 999px;
          background: rgba(12, 8, 28, 0.75);
          border: 1.5px solid rgba(139, 92, 246, 0.35);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(167, 139, 250, 0.08),
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 0 60px rgba(124, 58, 237, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          position: relative;
        }
        /* Animated gradient border glow */
        .nav-shell::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 999px;
          background: linear-gradient(
            135deg,
            rgba(167, 139, 250, 0.5) 0%,
            rgba(124, 58, 237, 0.3) 25%,
            rgba(139, 92, 246, 0.1) 50%,
            rgba(124, 58, 237, 0.3) 75%,
            rgba(167, 139, 250, 0.5) 100%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          padding: 1.5px;
          pointer-events: none;
          opacity: 0.7;
          transition: opacity 0.4s ease;
        }
        .nav-shell:hover::before {
          opacity: 1;
        }
        /* Scrolled state - stronger glow */
        .site-header.is-scrolled .nav-shell {
          background: rgba(8, 5, 20, 0.88);
          border-color: rgba(139, 92, 246, 0.5);
          box-shadow:
            0 0 0 1px rgba(167, 139, 250, 0.12),
            0 12px 40px rgba(0, 0, 0, 0.5),
            0 0 80px rgba(124, 58, 237, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }
        :root.light-theme .nav-shell {
          background: rgba(255, 255, 255, 0.88);
          border-color: rgba(124, 58, 237, 0.25);
          box-shadow:
            0 0 0 1px rgba(124, 58, 237, 0.06),
            0 8px 32px rgba(0, 0, 0, 0.1),
            0 0 60px rgba(124, 58, 237, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }
        :root.light-theme .nav-shell::before {
          background: linear-gradient(
            135deg,
            rgba(124, 58, 237, 0.4) 0%,
            rgba(167, 139, 250, 0.2) 50%,
            rgba(124, 58, 237, 0.4) 100%
          );
        }
        :root.light-theme .site-header.is-scrolled .nav-shell {
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(124, 58, 237, 0.35);
        }
        .brand-mark {
          position: relative;
          overflow: visible;
          display: flex;
          align-items: center;
          text-decoration: none;
        }
        .brand-mark-word {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: 0.02em;
          color: #fff;
          background: linear-gradient(135deg, #fff 0%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .brand-glow {
          position: absolute;
          inset: -10px;
          background: radial-gradient(circle at center, rgba(167,139,250,0.35) 0%, transparent 70%);
          filter: blur(20px);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }
        .brand-mark:hover .brand-glow {
          opacity: 1;
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-left: auto;
        }
        .desktop-nav a {
          position: relative;
          overflow: visible;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 500;
          font-size: 0.85rem;
          letter-spacing: 0.01em;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          padding: 6px 0;
        }
        .desktop-nav a:hover {
          transform: translateY(-2px);
          text-shadow: 0 4px 20px rgba(167, 139, 250, 0.4);
          color: #a78bfa;
        }
        .nav-cta {
          position: relative;
          overflow: hidden;
          padding: 0.45rem 0.9rem !important;
          font-size: 0.75rem !important;
          min-height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          border-radius: 10px;
        }
        .nav-cta:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 20px 40px rgba(139, 92, 246, 0.35);
        }
        .nav-cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }
        .nav-cta:hover::before {
          left: 100%;
        }
        .theme-toggle-btn {
          width: 36px;
          height: 36px;
          borderRadius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justifyContent: center;
          fontSize: 1rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          padding: 0;
        }
        .theme-toggle-btn:hover {
          background: rgba(139, 92, 246, 0.12);
          border-color: rgba(167, 139, 250, 0.4);
          transform: translateY(-2px);
        }
        :root.light-theme .theme-toggle-btn {
          border-color: rgba(0, 0, 0, 0.1);
          background: rgba(0, 0, 0, 0.05);
        }
        
        /* Menu Toggle */
        .menu-toggle {
          display: none;
        }
        
        @media (max-width: 960px) {
          .desktop-nav { display: none !important; }
          .nav-cta { display: none !important; }
          .menu-toggle {
            display: flex !important;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 42px;
            height: 42px;
            borderRadius: 12px;
            border: 2px solid rgba(139, 92, 246, 0.5);
            background: rgba(139, 92, 246, 0.12);
            backdrop-filter: blur(10px);
            cursor: pointer;
            padding: 10px;
            gap: 4px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(139, 92, 246, 0.25);
          }
          .menu-toggle:hover {
            background: rgba(139, 92, 246, 0.2);
            border-color: rgba(167, 139, 250, 0.8);
            transform: scale(1.05);
          }
          .menu-toggle span {
            display: block;
            width: 22px;
            height: 2.5px;
            border-radius: 3px;
            transition: all 0.3s ease;
            box-shadow: 0 0 8px rgba(167, 139, 250, 0.5);
            background: linear-gradient(90deg, #a78bfa, #8b5cf6);
          }
        }
        
        @media (max-width: 768px) {
          .site-header {
            min-height: auto;
            padding: 10px 12px 0;
          }
          .nav-shell {
            height: 50px;
            padding: 0 16px;
            border-radius: 999px;
          }
          .brand-mark-word { font-size: 1.3rem !important; }
          .menu-toggle {
            width: 36px !important;
            height: 36px !important;
            padding: 8px !important;
          }
          .menu-toggle span {
            width: 18px !important;
            height: 2px !important;
          }
        }

        /* Mobile Drawer */
        .mobile-drawer-backdrop {
          position: fixed;
          inset: 0;
          z-index: 998;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
        }
        .mobile-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(300px, 82vw);
          z-index: 999;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          box-shadow: -8px 0 40px rgba(0,0,0,0.5);
        }
        .mobile-drawer::-webkit-scrollbar { display: none; }
        .mobile-drawer-content {
          padding: 1.5rem;
          flex: 1;
        }
        .mobile-theme-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
          margin-bottom: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        :root.light-theme .mobile-theme-toggle {
          border-bottom-color: rgba(0,0,0,0.08);
        }
        .mobile-nav-link {
          display: block;
          padding: 0.85rem 0;
          font-size: 1.05rem;
          font-weight: 500;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          position: relative;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.3s ease;
        }
        :root.light-theme .mobile-nav-link {
          border-bottom-color: rgba(0,0,0,0.05);
        }
        .mobile-nav-link:hover {
          padding-left: 10px;
          color: #a78bfa;
        }
        .mobile-nav-link.is-active {
          color: #a78bfa;
          font-weight: 600;
        }
      `}</style>

      <motion.header 
        className={`site-header ${scrolled ? 'is-scrolled' : ''}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container">
          <div className="nav-shell">

          {/* Brand Logo */}
          <Link to="/" className="brand-mark" aria-label="YBEX home">
            <motion.div 
              className="brand-glow"
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
            />
            <motion.span 
              className="brand-mark-word"
              whileHover={{ 
                scale: 1.05,
                textShadow: '0 0 30px rgba(228,241,65,0.5)'
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              {'YBEX'.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: i * 0.1, 
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  whileHover={{
                    color: '#E4F141',
                    y: -2,
                    transition: { duration: 0.2 }
                  }}
                  style={{ display: 'inline-block' }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.span>
          </Link>

          {/* Desktop nav */}
          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map((item, i) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.3 + i * 0.08, 
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1]
                }}
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{ position: 'relative' }}
              >
                <MagneticLink
                  to={item.path}
                  className={location.pathname === item.path ? 'is-active' : ''}
                  isActive={location.pathname === item.path}
                >
                  <span style={{ 
                    position: 'relative',
                    zIndex: 2,
                    color: item.highlight
                      ? '#e4f141'
                      : hoveredItem === item.path ? '#E4F141' : 'inherit',
                    transition: 'color 0.3s ease',
                    fontWeight: item.highlight ? 700 : undefined,
                  }}>
                    {item.label}
                    {item.highlight && (
                      <span style={{
                        marginLeft: '5px',
                        fontSize: '0.6rem',
                        background: 'rgba(228,241,65,0.15)',
                        border: '1px solid rgba(228,241,65,0.35)',
                        borderRadius: '4px',
                        padding: '1px 5px',
                        verticalAlign: 'middle',
                        letterSpacing: '0.04em',
                        color: '#e4f141',
                      }}>FREE</span>
                    )}
                  </span>
                  
                  {/* Hover glow */}
                  <AnimatePresence>
                    {hoveredItem === item.path && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          position: 'absolute',
                          inset: '-8px -16px',
                          background: 'rgba(228,241,65,0.08)',
                          border: '1px solid rgba(228,241,65,0.15)',
                          borderRadius: '12px',
                          zIndex: -1,
                        }}
                      />
                    )}
                  </AnimatePresence>
                </MagneticLink>
              </motion.div>
            ))}
          </nav>

          {/* Actions */}
          <div className="nav-actions">
            {/* Theme Toggle */}
            <motion.button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55, duration: 0.4 }}
              whileHover={{ scale: 1.1, rotate: theme === 'light' ? 180 : -180 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {theme === 'light' ? (
                  <motion.span
                    key="moon"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >🌙</motion.span>
                ) : (
                  <motion.span
                    key="sun"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >☀️</motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <Link to="/get-started" className="button button-primary nav-cta">
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ display: 'inline-block' }}
                >
                  Start a Project
                </motion.span>
              </Link>
            </motion.div>
            
            {/* Mobile Menu Toggle */}
            <motion.button
              type="button"
              className="menu-toggle"
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span 
                animate={{
                  rotate: isOpen ? 45 : 0,
                  y: isOpen ? 6 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span 
                animate={{
                  opacity: isOpen ? 0 : 1,
                  scaleX: isOpen ? 0 : 1,
                }}
                transition={{ duration: 0.2 }}
              />
              <motion.span 
                animate={{
                  rotate: isOpen ? -45 : 0,
                  y: isOpen ? -6 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </div>
          </div>{/* end nav-shell */}
        </div>{/* end container */}
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="mobile-drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Drawer */}
            <motion.div
              className="mobile-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                background: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(10, 10, 10, 0.98)',
                backdropFilter: 'blur(30px)',
              }}
            >
              <div className="mobile-drawer-content">
                {/* Theme Toggle */}
                <motion.div
                  className="mobile-theme-toggle"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span style={{ 
                    fontSize: '1rem', 
                    fontWeight: 500,
                    color: theme === 'light' ? '#1a1a1a' : '#fff'
                  }}>
                    {theme === 'light' ? '☀️ Light Mode' : '🌙 Dark Mode'}
                  </span>
                  <button
                    onClick={toggleTheme}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      border: 'none',
                      background: theme === 'light' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(228, 241, 65, 0.15)',
                      color: theme === 'light' ? '#7c3aed' : '#E4F141',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Switch to {theme === 'light' ? 'Dark' : 'Light'}
                  </button>
                </motion.div>

                {/* Nav Links */}
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      className={`mobile-nav-link ${location.pathname === item.path ? 'is-active' : ''}`}
                      onClick={() => setIsOpen(false)}
                      style={{
                        color: item.highlight ? '#e4f141' : (theme === 'light' ? '#1a1a1a' : '#fff'),
                      }}
                    >
                      {item.label}
                      {location.pathname === item.path && (
                        <motion.span
                          layoutId="mobileActive"
                          style={{
                            position: 'absolute',
                            right: '0',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: theme === 'light' ? '#7c3aed' : '#E4F141',
                          }}
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
                
                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + navItems.length * 0.05 + 0.1 }}
                  style={{ marginTop: '1.5rem' }}
                >
                  <Link
                    to="/get-started"
                    className="button button-primary"
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '1rem',
                      fontSize: '1rem',
                    }}
                  >
                    Start a Project →
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
