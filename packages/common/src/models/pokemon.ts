import { WithTimestamps } from '@danilupion/turbo-common/model/timestamps.js';

import { Operator } from './operation.js';

export enum PokemonType {
  Grass = 'grass',
  Poison = 'poison',
  Fire = 'fire',
  Bug = 'bug',
  Normal = 'normal',
  Flying = 'flying',
  Water = 'water',
  Ground = 'ground',
  Fighting = 'fighting',
  Psychic = 'psychic',
  Rock = 'rock',
  Electric = 'electric',
  Steel = 'steel',
  Ghost = 'ghost',
  Ice = 'ice',
  Dragon = 'dragon',
  Fairy = 'fairy',
  Dark = 'dark',
}

export interface Pokemon extends WithTimestamps {
  id: string;
  number: number;
  name: string;
  generation: number;
  habitat: string;
  evolutionLevel: number;
  types: PokemonType[];
  abilities: string[];
  moves: string[];
}

export interface PokedexCapturedPokemon extends Pokemon {
  operator: Operator;
  difficultyLevel: number;
}

export interface PokedexFoundPokemon
  extends Omit<PokedexCapturedPokemon, 'habitat' | 'types' | 'abilities' | 'moves'> {
  habitat: undefined;
  types: undefined;
  abilities: undefined;
  moves: undefined;
}

export interface PokedexUnknownPokemon extends Omit<PokedexFoundPokemon, 'name'> {
  name: undefined;
}

export type PokedexPokemon = PokedexUnknownPokemon | PokedexFoundPokemon | PokedexCapturedPokemon;
