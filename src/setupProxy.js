const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Only proxy /api requests to the backend - let the dev server handle SPA routes
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3099',
      changeOrigin: true,
    })
  );
};
