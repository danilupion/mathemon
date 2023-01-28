// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware');

const serverHost = 'localhost:3200';

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: `http://${serverHost}`,
      changeOrigin: true,
    }),
  );
  app.use(
    createProxyMiddleware('/oauth', {
      target: `http://${serverHost}`,
      changeOrigin: true,
    }),
  );
  app.use(
    createProxyMiddleware('/tokens', {
      target: `http://${serverHost}`,
      changeOrigin: true,
    }),
  );
  app.use(
    createProxyMiddleware('/websocket', {
      target: `ws://${serverHost}`,
      ws: true,
      logLevel: 'debug',
    }),
  );
};
