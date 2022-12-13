import { getGenerations } from '@mathemon/poke-api/generation.js';
import { Pokemon } from '@mathemon/poke-api/pokemon.js';
import chalk from 'chalk';

import PokemonModel, { PokemonDocument } from '../../models/pokemon.js';

import { createOrUpdate } from './index.js';

interface SeedPokemonOptions {
  verbose?: boolean;
}
export const seedPokemon = async ({ verbose = false }: SeedPokemonOptions = {}) => {
  const generations = await getGenerations(1);
  let updated = 0;
  let created = 0;
  let failed = 0;

  await Promise.all(
    generations
      .reduce((acc, { pokemons }) => [...acc, ...pokemons], [] as Pokemon[])
      .map(async (pokemon) => {
        try {
          const [, isNew] = await createOrUpdate<PokemonDocument>(
            PokemonModel,
            { name: pokemon.name },
            {
              name: pokemon.name,
              order: pokemon.id,
              habitat: pokemon.habitat,
              types: pokemon.types,
              abilities: pokemon.abilities.map((a) => a.name),
              moves: pokemon.moves.map((m) => m.name),
            },
          );

          if (isNew) {
            created++;
            verbose &&
              console.log(chalk.green(`${chalk.bold('[Pokemon:CREATED]')} ${pokemon.name}`));
          } else {
            updated++;
            verbose &&
              console.log(chalk.yellow(`${chalk.bold('[Pokemon:UPDATED]')} ${pokemon.name}`));
          }
        } catch (e) {
          failed++;
          verbose &&
            console.log(
              console.log(chalk.red(`${chalk.bold('[Pokemon:FAILED]')} ${pokemon.name}`), e),
            );
        }
      }),
  );

  const summary = [
    ...(created ? [chalk.green(`Created: ${created}`)] : []),
    ...(updated ? [chalk.yellow(`Updated: ${updated}`)] : []),
    ...(failed ? [chalk.red(`Failed: ${failed}`)] : []),
  ].join(' || ');

  console.log(`${chalk.bold('[Pokemon:DONE]')} ${summary}`);
};

export const clearPokemon = async () => {
  const result = await PokemonModel.deleteMany({});
  console.log(chalk.green(`${chalk.bold('[Pokemon:CLEARED]')} ${result.deletedCount} pokemons.`));
};
