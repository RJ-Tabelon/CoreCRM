export const cookies = {
  getOptions: () => ({
    // Returns the default, secure cookie settings
    // These options are reused whenever a cookie is set or cleared

    httpOnly: true, // Cookie cannot be accessed by JavaScript (protects against XSS)
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict', // Prevents cookie from being sent on cross-site requests
    maxAge: 15 * 60 * 1000, // Cookie expires after 15 minutes
  }),

  // Sets a cookie on the response
  set: (res, name, value, options = {}) => {
    res.cookie(name, value, { ...cookies.getOptions(), ...options });
  },

  // Removes a cookie from the browser
  clear: (res, name, options = {}) => {
    res.clearCookie(name, { ...cookies.getOptions(), ...options });
  },

  // Reads a cookie value from the incoming request
  get: (req, name) => {
    return req.cookies[name];
  },
};
