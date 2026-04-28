const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adminName: {
    type: String,
    required: true
  },
  adminEmail: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT',
      'ADD_BRAND', 'UPDATE_BRAND', 'DELETE_BRAND',
      'ADD_SUCCESS_STORY', 'UPDATE_SUCCESS_STORY', 'DELETE_SUCCESS_STORY',
      'ADD_TEAM_MEMBER', 'UPDATE_TEAM_MEMBER', 'DELETE_TEAM_MEMBER',
      'ADD_INFLUENCER', 'UPDATE_INFLUENCER', 'DELETE_INFLUENCER',
      'UPDATE_HIRING_STATUS', 'DELETE_HIRING_APPLICATION',
      'ADD_INVOICE', 'UPDATE_INVOICE', 'DELETE_INVOICE',
      'ADD_SCHOLARSHIP', 'UPDATE_SCHOLARSHIP', 'DELETE_SCHOLARSHIP',
      'UPDATE_USER_ROLE', 'DELETE_USER',
      'UPDATE_ENQUIRY_STATUS', 'DELETE_ENQUIRY',
      'ADD_SUGGESTION', 'UPDATE_SUGGESTION', 'DELETE_SUGGESTION',
      'SYSTEM', 'OTHER'
    ]
  },
  entityType: {
    type: String,
    required: true,
    enum: [
      'BRAND', 'SUCCESS_STORY', 'TEAM_MEMBER', 'INFLUENCER',
      'HIRING_APPLICATION', 'INVOICE', 'SCHOLARSHIP', 'USER',
      'ENQUIRY', 'SUGGESTION', 'SETTINGS', 'AUTH', 'SYSTEM', 'OTHER'
    ]
  },
  entityId: {
    type: String,
    default: null
  },
  entityName: {
    type: String,
    default: null
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILED', 'PENDING'],
    default: 'SUCCESS'
  },
  errorMessage: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
activitySchema.index({ createdAt: -1 });
activitySchema.index({ adminId: 1, createdAt: -1 });
activitySchema.index({ action: 1, createdAt: -1 });
activitySchema.index({ entityType: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
