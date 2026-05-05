const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    preferredTrack: {
      type: String,
      required: true,
      enum: ['Content Creation', 'Digital Marketing', 'Both Tracks'],
    },
    portfolioUrl: { type: String, default: '', trim: true },
    reason: { type: String, required: true, trim: true },
    background: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected', 'shortlisted'],
      default: 'pending',
    },
    isRead: { type: Boolean, default: false },
    adminNotes: { type: String, default: '' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

// Index for efficient queries
scholarshipSchema.index({ status: 1, createdAt: -1 });
scholarshipSchema.index({ isRead: 1 });

module.exports = mongoose.model('Scholarship', scholarshipSchema);
