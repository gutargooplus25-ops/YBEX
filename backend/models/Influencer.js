const mongoose = require('mongoose');
const influencerSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  profileLink: { type: String, default: '' },
  imageUrl:    { type: String, default: null },
  deletedAt: { type: Date, default: null },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });
module.exports = mongoose.model('Influencer', influencerSchema);
