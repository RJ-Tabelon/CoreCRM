import arcjet, { shield, detectBot, slidingWindow } from '@arcjet/node';

// Create an Arcjet instance with your API key and security rules
const aj = arcjet({
  key: process.env.ARCJET_KEY,

  // List of security rules applied to incoming requests
  rules: [
    // Provides general protection against common attacks
    shield({ mode: 'LIVE' }),

    // Detects and blocks bots, while allowing known safe bots
    detectBot({
      mode: 'LIVE',
      allow: ['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW'],
    }),

    // Limits how many requests a client can make in a short time
    slidingWindow({
      mode: 'LIVE',
      interval: '2s', // Time window for counting requests
      max: 5, // Maximum requests allowed per window
    }),
  ],
});

export default aj;
