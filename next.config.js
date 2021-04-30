const withPWA = require("next-pwa");

module.exports = withPWA({
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    sw: "/sw.js",
    scope: "/"
  },
});

module.exports = {
  images: {
    domains: ['storage.googleapis.com'],
  }
}; 