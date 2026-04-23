const cors = require('cors');

// Allow all common development origins plus any IP-based access
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:3000',
  // Allow any IP address on common ports
  /^http:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:517[3-9]$/,
  /^http:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:3000$/,
  /^http:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:5000$/,
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, mobile apps, curl, server-to-server)
    if (!origin) {
      callback(null, true);
      return;
    }
    
    // Check if origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log(`CORS warning: Origin ${origin} not in allowed list but allowing for development`);
      // Allow all origins in development - change to false in production
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 hours
};

module.exports = cors(corsOptions);
