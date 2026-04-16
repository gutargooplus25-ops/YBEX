import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { services } from '../../content/siteData';

export default function Services() {
  return (
    <section className="page-shell">
      <div className="container">
        <motion.div className="section-heading page-heading" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="eyebrow">Services</p>
          <h1>Execution services for brands and creators that want real momentum, not random activity.</h1>
          <p className="section-copy">
            We plug into strategy, creator partnerships, content planning, production, and growth so every moving part works together.
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
            <h2>From sharp brief to campaign running live.</h2>
            <span>
              We identify the audience, shape the angle, align creators or formats, then manage execution with fast feedback loops.
            </span>
          </div>
          <div className="detail-panel">
            <p className="eyebrow">Output</p>
            <h2>Content and campaigns that look premium and perform like systems.</h2>
            <span>
              The goal is consistency, compounding reach, and cleaner reporting so growth is visible and repeatable.
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
