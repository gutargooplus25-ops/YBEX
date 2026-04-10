import { Link } from 'react-router-dom';
import { navItems } from '../../content/siteData';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-brand">YBEX</p>
          <p className="footer-copy">
            Motion-led design, creator campaigns, and premium digital launches for ambitious brands.
          </p>
        </div>

        <nav className="footer-links">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="footer-meta">
          <p>hello@ybex.studio</p>
          <p>New Delhi, India</p>
          <p>Copyright {new Date().getFullYear()} YBEX Studio</p>
        </div>
      </div>
    </footer>
  );
}
