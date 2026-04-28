const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true },
    phone:    { type: String, default: '' },
    subject:  { type: String, required: true },
    message:  { type: String, required: true },
    category: {
      type: String,
      enum: ['challenge', 'creators-school', 'pitch-ideas', 'sales-brand-growth', 'general'],
      default: 'general',
    },
    isRead:     { type: Boolean, default: false },
    status:     { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    adminReply: { type: String, default: '' },
    repliedAt:  { type: Date, default: null },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
