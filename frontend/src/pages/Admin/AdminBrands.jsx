import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AdminLayout from './AdminLayout';
import axiosInstance from '../../api/axiosInstance';

const ACCENT = '#e4f141';
const BORDER = 'rgba(255,255,255,0.08)';
const MUTED  = 'rgba(255,255,255,0.35)';
const DIM    = 'rgba(255,255,255,0.12)';

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace('/api', '');

function toAbsUrl(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_BASE}${url}`;
}

function AddBrandModal({ open, onClose, onAdd }) {
  const [name, setName]               = useState('');
  const [websiteLink, setWebsiteLink] = useState('');
  const [logo, setLogo]               = useState(null);
  const [preview, setPreview]         = useState(null);
  const [saving, setSaving]           = useState(false);
  const [err, setErr]                 = useState('');
  const fileRef = useRef();

  useEffect(() => {
    if (open) { setName(''); setWebsiteLink(''); setLogo(null); setPreview(null); setErr(''); }
  }, [open]);

  const pickFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setLogo(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async () => {
    if (!name.trim())        { setErr('Brand name is required');   return; }
    if (!logo)               { setErr('Brand logo is required');   return; }
    if (!websiteLink.trim()) { setErr('Website link is required'); return; }
    setSaving(true); setErr('');
    try {
      const fd = new FormData();
      fd.append('name', name.trim());
      fd.append('websiteLink', websiteLink.trim());
      fd.append('logo', logo);
      const { data } = await axiosInstance.post('/admin/brands', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onAdd(data.brand);
      onClose();
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to add brand');
    } finally {
      setSaving(false);
    }
  };

  const inp = {
    width: '100%', padding: '0.85rem 1rem',
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${DIM}`, borderRadius: '12px',
    color: '#fff', fontSize: '0.88rem', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color .2s, box-shadow .2s',
    fontFamily: 'inherit',
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="bd"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(16px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}
      >
        <motion.div
          key="bx"
          initial={{ opacity: 0, scale: 0.86, y: 48 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.86, y: 48 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '100%', maxWidth: '500px', background: '#0d0d0d',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', overflow: 'hidden',
            boxShadow: '0 60px 120px rgba(0,0,0,0.95)',
          }}
        >
          <div style={{
            padding: '1.6rem 1.8rem 1.3rem',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'linear-gradient(135deg,rgba(228,241,65,0.06) 0%,transparent 55%)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: 'rgba(228,241,65,0.1)', border: '1px solid rgba(228,241,65,0.22)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', color: ACCENT, fontWeight: 900,
              }}>B</div>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
                  Add New Brand
                </div>
                <div style={{ fontSize: '0.68rem', color: MUTED, marginTop: '2px' }}>
                  All three fields are required
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
              onClick={onClose}
              style={{
                width: '32px', height: '32px', borderRadius: '9px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.9rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >x</motion.button>
          </div>

          <div style={{ padding: '1.6rem 1.8rem', display: 'flex', flexDirection: 'column', gap: '1.3rem' }}>
            <AnimatePresence>
              {err && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{
                    background: 'rgba(255,61,16,0.08)', border: '1px solid rgba(255,61,16,0.28)',
                    borderRadius: '10px', padding: '0.7rem 1rem',
                    color: '#FF3D10', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px',
                  }}
                >! {err}</motion.div>
              )}
            </AnimatePresence>

            <div>
              <label style={{ display: 'block', color: MUTED, fontSize: '0.67rem', fontWeight: 700, marginBottom: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Brand Logo <span style={{ color: ACCENT }}>*</span>
              </label>
              <motion.div
                onClick={() => fileRef.current.click()}
                onDrop={(e) => { e.preventDefault(); pickFile(e.dataTransfer.files[0]); }}
                onDragOver={(e) => e.preventDefault()}
                whileHover={{ borderColor: ACCENT, background: 'rgba(228,241,65,0.04)' }}
                style={{
                  width: '100%', height: '148px',
                  border: `2px dashed ${preview ? ACCENT : DIM}`,
                  borderRadius: '16px',
                  background: preview ? 'rgba(228,241,65,0.03)' : 'rgba(255,255,255,0.02)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', overflow: 'hidden', position: 'relative',
                  transition: 'border-color .2s, background .2s',
                }}
              >
                {preview ? (
                  <>
                    <img src={preview} alt="preview"
                      style={{ maxWidth: '80%', maxHeight: '115px', objectFit: 'contain' }}
                    />
                    <div style={{
                      position: 'absolute', bottom: '8px', right: '10px',
                      fontSize: '0.6rem', color: ACCENT, fontWeight: 700,
                      background: 'rgba(0,0,0,0.65)', padding: '2px 8px', borderRadius: '4px',
                    }}>CLICK TO CHANGE</div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px', opacity: 0.35, color: '#fff' }}>[ IMG ]</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.38)', fontWeight: 600 }}>
                      Click or drag and drop logo
                    </div>
                    <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.18)', marginTop: '4px' }}>
                      PNG, JPG, SVG - Max 5 MB
                    </div>
                  </div>
                )}
              </motion.div>
              <input ref={fileRef} type="file" accept="image/*"
                onChange={(e) => pickFile(e.target.files[0])} style={{ display: 'none' }} />
            </div>

            <div>
              <label style={{ display: 'block', color: MUTED, fontSize: '0.67rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Brand Name <span style={{ color: ACCENT }}>*</span>
              </label>
              <input
                type="text" placeholder="e.g. Nike, Colgate, Amazon"
                value={name} onChange={(e) => setName(e.target.value)}
                style={inp}
                onFocus={(e) => { e.target.style.borderColor = ACCENT; e.target.style.boxShadow = '0 0 0 3px rgba(228,241,65,0.08)'; }}
                onBlur={(e)  => { e.target.style.borderColor = DIM;    e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: MUTED, fontSize: '0.67rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Website Link <span style={{ color: ACCENT }}>*</span>
              </label>
              <input
                type="url" placeholder="https://brand.com"
                value={websiteLink} onChange={(e) => setWebsiteLink(e.target.value)}
                style={inp}
                onFocus={(e) => { e.target.style.borderColor = ACCENT; e.target.style.boxShadow = '0 0 0 3px rgba(228,241,65,0.08)'; }}
                onBlur={(e)  => { e.target.style.borderColor = DIM;    e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </div>

          <div style={{
            padding: '1.2rem 1.8rem', borderTop: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', gap: '0.75rem', justifyContent: 'flex-end',
            background: 'rgba(255,255,255,0.01)',
          }}>
            <button onClick={onClose} style={{
              padding: '0.7rem 1.4rem', background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
              color: 'rgba(255,255,255,0.55)', fontSize: '0.83rem', fontWeight: 600, cursor: 'pointer',
            }}>Cancel</button>
            <motion.button
              whileHover={!saving ? { scale: 1.04, boxShadow: '0 8px 26px rgba(228,241,65,0.32)' } : {}}
              whileTap={!saving ? { scale: 0.97 } : {}}
              onClick={submit} disabled={saving}
              style={{
                padding: '0.7rem 1.7rem', background: saving ? 'rgba(228,241,65,0.45)' : ACCENT,
                border: 'none', borderRadius: '10px', color: '#000',
                fontSize: '0.83rem', fontWeight: 800,
                cursor: saving ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '7px',
              }}
            >
              {saving ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.85, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'inline-block', width: '13px', height: '13px', border: '2px solid rgba(0,0,0,0.25)', borderTopColor: '#000', borderRadius: '50%' }}
                  />
                  Adding...
                </>
              ) : '+ Add Brand'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function BrandCard({ brand, index, onDelete }) {
  const [hovered, setHovered]   = useState(false);
  const [deleting, setDeleting] = useState(false);

  const remove = async () => {
    if (!window.confirm('Remove "' + brand.name + '"?')) return;
    setDeleting(true);
    try {
      await axiosInstance.delete('/admin/brands/' + brand._id);
      onDelete(brand._id);
    } catch (e) {
      console.error(e);
      setDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 22 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.84, y: -12 }}
      transition={{ delay: index * 0.055, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -8, boxShadow: '0 28px 56px rgba(0,0,0,0.65)', borderColor: 'rgba(228,241,65,0.35)' }}
      style={{
        background: 'linear-gradient(145deg,rgba(255,255,255,0.045) 0%,rgba(255,255,255,0.02) 100%)',
        border: '1px solid ' + BORDER, borderRadius: '20px',
        overflow: 'hidden', position: 'relative', transition: 'border-color .3s',
      }}
    >
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }}
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: '20px',
          background: 'radial-gradient(ellipse at 50% 0%,rgba(228,241,65,0.08) 0%,transparent 65%)',
        }}
      />

      <div style={{
        width: '100%', height: '148px', background: 'rgba(255,255,255,0.03)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', position: 'relative', borderBottom: '1px solid ' + BORDER,
      }}>
        {brand.logoUrl
          ? <motion.img
              src={toAbsUrl(brand.logoUrl)} alt={brand.name}
              animate={{ scale: hovered ? 1.07 : 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                maxWidth: '74%', maxHeight: '104px', objectFit: 'contain',
                filter: hovered ? 'brightness(1.12) drop-shadow(0 4px 18px rgba(228,241,65,0.22))' : 'brightness(0.88)',
                transition: 'filter .3s',
              }}
            />
          : <div style={{ fontSize: '1.5rem', opacity: 0.18, color: '#fff' }}>NO LOGO</div>
        }
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.32) 100%)',
        }} />
      </div>

      <div style={{ padding: '0.95rem 1.1rem 1.05rem' }}>
        <div style={{
          fontSize: '0.88rem', fontWeight: 800, color: '#fff', marginBottom: '5px',
          letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{brand.name}</div>
        <a
          href={brand.websiteLink} target="_blank" rel="noreferrer"
          style={{
            fontSize: '0.67rem', color: ACCENT, textDecoration: 'none',
            fontWeight: 600, letterSpacing: '0.04em',
            display: 'flex', alignItems: 'center', gap: '4px',
            opacity: 0.78, transition: 'opacity .2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.78'}
        >
          Visit Website
        </a>
      </div>

      <motion.button
        whileHover={{ scale: 1.12, background: 'rgba(255,61,16,0.32)' }}
        whileTap={{ scale: 0.9 }}
        onClick={remove} disabled={deleting}
        style={{
          position: 'absolute', top: '10px', right: '10px',
          width: '28px', height: '28px', background: 'rgba(0,0,0,0.58)',
          border: '1px solid rgba(255,255,255,0.13)', borderRadius: '8px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.75rem', opacity: hovered ? 1 : 0.45,
          transition: 'opacity .2s, background .2s',
          color: '#fff',
        }}
      >{deleting ? '...' : 'X'}</motion.button>

      <div style={{
        position: 'absolute', top: '10px', left: '10px',
        background: 'rgba(0,0,0,0.62)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '6px', padding: '2px 7px',
        fontSize: '0.59rem', color: 'rgba(255,255,255,0.28)', fontWeight: 700,
      }}>#{index + 1}</div>
    </motion.div>
  );
}

export default function AdminBrands() {
  const [brands, setBrands]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);

  useEffect(() => {
    axiosInstance.get('/admin/brands')
      .then(({ data }) => setBrands(data.brands || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAdd    = (b)  => setBrands((p) => [b, ...p]);
  const handleDelete = (id) => setBrands((p) => p.filter((b) => b._id !== id));

  return (
    <AdminLayout>
      <AddBrandModal open={modal} onClose={() => setModal(false)} onAdd={handleAdd} />

      <motion.div
        initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(228,241,65,0.1)', border: '1px solid rgba(228,241,65,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', color: ACCENT, fontWeight: 900,
            }}>B</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', margin: 0 }}>
              Brands
            </h1>
          </div>
          <p style={{ color: MUTED, fontSize: '0.79rem', margin: 0, paddingLeft: '46px' }}>
            {brands.length} brand{brands.length !== 1 ? 's' : ''} - displayed on homepage marquee
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(228,241,65,0.32)' }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setModal(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '0.72rem 1.45rem',
            background: ACCENT, border: 'none', borderRadius: '12px',
            color: '#000', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer',
          }}
        >+ Add Brand</motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
        style={{
          background: 'rgba(228,241,65,0.04)', border: '1px solid rgba(228,241,65,0.13)',
          borderRadius: '14px', padding: '0.9rem 1.2rem', marginBottom: '1.8rem',
          display: 'flex', alignItems: 'center', gap: '10px',
          fontSize: '0.78rem', color: 'rgba(255,255,255,0.48)',
        }}
      >
        Brands added here will appear on the homepage scrolling marquee. Only the logo is shown, with the website link revealed on hover.
      </motion.div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '1.1rem' }}>
          {[...Array(6)].map((_, i) => (
            <motion.div key={i}
              animate={{ opacity: [0.12, 0.38, 0.12] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.13 }}
              style={{ height: '224px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid ' + BORDER }}
            />
          ))}
        </div>
      ) : brands.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
          style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid ' + BORDER,
            borderRadius: '20px', padding: '5rem 2rem', textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.35, color: '#fff' }}>[ B ]</div>
          <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '6px' }}>
            No brands yet
          </div>
          <div style={{ color: 'rgba(255,255,255,0.16)', fontSize: '0.78rem' }}>
            Click Add Brand to add your first brand partner.
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '1.1rem' }}
        >
          <AnimatePresence>
            {brands.map((b, i) => (
              <BrandCard key={b._id} brand={b} index={i} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </AdminLayout>
  );
}