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

        <motion.div
          className="invoice-cta-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="invoice-cta-card">
            <div className="invoice-cta-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div className="invoice-cta-text">
              <h4>Need to bill a client?</h4>
              <p>Create professional invoices in seconds</p>
            </div>
            <Link to="/invoice" className="button button-primary invoice-compact-btn">
              Generate Invoice
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
