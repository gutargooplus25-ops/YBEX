import { motion } from 'motion/react';
import {
  aboutIntro,
  aboutStoryBlocks,
  creatorEconomyCards,
  principles,
} from '../../content/siteData';

export default function About() {
  return (
    <section className="page-shell">
      <div className="container">
        <motion.div
          className="about-hero section-heading page-heading"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="eyebrow">{aboutIntro.eyebrow}</p>
          <h1>{aboutIntro.title}</h1>
          <p className="section-copy">
            {aboutIntro.description}
          </p>
        </motion.div>

        <motion.div
          className="about-video-stage"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75 }}
        >
          <div className="about-video-copy">
            <h2>
              Elevate Brands with
              <br />
              <span>Authentic Influence.</span>
            </h2>
            <div className="about-story-copy">
              {aboutStoryBlocks.map((block) => (
                <article key={block.title}>
                  <strong>{block.title}</strong>
                  <p>{block.description}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="about-video-frame">
            <video autoPlay muted loop playsInline>
              <source src="/video.mp4" type="video/mp4" />
            </video>
            <div className="about-video-frame-copy">
              <span>Craft Your Brand Story</span>
              <strong>with top creators</strong>
            </div>
          </div>
        </motion.div>

        <section className="creator-economy-section">
          <div className="creator-economy-media">
            <div className="creator-economy-sticky">
              <img
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80"
                alt="Creator economy"
              />
            </div>
          </div>
          <div className="creator-economy-content">
            <div className="clone-pill">
              <span>About Creator Economy</span>
            </div>
            <h2>
              The Architecture
              <br />
              <span>of Influence</span>
            </h2>
            <p>
              YBEX provides a full-service framework for ambitious brands and premier
              creators. We shape the strategy, forge the partnerships, and drive the
              systems that define modern digital growth.
            </p>
            <div className="creator-economy-cards">
              {creatorEconomyCards.map((card, index) => (
                <motion.article
                  key={card.title}
                  className="creator-economy-card"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ delay: index * 0.08, duration: 0.65 }}
                >
                  <div className="creator-economy-card-top">
                    <span>{card.label}</span>
                  </div>
                  <strong>{card.title}</strong>
                  <p>{card.description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <div className="principle-list principle-list-wide">
          {principles.map((item, index) => (
            <motion.div
              key={item}
              className="principle-item"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <span>0{index + 1}</span>
              <p>{item}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
