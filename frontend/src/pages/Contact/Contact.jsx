import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { submitContact } from '../../api/api';
import { contactDetails } from '../../content/siteData';

const COPY_LINES = [
  { text: 'Ready to turn your current frontend', accent: false },
  { text: 'into something people remember?',     accent: true  },
  { text: 'Share your goals, references,',       accent: false },
  { text: 'launch timeline, and what feels',     accent: false },
  { text: 'broken today.',                        accent: true  },
  { text: 'We will shape the next version',      accent: false },
  { text: 'with you.',                            accent: true  },
];

const ICONS = { Email: '✉', Phone: '📞', Base: '📍' };

/* ── validation helpers ── */
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const isValidPhone = (v) => !v.trim() || /^[+]?[\d\s\-().]{7,15}$/.test(v.trim());

/* ── single input field ── */
function Field({ name, type = 'text', placeholder, value, focused, error, onChange, onFocus, onBlur, required = true }) {
  const on = focused === name;
  const hasErr = !!error;
  return (
    <div style={{ position: 'relative' }}>
      <input
        name={name} type={type} placeholder={placeholder} value={value}
        onChange={onChange} onFocus={onFocus} onBlur={onBlur} required={required}
        style={{
          width: '100%', padding: '13px 16px',
          background: hasErr ? 'rgba(255,69,0,0.06)' : on ? 'rgba(74,222,128,0.07)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${hasErr ? 'rgba(255,69,0,0.55)' : on ? 'rgba(74,222,128,0.55)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '12px', color: '#fff', fontSize: '0.88rem', outline: 'none',
          boxSizing: 'border-box', fontFamily: 'inherit',
          transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
          boxShadow: hasErr ? '0 0 0 3px rgba(255,69,0,0.12)' : on ? '0 0 0 3px rgba(74,222,128,0.1)' : 'none',
        }}
      />
      {/* focus underline */}
      <AnimatePresence>
        {on && !hasErr && (
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }}
            transition={{ duration: 0.22 }}
            style={{
              position: 'absolute', bottom: 1, left: '10%', right: '10%', height: '2px',
              background: 'linear-gradient(90deg,transparent,#4ade80,transparent)',
              transformOrigin: 'center', borderRadius: '2px',
            }}
          />
        )}
      </AnimatePresence>
      {/* error message */}
      <AnimatePresence>
        {hasErr && (
          <motion.p
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ margin: '4px 0 0 4px', fontSize: '0.72rem', color: '#ff6b35', fontWeight: 600 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Contact() {
  const [form, setForm]         = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [focused, setFocused]   = useState('');
  const [errors, setErrors]     = useState({});
  const [hoveredLine, setHoveredLine] = useState(null);
  const [status, setStatus]     = useState(null);
  const [loading, setLoading]   = useState(false);

  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const bind = (name) => ({
    value: form[name],
    onChange: (e) => {
      setForm(f => ({ ...f, [name]: e.target.value }));
      if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
    },
    onFocus: () => setFocused(name),
    onBlur:  () => {
      setFocused('');
      validate(name, form[name]);
    },
    error: errors[name] || '',
  });

  const validate = (name, value) => {
    let msg = '';
    if (name === 'email' && value && !isValidEmail(value)) msg = 'Enter a valid email address';
    if (name === 'phone' && value && !isValidPhone(value)) msg = 'Enter a valid phone number';
    if (name === 'name' && !value.trim()) msg = 'Name is required';
    if (name === 'subject' && !value.trim()) msg = 'Project type is required';
    if (name === 'message' && !value.trim()) msg = 'Message is required';
    setErrors(er => ({ ...er, [name]: msg }));
    return !msg;
  };

  const validateAll = () => {
    const fields = ['name', 'email', 'subject', 'message'];
    const newErrors = {};
    let valid = true;
    fields.forEach(f => {
      let msg = '';
      if (f === 'email' && !isValidEmail(form[f])) { msg = 'Enter a valid email address'; valid = false; }
      else if (f !== 'email' && !form[f].trim()) { msg = `${f.charAt(0).toUpperCase() + f.slice(1)} is required`; valid = false; }
      newErrors[f] = msg;
    });
    if (form.phone && !isValidPhone(form.phone)) { newErrors.phone = 'Enter a valid phone number'; valid = false; }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    setLoading(true); setStatus(null);
    try {
      const res = await submitContact(form);
      console.log('%c📬 Contact Form Submitted', 'color:#ff4500;font-weight:bold;font-size:14px;');
      console.table({ Name: form.name, Email: form.email, Phone: form.phone || '—', Subject: form.subject, Message: form.message });
      console.log('Server response:', res.data);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setErrors({});
    } catch (err) {
      console.error('Contact form error:', err?.response?.data || err.message);
      setStatus('error');
    } finally { setLoading(false); }
  };

  return (
    <section ref={ref} className="page-shell contact-page-shell" style={{ position: 'relative', overflow: 'hidden', paddingBottom: '3rem' }}>

      {/* ── background grid ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(74,222,128,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.04) 1px,transparent 1px)',
        backgroundSize: '72px 72px',
        maskImage: 'radial-gradient(ellipse 85% 85% at 50% 40%,black 20%,transparent 100%)',
      }} />

      {/* ── orbs ── */}
      <motion.div animate={{ scale:[1,1.2,1], opacity:[0.1,0.2,0.1] }} transition={{ duration:8, repeat:Infinity, ease:'easeInOut' }}
        style={{ position:'absolute', top:'-12%', left:'28%', width:'700px', height:'580px', background:'radial-gradient(ellipse,rgba(74,222,128,0.18) 0%,transparent 65%)', pointerEvents:'none', zIndex:0 }} />
      <motion.div animate={{ scale:[1,1.15,1], opacity:[0.05,0.12,0.05] }} transition={{ duration:11, repeat:Infinity, ease:'easeInOut', delay:4 }}
        style={{ position:'absolute', bottom:'-8%', right:'-4%', width:'480px', height:'380px', background:'radial-gradient(ellipse,rgba(74,222,128,0.12) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 }} />
      <motion.div animate={{ scale:[1,1.3,1], opacity:[0.03,0.08,0.03] }} transition={{ duration:14, repeat:Infinity, ease:'easeInOut', delay:7 }}
        style={{ position:'absolute', top:'8%', right:'4%', width:'280px', height:'280px', background:'radial-gradient(ellipse,rgba(255,69,0,0.1) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 }} />

      {/* ── particles ── */}
      {[...Array(10)].map((_,i) => (
        <motion.div key={i}
          animate={{ y:[0,-(12+i*3),0], opacity:[0.04,0.14+(i%3)*0.04,0.04], x:[0,i%2?9:-9,0] }}
          transition={{ duration:5+i*0.7, repeat:Infinity, ease:'easeInOut', delay:i*0.6 }}
          style={{ position:'absolute', left:`${5+i*9}%`, top:`${8+(i%5)*18}%`, width:i%3===0?'5px':'3px', height:i%3===0?'5px':'3px', background:i%4===0?'rgba(255,69,0,0.5)':'rgba(74,222,128,0.6)', borderRadius:'50%', pointerEvents:'none', zIndex:0 }}
        />
      ))}

      <div className="container contact-page-container" style={{ position:'relative', zIndex:1 }}>

        {/* eyebrow */}
        <motion.p className="eyebrow"
          initial={{ opacity:0, y:14 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:0.5, delay:0.04 }}
          style={{ justifyContent:'center', marginBottom:'clamp(32px,5vw,52px)' }}
        >
          <motion.span animate={{ scale:[1,1.6,1] }} transition={{ duration:2, repeat:Infinity }}
            style={{ display:'inline-block', width:'6px', height:'6px', borderRadius:'50%', background:'#4ade80', marginRight:'8px', verticalAlign:'middle' }} />
          Contact
        </motion.p>

        {/* ── two-column: left text | right form ── */}
        <div className="contact-page-grid">

          {/* ══ LEFT ══ */}
          <motion.div
            initial={{ opacity:0, x:-30 }} animate={inView?{opacity:1,x:0}:{}} transition={{ duration:0.72, delay:0.1, ease:[0.22,1,0.36,1] }}
            style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', gap:'2rem' }}
          >
            {/* copy lines */}
            <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
              {COPY_LINES.map((line,i) => (
                <motion.div key={i}
                  initial={{ opacity:0, x:-18 }} animate={inView?{opacity:1,x:0}:{}} transition={{ duration:0.52, delay:0.14+i*0.07, ease:[0.22,1,0.36,1] }}
                  onHoverStart={() => setHoveredLine(i)} onHoverEnd={() => setHoveredLine(null)}
                  style={{ cursor:'default', position:'relative', paddingLeft:'14px' }}
                >
                  <AnimatePresence>
                    {hoveredLine === i && (
                      <motion.div
                        initial={{ scaleY:0, opacity:0 }} animate={{ scaleY:1, opacity:1 }} exit={{ scaleY:0, opacity:0 }}
                        transition={{ duration:0.18 }}
                        style={{ position:'absolute', left:0, top:'10%', width:'3px', height:'80%', background:'#4ade80', borderRadius:'2px', transformOrigin:'center' }}
                      />
                    )}
                  </AnimatePresence>
                  <motion.span
                    animate={{
                      color: hoveredLine===i ? (line.accent?'#4ade80':'#fff') : (line.accent?'rgba(74,222,128,0.7)':'rgba(255,255,255,0.25)'),
                      textShadow: hoveredLine===i ? (line.accent?'0 0 22px rgba(74,222,128,0.5)':'0 0 14px rgba(255,255,255,0.12)') : 'none',
                    }}
                    transition={{ duration:0.18 }}
                    style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(1.25rem,2.5vw,1.9rem)', fontWeight:800, letterSpacing:'-0.03em', lineHeight:1.18, display:'block' }}
                  >{line.text}</motion.span>
                </motion.div>
              ))}
            </div>

            {/* contact details card */}
            <motion.div
              initial={{ opacity:0, y:14 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:0.52, delay:0.68 }}
              style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'18px', padding:'1.1rem 1.35rem' }}
            >
              {contactDetails.map((item,i) => (
                <motion.div key={item.label} whileHover={{ x:5, transition:{ duration:0.16 } }}
                  style={{ display:'flex', alignItems:'center', gap:'11px', padding:'0.65rem 0', borderBottom:i<contactDetails.length-1?'1px solid rgba(255,255,255,0.05)':'none', cursor:'default' }}
                >
                  <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.9rem', flexShrink:0 }}>
                    {ICONS[item.label]||'📌'}
                  </div>
                  <div>
                    <div style={{ fontSize:'0.57rem', color:'rgba(255,255,255,0.24)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'2px' }}>{item.label}</div>
                    <div style={{ fontSize:'0.84rem', color:'rgba(255,255,255,0.78)', fontWeight:600 }}>{item.value}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* online dot */}
            <motion.div initial={{ opacity:0 }} animate={inView?{opacity:1}:{}} transition={{ duration:0.5, delay:0.82 }}
              style={{ display:'flex', alignItems:'center', gap:'9px' }}
            >
              <motion.div animate={{ scale:[1,1.7,1], opacity:[1,0.3,1] }} transition={{ duration:1.8, repeat:Infinity }}
                style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#4ade80', flexShrink:0 }} />
              <span style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.32)', fontWeight:500 }}>
                Usually responds within 24 hours · Mon–Sat, 10am–7pm IST
              </span>
            </motion.div>
          </motion.div>

          {/* ══ RIGHT: form ══ */}
          <motion.div
            initial={{ opacity:0, x:30 }} animate={inView?{opacity:1,x:0}:{}} transition={{ duration:0.72, delay:0.18, ease:[0.22,1,0.36,1] }}
            style={{ background:'linear-gradient(160deg,rgba(74,222,128,0.06) 0%,rgba(0,0,0,0.5) 100%)', border:'1px solid rgba(74,222,128,0.18)', borderRadius:'26px', padding:'clamp(2rem,4vw,3rem)', backdropFilter:'blur(28px)', boxShadow:'0 28px 72px rgba(0,0,0,0.55),inset 0 1px 0 rgba(74,222,128,0.08)', position:'relative', overflow:'hidden' }}
          >
            {/* top shimmer line */}
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,#4ade80,transparent)', pointerEvents:'none' }} />

            <div style={{ marginBottom:'1.5rem' }}>
              <p style={{ fontSize:'0.58rem', fontWeight:800, color:'rgba(74,222,128,0.7)', letterSpacing:'0.2em', textTransform:'uppercase', margin:'0 0 5px' }}>Send enquiry</p>
              <p style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.28)', margin:0, lineHeight:1.5 }}>Fill in the details and we'll get back to you.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>

              {/* name + email */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }} className="form-row-half">
                <Field name="name"  type="text"  placeholder="Your name"     focused={focused} {...bind('name')} />
                <Field name="email" type="email" placeholder="Email address" focused={focused} {...bind('email')} />
              </div>

              {/* phone + subject */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }} className="form-row-half">
                <Field name="phone"   type="tel"  placeholder="Phone (optional)" focused={focused} required={false} {...bind('phone')} />
                <Field name="subject" type="text" placeholder="Project type"     focused={focused} {...bind('subject')} />
              </div>

              {/* message */}
              <div style={{ position:'relative' }}>
                <textarea name="message" rows={6}
                  placeholder="Tell us what you want to build"
                  value={form.message}
                  onChange={(e) => { setForm(f=>({...f,message:e.target.value})); if(errors.message) setErrors(er=>({...er,message:''})); }}
                  onFocus={() => setFocused('message')}
                  onBlur={() => { setFocused(''); validate('message', form.message); }}
                  required
                  style={{
                    width:'100%', padding:'13px 16px',
                    background: errors.message?'rgba(255,69,0,0.06)': focused==='message'?'rgba(74,222,128,0.07)':'rgba(255,255,255,0.04)',
                    border:`1px solid ${errors.message?'rgba(255,69,0,0.55)':focused==='message'?'rgba(74,222,128,0.55)':'rgba(255,255,255,0.1)'}`,
                    borderRadius:'12px', color:'#fff', fontSize:'0.88rem',
                    outline:'none', resize:'vertical', boxSizing:'border-box',
                    fontFamily:'inherit', lineHeight:1.65,
                    transition:'border-color 0.2s,background 0.2s,box-shadow 0.2s',
                    boxShadow: errors.message?'0 0 0 3px rgba(255,69,0,0.12)':focused==='message'?'0 0 0 3px rgba(74,222,128,0.1)':'none',
                  }}
                />
                <AnimatePresence>
                  {focused==='message' && !errors.message && (
                    <motion.div initial={{scaleX:0}} animate={{scaleX:1}} exit={{scaleX:0}} transition={{duration:0.22}}
                      style={{ position:'absolute', bottom:1, left:'10%', right:'10%', height:'2px', background:'linear-gradient(90deg,transparent,#4ade80,transparent)', transformOrigin:'center', borderRadius:'2px' }} />
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {errors.message && (
                    <motion.p initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.2}}
                      style={{ margin:'4px 0 0 4px', fontSize:'0.72rem', color:'#ff6b35', fontWeight:600 }}>{errors.message}</motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* status */}
              <AnimatePresence mode="wait">
                {status==='success' && (
                  <motion.div key="ok" initial={{opacity:0,y:-8,height:0}} animate={{opacity:1,y:0,height:'auto'}} exit={{opacity:0,height:0}} transition={{duration:0.3}}
                    style={{ display:'flex', alignItems:'center', gap:'10px', background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.25)', borderRadius:'12px', padding:'0.8rem 1rem', overflow:'hidden' }}
                  >
                    <motion.span initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:280,damping:16}} style={{fontSize:'1.1rem'}}>✅</motion.span>
                    <span style={{color:'#4ade80',fontSize:'0.84rem',fontWeight:600}}>Message sent. We'll be in touch soon.</span>
                  </motion.div>
                )}
                {status==='error' && (
                  <motion.div key="err" initial={{opacity:0,y:-8,height:0}} animate={{opacity:1,y:0,height:'auto'}} exit={{opacity:0,height:0}} transition={{duration:0.3}}
                    style={{ display:'flex', alignItems:'center', gap:'10px', background:'rgba(255,69,0,0.08)', border:'1px solid rgba(255,69,0,0.25)', borderRadius:'12px', padding:'0.8rem 1rem', overflow:'hidden' }}
                  >
                    <span style={{fontSize:'1.1rem'}}>⚠</span>
                    <span style={{color:'#ff6b35',fontSize:'0.84rem',fontWeight:600}}>Something went wrong. Please try again.</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* submit */}
              <motion.button type="submit" disabled={loading}
                whileHover={!loading?{scale:1.02,boxShadow:'0 16px 44px rgba(74,222,128,0.35)'}:{}}
                whileTap={!loading?{scale:0.98}:{}}
                style={{
                  width:'100%', padding:'14px',
                  background:loading?'rgba(74,222,128,0.3)':'linear-gradient(135deg,#22c55e 0%,#4ade80 50%,#22c55e 100%)',
                  border:'none', borderRadius:'13px', color:'#000',
                  fontSize:'0.9rem', fontWeight:800, cursor:loading?'not-allowed':'pointer',
                  letterSpacing:'0.05em', boxShadow:'0 8px 26px rgba(74,222,128,0.25)',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:'10px',
                  transition:'background 0.3s,box-shadow 0.3s', marginTop:'0.2rem',
                }}
              >
                {loading ? (
                  <>
                    <motion.span animate={{rotate:360}} transition={{duration:0.85,repeat:Infinity,ease:'linear'}}
                      style={{display:'inline-block',width:'14px',height:'14px',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%'}} />
                    Sending...
                  </>
                ) : (
                  <>Send enquiry <motion.span animate={{x:[0,4,0]}} transition={{duration:1.5,repeat:Infinity}}>→</motion.span></>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* ══ MAP SECTION ══ */}
        <motion.div
          initial={{ opacity:0, y:32 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:0.7, delay:0.5, ease:[0.22,1,0.36,1] }}
          style={{ marginTop:'clamp(2rem,4vw,3.5rem)' }}
        >
          <div className="contact-map-header" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem', flexWrap:'wrap', gap:'0.75rem' }}>
            <div>
              <p style={{ fontSize:'0.6rem', fontWeight:800, color:'rgba(74,222,128,0.6)', letterSpacing:'0.2em', textTransform:'uppercase', margin:'0 0 4px' }}>Our Location</p>
              <p style={{ fontSize:'1rem', fontWeight:700, color:'#fff', margin:0 }}>Sector 63, Noida — Hyperfocus Building</p>
            </div>
            <motion.a
              href="https://maps.google.com/?q=Hyperfocus+Building+Sector+63+Noida"
              target="_blank" rel="noreferrer"
              whileHover={{ scale:1.04, background:'rgba(74,222,128,0.15)' }}
              whileTap={{ scale:0.97 }}
              style={{ display:'flex', alignItems:'center', gap:'7px', padding:'0.5rem 1.1rem', background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.3)', borderRadius:'999px', color:'#4ade80', fontSize:'0.75rem', fontWeight:700, textDecoration:'none', letterSpacing:'0.05em', transition:'all 0.2s' }}
            >📍 Open in Maps →</motion.a>
          </div>

          <div className="contact-map-frame" style={{ position:'relative', borderRadius:'22px', overflow:'hidden', border:'1px solid rgba(255,255,255,0.09)', boxShadow:'0 24px 64px rgba(0,0,0,0.35)', height:'360px' }}>
            <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.15)', zIndex:1, pointerEvents:'none' }} />
            {/* Sector 63, Noida — D-216 Hyperfocus Building near Dainik Jagran */}
            <iframe
              title="YBEX Studio — Sector 63 Noida"
              src="https://www.openstreetmap.org/export/embed.html?bbox=77.3600%2C28.6150%2C77.3900%2C28.6350&layer=mapnik&marker=28.6250%2C77.3750"
              style={{ width:'100%', height:'100%', border:'none', display:'block', filter:'invert(0.88) hue-rotate(180deg) saturate(0.55) brightness(0.82)' }}
              loading="lazy"
              allowFullScreen
            />
            <div className="contact-map-badge" style={{ position:'absolute', bottom:'1.25rem', left:'1.25rem', zIndex:2, background:'rgba(0,0,0,0.78)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'12px', padding:'0.65rem 1rem', display:'flex', alignItems:'center', gap:'10px' }}>
              <motion.div animate={{ scale:[1,1.3,1] }} transition={{ duration:2, repeat:Infinity }}
                style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#4ade80', flexShrink:0 }} />
              <div>
                <div style={{ fontSize:'0.72rem', fontWeight:700, color:'#fff' }}>YBEX Studio</div>
                <div style={{ fontSize:'0.62rem', color:'rgba(255,255,255,0.45)' }}>D-216 Hyperfocus Building, Sector 63, Noida</div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      <style>{`
        .contact-page-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.35fr);
          gap: clamp(2rem, 5vw, 4.5rem);
          align-items: stretch;
        }
        @media (max-width:1024px) { .contact-page-grid { grid-template-columns:1fr !important; } }
        @media (max-width:640px) {
          .contact-map-header { align-items:flex-start !important; }
          .contact-map-frame { height:300px !important; }
          .contact-map-badge { left:0.85rem !important; right:0.85rem; bottom:0.85rem !important; width:auto; }
        }
        @media (max-width:500px) { .form-row-half { grid-template-columns:1fr !important; } }
        input::placeholder, textarea::placeholder { color:rgba(255,255,255,0.22); }
        input:-webkit-autofill, input:-webkit-autofill:focus {
          -webkit-box-shadow:0 0 0 1000px rgba(8,8,8,0.98) inset !important;
          -webkit-text-fill-color:#fff !important;
        }
      `}</style>
    </section>
  );
}
