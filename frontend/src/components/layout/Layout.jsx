import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from '../common/ScrollToTop';

export default function Layout({ children }) {
  return (
    <div className="site-shell">
      <ScrollToTop />
      <Navbar />
      <main className="site-main">{children}</main>
      <Footer />
    </div>
  );
}
