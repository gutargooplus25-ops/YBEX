const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

const SUGGESTION_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  IMPLEMENTED: 'implemented',
  REJECTED: 'rejected',
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

module.exports = { ROLES, SUGGESTION_STATUS, HTTP_STATUS };
