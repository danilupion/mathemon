import { getGeneration } from '@mathemon/poke-api/index.js';
import chalk from 'chalk';

import PokemonModel, { PokemonDocument } from '../../models/pokemon.js';

import { createOrUpdate } from './index.js';
export const seedPokemon = async () => {
  const pokemons = await getGeneration(1);

  await Promise.all(
    pokemons.map(async (pokemon) => {
      try {
        const [, isNew] = await createOrUpdate<PokemonDocument>(
          PokemonModel,
          { name: pokemon.name },
          {
            name: pokemon.name,
            created: new Date(),
          },
        );

        console.log(
          isNew
            ? chalk.green(`[Pokemon:CREATED] ${pokemon.name}`)
            : chalk.yellow(`[Pokemon:UPDATED] ${pokemon.name}`),
        );
      } catch (e) {
        console.log(chalk.red(`[Pokemon:FAILED] ${pokemon.name}`), e);
      }
    }),
  );

  console.log('seedPokemon');
};

export const clearPokemon = async () => {
  const result = await PokemonModel.deleteMany({});
  console.log(chalk.green(`[Pokemon:CLEARED] ${result.deletedCount} pokemons.`));
};
