import got from 'got';

import { Ability, getAbility } from './ability.js';
import { Move, getMove } from './move.js';
import { promiseStore } from './utils.js';

interface PokeApiSpecies {
  id: number;
  name: string;
  generation: {
    name: string;
  };
  habitat: {
    name: string;
  };
  varieties: {
    is_default: boolean;
    pokemon: {
      name: string;
      url: string;
    };
  }[];
}

interface PokeApiPokemon {
  id: number;
  name: string;
  types: {
    type: {
      name: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
      url: string;
    };
  }[];
  moves: {
    move: {
      name: string;
      url: string;
    };
    version_group_details: {
      level_learned_at: number;
      move_learn_method: {
        name: string;
      };
    }[];
  }[];
}

export interface Pokemon {
  id: number;
  name: string;
  generation: string;
  habitat: string;
  types: string[];
  abilities: Ability[];
  moves: Move[];
}

export const getPokemon = promiseStore(async (id: number) => {
  const species = await got
    .get(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
    .json<PokeApiSpecies>();

  const pokemon = await got
    .get(species.varieties.find((v) => v.is_default)!.pokemon.url)
    .json<PokeApiPokemon>();

  return {
    id: pokemon.id,
    name: pokemon.name,
    generation: species.generation.name,
    habitat: species.habitat?.name || 'unknown',
    types: pokemon.types.map((type) => type.type.name),
    abilities: await Promise.all(
      pokemon.abilities.map(async (ability) => {
        const id = Number.parseInt(ability.ability.url.split('/').reverse()[1]);

        return getAbility(id);
      }),
    ),
    moves: await Promise.all(
      pokemon.moves
        .filter((move) =>
          move.version_group_details.some((d) => d.move_learn_method.name === 'level-up'),
        )
        .map(async (move) => {
          const id = Number.parseInt(move.move.url.split('/').reverse()[1]);

          return getMove(id);
        }),
    ),
  } as Pokemon;
});
