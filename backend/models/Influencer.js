const mongoose = require('mongoose');
const influencerSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  profileLink: { type: String, default: '' },
  imageUrl:    { type: String, default: null },
}, { timestamps: true });
module.exports = mongoose.model('Influencer', influencerSchema);
