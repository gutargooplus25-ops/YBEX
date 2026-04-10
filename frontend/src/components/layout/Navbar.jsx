// src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Academy', path: '/academy' },
    { label: 'Contact', path: '/contact' },
    { label: 'About', path: '/about' },
  ];

  return (
    <header 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled 
          ? 'rgba(10, 10, 26, 0.95)' 
          : 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(88, 84, 156, 0.2)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
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
        <Link to="/" style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          letterSpacing: '0.1em',
          color: '#ffffff',
        }}>
          YB<span style={{ color: '#58549C' }}>EX</span>
        </Link>
        
        <nav style={{ display: 'flex', gap: '2rem' }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                color: location.pathname === item.path 
                  ? '#ffffff' 
                  : 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color 0.2s',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
<<<<<<< HEAD

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
=======
        
        <Link 
          to="/get-started" 
>>>>>>> 177a709 (added hero section animation and UI improvements)
          style={{
            padding: '0.5rem 1.5rem',
            background: 'linear-gradient(135deg, #58549C, #6a67b8)',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            transition: 'all 0.3s ease',
          }}
        >
          Get Started
        </Link>
      </div>
<<<<<<< HEAD

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
=======
>>>>>>> 177a709 (added hero section animation and UI improvements)
    </header>
  );
}