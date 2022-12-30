import { default as got } from 'got';

import { Pokemon, getPokemon } from './pokemon.js';
import { promiseStore } from './utils.js';

interface PokeApiGenerationSpecies {
  name: string;
  url: string;
}

interface PokeApiGeneration {
  pokemon_species: PokeApiGenerationSpecies[];
}

export interface Generation {
  id: number;
  pokemons: Pokemon[];
}

const getGeneration = promiseStore(async (id: number) => {
  const pokeApiGeneration = await got
    .get(`https://pokeapi.co/api/v2/generation/${id}`)
    .json<PokeApiGeneration>();

  return {
    id,
    pokemons: await Promise.all(
      pokeApiGeneration.pokemon_species.map(async (species) => {
        const id = Number.parseInt(species.url.split('/').reverse()[1]);

        return await getPokemon(id);
      }),
    ),
  } as Generation;
});

export const getGenerations = async (...ids: number[]): Promise<Generation[]> => {
  return (
    await Promise.all(
      ids.map(async (id) => {
        return await getGeneration(id);
      }),
    )
  ).flat();
};
