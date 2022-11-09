import path from 'path';

import config from 'config';
import express, { static as staticMiddleware } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { isDev } from './helpers/env';
import errorHandler from './middleware/express/errorHandler';
import notFoundHandler from './middleware/express/notFoundHandler';

const app = express();
const port = config.get<number>('server.port');

const startServer = async () => {
  // Configure some security headers
  if (isDev) {
    app.use(helmet({ contentSecurityPolicy: false }));
  } else {
    app.use(helmet());
  }

  // Register HTTP request logger
  app.use(morgan('dev'));

  // Register handler for static assets
  app.use(staticMiddleware(path.resolve(__dirname, 'public')));

  // Serve public/index.html
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  // Register custom not found handler
  app.use(notFoundHandler);

  // Register custom error handler (should registered the last)
  app.use(errorHandler);

  app.listen(port);
  console.error(`Listening in port ${port}`);
};

startServer().catch((e) => console.log('Error while creating the server', e));

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Caught exception:', err.stack, err);
});
