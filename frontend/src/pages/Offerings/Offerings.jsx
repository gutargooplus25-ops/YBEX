import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { services } from '../../content/siteData';

export default function Offerings() {
  return (
    <section className="page-shell">
      <div className="container">
        <motion.div className="section-heading page-heading" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="eyebrow">Offerings</p>
          <h1>Flexible engagement models for launches, rebrands, and high-impact front-end redesigns.</h1>
        </motion.div>

        <div className="feature-grid">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              className="feature-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <p>{service.eyebrow}</p>
              <h3>{service.title}</h3>
              <span>{service.description}</span>
            </motion.article>
          ))}
        </div>

        <div className="page-cta">
          <Link to="/get-started" className="button button-primary">Choose your direction</Link>
        </div>
      </div>
    </section>
  );
}
