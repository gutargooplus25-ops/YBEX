import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AdminLayout from './AdminLayout';
import axiosInstance from '../../api/axiosInstance';

/* ── categories (no challenge) ── */
const CATEGORIES = [
  { key: 'all',                label: 'All Enquiries',        icon: '📋' },
  { key: 'creators-school',    label: 'Creators School',      icon: '📚' },
  { key: 'pitch-ideas',        label: 'Pitch Ideas',          icon: '💡' },
  { key: 'sales-brand-growth', label: 'Sales / Brand Growth', icon: '⚡' },
  { key: 'general',            label: 'General',              icon: '💬' },
];

/* status → card border/bg */
const STATUS_STYLE = {
  pending:  { border: 'rgba(59,130,246,0.35)',  bg: 'rgba(59,130,246,0.05)',  badge: '#3b82f6',  label: 'PENDING'  },
  approved: { border: 'rgba(74,222,128,0.4)',   bg: 'rgba(74,222,128,0.06)', badge: '#4ade80',  label: 'APPROVED' },
  rejected: { border: 'rgba(255,61,16,0.35)',   bg: 'rgba(255,61,16,0.05)',  badge: '#FF3D10',  label: 'REJECTED' },
};

function fmt(d) {
  const dt = new Date(d);
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' · ' + dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

/* ── Reply Modal ── */
function ReplyModal({ contact, onClose, onReplied }) {
  const [msg, setMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState('');

  const send = async () => {
    if (!msg.trim()) { setErr('Reply cannot be empty'); return; }
    setSending(true); setErr('');
    try {
      const res = await axiosInstance.post(`/admin/contacts/${contact._id}/reply`, { replyMessage: msg });
      onReplied(res.data.contact);
      onClose();
    } catch (e) { setErr(e.response?.data?.message || 'Failed to send'); }
    finally { setSending(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 24 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '540px', background: '#111', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.8)' }}
      >
        <div style={{ height: '2px', background: 'linear-gradient(90deg,transparent,#E4F141,transparent)' }} />
        <div style={{ padding: '1.5rem 1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: '#fff', marginBottom: '3px' }}>Reply to {contact.name}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>→ {contact.email}</div>
            </div>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose}
              style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >✕</motion.button>
          </div>

          {/* original message */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '5px' }}>Original · {contact.subject}</div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, maxHeight: '72px', overflow: 'hidden' }}>{contact.message}</div>
          </div>

          <textarea value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Write your reply…" rows={5}
            style={{ width: '100%', padding: '0.9rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', color: '#fff', fontSize: '0.88rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.65 }}
            onFocus={(e) => e.target.style.borderColor = '#E4F141'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
          />
          {err && <div style={{ marginTop: '0.6rem', fontSize: '0.78rem', color: '#FF3D10' }}>⚠ {err}</div>}

          <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1.1rem', justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{ padding: '0.6rem 1.2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            <motion.button whileHover={!sending ? { scale: 1.03, boxShadow: '0 6px 20px rgba(228,241,65,0.3)' } : {}} whileTap={!sending ? { scale: 0.97 } : {}}
              onClick={send} disabled={sending}
              style={{ padding: '0.6rem 1.4rem', background: sending ? 'rgba(228,241,65,0.4)' : '#E4F141', border: 'none', borderRadius: '10px', color: '#000', fontSize: '0.82rem', fontWeight: 800, cursor: sending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {sending ? (<><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%' }} />Sending…</>) : '✉ Send Reply'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── single enquiry card ── */
function EnquiryCard({ contact, onApprove, onReject, onReply, onMarkRead }) {
  const [expanded, setExpanded] = useState(false);
  const [busy, setBusy] = useState('');
  const ss = STATUS_STYLE[contact.status] || STATUS_STYLE.pending;

  const doApprove = async (e) => { e.stopPropagation(); setBusy('approve'); await onApprove(contact._id); setBusy(''); };
  const doReject  = async (e) => { e.stopPropagation(); setBusy('reject');  await onReject(contact._id);  setBusy(''); };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, height: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{ background: ss.bg, border: `1px solid ${ss.border}`, borderRadius: '14px', overflow: 'hidden', transition: 'border-color 0.3s, background 0.3s' }}
    >
      {/* header row — always visible, click to expand */}
      <div onClick={() => setExpanded(!expanded)} style={{ padding: '1.1rem 1.4rem', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.7rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', fontSize: '0.62rem', fontWeight: 700, padding: '0.18rem 0.55rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {contact.category || 'general'}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>{fmt(contact.createdAt)}</span>
            {!contact.isRead && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                style={{ background: 'rgba(255,61,16,0.2)', color: '#FF3D10', fontSize: '0.6rem', fontWeight: 900, padding: '0.12rem 0.45rem', borderRadius: '20px', letterSpacing: '0.1em' }}>● NEW</motion.span>
            )}
            {contact.adminReply && (
              <span style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', fontSize: '0.6rem', fontWeight: 800, padding: '0.12rem 0.45rem', borderRadius: '20px', border: '1px solid rgba(74,222,128,0.25)' }}>✓ REPLIED</span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: `${ss.badge}20`, color: ss.badge, fontSize: '0.62rem', fontWeight: 900, padding: '0.2rem 0.65rem', borderRadius: '20px', border: `1px solid ${ss.badge}40`, letterSpacing: '0.1em' }}>{ss.label}</span>
            <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.22 }} style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>▼</motion.span>
          </div>
        </div>

        <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.01em', marginBottom: '4px' }}>{contact.name.toUpperCase()}</div>
        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', fontStyle: 'italic', marginBottom: '0.6rem' }}>{contact.subject}</div>
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
            <span style={{ color: '#FF3D10' }}>✉</span> {contact.email}
          </span>
          {contact.phone && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
              <span style={{ color: '#FF3D10' }}>📞</span> {contact.phone}
            </span>
          )}
        </div>
      </div>

      {/* expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 1.4rem 1.4rem' }}>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '1.1rem' }} />

              {/* message */}
              {contact.message && (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderLeft: '3px solid rgba(255,61,16,0.5)', borderRadius: '10px', padding: '0.9rem 1.1rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Message</div>
                  <div style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.75 }}>{contact.message}</div>
                </div>
              )}

              {/* admin reply */}
              {contact.adminReply && (
                <div style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.2)', borderLeft: '3px solid #4ade80', borderRadius: '10px', padding: '0.9rem 1.1rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.62rem', color: '#4ade80', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Admin Reply</div>
                  <div style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75 }}>{contact.adminReply}</div>
                </div>
              )}

              {/* action buttons */}
              <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {contact.status !== 'approved' && (
                  <motion.button whileHover={{ scale: 1.04, boxShadow: '0 4px 16px rgba(74,222,128,0.3)' }} whileTap={{ scale: 0.96 }}
                    onClick={doApprove} disabled={busy === 'approve'}
                    style={{ padding: '0.5rem 1.1rem', background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.4)', borderRadius: '9px', color: '#4ade80', fontSize: '0.75rem', fontWeight: 800, cursor: busy === 'approve' ? 'not-allowed' : 'pointer', letterSpacing: '0.07em' }}
                  >{busy === 'approve' ? '…' : '✓ ACCEPT'}</motion.button>
                )}
                {contact.status !== 'rejected' && (
                  <motion.button whileHover={{ scale: 1.04, boxShadow: '0 4px 16px rgba(255,61,16,0.3)' }} whileTap={{ scale: 0.96 }}
                    onClick={doReject} disabled={busy === 'reject'}
                    style={{ padding: '0.5rem 1.1rem', background: 'rgba(255,61,16,0.12)', border: '1px solid rgba(255,61,16,0.4)', borderRadius: '9px', color: '#FF3D10', fontSize: '0.75rem', fontWeight: 800, cursor: busy === 'reject' ? 'not-allowed' : 'pointer', letterSpacing: '0.07em' }}
                  >{busy === 'reject' ? '…' : '✕ REJECT'}</motion.button>
                )}
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={(e) => { e.stopPropagation(); onReply(contact); }}
                  style={{ padding: '0.5rem 1.1rem', background: 'rgba(228,241,65,0.1)', border: '1px solid rgba(228,241,65,0.3)', borderRadius: '9px', color: '#E4F141', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em' }}
                >✉ {contact.adminReply ? 'RE-REPLY' : 'REPLY'}</motion.button>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={(e) => { e.stopPropagation(); onMarkRead(contact._id, contact.isRead); }}
                  style={{ padding: '0.5rem 1.1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '9px', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                >{contact.isRead ? '○ Unread' : '● Read'}</motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AdminEnquiries() {
  const [contacts, setContacts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeCategory, setActive]   = useState('all');
  const [counts, setCounts]           = useState({});
  const [replyTarget, setReplyTarget] = useState(null);

  const fetchContacts = async (cat) => {
    setLoading(true);
    try {
      const q = cat !== 'all' ? `?category=${cat}` : '';
      const res = await axiosInstance.get(`/admin/contacts${q}`);
      setContacts(res.data.contacts || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchCounts = async () => {
    try {
      const all = await axiosInstance.get('/admin/contacts');
      const map = { all: all.data.total || 0 };
      for (const c of CATEGORIES.slice(1)) {
        const r = await axiosInstance.get(`/admin/contacts?category=${c.key}`);
        map[c.key] = r.data.total || 0;
      }
      setCounts(map);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchContacts('all'); fetchCounts(); }, []);

  const handleCategoryChange = (key) => { setActive(key); fetchContacts(key); };

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

  const handleMarkRead = async (id, current) => {
    try {
      const res = await axiosInstance.patch(`/admin/contacts/${id}`, { isRead: !current });
      setContacts(prev => prev.map(c => c._id === id ? res.data.contact : c));
    } catch (e) { console.error(e); }
  };

  const handleReplied = (updated) => setContacts(prev => prev.map(c => c._id === updated._id ? updated : c));

  const unread = contacts.filter(c => !c.isRead).length;

  return (
    <AdminLayout>
      {/* page title */}
      <div className="admin-page-header" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3px' }}>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>All Enquiries</h1>
          {unread > 0 && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
              style={{ background: '#FF3D10', color: '#fff', fontSize: '0.62rem', fontWeight: 900, padding: '0.15rem 0.5rem', borderRadius: '20px' }}
            >{unread} unread</motion.span>
          )}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', margin: 0 }}>Review, accept, reject and reply to contact submissions</p>
      </div>

      <div className="enq-layout" style={{ display: 'flex', gap: '1.1rem', alignItems: 'flex-start' }}>

        {/* sidebar */}
        <div className="enq-sidebar" style={{ width: '195px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key;
            const count = counts[cat.key] ?? 0;
            return (
              <motion.button key={cat.key}
                whileHover={!isActive ? { x: 3 } : {}} whileTap={{ scale: 0.97 }}
                onClick={() => handleCategoryChange(cat.key)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.65rem 0.9rem',
                  background: isActive ? '#FF3D10' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isActive ? '#FF3D10' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '10px', color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                  fontSize: '0.75rem', fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer', textAlign: 'left', letterSpacing: '0.04em', textTransform: 'uppercase',
                  boxShadow: isActive ? '0 4px 18px rgba(255,61,16,0.3)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <span>{cat.icon}</span><span>{cat.label}</span>
                </span>
                {count > 0 && (
                  <span style={{ background: isActive ? 'rgba(0,0,0,0.25)' : 'rgba(255,61,16,0.2)', color: isActive ? '#fff' : '#FF3D10', fontSize: '0.65rem', fontWeight: 900, padding: '0.08rem 0.4rem', borderRadius: '20px', minWidth: '18px', textAlign: 'center' }}>{count}</span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* main list */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
              >
                {[...Array(4)].map((_, i) => (
                  <motion.div key={i} animate={{ opacity: [0.25, 0.5, 0.25] }} transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
                    style={{ height: '90px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }} />
                ))}
              </motion.div>
            ) : contacts.length === 0 ? (
              <motion.div key="empty" className="admin-empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '5rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.88rem' }}
              >
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📭</motion.div>
                No enquiries in this category.
              </motion.div>
            ) : (
              <motion.div key={activeCategory} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}
              >
                <AnimatePresence>
                  {contacts.map(c => (
                    <EnquiryCard key={c._id} contact={c}
                      onApprove={handleApprove} onReject={handleReject}
                      onReply={setReplyTarget} onMarkRead={handleMarkRead}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* reply modal */}
      <AnimatePresence>
        {replyTarget && <ReplyModal contact={replyTarget} onClose={() => setReplyTarget(null)} onReplied={handleReplied} />}
      </AnimatePresence>

      <style>{`
        @media (max-width: 640px) { .enq-layout { flex-direction: column !important; } .enq-sidebar { width: 100% !important; flex-direction: row !important; flex-wrap: wrap !important; } .enq-sidebar button { flex: 1 1 calc(50% - 0.2rem) !important; } .admin-empty-state { padding: 3rem 1.25rem !important; } }
        @media (max-width: 480px) { .enq-sidebar button { flex-basis: 100% !important; } }
        @media (min-width: 641px) and (max-width: 900px) { .enq-sidebar { width: 160px !important; } }
      `}</style>
    </AdminLayout>
  );
}
