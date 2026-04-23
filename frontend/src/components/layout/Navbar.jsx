import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
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
              background: 'linear-gradient(90deg, #FF3D10, #E4F141)',
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
  const menuRef = useRef(null);
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

  // Close menu on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

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
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          height: auto;
          min-height: 60px;
        }
        .site-header.is-scrolled {
          background: rgba(10, 10, 10, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        :root.light-theme .site-header.is-scrolled {
          background: rgba(250, 250, 250, 0.9);
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }
        .brand-mark {
          position: relative;
          overflow: visible;
        }
        .brand-glow {
          position: absolute;
          inset: -10px;
          background: radial-gradient(circle at center, rgba(228,241,65,0.3) 0%, transparent 70%);
          filter: blur(20px);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }
        .brand-mark:hover .brand-glow {
          opacity: 1;
        }
        .desktop-nav a {
          position: relative;
          overflow: visible;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .desktop-nav a:hover {
          transform: translateY(-2px);
          text-shadow: 0 4px 20px rgba(228, 241, 65, 0.3);
        }
        .nav-cta {
          position: relative;
          overflow: hidden;
          padding: 0.5rem 1rem !important;
          font-size: 0.8rem !important;
          min-height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nav-cta:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 20px 40px rgba(228, 241, 65, 0.3);
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
        .mobile-nav-link {
          position: relative;
          overflow: hidden;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .mobile-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #FF3D10, #E4F141);
          transition: width 0.3s ease;
        }
        .mobile-nav-link:hover::after,
        .mobile-nav-link.is-active::after {
          width: 100%;
        }
        
        /* Enhanced Menu Toggle - More Visible */
        .menu-toggle {
          display: none;
        }
        
        @media (max-width: 960px) {
          .menu-toggle {
            display: flex !important;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            border-radius: 12px;
            border: 2px solid rgba(228, 241, 65, 0.5);
            background: rgba(228, 241, 65, 0.1);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            cursor: pointer;
            padding: 10px;
            gap: 4px;
            transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
            box-shadow: 0 4px 15px rgba(228, 241, 65, 0.2);
          }
          .menu-toggle:hover {
            background: rgba(228, 241, 65, 0.2);
            border-color: rgba(228, 241, 65, 0.8);
            transform: scale(1.05);
            box-shadow: 0 6px 25px rgba(228, 241, 65, 0.35);
          }
          :root.light-theme .menu-toggle {
            border: 2px solid rgba(124, 58, 237, 0.5);
            background: rgba(124, 58, 237, 0.1);
            box-shadow: 0 4px 15px rgba(124, 58, 237, 0.2);
          }
          :root.light-theme .menu-toggle:hover {
            background: rgba(124, 58, 237, 0.2);
            border-color: rgba(124, 58, 237, 0.8);
            box-shadow: 0 6px 25px rgba(124, 58, 237, 0.35);
          }
          .menu-toggle span {
            display: block;
            width: 22px;
            height: 2.5px;
            border-radius: 3px;
            transition: all 0.3s ease;
            box-shadow: 0 0 8px rgba(228, 241, 65, 0.5);
          }
          :root.light-theme .menu-toggle span {
            box-shadow: 0 0 8px rgba(124, 58, 237, 0.5);
          }
        }
        
        /* Mobile Navbar Fixes - Compact */
        @media (max-width: 768px) {
          .site-header {
            min-height: 52px;
          }
          .nav-shell-clone {
            padding: 0.5rem 0.75rem !important;
          }
          .brand-mark-word {
            font-size: 1.1rem !important;
          }
          .brand-mark-tag {
            font-size: 0.55rem !important;
            letter-spacing: 0.08em !important;
          }
          .nav-cta {
            display: none !important;
          }
          .menu-toggle {
            width: 40px !important;
            height: 40px !important;
            padding: 8px !important;
            gap: 3px !important;
          }
          .menu-toggle span {
            width: 20px !important;
            height: 2px !important;
          }
          .mobile-nav {
            top: 52px !important;
          }
          .mobile-nav-link {
            padding: 0.75rem 0 !important;
            font-size: 1rem !important;
          }
        }
      `}</style>

      <motion.header 
        className={`site-header ${scrolled ? 'is-scrolled' : ''}`} 
        ref={menuRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container nav-shell nav-shell-clone">

          {/* Animated Brand Logo */}
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
            <motion.small 
              className="brand-mark-tag"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              Creative Motion Studio
            </motion.small>
          </Link>

          {/* Desktop nav with magnetic effect */}
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
                    color: hoveredItem === item.path ? '#E4F141' : 'inherit',
                    transition: 'color 0.3s ease'
                  }}>
                    {item.label}
                  </span>
                  
                  {/* Hover glow background */}
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

          {/* Desktop CTA + Theme Toggle + Animated Hamburger */}
          <div className="nav-actions">
            {/* Theme Toggle Button */}
            <motion.button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
              transition={{ delay: 0.6, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
            
            {/* Mobile Menu Toggle - More visible with reduced spacing */}
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
              style={{
                display: 'none', // Hidden on desktop
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                border: '2px solid rgba(228, 241, 65, 0.4)',
                background: 'rgba(228, 241, 65, 0.1)',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                padding: '10px',
                gap: '4px',
              }}
            >
              <motion.span 
                animate={{
                  rotate: isOpen ? 45 : 0,
                  y: isOpen ? 6 : 0,
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ 
                  display: 'block', 
                  width: '22px', 
                  height: '2.5px', 
                  background: theme === 'light' ? '#1a1a1a' : '#E4F141',
                  borderRadius: '3px',
                  boxShadow: '0 0 8px rgba(228, 241, 65, 0.5)',
                }}
              />
              <motion.span 
                animate={{
                  opacity: isOpen ? 0 : 1,
                  scaleX: isOpen ? 0 : 1,
                }}
                transition={{ duration: 0.2 }}
                style={{ 
                  display: 'block', 
                  width: '22px', 
                  height: '2.5px', 
                  background: theme === 'light' ? '#1a1a1a' : '#E4F141',
                  borderRadius: '3px',
                  boxShadow: '0 0 8px rgba(228, 241, 65, 0.5)',
                  transformOrigin: 'center'
                }}
              />
              <motion.span 
                animate={{
                  rotate: isOpen ? -45 : 0,
                  y: isOpen ? -6 : 0,
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ 
                  display: 'block', 
                  width: '22px', 
                  height: '2.5px', 
                  background: theme === 'light' ? '#1a1a1a' : '#E4F141',
                  borderRadius: '3px',
                  boxShadow: '0 0 8px rgba(228, 241, 65, 0.5)',
                }}
              />
            </motion.button>
          </div>
        </div>

        {/* Mobile menu — Premium animated */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="mobile-nav"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(10, 10, 10, 0.95)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                borderTop: `1px solid ${theme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'}`,
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '1.5rem' }}>
                {/* Theme Toggle in Mobile Menu */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ delay: 0, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 0',
                    borderBottom: `1px solid ${theme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)'}`,
                  }}
                >
                  <span style={{ 
                    fontSize: '1.1rem', 
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
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Switch to {theme === 'light' ? 'Dark' : 'Light'}
                  </button>
                </motion.div>

                {navItems.map((item, i) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ 
                      delay: (i + 1) * 0.05, 
                      duration: 0.3,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    <Link
                      to={item.path}
                      className={`mobile-nav-link ${location.pathname === item.path ? 'is-active' : ''}`}
                      onClick={() => setIsOpen(false)}
                      style={{
                        display: 'block',
                        padding: '0.85rem 0',
                        fontSize: '1.15rem',
                        fontWeight: 500,
                        borderBottom: `1px solid ${theme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)'}`,
                        position: 'relative',
                        color: theme === 'light' ? '#1a1a1a' : '#fff',
                      }}
                    >
                      <motion.span
                        whileHover={{ x: 10, color: theme === 'light' ? '#7c3aed' : '#E4F141' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        style={{ display: 'inline-block' }}
                      >
                        {item.label}
                      </motion.span>
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
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ 
                    delay: navItems.length * 0.05 + 0.1, 
                    duration: 0.3 
                  }}
                  style={{ marginTop: '1.5rem' }}
                >
                  <Link
                    to="/get-started"
                    className="button button-primary mobile-nav-cta"
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '1rem',
                      fontSize: '1rem',
                    }}
                  >
                    <motion.span
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ display: 'inline-block' }}
                    >
                      Start a Project →
                    </motion.span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
