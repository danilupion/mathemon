import { WithTimestamps } from './common/timestamps.js';

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
