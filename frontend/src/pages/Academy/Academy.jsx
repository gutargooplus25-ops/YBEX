import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';

/* ─── DATA ─────────────────────────────────────────────────────────── */
const pillars = [
  {
    iconEmoji: '🎬',
    title: 'Content Creation Mastery',
    desc: 'Learn the art of storytelling, high-end video editing, and viral hook techniques used by the world\'s top creators.',
  },
  {
    iconEmoji: '📊',
    title: 'Digital Marketing Pro',
    desc: 'Master performance marketing, SEO, and social media algorithms to scale any brand or personal profile effectively.',
  },
  {
    iconEmoji: '👥',
    title: 'Learn from Founders & Creators',
    desc: 'Direct mentorship from industry leaders who have built million-dollar media houses and successful digital brands.',
  },
  {
    iconEmoji: '🏢',
    title: 'Franchise Opportunity',
    desc: 'Exclusive access to our business model, enabling you to launch your own YBEX-powered media education hub.',
  },
];

const curriculumTracks = [
  {
    title: 'Content Creation',
    desc: 'Master the art of visual storytelling and high-retention editing that drives millions of views.',
    modules: ['Thumbnails & Design', 'Premium Editing', 'Storyboarding', 'Color Grading'],
    points: [
      'Photoshop mastery for viral thumbnail design',
      'Advanced Premier Pro & After Effects workflows',
      'Scriptwriting frameworks for high retention',
      'Sound design and color science for cinematic output',
      'Build a professional portfolio from day one',
    ],
  },
  {
    title: 'Digital Marketing',
    desc: 'Learn how to turn attention into revenue through performance marketing and sales funnels.',
    modules: ['Funnel Building', 'Meta & YT Ads', 'Copywriting', 'Data Analytics'],
    points: [
      'Building high-converting landing pages',
      'Psychology-backed copywriting for sales',
      'Scaling Meta and YouTube ad campaigns',
      'CRM automation and email marketing systems',
      'Conversion rate optimization (CRO) strategies',
    ],
  },
];

const premiumFeatures = [
  { iconEmoji: '💻', title: 'High-End Workstations', desc: 'Access to professional-grade editing rigs and software suites.' },
  { iconEmoji: '🎙️', title: 'Studio Access', desc: 'Record your content in our fully equipped production studios.' },
  { iconEmoji: '🧑‍🏫', title: 'One-on-One Mentorship', desc: 'Direct face-to-face guidance from industry veterans.' },
  { iconEmoji: '🤝', title: 'Creator Community Hub', desc: 'Network with other creators in a dedicated co-working space.' },
];

const mentors = [
  { name: 'Ravi', role: 'FOUNDER OF YBEX', initials: 'R' },
  { name: 'Sharadh', role: 'FOUNDER OF GUTARGOO+', initials: 'S' },
];

const faqs = [
  { q: 'Will I get a job after the course?', a: 'Yes, YBEX offers dedicated placement support. We have tie-ups with leading media houses and content creation agencies to help our students secure roles that match their skills and interests.' },
  { q: 'Who will I learn from?', a: 'You will learn directly from Ravi (Founder of YBEX), Sharadh (Founder of Gutargoo+), and 10+ specialized guest lecturers from the industry.' },
  { q: 'Do I need any prior experience?', a: 'No prior experience is needed. Our curriculum is designed to take you from zero to industry-ready, regardless of your background.' },
  { q: 'Is there a scholarship available?', a: 'Yes! The YBEX Talent Fund offers 100% scholarships for students with exceptional potential. Apply through our scholarship program.' },
  { q: 'What tools will I learn?', a: 'Adobe Premiere Pro, After Effects, Photoshop, Meta Ads Manager, Google Analytics, Notion, and many more industry-standard tools.' },
];

const franchiseStats = [
  { value: '5+', label: 'CITIES' },
  { value: '3L+', label: 'REVENUE' },
  { value: '6 Months', label: 'BREAK EVEN' },
  { value: '100%', label: 'SUPPORT' },
];

// Static placement brands as fallback
const staticPlacementBrands = [
  'ScrollStop Media', 'OnTheRise Media', 'ScoopWhoop', 'Mad Over Marketing',
  'The Viral Fever', 'SocialSamosa', 'FilterCopy', 'Pocket Aces', 'BeerBiceps',
  'Under 25', 'GrowthSchool', 'BigBrainco.'
];

