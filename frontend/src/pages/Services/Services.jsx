import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { services } from '../../content/siteData';

export default function Services() {
  return (
    <section className="page-shell">
      <div className="container">
        <motion.div className="section-heading page-heading" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="eyebrow">Services</p>
          <h1>Creative systems designed to make your brand look sharper, move better, and convert harder.</h1>
          <p className="section-copy">
            We shape the full experience: visual tone, motion hierarchy, campaign storytelling, and the front-end build that brings it together.
          </p>
        </motion.div>

        <div className="feature-grid">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: index * 0.08 }}
            >
              <p>{service.eyebrow}</p>
              <h3>{service.title}</h3>
              <span>{service.description}</span>
            </motion.article>
          ))}
        </div>

        <motion.div className="detail-grid" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}>
          <div className="detail-panel">
            <p className="eyebrow">Process</p>
            <h2>From reference moodboards to polished launch flows.</h2>
            <span>
              We start with narrative and audience intent, then define visual direction, section pacing, content priorities, and motion rules before development begins.
            </span>
          </div>
          <div className="detail-panel">
            <p className="eyebrow">Output</p>
            <h2>Pages that feel editorial, animated, and conversion-aware.</h2>
            <span>
              Every build is designed to hold attention with strong hierarchy while still staying easy to navigate on desktop and mobile.
            </span>
          </div>
        </motion.div>

        <div className="page-cta">
          <Link to="/contact" className="button button-primary">
            Discuss your project
          </Link>
        </div>
      </div>
    </section>
  );
}
