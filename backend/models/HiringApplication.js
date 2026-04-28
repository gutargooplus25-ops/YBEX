const mongoose = require('mongoose');
const hiringSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  email:      { type: String, required: true },
  phone:      { type: String, default: '' },
  position:   { type: String, default: '' },
  resumeLink: { type: String, default: '' },
  status:     { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  deletedAt: { type: Date, default: null },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });
module.exports = mongoose.model('HiringApplication', hiringSchema);
