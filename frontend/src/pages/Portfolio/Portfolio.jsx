import { motion } from 'motion/react';
import { featuredProjects } from '../../content/siteData';

export default function Portfolio() {
  return (
    <section className="page-shell">
      <div className="container">
        <motion.div className="section-heading page-heading" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="eyebrow">Portfolio</p>
          <h1>Proof from campaigns, creator growth, and systems built to keep compounding.</h1>
          <p className="section-copy">
            Every project reflects the same promise: strategy first, sharp content, clean execution, and growth you can point to.
          </p>
        </motion.div>

        <div className="project-grid project-grid-large">
          {featuredProjects.map((project, index) => (
            <motion.article
              key={project.title}
              className="project-card"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: index * 0.08 }}
            >
              <p>{project.category}</p>
              <h3>{project.title}</h3>
              <strong>{project.impact}</strong>
              <span>{project.summary}</span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
