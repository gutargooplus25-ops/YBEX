import { motion } from 'motion/react';
import { principles } from '../../content/siteData';

export default function About() {
  return (
    <section className="page-shell">
      <div className="container">
        <motion.div className="section-heading page-heading" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="eyebrow">About YBEX</p>
          <h1>We build visual momentum for brands that want to feel current, premium, and impossible to ignore.</h1>
          <p className="section-copy">
            The new YBEX frontend leans into cinematic pacing, creator-inspired energy, and a more confident editorial design language.
          </p>
        </motion.div>

        <div className="detail-grid">
          <motion.div className="detail-panel" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="eyebrow">Mission</p>
            <h2>Turn strategy into sensory digital experiences.</h2>
            <span>
              We connect narrative, design, and technology so each page does more than describe your brand. It makes people feel it.
            </span>
          </motion.div>
          <motion.div className="detail-panel" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}>
            <p className="eyebrow">Approach</p>
            <h2>High taste, clear hierarchy, and motion with discipline.</h2>
            <span>
              Strong websites are not busy. They are intentional. Every transition, section break, and visual accent has a job.
            </span>
          </motion.div>
        </div>

        <div className="principle-list principle-list-wide">
          {principles.map((item, index) => (
            <motion.div key={item} className="principle-item" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
              <span>0{index + 1}</span>
              <p>{item}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
