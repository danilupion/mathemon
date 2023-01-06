import { PaginatedResponse } from '@mathemon/turbo-common/api/pagination.js';

import { Pokemon } from '../pokemon.js';

export type PokedexMeta = {
  total: number;
  found: number;
  captured: number;
};

export type GetPokedexRes = PaginatedResponse<Pokemon, PokedexMeta>;
