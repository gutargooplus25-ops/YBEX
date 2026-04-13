import { Link } from 'react-router-dom';
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from 'motion/react';
import { useRef } from 'react';
import { featuredProjects, marqueeItems, services, stats } from '../../content/siteData';

const heroBadges = ['3D Motion', 'Premium UI', 'Sharper Type', 'Luxury Detail'];
const experienceSteps = [
  'Refined typography scale',
  '3D depth with restraint',
  'Cleaner premium hierarchy',
  'Smooth hover and scroll motion',
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
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 120, damping: 18, mass: 0.8 });
  const springRotateY = useSpring(rotateY, { stiffness: 120, damping: 18, mass: 0.8 });

  const handleHeroPointerMove = (event) => {
    const bounds = heroRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;

    rotateX.set(relativeY * -10);
    rotateY.set(relativeX * 12);
  };

  const resetHeroDepth = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <>
      <section
        className="hero-cinematic"
        ref={heroRef}
        onPointerMove={handleHeroPointerMove}
        onPointerLeave={resetHeroDepth}
      >
        <motion.div className="hero-video-shell" style={{ y: heroY, scale: heroScale }}>
          <video className="hero-video" autoPlay muted loop playsInline>
            <source src="/video.mp4" type="video/mp4" />
          </video>
          <div className="hero-video-overlay" />
        </motion.div>

        <div className="hero-depth-grid" />
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
              Premium,
              <br />
              motion-led,
              <br />
              web presence.
            </h1>
            <p className="hero-lead">
              We refined the interface with calmer typography, cinematic depth, and tasteful
              3D motion so the brand feels professional, modern, and high value.
            </p>

            <div className="hero-cta-row">
              <Link to="/get-started" className="button button-primary">
                Start Your Project
              </Link>
              <Link to="/portfolio" className="button button-secondary">
                Explore Portfolio
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

            <div className="hero-metrics">
              <div className="hero-metric">
                <strong>3D</strong>
                <span>layered hero interactions</span>
              </div>
              <div className="hero-metric">
                <strong>Clean</strong>
                <span>more balanced type hierarchy</span>
              </div>
              <div className="hero-metric">
                <strong>Premium</strong>
                <span>presentation across desktop and mobile</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual-stack"
            style={{ rotateX: springRotateX, rotateY: springRotateY }}
            initial={{ opacity: 0, y: 56 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 1 }}
          >
            <motion.div
              className="hero-floating-card hero-card-primary"
              animate={{ y: [0, -14, 0], rotateZ: [0, -1.5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span>Visual direction</span>
              <strong>Controlled glow, glass surfaces, and depth that feels expensive.</strong>
            </motion.div>

            <motion.div
              className="hero-monitor"
              whileHover={{ rotateX: -6, rotateY: 10, z: 18, scale: 1.02 }}
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
                  <p>YBEX Studio Interface</p>
                  <strong>Professional, immersive, premium</strong>
                </div>
                <div className="hero-monitor-stats">
                  <span>3D scene</span>
                  <span>Responsive layout</span>
                  <span>Elegant motion</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="hero-floating-card hero-card-secondary"
              animate={{ y: [0, 14, 0], rotateZ: [0, 1.5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span>Typography reset</span>
              <strong>Less oversized text, more rhythm, contrast, and clarity.</strong>
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
            <h2 className="section-title-big">
              A sharper visual system with depth, restraint, and confidence.
            </h2>
            <p className="section-copy">
              The updated direction removes the oversized feel and replaces it with better
              proportion, softer pacing, and a more polished premium finish.
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
            <h2 className="section-title-big">
              Built like a premium digital brand, not a loud template.
            </h2>
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
            <h2 className="section-title-big">
              Showcase panels with more depth and a cleaner luxury tone.
            </h2>
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
