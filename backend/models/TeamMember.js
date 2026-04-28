const mongoose = require('mongoose');
const teamMemberSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  role:       { type: String, default: '' },
  coreTeam:   { type: String, default: 'Core Team' },
  socialLink: { type: String, default: '' },
  imageUrl:   { type: String, default: null },
  deletedAt: { type: Date, default: null },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });
module.exports = mongoose.model('TeamMember', teamMemberSchema);
