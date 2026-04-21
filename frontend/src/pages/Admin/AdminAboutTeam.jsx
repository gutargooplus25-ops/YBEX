import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AdminLayout from './AdminLayout';
import axiosInstance from '../../api/axiosInstance';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';

const ACCENT = '#e4f141';
const DIM    = 'rgba(255,255,255,0.12)';
const MUTED  = 'rgba(255,255,255,0.35)';

const CORE_TEAM_OPTIONS = ['Founder', 'Head of Department', 'Core Team'];

const inp = {
  padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)',
  border: `1px solid ${DIM}`, borderRadius: '10px',
  color: '#fff', fontSize: '0.85rem', outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s', fontFamily: 'inherit',
  boxSizing: 'border-box',
};
const focus = (e) => { e.target.style.borderColor = ACCENT; e.target.style.boxShadow = '0 0 0 3px rgba(228,241,65,0.08)'; };
const blur  = (e) => { e.target.style.borderColor = DIM;    e.target.style.boxShadow = 'none'; };

const EMPTY = { name: '', role: '', coreTeam: 'Core Team', socialLink: '', imageUrl: '' };

export default function AdminAboutTeam() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [err, setErr]         = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);

  useEffect(() => {
    axiosInstance.get('/admin/team-members')
      .then((res) => setMembers(res.data.members || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleAdd = async () => {
    if (!form.name.trim()) { setErr('Name is required'); return; }
    setSaving(true); setErr('');
    try {
      const res = await axiosInstance.post('/admin/team-members', {
        name:       form.name.trim(),
        role:       form.role.trim(),
        coreTeam:   form.coreTeam,
        socialLink: form.socialLink.trim(),
        imageUrl:   form.imageUrl.trim() || null,
      });
      setMembers((prev) => [...prev, res.data.member]);
      setForm(EMPTY);
    } catch (e) { setErr(e.response?.data?.message || 'Error adding member'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(`/admin/team-members/${id}`);
      setMembers((prev) => prev.filter((m) => m._id !== id));
      setDeleteTarget(null);
    } catch (e) { console.error(e); }
    finally { setDeleting(false); }
  };

  return (
    <AdminLayout>
      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget?._id)}
        loading={deleting}
        title="Delete Team Member"
        message={`"${deleteTarget?.name}" will be permanently removed from the About page.`}
      />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginBottom: '0.2rem', letterSpacing: '-0.02em' }}>About Page Team</h1>
        <p style={{ color: MUTED, fontSize: '0.8rem' }}>Manage team members shown on the About page</p>
      </motion.div>

      {/* Add Member Form */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.45 }}
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '1.1rem' }}>👥</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Add Team Member</span>
        </div>

        {err && (
          <div style={{ background: 'rgba(255,61,16,0.1)', border: '1px solid rgba(255,61,16,0.3)', borderRadius: '8px', padding: '0.6rem 1rem', color: '#FF3D10', fontSize: '0.8rem', marginBottom: '1rem' }}>⚠ {err}</div>
        )}

        {/* Row 1: name + role + category */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <input type="text" placeholder="Full Name *" value={form.name} onChange={set('name')}
            style={{ ...inp, flex: '1 1 160px' }} onFocus={focus} onBlur={blur} />
          <input type="text" placeholder="Role (e.g. Founder, Lead Editor)" value={form.role} onChange={set('role')}
            style={{ ...inp, flex: '1 1 200px' }} onFocus={focus} onBlur={blur} />
          <select value={form.coreTeam} onChange={set('coreTeam')}
            style={{ ...inp, flex: '0 0 180px', cursor: 'pointer' }}
          >
            {CORE_TEAM_OPTIONS.map((o) => <option key={o} value={o} style={{ background: '#1a1a1a' }}>{o}</option>)}
          </select>
        </div>

        {/* Row 2: image URL + social link + add button */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 220px' }}>
            <input type="url" placeholder="Photo URL (https://...)" value={form.imageUrl} onChange={set('imageUrl')}
              style={{ ...inp, width: '100%' }} onFocus={focus} onBlur={blur} />
            {form.imageUrl.trim() && (
              <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                src={form.imageUrl} alt="preview"
                onError={(e) => { e.target.style.display = 'none'; }}
                style={{ marginTop: '8px', width: '52px', height: '52px', borderRadius: '10px', objectFit: 'cover', border: `1px solid ${ACCENT}` }}
              />
            )}
          </div>
          <input type="url" placeholder="Social Link (optional)" value={form.socialLink} onChange={set('socialLink')}
            style={{ ...inp, flex: '1 1 180px' }} onFocus={focus} onBlur={blur} />
          <motion.button
            whileHover={!saving ? { scale: 1.04, boxShadow: '0 6px 20px rgba(228,241,65,0.3)' } : {}}
            whileTap={!saving ? { scale: 0.97 } : {}}
            onClick={handleAdd} disabled={saving}
            style={{ padding: '0.75rem 1.5rem', background: saving ? 'rgba(228,241,65,0.4)' : ACCENT, border: 'none', borderRadius: '10px', color: '#000', fontSize: '0.82rem', fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer', letterSpacing: '0.06em', whiteSpace: 'nowrap', flexShrink: 0, alignSelf: 'flex-start' }}
          >
            {saving ? 'Adding...' : 'ADD MEMBER'}
          </motion.button>
        </div>

        <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.28)' }}>
          💡 Paste any image URL (Google, Unsplash, LinkedIn photo, etc.) as the photo.
        </div>
      </motion.div>

      {/* Members Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
          {[...Array(4)].map((_, i) => (
            <motion.div key={i} animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
              style={{ height: '240px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }} />
          ))}
        </div>
      ) : members.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.9rem' }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👥</div>
          No team members yet. Add one above.
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}
        >
          <AnimatePresence>
            {members.map((m, i) => (
              <motion.div key={m._id}
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.88 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.5)', borderColor: 'rgba(228,241,65,0.3)' }}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', overflow: 'hidden', position: 'relative', transition: 'border-color 0.2s' }}
              >
                <div style={{ width: '100%', aspectRatio: '1', background: 'rgba(255,255,255,0.05)', overflow: 'hidden', position: 'relative' }}>
                  {m.imageUrl
                    ? <img src={m.imageUrl} alt={m.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(30%)', transition: 'filter 0.3s, transform 0.4s' }}
                        onMouseEnter={(e) => { e.target.style.filter = 'grayscale(0%)'; e.target.style.transform = 'scale(1.06)'; }}
                        onMouseLeave={(e) => { e.target.style.filter = 'grayscale(30%)'; e.target.style.transform = 'scale(1)'; }}
                      />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: 'rgba(255,255,255,0.15)' }}>👤</div>
                  }
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)', pointerEvents: 'none' }} />
                </div>
                <div style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>{m.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.role || m.coreTeam}</div>
                </div>
                <motion.button whileHover={{ scale: 1.1, background: 'rgba(255,61,16,0.3)' }} whileTap={{ scale: 0.9 }}
                  onClick={() => setDeleteTarget(m)}
                  style={{ position: 'absolute', top: '8px', right: '8px', width: '26px', height: '26px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,61,16,0.25)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#ff6b35' }}
                >🗑</motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </AdminLayout>
  );
}
