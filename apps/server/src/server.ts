import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

import { isDev } from '@mathemon/server-utils/helpers/env.js';
import errorHandler from '@mathemon/server-utils/middleware/express/errorHandler.js';
import notFoundHandler from '@mathemon/server-utils/middleware/express/notFoundHandler.js';
import config from 'config';
import express, { json, static as staticMiddleware } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

  // Configure body parser to accept json
  app.use(json({ limit: config.get<string>('server.bodyParserLimits.json') }));

  // Register handler for static assets
  app.use(staticMiddleware(resolve(__dirname, 'public')));

  // Register routes
  app.use('/', routes);

  // Serve public/index.html
  app.get('*', (_, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
  });

  // Register custom not found handler
  app.use(notFoundHandler);

  // Register custom error handler (should registered the last)
  app.use(errorHandler);

  // await connectMongoose();
  app.listen(port);
  console.error(`Listening in port ${port}`, isDev);
};

startServer().catch((e) => console.log('Error while creating the server', e));

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

process.on('uncaughtException', (err, origin) => {
  console.error('Caught exception:', err.stack, err, origin);
});
