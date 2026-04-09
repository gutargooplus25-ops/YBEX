import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AdminLayout from './AdminLayout';
import axiosInstance from '../../api/axiosInstance';

const CATEGORIES = [
  { key: 'all', label: 'All Enquiries', icon: '📋' },
  { key: 'creators-school', label: 'Creators School', icon: '📚' },
  { key: 'pitch-ideas', label: 'Pitch Ideas', icon: '💡' },
  { key: 'sales-brand-growth', label: 'Sales / Brand Growth', icon: '⚡' },
  { key: 'general', label: 'General / Community', icon: '💬' },
  { key: 'challenge', label: 'Challenge', icon: '🏆' },
];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }) +
    ', ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, x: -20, height: 0, marginBottom: 0, transition: { duration: 0.3 } },
};

export default function AdminEnquiries() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [counts, setCounts] = useState({});

  const fetchContacts = async (category) => {
    setLoading(true);
    try {
      const params = category !== 'all' ? `?category=${category}` : '';
      const res = await axiosInstance.get(`/admin/contacts${params}`);
      setContacts(res.data.contacts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    try {
      const all = await axiosInstance.get('/admin/contacts');
      const countMap = { all: all.data.total };
      for (const cat of CATEGORIES.slice(1)) {
        const r = await axiosInstance.get(`/admin/contacts?category=${cat.key}`);
        countMap[cat.key] = r.data.total;
      }
      setCounts(countMap);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchContacts(activeCategory);
    fetchCounts();
  }, []);

  const handleCategoryChange = (key) => {
    setActiveCategory(key);
    fetchContacts(key);
  };

  const handleReject = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    try {
      await axiosInstance.delete(`/admin/contacts/${id}`);
      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkRead = async (id, current) => {
    try {
      await axiosInstance.patch(`/admin/contacts/${id}`, { isRead: !current });
      setContacts((prev) => prev.map((c) => c._id === id ? { ...c, isRead: !current } : c));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="enquiries-layout" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="enquiries-sidebar"
          style={{ width: '200px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}
        >
          {CATEGORIES.map((cat, i) => {
            const isActive = activeCategory === cat.key;
            const count = counts[cat.key] ?? 0;
            return (
              <motion.button
                key={cat.key}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                whileHover={!isActive ? { x: 4, background: 'rgba(255,255,255,0.07)' } : {}}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCategoryChange(cat.key)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: isActive ? '#ff4500' : 'rgba(255,255,255,0.03)',
                  border: isActive ? '1px solid #ff4500' : '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '10px',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                  fontSize: '0.78rem', fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left', letterSpacing: '0.04em', textTransform: 'uppercase',
                  boxShadow: isActive ? '0 4px 20px rgba(255,69,0,0.3)' : 'none',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </span>
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      style={{
                        background: isActive ? 'rgba(0,0,0,0.25)' : 'rgba(255,69,0,0.2)',
                        color: isActive ? '#fff' : '#ff4500',
                        fontSize: '0.68rem', fontWeight: 800,
                        padding: '0.1rem 0.45rem', borderRadius: '20px', minWidth: '20px', textAlign: 'center',
                      }}
                    >{count}</motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
                    style={{
                      height: '110px', borderRadius: '12px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  />
                ))}
              </motion.div>
            ) : contacts.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '14px', padding: '5rem', textAlign: 'center',
                  color: 'rgba(255,255,255,0.25)', fontSize: '0.9rem',
                }}
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ fontSize: '2.5rem', marginBottom: '1rem' }}
                >📭</motion.div>
                No enquiries found in this category.
              </motion.div>
            ) : (
              <motion.div
                key={activeCategory}
                variants={listVariants}
                initial="hidden"
                animate="show"
                style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
              >
                {contacts.map((contact) => (
                  <motion.div
                    key={contact._id}
                    variants={itemVariants}
                    layout
                    whileHover={{ borderColor: contact.isRead ? 'rgba(255,255,255,0.14)' : 'rgba(255,69,0,0.3)' }}
                    style={{
                      background: contact.isRead ? 'rgba(255,255,255,0.025)' : 'rgba(255,69,0,0.04)',
                      border: contact.isRead ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,69,0,0.18)',
                      borderRadius: '14px',
                      padding: '1.25rem 1.5rem',
                    }}
                  >
                    {/* Top row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <span style={{
                          background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.55)',
                          fontSize: '0.68rem', fontWeight: 700, padding: '0.2rem 0.6rem',
                          borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.08em',
                        }}>
                          {contact.category || 'general'}
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.76rem' }}>
                          {formatDate(contact.createdAt)}
                        </span>
                        <AnimatePresence>
                          {!contact.isRead && (
                            <motion.span
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              style={{
                                background: 'rgba(255,69,0,0.2)', color: '#ff4500',
                                fontSize: '0.62rem', fontWeight: 800,
                                padding: '0.15rem 0.5rem', borderRadius: '20px', letterSpacing: '0.08em',
                              }}
                            >NEW</motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => handleMarkRead(contact._id, contact.isRead)}
                          style={{
                            padding: '0.38rem 0.85rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '7px', color: 'rgba(255,255,255,0.6)',
                            fontSize: '0.73rem', fontWeight: 600, cursor: 'pointer',
                          }}
                        >
                          {contact.isRead ? 'Mark Unread' : 'Mark Read'}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.04, background: 'rgba(255,69,0,0.25)' }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => handleReject(contact._id)}
                          style={{
                            padding: '0.38rem 0.85rem',
                            background: 'rgba(255,69,0,0.12)',
                            border: '1px solid rgba(255,69,0,0.35)',
                            borderRadius: '7px', color: '#ff4500',
                            fontSize: '0.73rem', fontWeight: 800, cursor: 'pointer',
                            letterSpacing: '0.06em',
                          }}
                        >
                          REJECT
                        </motion.button>
                      </div>
                    </div>

                    {/* Name */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}
                    >
                      {contact.name.toUpperCase()}
                    </motion.div>

                    {/* Contact info */}
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: contact.message ? '0.75rem' : 0 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.5)', fontSize: '0.84rem' }}>
                        <span style={{ color: '#ff4500' }}>✉</span> {contact.email}
                      </span>
                      {contact.phone && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.5)', fontSize: '0.84rem' }}>
                          <span style={{ color: '#ff4500' }}>📞</span> {contact.phone}
                        </span>
                      )}
                    </div>

                    {/* Message */}
                    <AnimatePresence>
                      {contact.message && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          style={{
                            marginTop: '0.75rem',
                            padding: '0.75rem 1rem',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '8px',
                            borderLeft: '3px solid rgba(255,69,0,0.45)',
                          }}
                        >
                          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', fontWeight: 700, marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                            Subject: <span style={{ color: 'rgba(255,255,255,0.55)' }}>{contact.subject}</span>
                          </div>
                          <div style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>
                            {contact.message}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .enquiries-layout { flex-direction: column !important; }
          .enquiries-sidebar { width: 100% !important; flex-direction: row !important; flex-wrap: wrap !important; }
          .enquiries-sidebar button { flex: 1 1 calc(50% - 0.2rem) !important; min-width: 0 !important; }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          .enquiries-sidebar { width: 160px !important; }
        }
      `}</style>
    </AdminLayout>
  );
}
