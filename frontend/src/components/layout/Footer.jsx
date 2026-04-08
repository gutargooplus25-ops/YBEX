import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#000000',
      borderTop: '1px solid rgba(88,84,156,0.2)',
      padding: '3rem 1.5rem',
      marginTop: '4rem',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
      }}>
        <div>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.15em' }}>
            YB<span style={{ color: '#58549C' }}>EX</span>
          </p>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.25rem' }}>
            Build. Scale. Succeed.
          </p>
        </div>

        <nav style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {[['About', '/about'], ['Services', '/services'], ['Portfolio', '/portfolio'], ['Contact', '/contact']].map(([label, path]) => (
            <Link
              key={path}
              to={path}
              style={{
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.5)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            >
              {label}
            </Link>
          ))}
        </nav>

        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
          © {new Date().getFullYear()} YBEX. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
