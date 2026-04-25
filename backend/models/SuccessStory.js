const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  quote: { type: String, required: true },
  earning: { type: String, required: true },
  company: { type: String, required: true },
  imageUrl: { type: String, default: null },
  initials: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('SuccessStory', successStorySchema);
