const Activity = require('../models/Activity');

/**
 * Activity Logger Middleware
 * Automatically logs admin actions to the Activity collection
 */

// Map route patterns to action and entity types
const actionMap = {
  // Brands
  'POST /api/admin/brands': { action: 'ADD_BRAND', entityType: 'BRAND' },
  'DELETE /api/admin/brands': { action: 'DELETE_BRAND', entityType: 'BRAND' },
  
  // Success Stories
  'POST /api/success-stories': { action: 'ADD_SUCCESS_STORY', entityType: 'SUCCESS_STORY' },
  'PUT /api/success-stories': { action: 'UPDATE_SUCCESS_STORY', entityType: 'SUCCESS_STORY' },
  'DELETE /api/success-stories': { action: 'DELETE_SUCCESS_STORY', entityType: 'SUCCESS_STORY' },
  
  // Team Members
  'POST /api/admin/team-members': { action: 'ADD_TEAM_MEMBER', entityType: 'TEAM_MEMBER' },
  'DELETE /api/admin/team-members': { action: 'DELETE_TEAM_MEMBER', entityType: 'TEAM_MEMBER' },
  
  // Influencers
  'POST /api/admin/influencers': { action: 'ADD_INFLUENCER', entityType: 'INFLUENCER' },
  'DELETE /api/admin/influencers': { action: 'DELETE_INFLUENCER', entityType: 'INFLUENCER' },
  
  // Hiring
  'PATCH /api/admin/hiring': { action: 'UPDATE_HIRING_STATUS', entityType: 'HIRING_APPLICATION' },
  'DELETE /api/admin/hiring': { action: 'DELETE_HIRING_APPLICATION', entityType: 'HIRING_APPLICATION' },
  
  // Invoices
  'POST /api/invoices': { action: 'ADD_INVOICE', entityType: 'INVOICE' },
  'PUT /api/invoices': { action: 'UPDATE_INVOICE', entityType: 'INVOICE' },
  'DELETE /api/invoices': { action: 'DELETE_INVOICE', entityType: 'INVOICE' },
  
  // Users/Admins
  'POST /api/admin/users': { action: 'CREATE', entityType: 'USER' },
  'PATCH /api/admin/users': { action: 'UPDATE_USER_ROLE', entityType: 'USER' },
  'DELETE /api/admin/users': { action: 'DELETE_USER', entityType: 'USER' },
  
  // Contacts/Enquiries
  'PATCH /api/admin/contacts': { action: 'UPDATE_ENQUIRY_STATUS', entityType: 'ENQUIRY' },
  'DELETE /api/admin/contacts': { action: 'DELETE_ENQUIRY', entityType: 'ENQUIRY' },
  
  // Suggestions
  'POST /api/suggestions': { action: 'ADD_SUGGESTION', entityType: 'SUGGESTION' },
  'PATCH /api/admin/suggestions': { action: 'UPDATE_SUGGESTION', entityType: 'SUGGESTION' },
  'DELETE /api/admin/suggestions': { action: 'DELETE_SUGGESTION', entityType: 'SUGGESTION' },
};

// Helper to get action mapping from request
function getActionMapping(req) {
  const key = `${req.method} ${req.baseUrl}${req.route?.path || ''}`;
  
  // Try exact match first
  if (actionMap[key]) {
    return actionMap[key];
  }
  
  // Try pattern matching
  for (const [pattern, mapping] of Object.entries(actionMap)) {
    const regex = new RegExp('^' + pattern.replace(/:\w+/g, '[^/]+') + '(/[^/]+)?$');
    if (regex.test(key)) {
      return mapping;
    }
  }
  
  return null;
}

// Main middleware function
function activityLogger(req, res, next) {
  // Store original json method to intercept response
  const originalJson = res.json;
  
  res.json = function(data) {
    // Restore original json method
    res.json = originalJson;
    
    // Check if user is authenticated and is an admin
    if (req.user && req.user.role === 'admin') {
      const mapping = getActionMapping(req);
      
      if (mapping) {
        // Determine status based on response
        const status = data.success || (res.statusCode >= 200 && res.statusCode < 300) 
          ? 'SUCCESS' 
          : 'FAILED';
        
        // Extract entity info from request/response
        const entityId = req.params.id || data._id || data.brand?._id || data.influencer?._id || 
                        data.activity?._id || data.invoice?._id || null;
        
        const entityName = req.body.name || req.body.title || req.body.company || 
                          data.brand?.name || data.influencer?.name || 
                          data.activity?.entityName || data.invoice?.clientName || null;
        
        // Create activity log
        Activity.create({
          adminId: req.user._id,
          adminName: req.user.name || req.user.email,
          adminEmail: req.user.email,
          action: mapping.action,
          entityType: mapping.entityType,
          entityId: entityId?.toString() || null,
          entityName: entityName || null,
          details: {
            method: req.method,
            url: req.originalUrl,
            body: sanitizeBody(req.body),
            responseStatus: res.statusCode
          },
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          status,
          errorMessage: status === 'FAILED' ? (data.message || data.error || 'Operation failed') : null
        }).catch(err => {
          console.error('Activity logging failed:', err);
        });
      }
    }
    
    // Call original json method
    return originalJson.call(this, data);
  };
  
  next();
}

// Helper to sanitize request body (remove sensitive data)
function sanitizeBody(body) {
  if (!body || typeof body !== 'object') return body;
  
  const sanitized = { ...body };
  const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'creditCard'];
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
}

// Manual logging function for use in controllers
async function logActivity({
  req,
  action,
  entityType,
  entityId = null,
  entityName = null,
  details = {},
  status = 'SUCCESS',
  errorMessage = null
}) {
  try {
    if (!req.user) return;
    
    await Activity.create({
      adminId: req.user._id,
      adminName: req.user.name || req.user.email,
      adminEmail: req.user.email,
      action,
      entityType,
      entityId: entityId?.toString() || null,
      entityName: entityName || null,
      details: {
        ...details,
        url: req.originalUrl,
        method: req.method
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status,
      errorMessage
    });
  } catch (err) {
    console.error('Manual activity logging failed:', err);
  }
}

module.exports = {
  activityLogger,
  logActivity
};
