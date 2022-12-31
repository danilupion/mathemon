// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware');

const server = 'http://127.0.0.1:3200';

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: server,
      changeOrigin: true,
    }),
  );
  app.use(
    '/oauth',
    createProxyMiddleware({
      target: server,
      changeOrigin: true,
    }),
  );
};
