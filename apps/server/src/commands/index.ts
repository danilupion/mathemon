import { lstatSync, readdirSync } from 'fs';
import { basename, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const thisFile = basename(__filename, extname(__filename));

const instance = yargs(hideBin(process.argv));

const commands = readdirSync(__dirname)
  .map((f) => {
    const stats = lstatSync(`${__dirname}/${f}`);
    return {
      name: basename(f, extname(f)),
      path: stats.isDirectory() ? `${f}/index` : basename(f, extname(f)),
    };
  })
  .filter((f) => f.path !== thisFile);

for (const command of commands) {
  instance.command(`${command.name}`, `use ${command} --help for more info`, () => {
    import(`./${command.path}.js`);
  });
}

instance
  .command(
    '*',
    'default command',
    () => {
      // do nothing
    },
    () => {
      console.log('Command not found');
    },
  )
  .demandCommand()
  .parse();

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Caught exception:', err.stack, err);
});
