const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: String,
    required: true
  },
  dueDate: {
    type: String,
    default: null
  },
  referenceNumber: {
    type: String,
    default: null
  },
  invoiceType: {
    type: String,
    default: 'Standard'
  },
  currency: {
    type: String,
    default: 'INR'
  },
  placeOfSupply: {
    type: String,
    default: null
  },
  billedBy: {
    name: { type: String, default: '' },
    business: { type: String, default: '' },
    address: { type: String, default: '' },
    pan: { type: String, default: '' },
    gstin: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' }
  },
  billedTo: {
    name: { type: String, default: '' },
    business: { type: String, default: '' },
    address: { type: String, default: '' },
    pan: { type: String, default: '' },
    gstin: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' }
  },
  items: [{
    id: { type: Number, default: 1 },
    description: { type: String, default: 'Service Item' },
    quantity: { type: Number, default: 1 },
    rate: { type: Number, default: 0 },
    amount: { type: Number, default: 0 }
  }],
  bankDetails: {
    accountName: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    bankName: { type: String, default: '' },
    ifsc: { type: String, default: '' },
    branch: { type: String, default: '' }
  },
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  grandTotal: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['generated', 'sent', 'paid', 'cancelled'],
    default: 'generated'
  },
  deletedAt: { type: Date, default: null },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
