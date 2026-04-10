import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { featuredProjects, marqueeItems, services, stats } from '../../content/siteData';

const heroBadges = ['Motion Design', 'Creator Launches', 'Premium UI', 'Cinematic React'];
const experienceSteps = [
  'Scroll-led pacing',
  'Layered depth',
  'High-contrast typography',
  'Fluid hover feedback',
];

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const orbLift = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <>
      <section className="hero-cinematic" ref={heroRef}>
        <motion.div className="hero-video-shell" style={{ y: heroY, scale: heroScale }}>
          <video className="hero-video" autoPlay muted loop playsInline>
            <source src="/video.mp4" type="video/mp4" />
          </video>
          <div className="hero-video-overlay" />
        </motion.div>

        <motion.div className="hero-light hero-light-left" style={{ y: orbY }} />
        <motion.div className="hero-light hero-light-right" style={{ y: orbLift }} />

        <div className="container hero-cinematic-grid">
          <motion.div
            className="hero-intro"
            initial={{ opacity: 0, y: 42 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="hero-kicker">YBEX Creative Motion Studio</span>
            <h1 className="hero-display">
              Smooth,
              <br />
              cinematic,
              <br />
              award-style web design.
            </h1>
            <p className="hero-lead">
              Built to feel premium from the first frame with motion, depth, video, and a sharper visual rhythm.
            </p>

            <div className="hero-cta-row">
              <Link to="/get-started" className="button button-primary">
                Start Your Project
              </Link>
              <Link to="/portfolio" className="button button-secondary">
                View Showreel Style Work
              </Link>
            </div>

            <div className="hero-badge-row">
              {heroBadges.map((badge, index) => (
                <motion.span
                  key={badge}
                  className="hero-badge-pill"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.08, duration: 0.6 }}
                >
                  {badge}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="hero-visual-stack"
            initial={{ opacity: 0, y: 56 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 1 }}
          >
            <motion.div
              className="hero-floating-card hero-card-primary"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span>Creative launch system</span>
              <strong>Video, glow, movement, and a clear luxury feel.</strong>
            </motion.div>

            <motion.div
              className="hero-monitor"
              whileHover={{ rotateX: -3, rotateY: 6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 160, damping: 18 }}
            >
              <div className="hero-monitor-top">
                <span />
                <span />
                <span />
              </div>
              <div className="hero-monitor-screen">
                <video className="hero-monitor-video" autoPlay muted loop playsInline>
                  <source src="/video.mp4" type="video/mp4" />
                </video>
                <div className="hero-monitor-ui">
                  <p>YBEX Motion Campaign</p>
                  <strong>Immersive web experience</strong>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="hero-floating-card hero-card-secondary"
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span>Experience score</span>
              <strong>Designed to feel alive on every scroll.</strong>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="marquee-strip marquee-strip-strong">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </section>

      <section className="section-block section-tight">
        <div className="container stats-row stats-row-luxury">
          {stats.map((item, index) => (
            <motion.div
              key={item.label}
              className="stat-panel stat-panel-glow"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.08, duration: 0.7 }}
              whileHover={{ y: -6 }}
            >
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-block experience-section">
        <div className="container experience-grid">
          <motion.div
            className="experience-copy"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8 }}
          >
            <p className="eyebrow">Better visual experience</p>
            <h2 className="section-title-big">Less text. More feeling. More motion. More polish.</h2>
            <p className="section-copy">
              This version shifts the focus from heavy copy to mood, contrast, motion layers, and a cleaner professional presentation.
            </p>

            <div className="experience-steps">
              {experienceSteps.map((step, index) => (
                <motion.div
                  key={step}
                  className="experience-step"
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: index * 0.08, duration: 0.6 }}
                >
                  <span>0{index + 1}</span>
                  <p>{step}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="experience-stage"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9 }}
          >
            <div className="experience-ring" />
            <div className="experience-card experience-card-top">
              <span>UI Atmosphere</span>
              <strong>Editorial type with soft cinematic lighting</strong>
            </div>
            <div className="experience-card experience-card-middle">
              <span>Motion Language</span>
              <strong>Hover lift, reveal timing, and layered transitions</strong>
            </div>
            <div className="experience-card experience-card-bottom">
              <span>Professional Finish</span>
              <strong>Luxury depth without losing clarity or speed</strong>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-block">
        <div className="container">
          <motion.div
            className="section-heading section-heading-compact"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75 }}
          >
            <p className="eyebrow">Creative services</p>
            <h2 className="section-title-big">Built as a premium visual system, not a static company website.</h2>
          </motion.div>

          <div className="service-ribbon">
            {services.map((service, index) => (
              <motion.article
                key={service.title}
                className="service-card service-card-rich"
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.08, duration: 0.7 }}
                whileHover={{ y: -10, rotate: index % 2 === 0 ? -1 : 1 }}
              >
                <p>{service.eyebrow}</p>
                <h3>{service.title}</h3>
                <span>{service.description}</span>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="container">
          <motion.div
            className="section-heading section-heading-compact"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75 }}
          >
            <p className="eyebrow">Selected work</p>
            <h2 className="section-title-big">Showcase cards that feel like campaign frames.</h2>
          </motion.div>

          <div className="project-grid project-grid-cinematic">
            {featuredProjects.map((project, index) => (
              <motion.article
                key={project.title}
                className="project-card project-card-cinematic"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.08, duration: 0.7 }}
                whileHover={{ y: -10 }}
              >
                <div className="project-media">
                  <video autoPlay muted loop playsInline>
                    <source src="/video.mp4" type="video/mp4" />
                  </video>
                </div>
                <div className="project-copy">
                  <p>{project.category}</p>
                  <h3>{project.title}</h3>
                  <strong>{project.impact}</strong>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="container cta-banner cta-banner-premium">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.75 }}
          >
            <p className="eyebrow">Ready for the next level</p>
            <h2 className="section-title-big">Let’s turn YBEX into the smooth, high-end animated website you actually wanted.</h2>
          </motion.div>
          <Link to="/contact" className="button button-primary">
            Build The Final Version
          </Link>
        </div>
      </section>
    </>
  );
}
