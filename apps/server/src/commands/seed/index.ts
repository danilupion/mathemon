import {
  connectMongoose,
  disconnectMongoose,
} from '@mathemon/turbo-server/helpers/mongoose/connection.js';
import chalk from 'chalk';
import { Document, FilterQuery, Model } from 'mongoose';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { clearPokemon, seedPokemon } from './pokemon.js';

const instance = yargs(hideBin(process.argv));

export const createOrUpdate = async <T extends Document>(
  M: Model<T>,
  query: FilterQuery<T>,
  data: Partial<T>,
  { validateBeforeSave = true }: { validateBeforeSave?: boolean } = {},
): Promise<[T, boolean]> => {
  const existingModel = await M.findOne(query);
  if (!existingModel) {
    const newModel = new M(data);
    await newModel.save({ validateBeforeSave });
    return [newModel, true];
  } else {
    for (const [key, value] of Object.entries(data)) {
      existingModel.set(key, value);
    }
    await existingModel.save();
  }

  return [existingModel, false];
};

export default instance
  .command<{ clear: boolean; verbose: boolean }>(
    '*',
    'Seed Models',
    (commandYarg) => {
      commandYarg
        .default('clear', false)
        .alias('c', 'clear')
        .describe('c', 'Should the collections be cleared?')
        .boolean('c')
        .default('verbose', false)
        .alias('v', 'verbose')
        .describe('v', 'Should verbose logging be enabled?')
        .boolean('v');
    },
    async (argv) => {
      const { clear, verbose } = argv;
      try {
        await connectMongoose();
        if (clear) {
          await clearPokemon();
        }

        await seedPokemon({ verbose });
      } catch (e) {
        if (e instanceof Error) {
          console.log(chalk.red(`[SEED:FAILED] ${e.message}`));
        }
      } finally {
        await disconnectMongoose();
      }
    },
  )
  .help()
  .parse();