import { WithTimestamps } from './common/timestamps.js';

export interface Pokemon extends WithTimestamps {
  order: number;
  name: string;
  generation: string;
  habitat: string;
  types: string[];
  abilities: string[];
  moves: string[];
}
