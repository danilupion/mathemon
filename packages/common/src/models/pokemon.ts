import { WithTimestamps } from './common/timestamps.js';

export interface Pokemon extends WithTimestamps {
  number: number;
  name: string;
  generation: number;
  habitat: string;
  types: string[];
  abilities: string[];
  moves: string[];
}
