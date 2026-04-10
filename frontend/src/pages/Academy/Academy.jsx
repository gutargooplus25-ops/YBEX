import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { academyTracks } from '../../content/siteData';

export default function Academy() {
  return (
    <section className="page-shell">
      <div className="container">
        <motion.div className="section-heading page-heading" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="eyebrow">Academy</p>
          <h1>Creative learning paths for teams who want better taste, better storytelling, and better execution.</h1>
          <p className="section-copy">
            Build internal intuition for motion, visual hierarchy, and campaign thinking so every release feels more intentional.
          </p>
        </motion.div>

        <div className="feature-grid">
          {academyTracks.map((track, index) => (
            <motion.article
              key={track.title}
              className="feature-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <p>Track 0{index + 1}</p>
              <h3>{track.title}</h3>
              <span>{track.description}</span>
            </motion.article>
          ))}
        </div>

        <div className="page-cta">
          <Link to="/contact" className="button button-secondary">Plan a workshop</Link>
        </div>
      </div>
    </section>
  );
}
