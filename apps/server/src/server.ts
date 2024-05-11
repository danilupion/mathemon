import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// import { connectMongoose } from '@slangy/mongo/helpers/mongoose/connection.js';
import server from '@slangy/express/server.js';
import chalk from 'chalk';
import config from 'config';

// import api from './routes/api/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  await server({
    port: config.get<number>('server.port'),
    acceptJson: true,
    jsonBodyParserLimits: config.get<string>('server.bodyParserLimits.json'),
    staticsPath: resolve(__dirname, 'public'),
    spaFilePath: join(__dirname, 'public', 'index.html'),
    // routes: [['/api', api]],
    // init: async () => {
    //   await connectMongoose();
    // },
  });
  console.log(chalk.green(`${chalk.bold('[Init::]')} Server initialized`));
} catch (e) {
  console.log(chalk.red(`${chalk.bold('[Init::]')} Error while creating the server`, e));
}

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

process.on('uncaughtException', (err, origin) => {
  console.error('Caught exception:', err.stack, err, origin);
});
