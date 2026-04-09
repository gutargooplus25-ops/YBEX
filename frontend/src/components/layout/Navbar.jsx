import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useScroll from '../../hooks/useScroll';

const offeringsItems = [
  { label: '9-Day Brand Challenge', path: '/offerings#brand-challenge' },
  { label: 'Creators Academy',      path: '/offerings#creators-academy' },
  { label: 'In House Team',         path: '/offerings#in-house-team' },
  { label: 'Idea Pitch',            path: '/offerings#idea-pitch' },
];

const mainLinks = [
  { label: 'Home',      path: '/' },
  { label: 'Services',  path: '/services' },
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'Academy',   path: '/academy' },
  { label: 'Contact',   path: '/contact' },
  { label: 'About',     path: '/about' },
];

const linkStyle = (isActive) =>
  `text-sm font-medium transition-colors duration-200 ${
    isActive ? 'text-white' : 'text-white/60 hover:text-white'
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const scrolled = useScroll(20);
  const location = useLocation();
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropRef = useRef(null);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // close mobile on route change
  useEffect(() => { setMobileOpen(false); }, [location]);

  const isOfferingsActive = location.pathname === '/offerings';

  return (
    <header
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        backgroundColor: scrolled ? 'rgba(0,0,0,0.97)' : '#000000',
        borderBottom: '1px solid rgba(88,84,156,0.2)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.5rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '0.15em',
        }}>
          YB<span style={{ color: '#58549C' }}>EX</span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden-mobile">
          <NavLink to="/" end className={({ isActive }) => linkStyle(isActive)}>
            Home
          </NavLink>

          {/* Offerings Dropdown */}
          <div ref={dropRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setDropOpen(!dropOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: isOfferingsActive ? '#ffffff' : 'rgba(255,255,255,0.6)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={(e) => e.currentTarget.style.color = isOfferingsActive ? '#ffffff' : 'rgba(255,255,255,0.6)'}
            >
              Offerings
              <svg
                style={{
                  width: '12px', height: '12px',
                  transition: 'transform 0.2s',
                  transform: dropOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Panel */}
            {dropOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 12px)',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '220px',
                backgroundColor: '#000000',
                border: '1px solid rgba(88,84,156,0.35)',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                animation: 'fadeUp 0.2s ease forwards',
              }}>
                {offeringsItems.map(({ label, path }, i) => (
                  <Link
                    key={label}
                    to={path}
                    onClick={() => setDropOpen(false)}
                    style={{
                      display: 'block',
                      padding: '0.75rem 1.25rem',
                      fontSize: '0.85rem',
                      color: 'rgba(255,255,255,0.75)',
                      borderBottom: i < offeringsItems.length - 1 ? '1px solid rgba(88,84,156,0.12)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(88,84,156,0.18)';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.paddingLeft = '1.5rem';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
                      e.currentTarget.style.paddingLeft = '1.25rem';
                    }}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {mainLinks.slice(1).map(({ label, path }) => (
            <NavLink key={path} to={path} className={({ isActive }) => linkStyle(isActive)}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="hidden-mobile">
          {user?.role === 'admin' ? (
            <>
              <Link
                to="/admin/dashboard"
                style={{
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#ff4500',
                  border: '1px solid rgba(255,69,0,0.4)',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  background: 'rgba(255,69,0,0.08)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,69,0,0.18)';
                  e.currentTarget.style.borderColor = '#ff4500';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,69,0,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255,69,0,0.4)';
                }}
              >
                Admin Panel
              </Link>
              <button
                onClick={logout}
                className="btn-outline"
                style={{ padding: '0.5rem 1.25rem' }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/get-started" className="btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#ffffff',
            padding: '4px',
          }}
          className="show-mobile"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          backgroundColor: '#000000',
          borderTop: '1px solid rgba(88,84,156,0.2)',
          padding: '1rem 1.5rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
        }}>
          {[{ label: 'Home', path: '/' }, { label: 'Offerings', path: '/offerings' }, ...mainLinks.slice(1)].map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              style={{
                padding: '0.75rem 0',
                color: 'rgba(255,255,255,0.75)',
                fontSize: '0.95rem',
                fontWeight: 500,
                borderBottom: '1px solid rgba(88,84,156,0.1)',
              }}
            >
              {label}
            </Link>
          ))}
          {user?.role === 'admin' ? (
            <>
              <Link
                to="/admin/dashboard"
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1rem',
                  color: '#ff4500',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  border: '1px solid rgba(255,69,0,0.4)',
                  borderRadius: '8px',
                  background: 'rgba(255,69,0,0.08)',
                  textAlign: 'center',
                }}
              >
                Admin Panel
              </Link>
              <button
                onClick={logout}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.75rem 1rem',
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/get-started" className="btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>
              Get Started
            </Link>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
      `}</style>
    </header>
  );
}
