import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import {
  aboutHighlightCopy,
  clientLogos,
  heroGallery,
  marqueeItems,
  serviceCards,
  serviceHighlights,
  talentProfiles,
} from '../../content/siteData';
import axiosInstance from '../../api/axiosInstance';

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace('/api', '');
const toAbsUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_BASE}${url}`;
};

export default function Home() {
  const aboutSectionRef = useRef(null);
  const heroGalleryRef = useRef(null);
  const heroSectionRef = useRef(null);
  const [aboutProgress, setAboutProgress] = useState(0);
  const [heroExpanded, setHeroExpanded] = useState(false);
  const [heroTilt, setHeroTilt] = useState({ x: 0, y: 0 });
  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(true);

  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroSectionRef,
    offset: ['start start', 'end start'],
  });
  const heroParallax = useTransform(heroScrollProgress, [0, 1], ['0%', '14%']);
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 0.92]);
  const springRotateX = useSpring(heroTilt.x, { stiffness: 120, damping: 20, mass: 0.4 });
  const springRotateY = useSpring(heroTilt.y, { stiffness: 120, damping: 20, mass: 0.4 });

  useEffect(() => {
    const updateProgress = () => {
      const section = aboutSectionRef.current;

      if (!section) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const total = rect.height + viewportHeight * 0.6;
      const travelled = viewportHeight - rect.top;
      const progress = Math.min(Math.max(travelled / total, 0), 1);

      setAboutProgress(progress);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  useEffect(() => {
    const section = heroGalleryRef.current;

    if (!section) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeroExpanded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.45 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const aboutWords = useMemo(() => aboutHighlightCopy.split(' '), []);
  const talentTopRow = talentProfiles.slice(0, 4);
  const talentBottomRow = talentProfiles.slice(4);

  // Fetch brands from backend
  useEffect(() => {
    axiosInstance.get('/brands')
      .then((res) => setBrands(res.data.brands || []))
      .catch(() => setBrands([]))
      .finally(() => setBrandsLoading(false));
  }, []);

  // Mobile gallery: tap cover to fan out cards
  const [mobileGalleryOpen, setMobileGalleryOpen] = useState(false);

  const handleHeroMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    setHeroTilt({
      x: (0.5 - py) * 12,
      y: (px - 0.5) * 16,
    });
  };

  const resetHeroTilt = () => {
    setHeroTilt({ x: 0, y: 0 });
  };

  return (
    <div className="clone-home">
      <section ref={heroSectionRef} className="clone-hero section-block">
        <div className="container">
          <motion.div
            className="clone-hero-copy"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="clone-pill hero-pill">
              <span className="hero-pill-year">2026</span>
              <span>India&apos;s #1 Talent Management Company</span>
            </div>

            <h1 className="clone-hero-title">
              We Build <span>Talent</span> Powered
              <br />
              Momentum.
            </h1>

            <p className="clone-hero-text">
              YBEX blends creator strategy, sharp production, and growth-ready execution
              to turn ideas into campaigns, content, and brands that actually move.
            </p>
          </motion.div>

          {/* ── Desktop gallery ── */}
          <motion.div
            ref={heroGalleryRef}
            className="hero-gallery-stage hero-gallery-desktop"
            style={{ y: heroParallax, scale: heroScale, rotateX: springRotateX, rotateY: springRotateY }}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.8 }}
            onMouseMove={handleHeroMove}
            onMouseLeave={resetHeroTilt}
          >
            <div className="hero-gallery-glow" />
            {heroGallery.map((item, index) => (
              <article
                key={item.title}
                className={`hero-gallery-card hero-gallery-card-${index + 1} ${
                  heroExpanded ? 'is-expanded' : 'is-stacked'
                }`}
              >
                <img src={item.image} alt={item.title} />
                <div className="hero-gallery-card-copy">
                  <p>{item.title}</p>
                  <span>{item.tag}</span>
                </div>
              </article>
            ))}
          </motion.div>

          {/* ── Mobile gallery — cover stack + fan-out on tap ── */}
          <div className="hero-gallery-mobile">
            <motion.div
              className={`hero-gallery-mobile-stage${mobileGalleryOpen ? ' is-open' : ''}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
            >
              <div className="hero-gallery-mobile-glow" />

              {!mobileGalleryOpen && (
                <motion.div
                  className="hero-gallery-mobile-hint"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  onClick={() => setMobileGalleryOpen(true)}
                >
                  <span>Tap to explore</span>
                  <span className="hero-gallery-mobile-hint-arrow">↓</span>
                </motion.div>
              )}

              {heroGallery.map((item, index) => {
                const total = heroGallery.length;
                const stackRotate = (index - total / 2) * 7;
                const stackX = (index - total / 2) * 22;
                return (
                  <motion.article
                    key={item.title}
                    className="hero-gallery-mobile-card"
                    onClick={() => setMobileGalleryOpen(v => !v)}
                    animate={mobileGalleryOpen ? {
                      x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, zIndex: index + 1,
                    } : {
                      x: stackX, y: index * -5, rotate: stackRotate,
                      scale: index === 0 ? 1 : 0.9 - index * 0.03,
                      opacity: index === 0 ? 1 : 0.65 - index * 0.07,
                      zIndex: total - index,
                    }}
                    transition={{ duration: 0.42, delay: mobileGalleryOpen ? index * 0.055 : 0, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={mobileGalleryOpen ? { y: -10, scale: 1.04, zIndex: 20 } : {}}
                  >
                    <img src={item.image} alt={item.title} loading="lazy" />
                    <div className="hero-gallery-mobile-card-copy">
                      <span className="hero-gallery-mobile-tag">{item.tag}</span>
                      <p>{item.title}</p>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>

            {mobileGalleryOpen && (
              <motion.button
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                onClick={() => setMobileGalleryOpen(false)}
                className="hero-gallery-mobile-close"
              >
                ↑ Collapse
              </motion.button>
            )}
          </div>
        </div>
      </section>

      <section className="section-block services-panel">
        <div className="container">
          <div className="services-grid">
            {serviceCards.map((card, index) => (
              <motion.article
                key={card.title}
                className="service-panel-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.65, delay: index * 0.08 }}
              >
                <div className="service-panel-icon">{String(index + 1).padStart(2, '0')}</div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <Link to="/services" className="service-card-cta">
                  {card.cta}
                </Link>
              </motion.article>
            ))}
          </div>

          <div className="services-marquee-shell">
            <div className="clone-marquee clone-marquee-services">
              {[...marqueeItems, ...marqueeItems].map((item, index) => (
                <span key={`${item}-${index}`}>{item}</span>
              ))}
            </div>
          </div>

          <div className="service-highlights-grid">
            {serviceHighlights.map((item, index) => (
              <motion.article
                key={item.title}
                className="service-highlight-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.07 }}
              >
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block clients-section">
        <div className="container clients-shell">
          <div className="clone-pill">
            <span>Our Clients</span>
          </div>

          <div className="clients-copy">
            <h2>
              Our Clients: Leading
              <br />
              <span>Brands That Trust YBEX</span>
            </h2>
            <p>
              We partner with growth-focused brands across categories and build creator-led
              systems that feel premium, measurable, and culturally aligned.
            </p>
          </div>

          {brandsLoading ? (
            <div className="clients-marquee-stack">
              <div className="logo-marquee">
                <motion.div
                  className="logo-marquee-track"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ display: 'flex', gap: '24px' }}
                >
                  {[...Array(8)].map((_, i) => (
                    <div key={i} style={{
                      minWidth: '120px', height: '72px', borderRadius: '20px',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    }} />
                  ))}
                </motion.div>
              </div>
            </div>
          ) : brands.length > 0 ? (
            <div className="clients-marquee-stack">
              <div className="logo-marquee">
                <motion.div
                  className="logo-marquee-track"
                  animate={{ x: ['0%', '-50%'] }}
                  transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
                >
                  {[...brands, ...brands].map((brand, index) => (
                    <motion.a
                      key={`${brand._id}-${index}`}
                      href={brand.websiteLink}
                      target="_blank"
                      rel="noreferrer"
                      className="logo-pill logo-pill-brand"
                      whileHover={{ scale: 1.08, y: -4, boxShadow: '0 12px 30px rgba(228,241,65,0.2)' }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        position: 'relative',
                        textDecoration: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <img
                        src={toAbsUrl(brand.logoUrl)}
                        alt={brand.name}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '50px',
                          objectFit: 'contain',
                          filter: 'brightness(0.9)',
                          transition: 'filter 0.3s',
                        }}
                        onMouseEnter={(e) => e.target.style.filter = 'brightness(1.1)'}
                        onMouseLeave={(e) => e.target.style.filter = 'brightness(0.9)'}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          position: 'absolute',
                          bottom: '-32px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'rgba(0,0,0,0.9)',
                          border: '1px solid rgba(228,241,65,0.3)',
                          borderRadius: '8px',
                          padding: '4px 10px',
                          fontSize: '0.65rem',
                          color: '#e4f141',
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                          whiteSpace: 'nowrap',
                          pointerEvents: 'none',
                          zIndex: 10,
                        }}
                      >
                        🔗 {brand.name}
                      </motion.div>
                    </motion.a>
                  ))}
                </motion.div>
              </div>

              <div className="logo-marquee logo-marquee-reverse">
                <motion.div
                  className="logo-marquee-track"
                  animate={{ x: ['-50%', '0%'] }}
                  transition={{ duration: 32, ease: 'linear', repeat: Infinity }}
                >
                  {[...brands.slice().reverse(), ...brands.slice().reverse()].map((brand, index) => (
                    <motion.a
                      key={`${brand._id}-rev-${index}`}
                      href={brand.websiteLink}
                      target="_blank"
                      rel="noreferrer"
                      className="logo-pill logo-pill-brand"
                      whileHover={{ scale: 1.08, y: -4, boxShadow: '0 12px 30px rgba(228,241,65,0.2)' }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        position: 'relative',
                        textDecoration: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <img
                        src={toAbsUrl(brand.logoUrl)}
                        alt={brand.name}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '50px',
                          objectFit: 'contain',
                          filter: 'brightness(0.9)',
                          transition: 'filter 0.3s',
                        }}
                        onMouseEnter={(e) => e.target.style.filter = 'brightness(1.1)'}
                        onMouseLeave={(e) => e.target.style.filter = 'brightness(0.9)'}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          position: 'absolute',
                          bottom: '-32px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'rgba(0,0,0,0.9)',
                          border: '1px solid rgba(228,241,65,0.3)',
                          borderRadius: '8px',
                          padding: '4px 10px',
                          fontSize: '0.65rem',
                          color: '#e4f141',
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                          whiteSpace: 'nowrap',
                          pointerEvents: 'none',
                          zIndex: 10,
                        }}
                      >
                        🔗 {brand.name}
                      </motion.div>
                    </motion.a>
                  ))}
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="clients-marquee-stack">
              <div className="logo-marquee">
                <motion.div
                  className="logo-marquee-track"
                  animate={{ x: ['0%', '-50%'] }}
                  transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
                >
                  {[...clientLogos, ...clientLogos].map((logo, index) => (
                    <span key={`${logo}-${index}`} className="logo-pill">
                      {logo}
                    </span>
                  ))}
                </motion.div>
              </div>

              <div className="logo-marquee logo-marquee-reverse">
                <motion.div
                  className="logo-marquee-track"
                  animate={{ x: ['-50%', '0%'] }}
                  transition={{ duration: 32, ease: 'linear', repeat: Infinity }}
                >
                  {[...clientLogos.slice().reverse(), ...clientLogos.slice().reverse()].map((logo, index) => (
                    <span key={`${logo}-rev-${index}`} className="logo-pill">
                      {logo}
                    </span>
                  ))}
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section ref={aboutSectionRef} className="section-block about-highlight-section">
        <div className="container about-highlight-shell">
          <div className="clone-pill">
            <span>About Us</span>
          </div>

          <p className="about-highlight-copy" aria-label={aboutHighlightCopy}>
            {aboutWords.map((word, index) => {
              const threshold = index / aboutWords.length;
              const isActive = aboutProgress >= threshold;

              return (
                <span key={`${word}-${index}`} className={isActive ? 'is-active' : ''}>
                  {word}{' '}
                </span>
              );
            })}
          </p>

          <Link to="/contact" className="button button-primary clone-book-button">
            Book an Appointment
          </Link>
        </div>
      </section>

      <section className="section-block talents-section">
        <div className="container">
          <div className="talent-marquee talent-marquee-top">
            <motion.div
              className="talent-marquee-track"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
            >
              {[...talentTopRow, ...talentTopRow].map((talent, index) => (
                <article
                  key={`${talent.name}-top-${index}`}
                  className="talent-card talent-card-marquee"
                  style={{ rotate: `${talent.rotation}deg` }}
                >
                  <img src={talent.image} alt={talent.name} />
                  <span>{talent.name}</span>
                  <small>{talent.role}</small>
                </article>
              ))}
            </motion.div>
          </div>

          <h2 className="talents-title">Our Exclusive Talents</h2>

          <div className="talent-marquee talent-marquee-bottom">
            <motion.div
              className="talent-marquee-track"
              animate={{ x: ['-50%', '0%'] }}
              transition={{ duration: 34, ease: 'linear', repeat: Infinity }}
            >
              {[...talentBottomRow, ...talentBottomRow].map((talent, index) => (
                <article
                  key={`${talent.name}-bottom-${index}`}
                  className="talent-card talent-card-marquee"
                  style={{ rotate: `${talent.rotation}deg` }}
                >
                  <img src={talent.image} alt={talent.name} />
                  <span>{talent.name}</span>
                  <small>{talent.role}</small>
                </article>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="container launch-panel">
          <div className="launch-panel-media">
            <video autoPlay muted loop playsInline>
              <source src="/video.mp4" type="video/mp4" />
            </video>
            <div className="launch-panel-overlay" />
          </div>

          <motion.div
            className="launch-panel-copy"
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7 }}
          >
            <div className="clone-pill">
              <span>Launch Your Campaign</span>
            </div>

            <h2>
              Launch Your Campaign with YBEX
              <br />
              <span>In Minutes, Not Months.</span>
            </h2>

            <p>
              Build your brand with YBEX through campaign planning, creator partnerships,
              content systems, and launch support built to move faster without losing
              quality. Ready to scale your next idea? Let&apos;s start now.
            </p>

            <div className="launch-panel-actions">
              <Link to="/contact" className="button button-primary">
                Book an Appointment
              </Link>
              <span>200+ Agencies Rated</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
