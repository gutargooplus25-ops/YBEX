import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AdminLayout from './AdminLayout';
import axiosInstance from '../../api/axiosInstance';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';
import {
  FileText, Download, Trash2, Eye, CheckCircle, Clock,
  XCircle, Search, RefreshCw
} from 'lucide-react';

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    generated: 0,
    sent: 0,
    paid: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const [invoicesRes, statsRes] = await Promise.all([
        axiosInstance.get('/invoices'),
        axiosInstance.get('/invoices/stats')
      ]);

      if (invoicesRes.data.success) {
        setInvoices(invoicesRes.data.data);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(`/invoices/${deleteTarget._id}`);
      setInvoices(prev => prev.filter(inv => inv._id !== deleteTarget._id));
      setDeleteTarget(null);
      fetchInvoices();
    } catch (e) { console.error(e); }
    finally { setDeleting(false); }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/invoices/${id}/status`, { status: newStatus });
      setInvoices(invoices.map(inv =>
        inv._id === id ? { ...inv, status: newStatus } : inv
      ));
      fetchInvoices(); // Refresh stats
    } catch (error) {
      console.error('Error updating invoice status:', error);
      alert('Failed to update status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={18} className="status-icon paid" />;
      case 'sent':
        return <Eye size={18} className="status-icon sent" />;
      case 'generated':
        return <Clock size={18} className="status-icon generated" />;
      default:
        return <XCircle size={18} className="status-icon cancelled" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    return `status-badge ${status}`;
  };

  const formatCurrency = (amount, currency = 'INR') => {
    const symbols = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£',
      AED: 'د.إ'
    };
    return `${symbols[currency] || '₹'}${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.billedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.billedTo.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Delete Invoice"
        message={`Invoice "${deleteTarget?.invoiceNumber}" will be permanently deleted.`}
      />

      {/* Header */}
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}
        style={{ marginBottom:'2rem', display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}
      >
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'5px' }}>
            <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'rgba(228,241,65,0.1)', border:'1px solid rgba(228,241,65,0.22)', display:'flex', alignItems:'center', justifyContent:'center', color:'#e4f141' }}>
              <FileText size={18} />
            </div>
            <h1 style={{ fontSize:'1.5rem', fontWeight:900, color:'#fff', letterSpacing:'-0.03em', margin:0 }}>Invoices</h1>
          </div>
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.79rem', margin:0, paddingLeft:'46px' }}>
            {stats.total} invoice{stats.total !== 1 ? 's' : ''} generated
          </p>
        </div>
        <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.96 }}
          onClick={fetchInvoices} disabled={loading}
          style={{ display:'flex', alignItems:'center', gap:'8px', padding:'0.65rem 1.25rem', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'10px', color:'rgba(255,255,255,0.7)', fontSize:'0.82rem', fontWeight:700, cursor:'pointer' }}
        >
          <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </motion.button>
      </motion.div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'0.75rem', marginBottom:'2rem' }}>
        {[
          { label:'Total',    value:stats.total,    color:'#e4f141', icon:<FileText size={18}/> },
          { label:'Generated',value:stats.generated,color:'#a78bfa', icon:<Clock size={18}/> },
          { label:'Sent',     value:stats.sent,     color:'#60a5fa', icon:<Eye size={18}/> },
          { label:'Paid',     value:stats.paid,     color:'#4ade80', icon:<CheckCircle size={18}/> },
          { label:'Revenue',  value:formatCurrency(stats.totalRevenue), color:'#fb923c', icon:<Download size={18}/> },
        ].map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07, duration:0.4 }}
            style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${s.color}22`, borderRadius:'14px', padding:'1.1rem 1.25rem' }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px', color:s.color }}>{s.icon}</div>
            <div style={{ fontSize:'1.4rem', fontWeight:900, color:'#fff', marginBottom:'3px' }}>{s.value}</div>
            <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Search + filter */}
      <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        <div style={{ flex:'1 1 240px', position:'relative' }}>
          <Search size={16} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }} />
          <input type="text" placeholder="Search invoice #, billed by, billed to..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ width:'100%', padding:'0.65rem 1rem 0.65rem 2.25rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'10px', color:'#fff', fontSize:'0.85rem', outline:'none', boxSizing:'border-box' }}
            onFocus={e => e.target.style.borderColor='#e4f141'}
            onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'}
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding:'0.65rem 1rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'10px', color:'#fff', fontSize:'0.85rem', outline:'none', cursor:'pointer' }}
        >
          <option value="all" style={{ background:'#1a1a1a' }}>All Status</option>
          <option value="generated" style={{ background:'#1a1a1a' }}>Generated</option>
          <option value="sent" style={{ background:'#1a1a1a' }}>Sent</option>
          <option value="paid" style={{ background:'#1a1a1a' }}>Paid</option>
          <option value="cancelled" style={{ background:'#1a1a1a' }}>Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2, duration:0.4 }}
        style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'16px', overflow:'hidden' }}
      >
        {loading ? (
          <div style={{ padding:'4rem', textAlign:'center', color:'rgba(255,255,255,0.3)' }}>
            <RefreshCw size={28} style={{ animation:'spin 1s linear infinite', marginBottom:'12px' }} />
            <p style={{ margin:0 }}>Loading invoices...</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div style={{ padding:'4rem', textAlign:'center', color:'rgba(255,255,255,0.25)' }}>
            <FileText size={40} style={{ marginBottom:'12px', opacity:0.4 }} />
            <p style={{ margin:0, fontWeight:600 }}>No invoices found</p>
            <p style={{ margin:'6px 0 0', fontSize:'0.8rem' }}>{searchTerm || statusFilter !== 'all' ? 'Try adjusting filters' : 'Invoices appear here when generated'}</p>
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            {/* Table header */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1.2fr 1.2fr 110px 100px 110px 80px', padding:'0.75rem 1.25rem', background:'rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(255,255,255,0.07)', fontSize:'0.65rem', fontWeight:800, color:'rgba(255,255,255,0.35)', letterSpacing:'0.1em', textTransform:'uppercase', minWidth:'700px' }}>
              <span>Invoice #</span><span>Billed By</span><span>Billed To</span><span>Amount</span><span>Date</span><span>Status</span><span style={{ textAlign:'right' }}>Actions</span>
            </div>
            <AnimatePresence>
              {filteredInvoices.map((invoice, i) => (
                <motion.div key={invoice._id}
                  initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:10 }}
                  transition={{ delay:i*0.04, duration:0.3 }}
                  style={{ display:'grid', gridTemplateColumns:'1fr 1.2fr 1.2fr 110px 100px 110px 80px', padding:'1rem 1.25rem', borderBottom:'1px solid rgba(255,255,255,0.05)', alignItems:'center', minWidth:'700px', transition:'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.025)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}
                >
                  <span style={{ fontWeight:800, color:'#a78bfa', fontSize:'0.85rem' }}>{invoice.invoiceNumber}</span>
                  <div>
                    <div style={{ fontWeight:600, color:'#fff', fontSize:'0.85rem' }}>{invoice.billedBy.name || '—'}</div>
                    <div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.35)' }}>{invoice.billedBy.email || ''}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight:600, color:'#fff', fontSize:'0.85rem' }}>{invoice.billedTo.name || '—'}</div>
                    <div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.35)' }}>{invoice.billedTo.email || ''}</div>
                  </div>
                  <span style={{ fontWeight:800, color:'#e4f141', fontSize:'0.85rem' }}>{formatCurrency(invoice.grandTotal, invoice.currency)}</span>
                  <span style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.45)' }}>
                    {new Date(invoice.date).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
                  </span>
                  <select value={invoice.status} onChange={e => handleStatusUpdate(invoice._id, e.target.value)}
                    style={{ padding:'0.3rem 0.5rem', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'7px', color:'#fff', fontSize:'0.75rem', cursor:'pointer', outline:'none' }}
                  >
                    <option value="generated" style={{ background:'#1a1a1a' }}>Generated</option>
                    <option value="sent"      style={{ background:'#1a1a1a' }}>Sent</option>
                    <option value="paid"      style={{ background:'#1a1a1a' }}>Paid</option>
                    <option value="cancelled" style={{ background:'#1a1a1a' }}>Cancelled</option>
                  </select>
                  <div style={{ display:'flex', gap:'6px', justifyContent:'flex-end' }}>
                    <motion.button whileHover={{ scale:1.12, background:'rgba(255,61,16,0.3)' }} whileTap={{ scale:0.9 }}
                      onClick={() => setDeleteTarget(invoice)}
                      style={{ width:'28px', height:'28px', background:'rgba(255,61,16,0.08)', border:'1px solid rgba(255,61,16,0.2)', borderRadius:'7px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#ff6b35' }}
                    ><Trash2 size={14} /></motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </AdminLayout>
  );
}
