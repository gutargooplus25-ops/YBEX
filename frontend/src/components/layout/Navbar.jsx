import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { navItems } from '../../content/siteData';

export default function Navbar() {
  const [isOpen, setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const menuRef  = useRef(null);

  // Don't render on admin pages
  if (location.pathname.startsWith('/admin')) return null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
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
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`} ref={menuRef}>
      <div className="container nav-shell nav-shell-clone">

        {/* Brand */}
        <Link to="/" className="brand-mark" aria-label="YBEX home">
          <span className="brand-mark-word">YBEX</span>
          <small className="brand-mark-tag">Creative Motion Studio</small>
        </Link>

        {/* Desktop nav */}
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? 'is-active' : ''}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA + hamburger */}
        <div className="nav-actions">
          <Link to="/get-started" className="button button-primary nav-cta">
            Start a Project
          </Link>
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            <span style={{
              transform: isOpen ? 'translateY(7px) rotate(45deg)' : 'none',
              transition: 'transform 0.28s ease',
            }} />
            <span style={{
              opacity: isOpen ? 0 : 1,
              transform: isOpen ? 'scaleX(0)' : 'scaleX(1)',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
            }} />
            <span style={{
              transform: isOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
              transition: 'transform 0.28s ease',
            }} />
          </button>
        </div>
      </div>

      {/* Mobile menu — animated */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-nav"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {navItems.map((item, i) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? 'is-active' : ''}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navItems.length * 0.04, duration: 0.3 }}
            >
              <Link
                to="/get-started"
                className="button button-primary mobile-nav-cta"
                onClick={() => setIsOpen(false)}
              >
                Start a Project
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
