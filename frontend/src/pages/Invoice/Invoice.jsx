import React, { useState, useMemo, useCallback, useRef } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  FileText, Calendar, User, Building, Check, ChevronRight, ChevronLeft,
  Download, Send, Plus, Trash2, Eye, Sparkles, Receipt, Landmark, FileCheck
} from 'lucide-react';

const steps = [
  { id: 1, title: 'The Basics',  subtitle: 'Give it a number. Make it real.',    icon: FileText  },
  { id: 2, title: 'Who & Where', subtitle: 'Your details vs. Their details.',     icon: User      },
  { id: 3, title: "What's Sold", subtitle: 'List your items. Be descriptive.',    icon: Receipt   },
  { id: 4, title: 'Bank Details',subtitle: 'Where should they send money?',       icon: Landmark  },
  { id: 5, title: 'Review',      subtitle: 'Preview before you send.',            icon: Eye       },
  { id: 6, title: 'Done',        subtitle: 'Ready to download & send.',           icon: FileCheck },
];

// ─── Step 1 ───────────────────────────────────────────────────────────────────
function Step1({ invoiceData, setInvoiceData }) {
  return (
    <div className="step-content">
      <div className="step-header-card">
        <div className="step-icon-large"><FileText size={28} /></div>
        <div><h3>STEP 1: THE BASICS</h3><p>Give it a number. Make it real.</p></div>
      </div>
      <div className="form-section">
        <div className="form-header"><FileText size={20} /><h4>INVOICE INFO</h4></div>
        <div className="form-grid">
          <div className="form-field">
            <label>INVOICE NUMBER</label>
            <input type="text" value={invoiceData.invoiceNumber}
              onChange={e => setInvoiceData(p => ({ ...p, invoiceNumber: e.target.value }))} />
          </div>
          <div className="form-field">
            <label>REFERENCE / PO NUMBER (OPTIONAL)</label>
            <input type="text" value={invoiceData.referenceNumber}
              onChange={e => setInvoiceData(p => ({ ...p, referenceNumber: e.target.value }))} />
          </div>
          <div className="form-field">
            <label>DATE OF ISSUE</label>
            <div className="date-input-wrapper">
              <input type="date" value={invoiceData.date}
                onChange={e => setInvoiceData(p => ({ ...p, date: e.target.value }))} />
              <Calendar size={18} className="date-icon" />
            </div>
          </div>
          <div className="form-field">
            <label>DUE DATE (OPTIONAL)</label>
            <div className="date-input-wrapper">
              <input type="date" value={invoiceData.dueDate}
                onChange={e => setInvoiceData(p => ({ ...p, dueDate: e.target.value }))} />
              <Calendar size={18} className="date-icon" />
            </div>
          </div>
        </div>
        <div className="form-grid" style={{ marginTop: '20px' }}>
          <div className="form-field">
            <label>INVOICE TYPE</label>
            <select value={invoiceData.invoiceType}
              onChange={e => setInvoiceData(p => ({ ...p, invoiceType: e.target.value }))}>
              <option value="Standard">Standard Invoice</option>
              <option value="Proforma">Proforma Invoice</option>
              <option value="Credit Note">Credit Note</option>
              <option value="Debit Note">Debit Note</option>
            </select>
          </div>
          <div className="form-field">
            <label>CURRENCY</label>
            <select value={invoiceData.currency}
              onChange={e => setInvoiceData(p => ({ ...p, currency: e.target.value }))}>
              <option value="INR">INR (₹) - Indian Rupee</option>
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
              <option value="AED">AED (د.إ) - UAE Dirham</option>
            </select>
          </div>
          <div className="form-field">
            <label>PLACE OF SUPPLY (STATE)</label>
            <input type="text" value={invoiceData.placeOfSupply}
              onChange={e => setInvoiceData(p => ({ ...p, placeOfSupply: e.target.value }))} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────
function Step2({ invoiceData, updateInvoiceData }) {
  return (
    <div className="step-content">
      <div className="step-header-card">
        <div className="step-icon-large"><User size={28} /></div>
        <div><h3>STEP 2: WHO & WHERE</h3><p>Your details vs. Their details.</p></div>
      </div>
      <div className="billed-sections">
        <div className="form-section">
          <div className="form-header"><User size={20} /><h4>BILLED BY (YOU)</h4></div>
          <div className="form-field">
            <label>YOUR NAME / BUSINESS</label>
            <input type="text" value={invoiceData.billedBy.name}
              onChange={e => updateInvoiceData('billedBy', 'name', e.target.value)} />
          </div>
          <div className="form-field">
            <label>ADDRESS</label>
            <textarea value={invoiceData.billedBy.address} rows={3}
              onChange={e => updateInvoiceData('billedBy', 'address', e.target.value)} />
          </div>
          <div className="form-grid">
            <div className="form-field">
              <label>PAN NO.</label>
              <input type="text" value={invoiceData.billedBy.pan}
                onChange={e => updateInvoiceData('billedBy', 'pan', e.target.value)} />
            </div>
            <div className="form-field">
              <label>GSTIN (OPT)</label>
              <input type="text" value={invoiceData.billedBy.gstin}
                onChange={e => updateInvoiceData('billedBy', 'gstin', e.target.value)} />
            </div>
          </div>
          <div className="form-grid" style={{ marginTop: '16px' }}>
            <div className="form-field">
              <label>EMAIL</label>
              <input type="email" value={invoiceData.billedBy.email}
                onChange={e => updateInvoiceData('billedBy', 'email', e.target.value)} />
            </div>
            <div className="form-field">
              <label>PHONE</label>
              <input type="tel" value={invoiceData.billedBy.phone}
                onChange={e => updateInvoiceData('billedBy', 'phone', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-header"><Building size={20} /><h4>BILLED TO (CLIENT)</h4></div>
          <div className="form-field">
            <label>CLIENT NAME</label>
            <input type="text" value={invoiceData.billedTo.name}
              onChange={e => updateInvoiceData('billedTo', 'name', e.target.value)} />
          </div>
          <div className="form-field">
            <label>CLIENT ADDRESS</label>
            <textarea value={invoiceData.billedTo.address} rows={3}
              onChange={e => updateInvoiceData('billedTo', 'address', e.target.value)} />
          </div>
          <div className="form-grid">
            <div className="form-field">
              <label>CLIENT PAN</label>
              <input type="text" value={invoiceData.billedTo.pan}
                onChange={e => updateInvoiceData('billedTo', 'pan', e.target.value)} />
            </div>
            <div className="form-field">
              <label>CLIENT GSTIN</label>
              <input type="text" value={invoiceData.billedTo.gstin}
                onChange={e => updateInvoiceData('billedTo', 'gstin', e.target.value)} />
            </div>
          </div>
          <div className="form-grid" style={{ marginTop: '16px' }}>
            <div className="form-field">
              <label>CLIENT EMAIL</label>
              <input type="email" value={invoiceData.billedTo.email}
                onChange={e => updateInvoiceData('billedTo', 'email', e.target.value)} />
            </div>
            <div className="form-field">
              <label>CLIENT PHONE</label>
              <input type="tel" value={invoiceData.billedTo.phone}
                onChange={e => updateInvoiceData('billedTo', 'phone', e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────
function Step3({ invoiceData, setInvoiceData, subtotal, tax, grandTotal }) {
  const addItem = () => setInvoiceData(p => ({
    ...p, items: [...p.items, { id: Date.now(), description: '', quantity: 1, rate: 0, amount: 0 }]
  }));

  const removeItem = id => {
    if (invoiceData.items.length > 1)
      setInvoiceData(p => ({ ...p, items: p.items.filter(i => i.id !== id) }));
  };

  const updateItem = (id, field, value) => setInvoiceData(p => ({
    ...p, items: p.items.map(i => i.id === id ? { ...i, [field]: value } : i)
  }));

  return (
    <div className="step-content">
      <div className="step-header-card">
        <div className="step-icon-large"><Receipt size={28} /></div>
        <div><h3>STEP 3: WHAT'S SOLD</h3><p>List your items. Be descriptive so they know exactly what they bought.</p></div>
      </div>
      <div className="form-section items-section">
        <div className="items-table-header">
          <span>DESCRIPTION</span><span>QTY</span><span>RATE</span><span>AMOUNT</span><span></span>
        </div>
        {invoiceData.items.map(item => (
          <div key={item.id} className="item-row">
            <input type="text" className="item-description" value={item.description}
              onChange={e => updateItem(item.id, 'description', e.target.value)} />
            <input type="number" className="item-quantity" value={item.quantity} min="1"
              onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} />
            <input type="number" className="item-rate" value={item.rate}
              onChange={e => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)} />
            <span className="item-amount">
              ₹{(item.quantity * item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <button className="remove-item-btn" onClick={() => removeItem(item.id)}
              disabled={invoiceData.items.length <= 1}>
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        <button className="add-item-btn" onClick={addItem}><Plus size={20} />Add Item</button>
        <div className="items-total">
          <div className="total-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
          <div className="total-row"><span>GST (18%)</span><span>₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
          <div className="total-row grand-total"><span>Total</span><span>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 4 ───────────────────────────────────────────────────────────────────
function Step4({ invoiceData, updateInvoiceData }) {
  return (
    <div className="step-content">
      <div className="step-header-card">
        <div className="step-icon-large"><Landmark size={28} /></div>
        <div><h3>STEP 4: BANK DETAILS</h3><p>Make it official. Add your payment information.</p></div>
      </div>
      <div className="form-section">
        <div className="form-header"><Receipt size={20} /><h4>PAYMENT INFORMATION</h4></div>
        <div className="form-field">
          <label>ACCOUNT HOLDER NAME</label>
          <input type="text" value={invoiceData.bankDetails.accountName}
            onChange={e => updateInvoiceData('bankDetails', 'accountName', e.target.value)} />
        </div>
        <div className="form-field">
          <label>ACCOUNT NUMBER</label>
          <input type="text" value={invoiceData.bankDetails.accountNumber}
            onChange={e => updateInvoiceData('bankDetails', 'accountNumber', e.target.value)} />
        </div>
        <div className="form-grid">
          <div className="form-field">
            <label>BANK NAME</label>
            <input type="text" value={invoiceData.bankDetails.bankName}
              onChange={e => updateInvoiceData('bankDetails', 'bankName', e.target.value)} />
          </div>
          <div className="form-field">
            <label>IFSC CODE</label>
            <input type="text" value={invoiceData.bankDetails.ifsc}
              onChange={e => updateInvoiceData('bankDetails', 'ifsc', e.target.value)} />
          </div>
        </div>
        <div className="form-field">
          <label>BRANCH (OPTIONAL)</label>
          <input type="text" value={invoiceData.bankDetails.branch}
            onChange={e => updateInvoiceData('bankDetails', 'branch', e.target.value)} />
        </div>
      </div>
    </div>
  );
}

// ─── Step 5 ───────────────────────────────────────────────────────────────────
function Step5({ invoiceData, grandTotal }) {
  return (
    <div className="step-content">
      <div className="step-header-card">
        <div className="step-icon-large"><Eye size={28} /></div>
        <div><h3>STEP 5: REVIEW</h3><p>Preview before you send. Make sure everything looks perfect.</p></div>
      </div>
      <div className="review-section">
        <div className="review-card">
          <div className="review-header"><Sparkles size={20} /><span>Your invoice is ready for review</span></div>
          <div className="review-items">
            <div className="review-item"><Check size={16} /><span>Invoice #{invoiceData.invoiceNumber}</span></div>
            <div className="review-item"><Check size={16} /><span>{invoiceData.items.length} item(s) added</span></div>
            <div className="review-item"><Check size={16} /><span>Total: ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
            <div className="review-item"><Check size={16} /><span>{invoiceData.billedBy.name ? 'Billed By: ' + invoiceData.billedBy.name : 'Your details added'}</span></div>
            <div className="review-item"><Check size={16} /><span>{invoiceData.billedTo.name ? 'Billed To: ' + invoiceData.billedTo.name : 'Client details added'}</span></div>
          </div>
        </div>
        <p className="review-note">Click "Next Step" to proceed to download and share your invoice.</p>
      </div>
    </div>
  );
}

// ─── PDF Generator — captures the live preview div (pixel-perfect match) ─────
const generateInvoicePDF = async (invoiceData, subtotal, tax, grandTotal, action = 'download', previewRef = null) => {
  // If we have a ref to the preview DOM node, use html2canvas for pixel-perfect output
  if (previewRef && previewRef.current) {
    const node = previewRef.current;
    const canvas = await html2canvas(node, {
      scale: 3,           // high DPI — crisp text
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData  = canvas.toDataURL('image/png');
    const doc      = new jsPDF('p', 'mm', 'a4');
    const pageW    = doc.internal.pageSize.getWidth();   // 210
    const pageH    = doc.internal.pageSize.getHeight();  // 297
    const margin   = 10;
    const usableW  = pageW - margin * 2;
    const imgH     = (canvas.height / canvas.width) * usableW;

    // If content fits on one page
    if (imgH <= pageH - margin * 2) {
      doc.addImage(imgData, 'PNG', margin, margin, usableW, imgH);
    } else {
      // Multi-page: slice canvas into A4-height chunks
      const pageImgH = pageH - margin * 2;
      const totalPages = Math.ceil(imgH / pageImgH);
      for (let p = 0; p < totalPages; p++) {
        if (p > 0) doc.addPage();
        const srcY      = (p * pageImgH / imgH) * canvas.height;
        const srcH      = (pageImgH / imgH) * canvas.height;
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width  = canvas.width;
        sliceCanvas.height = srcH;
        const ctx = sliceCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);
        doc.addImage(sliceCanvas.toDataURL('image/png'), 'PNG', margin, margin, usableW, pageImgH);
      }
    }

    if (action === 'download') {
      doc.save(`${invoiceData.invoiceNumber || 'Invoice'}.pdf`);
      return null;
    } else {
      return doc.output('blob');
    }
  }

  // Fallback: jsPDF text-based (used only if no previewRef)
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth  = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = 0;

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setFillColor(0, 51, 102);
  doc.rect(0, 0, pageWidth, 50, 'F');
  doc.setFillColor(0, 102, 204);
  doc.rect(0, 45, pageWidth, 10, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(36);
  doc.setTextColor(255, 255, 255);
  doc.text('INVOICE', margin, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`NO: ${invoiceData.invoiceNumber || 'INV-001'}`, pageWidth - margin, 32, { align: 'right' });

  yPos = 70;

  const leftColX  = margin;
  const rightColX = pageWidth / 2 + 15;
  let leftY  = yPos;
  let rightY = yPos;

  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(0, 51, 102);
  doc.text('Bill To:', leftColX, leftY); leftY += 10;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(12); doc.setTextColor(0, 0, 0);
  doc.text(invoiceData.billedTo.name || 'Client Name', leftColX, leftY); leftY += 7;
  doc.setFontSize(10); doc.setTextColor(80, 80, 80);
  if (invoiceData.billedTo.phone) { doc.text(invoiceData.billedTo.phone, leftColX, leftY); leftY += 6; }
  if (invoiceData.billedTo.address) {
    invoiceData.billedTo.address.split('\n').slice(0, 2).forEach(line => { doc.text(line, leftColX, leftY); leftY += 6; });
  }

  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(0, 51, 102);
  doc.text('From:', rightColX, rightY); rightY += 10;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(12); doc.setTextColor(0, 0, 0);
  doc.text(invoiceData.billedBy.name || 'Your Name', rightColX, rightY); rightY += 7;
  doc.setFontSize(10); doc.setTextColor(80, 80, 80);
  if (invoiceData.billedBy.phone) { doc.text(invoiceData.billedBy.phone, rightColX, rightY); rightY += 6; }
  if (invoiceData.billedBy.address) {
    invoiceData.billedBy.address.split('\n').slice(0, 2).forEach(line => { doc.text(line, rightColX, rightY); rightY += 6; });
  }

  yPos = Math.max(leftY, rightY) + 15;

  const dateStr = invoiceData.date
    ? new Date(invoiceData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  doc.setFontSize(10); doc.setTextColor(0, 0, 0);
  doc.text(`Date: ${dateStr}`, margin, yPos); yPos += 18;

  const tableWidth = pageWidth - 2 * margin;
  const colDescWidth = 90, colQtyWidth = 18, colPriceWidth = 30, colTotalWidth = 32;
  const colDescX = margin, colQtyX = margin + colDescWidth, colPriceX = colQtyX + colQtyWidth, colTotalX = colPriceX + colPriceWidth;
  const tableStartY = yPos, rowHeight = 10;

  doc.setFillColor(0, 102, 204);
  doc.rect(margin, tableStartY - 6, tableWidth, 10, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(255, 255, 255);
  doc.text('Description', colDescX + 3, tableStartY);
  doc.text('Qty', colQtyX + colQtyWidth / 2, tableStartY, { align: 'center' });
  doc.text('Rate', colPriceX + colPriceWidth / 2, tableStartY, { align: 'center' });
  doc.text('Amount', colTotalX + colTotalWidth / 2, tableStartY, { align: 'center' });
  yPos = tableStartY + 10;

  const fmtNum = v => Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  invoiceData.items.forEach((item, idx) => {
    if (idx % 2 === 1) { doc.setFillColor(240, 245, 250); doc.rect(margin, yPos - 6, tableWidth, rowHeight, 'F'); }
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(0, 0, 0);
    doc.text((item.description || 'Service Item').substring(0, 45), colDescX + 3, yPos);
    doc.text(String(item.quantity), colQtyX + colQtyWidth / 2, yPos, { align: 'center' });
    doc.text('Rs.' + fmtNum(item.rate), colPriceX + colPriceWidth - 3, yPos, { align: 'right' });
    doc.text('Rs.' + fmtNum(Number(item.quantity) * Number(item.rate)), colTotalX + colTotalWidth - 3, yPos, { align: 'right' });
    yPos += rowHeight;
  });

  const tableEndY = yPos;
  doc.setDrawColor(0, 102, 204); doc.setLineWidth(0.5);
  doc.rect(margin, tableStartY - 6, tableWidth, tableEndY - tableStartY + 6);
  for (let i = 0; i < invoiceData.items.length; i++) doc.line(margin, tableStartY + 4 + i * rowHeight, margin + tableWidth, tableStartY + 4 + i * rowHeight);
  doc.line(colQtyX, tableStartY - 6, colQtyX, tableEndY);
  doc.line(colPriceX, tableStartY - 6, colPriceX, tableEndY);
  doc.line(colTotalX, tableStartY - 6, colTotalX, tableEndY);
  yPos = tableEndY + 10;

  const totalsWidth = 75, totalsX = pageWidth - margin - totalsWidth, totalsStartY = yPos;
  doc.setDrawColor(0, 102, 204); doc.setLineWidth(0.5);
  doc.rect(totalsX, totalsStartY - 6, totalsWidth, 40);
  const lx = totalsX + 5, vx = totalsX + totalsWidth - 5;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(0, 0, 0);
  doc.text('Sub Total', lx, totalsStartY + 3); doc.text('Rs.' + fmtNum(subtotal), vx, totalsStartY + 3, { align: 'right' });
  doc.text('Tax (18%)', lx, totalsStartY + 14); doc.text('Rs.' + fmtNum(tax), vx, totalsStartY + 14, { align: 'right' });
  doc.setDrawColor(200, 200, 200); doc.line(lx, totalsStartY + 20, vx, totalsStartY + 20);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(0, 51, 102);
  doc.text('TOTAL', lx, totalsStartY + 30); doc.text('Rs.' + fmtNum(grandTotal), vx, totalsStartY + 30, { align: 'right' });
  yPos = totalsStartY + 50;

  if (invoiceData.bankDetails.accountNumber) {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(0, 51, 102);
    doc.text('Payment Information:', margin, yPos); yPos += 12;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(0, 0, 0);
    const pl = margin, pv = margin + 40;
    doc.text('Bank:', pl, yPos); doc.text(invoiceData.bankDetails.bankName || '-', pv, yPos); yPos += 8;
    doc.text('Account:', pl, yPos); doc.text(invoiceData.bankDetails.accountNumber || '-', pv, yPos); yPos += 8;
    doc.text('IFSC:', pl, yPos); doc.text(invoiceData.bankDetails.ifsc || '-', pv, yPos); yPos += 8;
    if (invoiceData.bankDetails.branch) { doc.text('Branch:', pl, yPos); doc.text(invoiceData.bankDetails.branch, pv, yPos); yPos += 8; }
    doc.text('Email:', pl, yPos); doc.text(invoiceData.billedBy.email || '-', pv, yPos); yPos += 13;
  }

  doc.setFont('helvetica', 'bold'); doc.setFontSize(24); doc.setTextColor(0, 102, 204);
  doc.text('Thank You!', pageWidth / 2, yPos, { align: 'center' });
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(150, 150, 150);
  doc.text('Generated by YBEX Invoice Maker', pageWidth / 2, pageHeight - 20, { align: 'center' });

  if (action === 'download') { doc.save(`${invoiceData.invoiceNumber || 'Invoice'}.pdf`); return null; }
  else { return doc.output('blob'); }
};

// ─── Share Modal ──────────────────────────────────────────────────────────────
function ShareModal({ open, onClose, invoiceData, subtotal, tax, grandTotal, previewRef }) {
  const [sharing, setSharing] = React.useState(null);
  const [copied,  setCopied]  = React.useState(false);

  const opts = [
    { id: 'whatsapp', label: 'WhatsApp',          color: '#25D366', icon: '💬' },
    { id: 'gmail',    label: 'Gmail',              color: '#EA4335', icon: '📧' },
    { id: 'twitter',  label: 'Twitter/X',          color: '#1DA1F2', icon: '🐦' },
    { id: 'facebook', label: 'Facebook',           color: '#1877F2', icon: '📘' },
    { id: 'telegram', label: 'Telegram',           color: '#0088CC', icon: '✈️' },
    { id: 'copy',     label: copied ? 'Copied!' : 'Copy', color: '#e4f141', icon: copied ? '✅' : '📋' },
  ];

  const handleShare = async (platform) => {
    setSharing(platform);
    try {
      const blob = await generateInvoicePDF(invoiceData, subtotal, tax, grandTotal, 'share', previewRef);
      const fileName = `${invoiceData.invoiceNumber || 'Invoice'}.pdf`;
      const text = `Invoice ${invoiceData.invoiceNumber || ''} from ${invoiceData.billedBy.name || 'YBEX'} — Amount: ₹${Number(grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

      if (platform === 'native' && navigator.share) {
        const file = new File([blob], fileName, { type: 'application/pdf' });
        await navigator.share({ title: `Invoice ${invoiceData.invoiceNumber}`, text, files: [file] });
        onClose(); return;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = fileName; a.click();
      URL.revokeObjectURL(url);

      const enc = encodeURIComponent;
      const urls = {
        whatsapp: `https://wa.me/?text=${enc(text)}`,
        gmail:    `mailto:?subject=${enc('Invoice ' + (invoiceData.invoiceNumber || ''))}&body=${enc(text)}`,
        twitter:  `https://twitter.com/intent/tweet?text=${enc(text)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?quote=${enc(text)}`,
        telegram: `https://t.me/share/url?url=${enc(window.location.href)}&text=${enc(text)}`,
      };

      if (platform === 'copy') {
        await navigator.clipboard.writeText(text);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
      } else if (urls[platform]) {
        window.open(urls[platform], '_blank');
        onClose();
      }
    } catch (e) { console.error(e); }
    finally { setSharing(null); }
  };

  if (!open) return null;
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position:'fixed', inset:0, zIndex:99999, background:'rgba(0,0,0,0.88)', backdropFilter:'blur(18px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div style={{ position:'absolute', top:'10%', left:'50%', transform:'translateX(-50%)', width:'500px', height:'250px', background:'radial-gradient(ellipse,rgba(0,102,204,0.18) 0%,transparent 70%)', pointerEvents:'none', borderRadius:'50%' }} />
      <div style={{ position:'relative', width:'100%', maxWidth:'420px', background:'linear-gradient(160deg,#0f0f0f 0%,#0a0a0a 100%)', border:'1px solid rgba(0,102,204,0.28)', borderRadius:'22px', overflow:'hidden', boxShadow:'0 48px 96px rgba(0,0,0,0.9)' }}>
        <div style={{ height:'2px', background:'linear-gradient(90deg,transparent,#0066cc,transparent)' }} />
        <div style={{ padding:'1.5rem 1.75rem 1.25rem', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:'1.05rem', fontWeight:900, color:'#fff', letterSpacing:'-0.02em' }}>Share Invoice</div>
            <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.35)', marginTop:'2px' }}>PDF downloads + share link opens</div>
          </div>
          <button onClick={onClose} style={{ width:'30px', height:'30px', borderRadius:'8px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>
        <div style={{ padding:'1.5rem 1.75rem', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.75rem' }}>
          {opts.map(opt => (
            <button key={opt.id} onClick={() => handleShare(opt.id)} disabled={!!sharing}
              style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'8px', padding:'1rem 0.5rem', background: sharing===opt.id ? `${opt.color}22` : 'rgba(255,255,255,0.04)', border:`1px solid ${sharing===opt.id ? opt.color+'55' : 'rgba(255,255,255,0.08)'}`, borderRadius:'14px', cursor:sharing?'not-allowed':'pointer', transition:'all 0.2s', opacity:sharing&&sharing!==opt.id?0.5:1 }}
              onMouseEnter={e => { if(!sharing){e.currentTarget.style.background=`${opt.color}18`;e.currentTarget.style.borderColor=`${opt.color}55`;}}}
              onMouseLeave={e => { if(!sharing){e.currentTarget.style.background='rgba(255,255,255,0.04)';e.currentTarget.style.borderColor='rgba(255,255,255,0.08)';}}}
            >
              <span style={{ fontSize:'1.6rem' }}>{sharing===opt.id ? '⏳' : opt.icon}</span>
              <span style={{ fontSize:'0.65rem', fontWeight:700, color:sharing===opt.id?opt.color:'rgba(255,255,255,0.65)', letterSpacing:'0.04em', textTransform:'uppercase' }}>{opt.label}</span>
            </button>
          ))}
        </div>
        {typeof navigator !== 'undefined' && navigator.share && (
          <div style={{ padding:'0 1.75rem 1.5rem' }}>
            <button onClick={() => handleShare('native')} disabled={!!sharing}
              style={{ width:'100%', padding:'0.8rem', background:'rgba(0,102,204,0.15)', border:'1px solid rgba(0,102,204,0.35)', borderRadius:'11px', color:'#4da6ff', fontSize:'0.85rem', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
              📱 Share via Device
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step 6 ───────────────────────────────────────────────────────────────────
function Step6({ invoiceData, subtotal, tax, grandTotal, previewRef }) {
  const [shareOpen, setShareOpen] = React.useState(false);
  const [saved,     setSaved]     = React.useState(false);

  const saveToBackend = async () => {
    if (saved) return;
    const payload = {
      invoiceNumber:  invoiceData.invoiceNumber,
      date:           invoiceData.date,
      dueDate:        invoiceData.dueDate        || null,
      referenceNumber:invoiceData.referenceNumber|| null,
      invoiceType:    invoiceData.invoiceType,
      currency:       invoiceData.currency,
      placeOfSupply:  invoiceData.placeOfSupply  || null,
      billedBy:       invoiceData.billedBy,
      billedTo:       invoiceData.billedTo,
      items: invoiceData.items.map(item => ({
        id:          typeof item.id === 'number' ? item.id : 1,
        description: item.description || 'Service Item',
        quantity:    Number(item.quantity) || 1,
        rate:        Number(item.rate)     || 0,
        amount:      Number(item.quantity) * Number(item.rate),
      })),
      bankDetails: invoiceData.bankDetails,
      subtotal:    Number(subtotal),
      tax:         Number(tax),
      grandTotal:  Number(grandTotal),
      status:      'generated',
    };

    try {
      try {
        await axiosInstance.post('/invoices', payload);
      } catch (e) {
        const isDuplicate =
          e.response?.status === 409 ||
          e.response?.status === 500 ||
          e.response?.data?.error?.includes?.('duplicate') ||
          e.response?.data?.error?.includes?.('11000');
        if (isDuplicate) {
          // Invoice already saved — not an error
        } else {
          throw e;
        }
      }
      setSaved(true);
    } catch (error) {
      console.error('Failed to save invoice:', error);
    }
  };

  const handleDownload = async () => {
    await generateInvoicePDF(invoiceData, subtotal, tax, grandTotal, 'download', previewRef);
    await saveToBackend();
  };

  const handleShare = async () => {
    await saveToBackend();
    setShareOpen(true);
  };

  return (
    <>
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        invoiceData={invoiceData}
        subtotal={subtotal}
        tax={tax}
        grandTotal={grandTotal}
        previewRef={previewRef}
      />
      <div className="step-content">
        <div className="step-header-card success">
          <div className="step-icon-large success"><Check size={32} /></div>
          <div>
            <h3>ALL DONE!</h3>
            <p>Your invoice is ready. Download the PDF and send it off to get paid.</p>
          </div>
        </div>
        <div className="success-actions">
          <button className="button button-primary download-btn" onClick={handleDownload}>
            <Download size={20} /> Download PDF
          </button>
          <button className="button button-secondary share-btn" onClick={handleShare}>
            <Send size={20} /> Share Invoice
          </button>
        </div>
        <div className="success-note"><p>(It is free, we promise!)</p></div>
      </div>
    </>
  );
}

// ─── Live Invoice Preview ─────────────────────────────────────────────────────
function InvoicePreview({ invoiceData, subtotal, tax, grandTotal }) {
  const fmtMoney = (val) =>
    Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const dateStr = invoiceData.date
    ? new Date(invoiceData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const dueDateStr = invoiceData.dueDate
    ? new Date(invoiceData.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#000', fontSize: '10px', lineHeight: 1.4 }}>
      {/* Blue header */}
      <div style={{ background: '#003366', padding: '14px 16px 10px', borderRadius: '6px 6px 0 0', marginBottom: 0 }}>
        <div style={{ background: '#0066cc', height: '3px', borderRadius: '2px', marginBottom: '10px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '0.05em' }}>INVOICE</div>
            {invoiceData.invoiceType && invoiceData.invoiceType !== 'Standard' && (
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{invoiceData.invoiceType}</div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px' }}>NO.</div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '12px' }}>{invoiceData.invoiceNumber || 'INV-001'}</div>
            {invoiceData.referenceNumber && (
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '8px', marginTop: '2px' }}>REF: {invoiceData.referenceNumber}</div>
            )}
          </div>
        </div>
      </div>

      {/* Light blue accent bar */}
      <div style={{ background: '#0066cc', height: '4px', marginBottom: '14px' }} />

      {/* Bill To / From */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '8px', fontWeight: 700, color: '#003366', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px', borderBottom: '1px solid #0066cc', paddingBottom: '2px' }}>Bill To</div>
          <div style={{ fontWeight: 700, fontSize: '11px', color: '#111', marginBottom: '2px' }}>{invoiceData.billedTo.name || <span style={{ color: '#bbb' }}>Client Name</span>}</div>
          {invoiceData.billedTo.phone && <div style={{ color: '#555', fontSize: '9px' }}>{invoiceData.billedTo.phone}</div>}
          {invoiceData.billedTo.email && <div style={{ color: '#555', fontSize: '9px' }}>{invoiceData.billedTo.email}</div>}
          {invoiceData.billedTo.address && (
            <div style={{ color: '#555', fontSize: '9px', whiteSpace: 'pre-line' }}>{invoiceData.billedTo.address}</div>
          )}
          {invoiceData.billedTo.gstin && <div style={{ color: '#777', fontSize: '8px', marginTop: '2px' }}>GSTIN: {invoiceData.billedTo.gstin}</div>}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '8px', fontWeight: 700, color: '#003366', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px', borderBottom: '1px solid #0066cc', paddingBottom: '2px' }}>From</div>
          <div style={{ fontWeight: 700, fontSize: '11px', color: '#111', marginBottom: '2px' }}>{invoiceData.billedBy.name || <span style={{ color: '#bbb' }}>Your Name</span>}</div>
          {invoiceData.billedBy.phone && <div style={{ color: '#555', fontSize: '9px' }}>{invoiceData.billedBy.phone}</div>}
          {invoiceData.billedBy.email && <div style={{ color: '#555', fontSize: '9px' }}>{invoiceData.billedBy.email}</div>}
          {invoiceData.billedBy.address && (
            <div style={{ color: '#555', fontSize: '9px', whiteSpace: 'pre-line' }}>{invoiceData.billedBy.address}</div>
          )}
          {invoiceData.billedBy.gstin && <div style={{ color: '#777', fontSize: '8px', marginTop: '2px' }}>GSTIN: {invoiceData.billedBy.gstin}</div>}
        </div>
      </div>

      {/* Date row */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '14px', fontSize: '9px', color: '#444' }}>
        <div><span style={{ fontWeight: 700, color: '#003366' }}>Date: </span>{dateStr}</div>
        {dueDateStr && <div><span style={{ fontWeight: 700, color: '#003366' }}>Due: </span>{dueDateStr}</div>}
        {invoiceData.placeOfSupply && <div><span style={{ fontWeight: 700, color: '#003366' }}>Place: </span>{invoiceData.placeOfSupply}</div>}
      </div>

      {/* Items table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', fontSize: '9px' }}>
        <thead>
          <tr style={{ background: '#0066cc' }}>
            <th style={{ padding: '5px 6px', textAlign: 'left', color: '#fff', fontWeight: 700, fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</th>
            <th style={{ padding: '5px 6px', textAlign: 'center', color: '#fff', fontWeight: 700, fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '30px' }}>Qty</th>
            <th style={{ padding: '5px 6px', textAlign: 'right', color: '#fff', fontWeight: 700, fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '60px' }}>Rate</th>
            <th style={{ padding: '5px 6px', textAlign: 'right', color: '#fff', fontWeight: 700, fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '60px' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.items.map((item, idx) => (
            <tr key={item.id} style={{ background: idx % 2 === 1 ? '#f0f5fa' : '#fff' }}>
              <td style={{ padding: '5px 6px', color: '#222', borderBottom: '1px solid #e8eef5' }}>{item.description || <span style={{ color: '#bbb' }}>Item description</span>}</td>
              <td style={{ padding: '5px 6px', textAlign: 'center', color: '#444', borderBottom: '1px solid #e8eef5' }}>{item.quantity}</td>
              <td style={{ padding: '5px 6px', textAlign: 'right', color: '#444', borderBottom: '1px solid #e8eef5' }}>₹{fmtMoney(item.rate)}</td>
              <td style={{ padding: '5px 6px', textAlign: 'right', color: '#222', fontWeight: 600, borderBottom: '1px solid #e8eef5' }}>₹{fmtMoney(Number(item.quantity) * Number(item.rate))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
        <div style={{ width: '160px', border: '1px solid #0066cc', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', fontSize: '9px', color: '#444' }}>
            <span>Subtotal</span><span>₹{fmtMoney(subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', fontSize: '9px', color: '#444', borderTop: '1px solid #e8eef5' }}>
            <span>Tax (18%)</span><span>₹{fmtMoney(tax)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 8px', fontSize: '10px', fontWeight: 800, color: '#003366', background: '#eef4ff', borderTop: '1px solid #0066cc' }}>
            <span>TOTAL</span><span>₹{fmtMoney(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Payment info */}
      {invoiceData.bankDetails.accountNumber && (
        <div style={{ marginBottom: '12px', padding: '8px 10px', background: '#f8faff', border: '1px solid #dde8f5', borderRadius: '4px' }}>
          <div style={{ fontSize: '8px', fontWeight: 700, color: '#003366', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '5px' }}>Payment Information</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 12px', fontSize: '8px', color: '#444' }}>
            {invoiceData.bankDetails.bankName && <div><span style={{ fontWeight: 700 }}>Bank: </span>{invoiceData.bankDetails.bankName}</div>}
            {invoiceData.bankDetails.accountNumber && <div><span style={{ fontWeight: 700 }}>Account: </span>{invoiceData.bankDetails.accountNumber}</div>}
            {invoiceData.bankDetails.ifsc && <div><span style={{ fontWeight: 700 }}>IFSC: </span>{invoiceData.bankDetails.ifsc}</div>}
            {invoiceData.bankDetails.branch && <div><span style={{ fontWeight: 700 }}>Branch: </span>{invoiceData.bankDetails.branch}</div>}
            {invoiceData.billedBy.email && <div><span style={{ fontWeight: 700 }}>Email: </span>{invoiceData.billedBy.email}</div>}
          </div>
        </div>
      )}

      {/* Thank you */}
      <div style={{ textAlign: 'center', paddingTop: '10px', borderTop: '1px solid #e8eef5' }}>
        <div style={{ fontSize: '16px', fontWeight: 900, color: '#0066cc', letterSpacing: '-0.01em' }}>Thank You!</div>
        <div style={{ fontSize: '8px', color: '#aaa', marginTop: '3px' }}>Generated by YBEX Invoice Maker</div>
      </div>
    </div>
  );
}

// ─── Main Invoice Component ───────────────────────────────────────────────────
export default function Invoice() {
  const [currentStep, setCurrentStep] = useState(1);
  const previewRef = useRef(null);
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber:   'INV-001',
    referenceNumber: '',
    date:            new Date().toISOString().split('T')[0],
    dueDate:         '',
    invoiceType:     'Standard',
    currency:        'INR',
    placeOfSupply:   '',
    billedBy: { name:'', address:'', pan:'', gstin:'', email:'', phone:'' },
    billedTo: { name:'', address:'', pan:'', gstin:'', email:'', phone:'' },
    items: [{ id: Date.now(), description:'', quantity:1, rate:0, amount:0 }],
    bankDetails: { accountName:'', accountNumber:'', bankName:'', ifsc:'', branch:'' },
  });

  const updateInvoiceData = useCallback((section, field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  }, []);

  const subtotal   = useMemo(() => invoiceData.items.reduce((s, i) => s + Number(i.quantity) * Number(i.rate), 0), [invoiceData.items]);
  const tax        = useMemo(() => subtotal * 0.18, [subtotal]);
  const grandTotal = useMemo(() => subtotal + tax,  [subtotal, tax]);

  const goNext = () => setCurrentStep(s => Math.min(s + 1, 6));
  const goPrev = () => setCurrentStep(s => Math.max(s - 1, 1));

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1 invoiceData={invoiceData} setInvoiceData={setInvoiceData} />;
      case 2: return <Step2 invoiceData={invoiceData} updateInvoiceData={updateInvoiceData} />;
      case 3: return <Step3 invoiceData={invoiceData} setInvoiceData={setInvoiceData} subtotal={subtotal} tax={tax} grandTotal={grandTotal} />;
      case 4: return <Step4 invoiceData={invoiceData} updateInvoiceData={updateInvoiceData} />;
      case 5: return <Step5 invoiceData={invoiceData} grandTotal={grandTotal} />;
      case 6: return <Step6 invoiceData={invoiceData} subtotal={subtotal} tax={tax} grandTotal={grandTotal} previewRef={previewRef} />;
      default: return null;
    }
  };

  return (
    <>
      <style>{`
        /* ── Page shell ── */
        .inv-page {
          min-height: 100vh;
          background: #080808;
          padding: 2rem 1rem;
          font-family: 'Inter', sans-serif;
          color: #fff;
        }
        .inv-container { max-width: 1400px; margin: 0 auto; }

        /* ── Header ── */
        .inv-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .inv-header h1 {
          font-size: 2.2rem;
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.03em;
          margin: 0 0 0.4rem;
        }
        .inv-header p {
          color: rgba(255,255,255,0.4);
          font-size: 0.9rem;
          margin: 0;
        }

        /* ── Two-column layout ── */
        .inv-layout {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 2rem;
          align-items: start;
        }

        /* ── Form column ── */
        .inv-form-col {}

        /* ── Step indicator ── */
        .inv-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          margin-bottom: 1.75rem;
          flex-wrap: wrap;
          gap: 0.25rem;
        }
        .inv-step-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          border: 1.5px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.35);
          cursor: default;
          transition: all 0.25s;
          white-space: nowrap;
        }
        .inv-step-pill.active {
          background: #0066cc;
          border-color: #0066cc;
          color: #fff;
          box-shadow: 0 0 18px rgba(0,102,204,0.45);
        }
        .inv-step-pill.done {
          background: rgba(0,180,100,0.12);
          border-color: rgba(0,180,100,0.4);
          color: #4ade80;
          cursor: pointer;
        }
        .inv-step-pill.done:hover {
          background: rgba(0,180,100,0.2);
        }
        .inv-step-check {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #4ade80;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .inv-step-num {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          flex-shrink: 0;
        }
        .inv-step-pill.active .inv-step-num {
          background: rgba(255,255,255,0.25);
        }
        .inv-step-connector {
          width: 20px;
          height: 1.5px;
          background: rgba(255,255,255,0.1);
          flex-shrink: 0;
        }
        .inv-step-connector.done { background: rgba(0,180,100,0.4); }

        /* ── Form card ── */
        .inv-form-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 1.25rem;
        }

        /* ── Navigation ── */
        .inv-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .inv-nav-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0.65rem 1.4rem;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          font-family: inherit;
        }
        .inv-nav-prev {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.55);
          border: 1px solid rgba(255,255,255,0.1) !important;
        }
        .inv-nav-prev:hover { background: rgba(255,255,255,0.1); }
        .inv-nav-next {
          background: #0066cc;
          color: #fff;
        }
        .inv-nav-next:hover { background: #0052a3; }
        .inv-nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .inv-step-counter { font-size: 0.75rem; color: rgba(255,255,255,0.3); }

        /* ── Preview column ── */
        .inv-preview-col {
          position: sticky;
          top: 2rem;
        }
        .inv-preview-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .inv-preview-label::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #0066cc;
          box-shadow: 0 0 8px #0066cc;
          animation: inv-pulse 2s infinite;
        }
        @keyframes inv-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .inv-preview-paper {
          background: #fff;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4);
          min-height: 600px;
          font-family: Arial, sans-serif;
          color: #000;
          font-size: 11px;
          overflow: hidden;
        }

        /* ── Shared step styles (reused from original) ── */
        .step-content {}
        .step-header-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.1rem 1.25rem;
          background: rgba(0,102,204,0.1);
          border: 1px solid rgba(0,102,204,0.25);
          border-radius: 12px;
          margin-bottom: 1.25rem;
        }
        .step-header-card.success {
          background: rgba(0,180,100,0.1);
          border-color: rgba(0,180,100,0.3);
        }
        .step-icon-large {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(0,102,204,0.2);
          border: 1px solid rgba(0,102,204,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4da6ff;
          flex-shrink: 0;
        }
        .step-icon-large.success {
          background: rgba(0,180,100,0.2);
          border-color: rgba(0,180,100,0.4);
          color: #4ade80;
        }
        .step-header-card h3 {
          font-size: 0.82rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: 0.05em;
          margin: 0 0 3px;
        }
        .step-header-card p {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.5);
          margin: 0;
        }

        /* Form sections */
        .form-section {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 1rem;
        }
        .form-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.1rem;
          color: #4da6ff;
        }
        .form-header h4 {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          margin: 0;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-bottom: 0.9rem;
        }
        .form-field label {
          font-size: 0.62rem;
          font-weight: 700;
          color: rgba(255,255,255,0.38);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .form-field input,
        .form-field select,
        .form-field textarea {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: #fff;
          padding: 0.55rem 0.7rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
          font-family: inherit;
        }
        .form-field input:focus,
        .form-field select:focus,
        .form-field textarea:focus {
          border-color: #0066cc;
        }
        .form-field select option { background: #1a1a1a; }
        .date-input-wrapper { position: relative; }
        .date-input-wrapper input { width: 100%; box-sizing: border-box; }
        .date-icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.3);
          pointer-events: none;
        }

        /* Billed sections */
        .billed-sections {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        /* Items */
        .items-table-header {
          display: grid;
          grid-template-columns: 1fr 70px 90px 90px 36px;
          gap: 0.5rem;
          padding: 0.45rem 0.65rem;
          background: rgba(0,102,204,0.15);
          border-radius: 7px;
          margin-bottom: 0.4rem;
          font-size: 0.62rem;
          font-weight: 700;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .item-row {
          display: grid;
          grid-template-columns: 1fr 70px 90px 90px 36px;
          gap: 0.5rem;
          align-items: center;
          padding: 0.35rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .item-description,
        .item-quantity,
        .item-rate {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          color: #fff;
          padding: 0.4rem 0.55rem;
          font-size: 0.82rem;
          outline: none;
          font-family: inherit;
        }
        .item-description:focus,
        .item-quantity:focus,
        .item-rate:focus { border-color: #0066cc; }
        .item-amount {
          font-size: 0.82rem;
          color: #4da6ff;
          font-weight: 600;
          text-align: right;
        }
        .remove-item-btn {
          background: rgba(255,60,60,0.1);
          border: 1px solid rgba(255,60,60,0.2);
          border-radius: 6px;
          color: rgba(255,100,100,0.8);
          cursor: pointer;
          padding: 0.3rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .remove-item-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .add-item-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 0.65rem;
          padding: 0.55rem 0.9rem;
          background: rgba(0,102,204,0.1);
          border: 1px dashed rgba(0,102,204,0.4);
          border-radius: 8px;
          color: #4da6ff;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
        }
        .items-total {
          margin-top: 1.1rem;
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 0.9rem;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 0.3rem 0;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.65);
        }
        .total-row.grand-total {
          font-size: 1rem;
          font-weight: 800;
          color: #fff;
          border-top: 1px solid rgba(255,255,255,0.15);
          margin-top: 0.4rem;
          padding-top: 0.4rem;
        }

        /* Review */
        .review-card {
          background: rgba(0,102,204,0.08);
          border: 1px solid rgba(0,102,204,0.2);
          border-radius: 12px;
          padding: 1.25rem;
        }
        .review-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #4da6ff;
          font-weight: 700;
          margin-bottom: 0.9rem;
        }
        .review-items { display: flex; flex-direction: column; gap: 0.45rem; }
        .review-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.72);
        }
        .review-item svg { color: #4ade80; flex-shrink: 0; }
        .review-note {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.32);
          margin-top: 0.9rem;
          text-align: center;
        }

        /* Step 6 */
        .success-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.4rem;
          flex-wrap: wrap;
        }
        .button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0.8rem 1.6rem;
          border-radius: 11px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          font-family: inherit;
        }
        .button-primary { background: #0066cc; color: #fff; }
        .button-primary:hover { background: #0052a3; }
        .button-secondary {
          background: rgba(255,255,255,0.08);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.15) !important;
        }
        .button-secondary:hover { background: rgba(255,255,255,0.12); }
        .success-note { margin-top: 0.9rem; font-size: 0.78rem; color: rgba(255,255,255,0.28); }

        /* ── Mobile ── */
        @media (max-width: 900px) {
          .inv-layout {
            grid-template-columns: 1fr;
          }
          .inv-preview-col {
            display: none;
          }
        }
        @media (max-width: 640px) {
          .billed-sections { grid-template-columns: 1fr; }
          .form-grid { grid-template-columns: 1fr; }
          .items-table-header,
          .item-row { grid-template-columns: 1fr 55px 75px 75px 32px; }
          .success-actions { flex-direction: column; }
          .inv-steps { gap: 0.15rem; }
          .inv-step-pill { padding: 5px 10px; font-size: 0.62rem; }
        }
      `}</style>

      <div className="inv-page">
        <div className="inv-container">

          {/* Header */}
          <div className="inv-header">
            <h1>Invoice Generator</h1>
            <p>Professional invoices in minutes — free, forever.</p>
          </div>

          {/* Two column */}
          <div className="inv-layout">

            {/* LEFT: Form */}
            <div className="inv-form-col">

              {/* Step indicator */}
              <div className="inv-steps">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isDone   = currentStep > step.id;
                  return (
                    <React.Fragment key={step.id}>
                      {idx > 0 && (
                        <div className={`inv-step-connector${isDone ? ' done' : ''}`} />
                      )}
                      <div
                        className={`inv-step-pill${isActive ? ' active' : isDone ? ' done' : ''}`}
                        onClick={() => isDone && setCurrentStep(step.id)}
                      >
                        {isDone ? (
                          <div className="inv-step-check">
                            <Check size={10} color="#fff" />
                          </div>
                        ) : (
                          <div className="inv-step-num">
                            <Icon size={10} />
                          </div>
                        )}
                        {step.title}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Step card */}
              <div className="inv-form-card">
                {renderStep()}
              </div>

              {/* Navigation */}
              <div className="inv-nav">
                <button
                  className="inv-nav-btn inv-nav-prev"
                  onClick={goPrev}
                  disabled={currentStep === 1}
                >
                  <ChevronLeft size={17} /> Previous
                </button>
                <span className="inv-step-counter">Step {currentStep} of {steps.length}</span>
                {currentStep < 6 ? (
                  <button className="inv-nav-btn inv-nav-next" onClick={goNext}>
                    Next Step <ChevronRight size={17} />
                  </button>
                ) : (
                  <span />
                )}
              </div>
            </div>

            {/* RIGHT: Live Preview (desktop) */}
            <div className="inv-preview-col">
              <div className="inv-preview-label">Live Preview</div>
              <div className="inv-preview-paper">
                <InvoicePreview
                  invoiceData={invoiceData}
                  subtotal={subtotal}
                  tax={tax}
                  grandTotal={grandTotal}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Hidden off-screen capture div — always rendered for PDF generation on mobile */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: '-9999px',
            width: '420px',
            background: '#fff',
            zIndex: -1,
            pointerEvents: 'none',
          }}
          ref={previewRef}
        >
          <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', color: '#000', fontSize: '11px' }}>
            <InvoicePreview
              invoiceData={invoiceData}
              subtotal={subtotal}
              tax={tax}
              grandTotal={grandTotal}
            />
          </div>
        </div>
      </div>
    </>
  );
}
