import { useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';

const STATUS_MAP = {
  'creators-school':    { label: 'Creators School',    icon: '📚', color: '#E4F141', statusKey: 'school'  },
  'pitch-ideas':        { label: 'Pitch Ideas',        icon: '💡', color: '#FF3D10', statusKey: 'pitch'   },
  'sales-brand-growth': { label: 'Sales / Brand Growth', icon: '⚡', color: '#00D26A', statusKey: 'sales' },
  'general':            { label: 'General / Community', icon: '💬', color: '#818cf8', statusKey: 'general' },
};

const STATUS_TO_CATEGORY = {
  school:  'creators-school',
  pitch:   'pitch-ideas',
  sales:   'sales-brand-growth',
  general: 'general',
};

function fmt(d) {
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'numeric', year: 'numeric' }) +
    ', ' + dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

const CARD_STATUS = {
  pending:  { border: 'rgba(255,255,255,0.08)', bg: 'rgba(255,255,255,0.02)' },
  approved: { border: 'rgba(74,222,128,0.35)',  bg: 'rgba(74,222,128,0.04)'  },
  rejected: { border: 'rgba(255,61,16,0.35)',   bg: 'rgba(255,61,16,0.04)'   },
};

function EnquiryCard({ contact, onApprove, onReject, accentColor }) {
  const [expanded, setExpanded] = useState(false);
  const [busy, setBusy] = useState('');
  const cs = CARD_STATUS[contact.status] || CARD_STATUS.pending;

  const doApprove = async (e) => { e.stopPropagation(); setBusy('approve'); await onApprove(contact._id); setBusy(''); };
  const doReject  = async (e) => { e.stopPropagation(); setBusy('reject');  await onReject(contact._id);  setBusy(''); };

  return (
    <motion.div layout
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{ background: cs.bg, border: `1px solid ${cs.border}`, borderRadius: '14px', overflow: 'hidden', marginBottom: '0.65rem' }}
    >
      <div onClick={() => setExpanded(p => !p)} style={{ padding: '1rem 1.25rem', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.55rem', flexWrap: 'wrap' }}>
          <span style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)', fontSize: '0.6rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{contact.category}</span>
          <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.7rem' }}>{fmt(contact.createdAt)}</span>
          {!contact.isRead && <span style={{ background: 'rgba(255,61,16,0.2)', color: '#FF3D10', fontSize: '0.58rem', fontWeight: 900, padding: '0.1rem 0.4rem', borderRadius: '20px' }}>● NEW</span>}
        </div>
        <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.01em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{contact.name}</div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem' }}><span style={{ color: accentColor }}>✉</span>{contact.email}</span>
          {contact.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem' }}><span style={{ color: accentColor }}>📞</span>{contact.phone}</span>}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0 1.25rem 1.1rem' }}>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '0.9rem' }} />
              {contact.message && (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderLeft: `3px solid ${accentColor}55`, borderRadius: '10px', padding: '0.8rem 1rem', marginBottom: '0.85rem' }}>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '5px' }}>Message</div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>{contact.message}</div>
                </div>
              )}
              {contact.subject && (
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.85rem' }}>
                  <span style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.25)' }}>Subject: </span>{contact.subject}
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {contact.status !== 'approved' && (
                  <motion.button whileHover={{ scale: 1.04, boxShadow: '0 4px 16px rgba(74,222,128,0.3)' }} whileTap={{ scale: 0.96 }}
                    onClick={doApprove} disabled={busy === 'approve'}
                    style={{ padding: '0.45rem 1rem', background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.4)', borderRadius: '8px', color: '#4ade80', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer', letterSpacing: '0.07em' }}
                  >{busy === 'approve' ? '...' : '✓ ACCEPT'}</motion.button>
                )}
                {contact.status !== 'rejected' && (
                  <motion.button whileHover={{ scale: 1.04, boxShadow: '0 4px 16px rgba(255,61,16,0.3)' }} whileTap={{ scale: 0.96 }}
                    onClick={doReject} disabled={busy === 'reject'}
                    style={{ padding: '0.45rem 1rem', background: 'rgba(255,61,16,0.12)', border: '1px solid rgba(255,61,16,0.4)', borderRadius: '8px', color: '#FF3D10', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer', letterSpacing: '0.07em' }}
                  >{busy === 'reject' ? '...' : '✕ REJECT'}</motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function HiringCard({ app, onStatusChange, accentColor }) {
  const ST = {
    pending:  { bg: 'rgba(250,204,21,0.1)',  color: '#facc15', border: 'rgba(250,204,21,0.3)' },
    accepted: { bg: 'rgba(74,222,128,0.1)',  color: '#4ade80', border: 'rgba(74,222,128,0.3)' },
    rejected: { bg: 'rgba(255,61,16,0.1)',   color: '#FF3D10', border: 'rgba(255,61,16,0.3)'  },
  };
  const st = ST[app.status] || ST.pending;
  return (
    <motion.div layout
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ borderColor: 'rgba(255,255,255,0.14)' }}
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1rem 1.25rem', marginBottom: '0.65rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
        {app.position && <span style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa', fontSize: '0.62rem', fontWeight: 800, padding: '0.18rem 0.6rem', borderRadius: '20px', border: '1px solid rgba(167,139,250,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{app.position}</span>}
        <span style={{ background: st.bg, color: st.color, fontSize: '0.62rem', fontWeight: 800, padding: '0.18rem 0.6rem', borderRadius: '20px', border: `1px solid ${st.border}`, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{app.status}</span>
        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem', marginLeft: 'auto' }}>{new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>
      <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#fff', textTransform: 'uppercase', marginBottom: '0.45rem', letterSpacing: '-0.01em' }}>{app.name}</div>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem' }}><span style={{ color: accentColor }}>✉</span>{app.email}</span>
        {app.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem' }}><span style={{ color: accentColor }}>📞</span>{app.phone}</span>}
        {app.resumeLink && <a href={app.resumeLink} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: accentColor, fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>🔗 RESUME</a>}
      </div>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {['pending','accepted','rejected'].map(s => (
          <button key={s} onClick={() => onStatusChange(app._id, s)}
            style={{ padding: '0.3rem 0.8rem', background: app.status === s ? ST[s].bg : 'rgba(255,255,255,0.04)', border: `1px solid ${app.status === s ? ST[s].border : 'rgba(255,255,255,0.08)'}`, borderRadius: '6px', color: app.status === s ? ST[s].color : 'rgba(255,255,255,0.4)', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize', letterSpacing: '0.05em', transition: 'all 0.15s' }}
          >{s}</button>
        ))}
      </div>
    </motion.div>
  );
}

export default function SubAdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const userStatuses = user?.status || [];
  const categories = userStatuses.map(s => STATUS_TO_CATEGORY[s]).filter(Boolean);
  const firstCat = categories[0] || 'general';
  const catConf = STATUS_MAP[firstCat] || STATUS_MAP['general'];
  const accentColor = catConf.color;

  const [activeTab, setActiveTab] = useState('enquiries');
  const [activeCat, setActiveCat] = useState(firstCat);
  const [contacts, setContacts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loadingEnq, setLoadingEnq] = useState(true);
  const [loadingHire, setLoadingHire] = useState(true);
  const [catCounts, setCatCounts] = useState({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const fetchEnquiries = async (cat) => {
    setLoadingEnq(true);
    try {
      const res = await axiosInstance.get(`/admin/contacts?category=${cat}`);
      setContacts(res.data.contacts || []);
    } catch (e) { console.error(e); }
    finally { setLoadingEnq(false); }
  };

  const fetchHiring = async () => {
    setLoadingHire(true);
    try {
      const res = await axiosInstance.get('/admin/hiring');
      setApplications(res.data.applications || []);
    } catch (e) { console.error(e); }
    finally { setLoadingHire(false); }
  };

  const fetchCounts = async () => {
    try {
      const counts = {};
      for (const cat of categories) {
        const r = await axiosInstance.get(`/admin/contacts?category=${cat}`);
        counts[cat] = r.data.total || 0;
      }
      setCatCounts(counts);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchEnquiries(firstCat);
    fetchHiring();
    fetchCounts();
  }, []);

  const handleCatChange = (cat) => { setActiveCat(cat); fetchEnquiries(cat); };

  const handleApprove = async (id) => {
    try {
      const res = await axiosInstance.patch(`/admin/contacts/${id}/approve`);
      setContacts(prev => prev.map(c => c._id === id ? res.data.contact : c));
    } catch (e) { console.error(e); }
  };

  const handleReject = async (id) => {
    try {
      const res = await axiosInstance.patch(`/admin/contacts/${id}/reject`);
      setContacts(prev => prev.map(c => c._id === id ? res.data.contact : c));
    } catch (e) { console.error(e); }
  };

  const handleHiringStatus = async (id, status) => {
    try {
      const res = await axiosInstance.patch(`/admin/hiring/${id}`, { status });
      setApplications(prev => prev.map(a => a._id === id ? res.data.application : a));
    } catch (e) { console.error(e); }
  };

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const roleLabel = user?.role === 'super-admin' ? 'SUPER ADMIN' : user?.role === 'sub-admin' ? 'SUB ADMIN' : user?.role?.toUpperCase();

  if (!mounted) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#080808', fontFamily: "'Inter', system-ui, sans-serif", color: '#fff' }}>

      {/* ── HEADER ── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.07)', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', position: 'sticky', top: 0, zIndex: 100 }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <motion.div
            animate={{ boxShadow: [`0 0 0px ${accentColor}00`, `0 0 16px ${accentColor}66`, `0 0 0px ${accentColor}00`] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ width: '34px', height: '34px', background: accentColor, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.82rem', color: '#000', flexShrink: 0 }}
          >YB</motion.div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#fff', letterSpacing: '0.02em', lineHeight: 1.1 }}>
              YBEX <span style={{ color: accentColor }}>COMMAND</span> CENTER
            </div>
            <div style={{ fontSize: '0.48rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Secure Dashboard Management</div>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.35rem 0.85rem' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: `${accentColor}20`, border: `1px solid ${accentColor}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', color: accentColor, fontWeight: 900 }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: accentColor, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{user?.name?.toUpperCase() || 'ADMIN'}</div>
              <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{roleLabel}</div>
            </div>
          </div>
          <motion.a href="/" target="_blank" rel="noreferrer" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.35rem 0.85rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
          >🌐 Live Site</motion.a>
          <motion.button onClick={handleLogout} whileHover={{ scale: 1.06, background: 'rgba(255,61,16,0.3)' }} whileTap={{ scale: 0.93 }}
            style={{ width: '34px', height: '34px', background: 'rgba(255,61,16,0.1)', border: '1px solid rgba(255,61,16,0.3)', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF3D10', fontSize: '1rem', transition: 'all 0.2s' }}
            title="Logout"
          >⏻</motion.button>
        </div>
      </motion.header>

      {/* ── TAB BAR ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', padding: '0 1.5rem', position: 'sticky', top: '64px', zIndex: 90 }}
      >
        {[
          { key: 'enquiries', label: 'Enquiries' },
          { key: 'hiring',    label: 'Hiring'    },
        ].map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <motion.button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{ padding: '0 1.1rem', height: '44px', fontSize: '0.72rem', fontWeight: isActive ? 700 : 500, letterSpacing: '0.08em', textTransform: 'uppercase', background: isActive ? `${accentColor}18` : 'transparent', color: isActive ? '#fff' : 'rgba(255,255,255,0.45)', border: 'none', borderBottom: isActive ? `2px solid ${accentColor}` : '2px solid transparent', borderTop: '2px solid transparent', cursor: 'pointer', position: 'relative', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
            >
              {tab.label}
              {isActive && (
                <motion.div layoutId="sub-tab-indicator"
                  style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: accentColor }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* ── MAIN CONTENT ── */}
      <main style={{ padding: 'clamp(1rem, 2vw, 1.5rem)', maxWidth: '1200px', margin: '0 auto' }}>
        <AnimatePresence mode="wait">

          {/* ENQUIRIES TAB */}
          {activeTab === 'enquiries' && (
            <motion.div key="enquiries" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>

                {/* Sidebar — category list */}
                <div style={{ width: '200px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {categories.map(cat => {
                    const conf = STATUS_MAP[cat];
                    const isActive = activeCat === cat;
                    const count = catCounts[cat] || 0;
                    return (
                      <motion.button key={cat} whileHover={!isActive ? { x: 3 } : {}} whileTap={{ scale: 0.97 }}
                        onClick={() => handleCatChange(cat)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.9rem', background: isActive ? accentColor : 'rgba(255,255,255,0.04)', border: `1px solid ${isActive ? accentColor : 'rgba(255,255,255,0.08)'}`, borderRadius: '10px', color: isActive ? '#000' : 'rgba(255,255,255,0.6)', fontSize: '0.72rem', fontWeight: isActive ? 800 : 500, cursor: 'pointer', textAlign: 'left', letterSpacing: '0.04em', textTransform: 'uppercase', boxShadow: isActive ? `0 4px 18px ${accentColor}40` : 'none', transition: 'all 0.15s' }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{conf?.icon}</span><span>{conf?.label}</span>
                        </span>
                        {count > 0 && (
                          <span style={{ background: isActive ? 'rgba(0,0,0,0.2)' : `${accentColor}25`, color: isActive ? '#000' : accentColor, fontSize: '0.62rem', fontWeight: 900, padding: '0.06rem 0.38rem', borderRadius: '20px', minWidth: '16px', textAlign: 'center' }}>{count}</span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Enquiry cards */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <AnimatePresence mode="wait">
                    {loadingEnq ? (
                      <motion.div key="enq-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        {[...Array(3)].map((_, i) => (
                          <motion.div key={i} animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
                            style={{ height: '90px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }} />
                        ))}
                      </motion.div>
                    ) : contacts.length === 0 ? (
                      <motion.div key="enq-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.88rem' }}
                      >
                        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</motion.div>
                        No enquiries in this category.
                      </motion.div>
                    ) : (
                      <motion.div key={activeCat} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <AnimatePresence>
                          {contacts.map(c => (
                            <EnquiryCard key={c._id} contact={c} onApprove={handleApprove} onReject={handleReject} accentColor={accentColor} />
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* HIRING TAB */}
          {activeTab === 'hiring' && (
            <motion.div key="hiring" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
              {/* Hiring banner */}
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: `linear-gradient(135deg, rgba(167,139,250,0.12), rgba(96,165,250,0.08))`, border: '1px solid rgba(167,139,250,0.2)', borderRadius: '14px', padding: '1.25rem 1.5rem', marginBottom: '1.25rem', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>💼</span>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#a78bfa', letterSpacing: '0.04em', textTransform: 'uppercase', margin: 0 }}>Team YBEX Applications</h2>
                  <span style={{ marginLeft: 'auto', fontSize: '1.3rem', opacity: 0.4 }}>🚀</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>Talent Pipeline Management</p>
              </motion.div>

              <AnimatePresence mode="wait">
                {loadingHire ? (
                  <motion.div key="hire-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {[...Array(3)].map((_, i) => (
                      <motion.div key={i} animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
                        style={{ height: '110px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }} />
                    ))}
                  </motion.div>
                ) : applications.length === 0 ? (
                  <motion.div key="hire-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.88rem' }}
                  >
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💼</motion.div>
                    No applications yet.
                  </motion.div>
                ) : (
                  <motion.div key="hire-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <AnimatePresence>
                      {applications.map(app => (
                        <HiringCard key={app._id} app={app} onStatusChange={handleHiringStatus} accentColor={accentColor} />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
