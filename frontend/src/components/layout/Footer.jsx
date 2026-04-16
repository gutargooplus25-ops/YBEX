import { Link } from 'react-router-dom';
import { footerLegalLinks, footerSocialLinks, navItems } from '../../content/siteData';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid footer-grid-premium">
        <div className="footer-brand-block">
          <p className="footer-brand">YBEX</p>
          <p className="footer-copy">
            India&apos;s No.1 talent management and influencer marketing company.
          </p>
          <p className="footer-meta">Copyright {new Date().getFullYear()} YBEX Media Pvt. Ltd.</p>
        </div>

        <div className="footer-links-column">
          <p className="footer-heading">Pages</p>
          <nav className="footer-links">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="footer-links-column">
          <p className="footer-heading">Social</p>
          <div className="footer-links">
            {footerSocialLinks.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <div className="footer-legal">
          {footerLegalLinks.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <div className="footer-watermark">YBEX</div>
    </footer>
  );
}