// Static success stories as fallback
const staticSuccessStories = [
  { name: 'ARYAN MEHTA', role: 'CONTENT CREATOR', quote: 'YBEX se seekha ki viral kaise hote hain. Aaj main apna brand khud manage karta hoon.', earning: '₹3.2L/mo', company: 'SELF-BUILT', initials: 'AM' },
  { name: 'PRIYA SINGH', role: 'DIGITAL MARKETER', quote: 'From a student to heading digital at a top FMCG brand. YBEX is where it started.', earning: '₹1.8L/mo', company: 'MAMAEARTH', initials: 'PS' },
  { name: 'RAHUL VERMA', role: 'BRAND STRATEGIST', quote: 'I learned execution here. Now I\'m working with the best brands in the country.', earning: '₹2.4L/mo', company: 'RAZORPAY', initials: 'RV' },
  { name: 'SNEHA PATEL', role: 'UGC CREATOR', quote: 'Monthly lakhs earning while sitting at home. YBEX school made me a real creator.', earning: '₹4.5L/mo', company: 'SELF-BUILT', initials: 'SP' },
  { name: 'VIKRAM DAS', role: 'GROWTH MANAGER', quote: 'Learned from Founders Cabin. Now working in a top-floor office at a global company.', earning: '₹1.6L/mo', company: 'VEDANTU', initials: 'VD' },
  { name: 'ANANYA SHARMA', role: 'INFLUENCER & SPEAKER', quote: 'I was just a student. YBEX built my profile and now brands pay me lakhs.', earning: '₹6.2L/mo', company: 'SELF-BUILT', initials: 'AS' },
];

/* ─── ANIMATION VARIANTS ────────────────────────────────────────────── */
const fadeUp = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

