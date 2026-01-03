import aj from '#config/arcjet.js';
import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';

// Security middleware that applies role-based rate limiting and threat protection
const securityMiddleware = async (req, res, next) => {
  try {
    // Get the user's role (fallback to "guest" if not authenticated)
    const role = req.user?.role || 'guest';

    let limit;

    // Decide how many requests are allowed based on role
    switch (role) {
      case 'admin':
        limit = 20;
        break;
      case 'user':
        limit = 10;
        break;
      case 'guest':
        limit = 5;
        break;
    }

    // Create an Arcjet client with a role-specific rate limit rule
    const client = aj.withRule(
      slidingWindow({
        mode: 'LIVE',
        interval: '1m', // Time window for rate limiting
        max: limit, // Max requests allowed in the window
        name: `${role}-rate-limit`, // Label for tracking/logging
      })
    );

    // Run the security check against the incoming request
    const decision = await client.protect(req);

    // Block requests identified as bots
    // if (decision.isDenied() && decision.reason.isBot()) {
    //   logger.warn('Bot request blocked', {
    //     ip: req.ip,
    //     userAgent: req.get('User-Agent'),
    //     path: req.path,
    //   });

    //   return res.status(403).json({
    //     error: 'Forbidden',
    //     message: 'Automated requests are not allowed',
    //   });
    // }

    // Block requests that violate Arcjet shield security rules
    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn('Shield Blocked request', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
      });

      return res.status(403).json({
        error: 'Forbidden',
        message: 'Request blocked by security policy',
      });
    }

    // Block requests that exceed the rate limit
    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });

      return res
        .status(403)
        .json({ error: 'Forbidden', message: 'Too many requests' });
    }

    // If everything is okay, allow the request to continue
    next();
  } catch (e) {
    console.error('Arcjet middleware error:', e);
    res.status(500).json({
      errro: 'Internal server error',
      message: 'Something went wrong with security middleware',
    });
  }
};
export default securityMiddleware;
