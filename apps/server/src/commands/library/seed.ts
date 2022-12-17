import {
  connectMongoose,
  disconnectMongoose,
} from '@mathemon/turbo-server/helpers/mongoose/connection.js';
import chalk from 'chalk';
import { BuilderCallback } from 'yargs';

import { clearPokemon, seedPokemon } from './seed/pokemon.js';

type SeedOptions = { clear: boolean; verbose: boolean };

export const command = 'seed';

export const describe = 'seeds models';

export const builder: BuilderCallback<SeedOptions, SeedOptions> = (yarngs) =>
  yarngs
    .option('clear', {
      alias: 'c',
      default: false,
      describe: 'Should the collections be cleared?',
      type: 'boolean',
    })
    .option('verbose', {
      alias: 'v',
      default: false,
      describe: 'Should verbose logging be enabled?',
      type: 'boolean',
    });
export const handler = async (argv: SeedOptions) => {
  const { clear, verbose } = argv;

  try {
    await connectMongoose();
    if (clear) {
      await clearPokemon();
    }

    await seedPokemon({ verbose });
  } catch (e) {
    if (e instanceof Error) {
      console.log(chalk.red(`${chalk.bold('[Seed:FAILED]')} ${e.message}`));
    }
  } finally {
    await disconnectMongoose();
  }
};