/* ─── COMPONENT ─────────────────────────────────────────────────────── */
export default function Academy() {
  const [openFaq, setOpenFaq] = useState(0);
  const [brands, setBrands] = useState([]);
  const [successStories, setSuccessStories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('enrollment');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    track: '',
    goals: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // Fetch brands and success stories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes, storiesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/brands'),
          axios.get('http://localhost:5000/api/success-stories')
        ]);
        setBrands(brandsRes.data.data || brandsRes.data.brands || []);
        setSuccessStories(storiesRes.data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setBrands([]);
        setSuccessStories([]);
      }
    };
    fetchData();
  }, []);

  const handleApplyClick = (type = 'enrollment') => {
    setModalType(type);
    setShowModal(true);
    setShowThankYou(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowThankYou(false);
    setFormData({ fullName: '', email: '', phone: '', track: '', goals: '' });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post('http://localhost:5000/api/contact', {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        subject: modalType === 'scholarship' ? 'YBEX Talent Fund Application' : 'YBEX School Enrollment',
        message: `Track: ${formData.track || 'Not selected'}\nGoals: ${formData.goals}`,
        category: modalType === 'scholarship' ? 'scholarship' : 'creators-school'
      });

      setIsSubmitting(false);
      setShowThankYou(true);

      setTimeout(() => {
        handleCloseModal();
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
    }
  };

  const displayBrands = brands.length > 0 ? brands.map(b => b.name) : staticPlacementBrands;
  const displayStories = successStories.length > 0 ? successStories : staticSuccessStories;

  return (
    <div style={{ background: 'linear-gradient(180deg,#06040f 0%,#080612 40%,#050410 100%)', minHeight: '100vh', color: '#fff', fontFamily: "'Outfit', sans-serif", overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 20px 80px', overflow: 'hidden' }}>
        {/* bg glow */}
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse,rgba(120,60,255,0.35) 0%,transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '300px', background: 'radial-gradient(ellipse,rgba(90,40,200,0.2) 0%,transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ marginBottom: '28px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', borderRadius: '999px', border: '1px solid rgba(150,100,255,0.35)', background: 'rgba(100,60,200,0.15)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a855f7', display: 'inline-block' }} />
            LIMITED SEATS AVAILABLE FOR NEXT BATCH
          </span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} style={{ margin: '0 0 16px', fontSize: 'clamp(3.2rem,8vw,6.5rem)', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.04em', fontFamily: "'Outfit',sans-serif" }}>
          <span style={{ color: '#fff' }}>YBEX </span>
          <span style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>School</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} style={{ margin: '0 0 40px', fontSize: 'clamp(1rem,2vw,1.25rem)', color: 'rgba(255,255,255,0.65)', fontWeight: 400 }}>
          A School from <strong style={{ color: '#fff', fontWeight: 600 }}>Founders Cabin</strong>
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '80px' }}>
          {/* Join Now Button with Lightning/Shimmer Effect */}
          <motion.button
            onClick={() => handleApplyClick('enrollment')}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #ff4d00, #ff6b35)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(255,77,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)',
              position: 'relative',
              overflow: 'hidden',
              textDecoration: 'none'
            }}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                pointerEvents: 'none'
              }}
            />
            <span style={{ position: 'relative', zIndex: 1 }}>Join Now →</span>
          </motion.button>

          <a href="#curriculum" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', transition: 'all 0.3s ease' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            Explore Curriculum
          </a>
        </motion.div>

        {/* Feature cards row */}
        <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px', width: '100%', maxWidth: '900px' }}>
          {[
            { icon: '📍', title: 'Learn at Our Office', desc: 'Hands-on physical workspace' },
            { icon: '🌐', title: 'Offline + Online', desc: 'Flexible hybrid learning model' },
            { icon: '🎛️', title: 'Studio Access', desc: 'Professional creator tools' },
            { icon: '📈', title: 'Guaranteed Growth', desc: 'Personalized mentorship path' },
          ].map((f, i) => (
            <motion.div key={i} variants={fadeUp} transition={{ duration: 0.5 }}
              style={{ padding: '24px 20px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '10px' }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px', color: '#fff' }}>{f.title}</div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>{f.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── WHY YBEX / CORE PILLARS ── */}
      <section id="pillars" style={{ padding: '100px 20px', position: 'relative' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '999px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a78bfa', marginBottom: '20px' }}>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#a78bfa' }} />
            WHY YBEX
          </span>
          <h2 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Our Core <span style={{ color: '#a855f7' }}>Pillars</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Beyond just a school, we are an ecosystem designed to turn passionate individuals into industry-ready masters.
          </p>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
          {pillars.map((pillar, i) => (
            <motion.div key={i} variants={fadeUp} transition={{ duration: 0.5 }}
              style={{ padding: '32px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease' }}
              whileHover={{ y: -8, borderColor: 'rgba(168,85,247,0.3)', background: 'rgba(255,255,255,0.05)' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg,rgba(168,85,247,0.2),rgba(124,58,237,0.1))', border: '1px solid rgba(168,85,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: '20px' }}>
                {pillar.iconEmoji}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 12px', color: '#fff' }}>{pillar.title}</h3>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0 }}>{pillar.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CURRICULUM / ROADMAP ── */}
      <section id="curriculum" style={{ padding: '100px 20px', background: 'linear-gradient(180deg,rgba(124,58,237,0.03) 0%,transparent 100%)' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            THE ROADMAP TO <span style={{ color: '#a855f7' }}>MASTERY</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            A dual-track curriculum designed to turn you into a full-stack digital entrepreneur.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(350px,1fr))', gap: '32px', maxWidth: '1100px', margin: '0 auto' }}>
          {curriculumTracks.map((track, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ padding: '40px', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 12px', color: '#fff' }}>{track.title}</h3>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', marginBottom: '28px', lineHeight: 1.6 }}>{track.desc}</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '12px', marginBottom: '28px' }}>
                {track.modules.map((module, j) => (
                  <div key={j} style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.85rem', fontWeight: 500, color: '#fff' }}>
                    {module}
                  </div>
                ))}
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {track.points.map((point, k) => (
                  <li key={k} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                    <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(168,85,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="12" height="12" fill="none" stroke="#a855f7" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PREMIUM / HQ SECTION ── */}
      <section style={{ padding: '100px 20px' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Learn at Our <span style={{ color: '#a855f7' }}>HQ Office</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
            Experience the ultimate creator environment. Get hands-on training with professional equipment and direct access to mentors at our Bangalore headquarters.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ padding: '40px', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 24px', color: '#fff' }}>What You Get in Premium</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '20px' }}>
              {premiumFeatures.map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                    {feature.iconEmoji}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{feature.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>{feature.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ padding: '40px', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(168,85,247,0.15)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '20px', right: '20px', padding: '4px 12px', borderRadius: '999px', background: 'rgba(168,85,247,0.2)', fontSize: '0.65rem', fontWeight: 700, color: '#a78bfa', letterSpacing: '0.05em' }}>
              COMING SOON
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 8px', color: '#fff' }}>Premium Plan</h3>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>Our most intensive cohorts.</p>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>₹??,???</div>
            <p style={{ fontSize: '0.75rem', color: '#a78bfa', marginBottom: '24px' }}>Pricing to be revealed soon</p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
              {['Limited to 9 seats per batch', '3 month Offline Intensive', 'Direct feedback on every project', 'Live Industry Projects', 'Certification & Portfolio Review'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                  <svg width="16" height="16" fill="none" stroke="#a855f7" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                  {item}
                </li>
              ))}
            </ul>

            <button style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#7c3aed', color: '#fff', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }}>
              JOIN WAITLIST →
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '12px', letterSpacing: '0.1em' }}>
              *BATCH STARTING IN 13 DAYS
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── MENTORS ── */}
      <section style={{ padding: '80px 20px' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, margin: '0 0 12px', color: 'rgba(255,255,255,0.8)' }}>
            Learn from the <span style={{ color: '#a855f7' }}>Best</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto' }}>
            Our mentors are industry practitioners who have successfully built and scaled digital-first brands.
          </p>
        </motion.div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {mentors.map((mentor, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ width: '200px', padding: '30px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg,rgba(168,85,247,0.3),rgba(124,58,237,0.2))', border: '2px solid rgba(168,85,247,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>
                {mentor.initials}
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 4px', color: '#fff' }}>{mentor.name}</h4>
              <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a78bfa', letterSpacing: '0.05em' }}>{mentor.role}</p>
            </motion.div>
          ))}
        </div>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} style={{ textAlign: 'center', marginTop: '30px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
          + and 10+ more specialized guest lecturers from the industry.
        </motion.p>
      </section>

      {/* ── PLACEMENTS ── */}
      <section style={{ padding: '100px 20px', background: 'linear-gradient(180deg,transparent 0%,rgba(124,58,237,0.02) 50%,transparent 100%)' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            GET PLACED AT
          </h2>
          <div style={{ width: '60px', height: '4px', background: 'linear-gradient(90deg,#ff4d00,transparent)', borderRadius: '2px', margin: '0 auto 20px' }} />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', maxWidth: '1000px', margin: '0 auto 40px' }}>
          {displayBrands.map((brand, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,77,0,0.1)', borderColor: 'rgba(255,77,0,0.3)' }}
              style={{ padding: '12px 24px', borderRadius: '999px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', cursor: 'default', transition: 'all 0.3s ease' }}
            >
              {brand}
            </motion.div>
          ))}
        </motion.div>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} style={{ textAlign: 'center', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', maxWidth: '500px', margin: '0 auto 30px' }}>
          Our graduates are making waves at India&apos;s top media houses and creative agencies.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} style={{ textAlign: 'center' }}>
          <motion.button
            onClick={() => handleApplyClick('enrollment')}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,77,0,0.2)' }}
            whileTap={{ scale: 0.95 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', borderRadius: '999px', border: '1px solid rgba(255,77,0,0.5)', color: '#ff6b35', fontWeight: 600, fontSize: '0.85rem', background: 'transparent', cursor: 'pointer', letterSpacing: '0.05em', transition: 'all 0.3s ease' }}
          >
            START YOUR JOURNEY →
          </motion.button>
        </motion.div>
      </section>

      {/* ── SUCCESS STORIES ── */}
      <section style={{ padding: '100px 20px', background: 'linear-gradient(180deg,#0a0a0f 0%,#12121a 100%)' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            OUR <span style={{ color: '#ff4d00' }}>SUCCESS STORIES</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            People who learned from us and are now crushing it.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
          {displayStories.map((story, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8, borderColor: 'rgba(255,77,0,0.3)' }}
              style={{
                padding: '32px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                {story.imageUrl ? (
                  <img src={story.imageUrl} alt={story.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,77,0,0.3)' }} />
                ) : (
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff4d00, #ff6b35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
                    {story.initials}
                  </div>
                )}
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: 0 }}>{story.name}</h4>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ff4d00', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{story.role}</p>
                </div>
              </div>

              {/* Quote */}
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '20px', fontStyle: 'italic' }}>
                &ldquo;{story.quote}&rdquo;
              </p>

              {/* Stats */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{story.earning}</div>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {story.company}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Your Story Card - CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: displayStories.length * 0.1 }}
            whileHover={{ y: -8, borderColor: 'rgba(255,77,0,0.5)', boxShadow: '0 20px 40px rgba(255,77,0,0.15)' }}
            style={{
              padding: '32px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(255,77,0,0.1) 0%, rgba(255,107,53,0.05) 100%)',
              border: '2px solid rgba(255,77,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff4d00, #ff6b35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: '16px' }}>
              🚀
            </div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>YOUR STORY</h4>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>NEXT?</p>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>APPLY NOW</p>
            <motion.button
              onClick={() => handleApplyClick('enrollment')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '12px 28px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #ff4d00, #ff6b35)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(255,77,0,0.4)'
              }}
            >
              APPLY NOW →
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── YBEX TALENT FUND ── */}
      <section style={{ padding: '100px 20px', background: 'linear-gradient(180deg, #12121a 0%, #0a0a0f 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(255,77,0,0.03) 0%, transparent 50%)', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '999px',
              background: 'rgba(255,77,0,0.1)',
              border: '1px solid rgba(255,77,0,0.2)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#ff6b35',
              marginBottom: '24px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}
          >
            <span>🎓</span> DOESN&apos;T FIT YOUR BUDGET?
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 32px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(20,20,30,0.9))',
              border: '1px solid rgba(255,255,255,0.1)',
              marginBottom: '32px'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>💜</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>100% Scholarship</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 800, margin: '0 0 24px', letterSpacing: '-0.02em', color: '#fff' }}
          >
            YBEX TALENT FUND
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6 }}
          >
            We believe talent shouldn&apos;t be limited by finances.<br />
            Our fully-funded scholarship program is designed for students with exceptional potential.
          </motion.p>

          <motion.button
            onClick={() => handleApplyClick('scholarship')}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(255,77,0,0.5)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '16px 40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ff4d00, #ff6b35)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(255,77,0,0.4)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                pointerEvents: 'none'
              }}
            />
            <span style={{ position: 'relative', zIndex: 1 }}>Apply for Scholarship</span>
          </motion.button>
        </motion.div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '100px 20px' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 700, margin: '0 0 12px' }}>
            Frequently Asked <span style={{ color: '#a855f7' }}>Questions</span>
          </h2>
        </motion.div>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
              style={{ marginBottom: '16px', borderRadius: '16px', background: openFaq === i ? 'rgba(168,85,247,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${openFaq === i ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.06)'}`, overflow: 'hidden', transition: 'all 0.3s ease' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', color: '#fff', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>
                {faq.q}
                <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.2 }} style={{ fontSize: '1.2rem', color: '#a78bfa' }}>
                  +
                </motion.span>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                    <div style={{ padding: '0 24px 20px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FRANCHISE ── */}
      <section id="apply" style={{ padding: '100px 20px', background: 'linear-gradient(180deg,rgba(124,58,237,0.05) 0%,transparent 100%)' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, margin: '0 0 16px' }}>
            Own a <span style={{ color: '#a855f7' }}>YBEX</span> Franchise
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            Launch your own YBEX-powered media education hub with our proven business model and full support.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', maxWidth: '800px', margin: '0 auto 50px' }}>
          {franchiseStats.map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#a855f7', marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} style={{ textAlign: 'center' }}>
          <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 36px', borderRadius: '999px', background: '#7c3aed', color: '#fff', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 8px 32px rgba(124,58,237,0.4)', transition: 'all 0.3s ease' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#6d28d9'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#7c3aed'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            Apply for Franchise →
          </Link>
        </motion.div>
      </section>

      {/* ── ADMISSION DESK MODAL ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(10px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 25 }}
              style={{
                width: '100%',
                maxWidth: '550px',
                maxHeight: '90vh',
                overflowY: 'auto',
                background: 'linear-gradient(145deg, #1a1a2e 0%, #16162a 100%)',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,77,0,0.2)',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                onClick={handleCloseModal}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.9 }}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10
                }}
              >
                ×
              </motion.button>

              {/* Header */}
              <div style={{ padding: '40px 40px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #ff4d00, #ff6b35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    🎓
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: 0 }}>ADMISSION DESK</h3>
                    <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#ff6b35', letterSpacing: '0.1em', margin: '4px 0 0' }}>YBEX SCHOOL • FOUNDERS CABIN</p>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', margin: '16px 0 0' }}>
                  Enter the elite network. Complete your application.
                </p>
              </div>

              {/* Thank You Animation */}
              {showThankYou ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
                  style={{ padding: '60px 40px', textAlign: 'center' }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ff4d00, #ff6b35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem',
                      margin: '0 auto 24px',
                      boxShadow: '0 10px 40px rgba(255,77,0,0.4)'
                    }}
                  >
                    ✓
                  </motion.div>
                  <motion.h4
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}
                  >
                    Thank You!
                  </motion.h4>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)' }}
                  >
                    Your application has been submitted successfully.<br />
                    We&apos;ll get back to you soon!
                  </motion.p>
                </motion.div>
              ) : (
                <>
                  {/* Form */}
                  <form onSubmit={handleSubmit} style={{ padding: '0 40px 40px' }}>
                    {/* Tab Toggle */}
                    <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '4px', marginBottom: '24px' }}>
                      <button
                        type="button"
                        onClick={() => setModalType('enrollment')}
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '10px',
                          background: modalType === 'enrollment' ? 'linear-gradient(135deg, #ff4d00, #ff6b35)' : 'transparent',
                          color: modalType === 'enrollment' ? '#fff' : 'rgba(255,255,255,0.5)',
                          border: 'none',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Enrollment
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalType('scholarship')}
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '10px',
                          background: modalType === 'scholarship' ? 'linear-gradient(135deg, #ff4d00, #ff6b35)' : 'transparent',
                          color: modalType === 'scholarship' ? '#fff' : 'rgba(255,255,255,0.5)',
                          border: 'none',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        General Inquiry
                      </button>
                    </div>

                    {/* Form Fields */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Your Name"
                          required
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            borderRadius: '12px',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff',
                            fontSize: '0.9rem',
                            outline: 'none',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => { e.target.style.borderColor = 'rgba(255,77,0,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,77,0,0.1)'; }}
                          onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="email@example.com"
                          required
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            borderRadius: '12px',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff',
                            fontSize: '0.9rem',
                            outline: 'none',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => { e.target.style.borderColor = 'rgba(255,77,0,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,77,0,0.1)'; }}
                          onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                          Phone / WhatsApp
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 00000 00000"
                          required
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            borderRadius: '12px',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff',
                            fontSize: '0.9rem',
                            outline: 'none',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => { e.target.style.borderColor = 'rgba(255,77,0,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,77,0,0.1)'; }}
                          onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                          Selected Track
                        </label>
                        <select
                          name="track"
                          value={formData.track}
                          onChange={handleInputChange}
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            borderRadius: '12px',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: formData.track ? '#fff' : 'rgba(255,255,255,0.4)',
                            fontSize: '0.9rem',
                            outline: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => { e.target.style.borderColor = 'rgba(255,77,0,0.5)'; }}
                          onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                        >
                          <option value="">Select Track</option>
                          <option value="Content Creation">Content Creation</option>
                          <option value="Digital Marketing">Digital Marketing</option>
                          <option value="Both Tracks">Both Tracks</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                        Your Goals / Mission
                      </label>
                      <textarea
                        name="goals"
                        value={formData.goals}
                        onChange={handleInputChange}
                        placeholder="Tell us what you want to achieve..."
                        rows={4}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          borderRadius: '12px',
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff',
                          fontSize: '0.9rem',
                          outline: 'none',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => { e.target.style.borderColor = 'rgba(255,77,0,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,77,0,0.1)'; }}
                        onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #ff4d00, #ff6b35)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        border: 'none',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        boxShadow: '0 8px 32px rgba(255,77,0,0.4)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        opacity: isSubmitting ? 0.7 : 1
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            style={{ display: 'inline-block' }}
                          >
                            ⟳
                          </motion.span>
                          Submitting...
                        </>
                      ) : (
                        <>Submit Application →</>
                      )}
                    </motion.button>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
                      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Direct Contact</span>
                      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                    </div>

                    {/* WhatsApp Button */}
                    <a
                      href="https://wa.me/919999999999"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '14px',
                        borderRadius: '12px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.6)',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(37,211,102,0.1)'; e.currentTarget.style.borderColor = 'rgba(37,211,102,0.3)'; e.currentTarget.style.color = '#25d366'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.3)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                    >
                      Talk on WhatsApp
                    </a>

                    <p style={{ textAlign: 'center', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginTop: '16px', letterSpacing: '0.05em' }}>
                      Admission and franchise data is securely processed.
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
