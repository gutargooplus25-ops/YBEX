import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AdminLayout from './AdminLayout';
import axiosInstance from '../../api/axiosInstance';

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace('/api', '');
const toAbsUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_BASE}${url}`;
};

function AddInfluencerModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', profileLink: '', image: null, imagePreview: null });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const fileRef = useRef();

  useEffect(() => {
    if (open) { setForm({ name: '', profileLink: '', image: null, imagePreview: null }); setErr(''); }
  }, [open]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, image: file, imagePreview: URL.createObjectURL(file) }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) { setErr('Name is required'); return; }
    setSaving(true); setErr('');
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('profileLink', form.profileLink);
      if (form.image) fd.append('image', form.image);
      const res = await axiosInstance.post('/admin/influencers', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      onAdd(res.data.influencer);
      onClose();
    } catch (e) { setErr(e.response?.data?.message || 'Error adding influencer'); }
    finally { setSaving(false); }
  };

  if (!open) return null;

  const inputStyle = {
    width: '100%', padding: '0.8rem 1rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '10px', color: '#fff', fontSize: '0.88rem',
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 40 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: '100%', maxWidth: '460px',
              background: '#0e0e0e',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px', overflow: 'hidden',
              boxShadow: '0 50px 100px rgba(0,0,0,0.8)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1.5rem 1.75rem 1.25rem',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(228,241,65,0.04)',
            }}>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#fff' }}>Add Influencer</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>Fill in influencer details</div>
              </div>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose}
                style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >✕</motion.button>
            </div>

            {/* Body */}
            <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {err && <div style={{ background: 'rgba(255,61,16,0.1)', border: '1px solid rgba(255,61,16,0.3)', borderRadius: '8px', padding: '0.6rem 1rem', color: '#FF3D10', fontSize: '0.8rem' }}>⚠ {err}</div>}

              {/* Image upload */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  onClick={() => fileRef.current.click()}
                  style={{
                    width: '100px', height: '100px', borderRadius: '50%',
                    background: form.imagePreview ? 'transparent' : 'rgba(255,255,255,0.05)',
                    border: `2px dashed ${form.imagePreview ? '#e4f141' : 'rgba(255,255,255,0.2)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', overflow: 'hidden', transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={(e) => { if (!form.imagePreview) e.currentTarget.style.borderColor = '#e4f141'; }}
                  onMouseLeave={(e) => { if (!form.imagePreview) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                >
                  {form.imagePreview
                    ? <img src={form.imagePreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📷</div>
                        <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>CLICK TO UPLOAD</div>
                      </div>
                  }
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
              </div>

              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.4rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Name</label>
                <input type="text" placeholder="Influencer name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#e4f141'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.4rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Profile Link</label>
                <input type="text" placeholder="https://instagram.com/..." value={form.profileLink} onChange={(e) => setForm({ ...form, profileLink: e.target.value })} style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#e4f141'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '1.1rem 1.75rem', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: '0.65rem', justifyContent: 'flex-end' }}>
              <button onClick={onClose} style={{ padding: '0.65rem 1.25rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '9px', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <motion.button
                whileHover={!saving ? { scale: 1.03, boxShadow: '0 6px 20px rgba(228,241,65,0.25)' } : {}}
                whileTap={!saving ? { scale: 0.97 } : {}}
                onClick={handleSubmit}
                disabled={saving}
                style={{
                  padding: '0.65rem 1.5rem',
                  background: saving ? 'rgba(228,241,65,0.4)' : '#e4f141',
                  border: 'none', borderRadius: '9px',
                  color: '#000', fontSize: '0.82rem', fontWeight: 800,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                {saving ? (
                  <>
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%' }} />
                    Adding...
                  </>
                ) : '+ Add Influencer'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function AdminInfluencers() {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchInfluencers = async () => {
    try {
      const res = await axiosInstance.get('/admin/influencers');
      setInfluencers(res.data.influencers || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchInfluencers(); }, []);

  const handleAdd = (inf) => setInfluencers((prev) => [...prev, inf]);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this influencer?')) return;
    try {
      await axiosInstance.delete(`/admin/influencers/${id}`);
      setInfluencers((prev) => prev.filter((inf) => inf._id !== id));
    } catch (e) { console.error(e); }
  };

  return (
    <AdminLayout>
      <AddInfluencerModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAdd} />

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}
      >
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginBottom: '0.2rem', letterSpacing: '-0.02em' }}>Influencers</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>{influencers.length} influencer{influencers.length !== 1 ? 's' : ''} added</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(228,241,65,0.3)' }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setModalOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '0.65rem 1.25rem',
            background: '#e4f141', border: 'none', borderRadius: '10px',
            color: '#000', fontSize: '0.85rem', fontWeight: 800,
            cursor: 'pointer', letterSpacing: '0.04em',
          }}
        >
          <span>+</span> Add Influencer
        </motion.button>
      </motion.div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
          {[...Array(6)].map((_, i) => (
            <motion.div key={i} animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.1 }}
              style={{ height: '200px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }} />
          ))}
        </div>
      ) : influencers.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '5rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.9rem' }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌟</div>
          No influencers yet. Click "Add Influencer" to get started.
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}
        >
          <AnimatePresence>
            {influencers.map((inf, i) => (
              <motion.div
                key={inf._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.5)', borderColor: 'rgba(228,241,65,0.3)' }}
                style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '14px', overflow: 'hidden', position: 'relative',
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{ width: '100%', aspectRatio: '1', background: 'rgba(255,255,255,0.05)', overflow: 'hidden', position: 'relative' }}>
                  {inf.imageUrl
                    ? <img src={toAbsUrl(inf.imageUrl)} alt={inf.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s, filter 0.3s' }}
                        onMouseEnter={(e) => { e.target.style.transform = 'scale(1.07)'; e.target.style.filter = 'brightness(1.1)'; }}
                        onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.filter = 'brightness(1)'; }}
                      />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: 'rgba(255,255,255,0.15)' }}>🌟</div>
                  }
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)', pointerEvents: 'none' }} />
                </div>
                <div style={{ padding: '0.75rem 1rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>{inf.name}</div>
                  {inf.profileLink && (
                    <a href={inf.profileLink} target="_blank" rel="noreferrer" style={{ fontSize: '0.68rem', color: '#e4f141', textDecoration: 'none', letterSpacing: '0.04em' }}>View Profile →</a>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, background: 'rgba(255,61,16,0.3)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(inf._id)}
                  style={{
                    position: 'absolute', top: '8px', right: '8px',
                    width: '26px', height: '26px',
                    background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '6px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem',
                  }}
                >🗑</motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </AdminLayout>
  );
}
